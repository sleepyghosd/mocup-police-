import { ImageData, EvidenceStatus, PhotoCategory } from "../types";
import { mockImages, caseObjects } from "../data/mockData";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Star,
  Check,
  Filter,
  Sparkles,
  Search,
  SquareCheckBig,
  Square,
  X,
  EyeOff,
  Eye,
  Tag,
  Car,
  Camera,
  Minus,
  Plus,
  Grid3x3,
  ChevronDown,
  ChevronUp,
  Ban,
  HelpCircle,
  Keyboard,
  Mouse,
  MousePointerClick,
} from "lucide-react";
import { ImageDetailModal } from "./ImageDetailModal";

const PAGE_SIZE = 36;

const categoryLabels: Record<PhotoCategory, string> = {
  sky_photo: 'Luchtfoto',
  detail_photo: 'Detailfoto',
  overview: 'Overzicht',
  close_up: 'Close-up',
  side_view: 'Zijaanzicht',
  front_view: 'Vooraanzicht',
};

const photoCategories: PhotoCategory[] = ['sky_photo', 'detail_photo', 'overview', 'close_up', 'side_view', 'front_view'];

type ThumbSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const thumbSizeConfig: Record<ThumbSize, { label: string; grid: string }> = {
  xs: { label: 'XS', grid: 'grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12' },
  sm: { label: 'S', grid: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10' },
  md: { label: 'M', grid: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8' },
  lg: { label: 'L', grid: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6' },
  xl: { label: 'XL', grid: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' },
};

const thumbSizeOrder: ThumbSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const thumbIconConfig: Record<ThumbSize, {
  statusIcon: string; statusPad: string; dot: string;
  mlIcon: string; mlPosition: string;
  favoriteIcon: string; favoritePosition: string;
  checkboxWrap: string; checkboxIcon: string; selectionCircle: string; selectionCheck: string;
  linkedPosition: string;
}> = {
  xs: {
    statusIcon: 'size-2', statusPad: 'p-px', dot: 'size-1.5',
    mlIcon: 'size-2.5', mlPosition: 'top-0.5 right-4',
    favoriteIcon: 'size-2.5', favoritePosition: 'top-0.5 right-0.5',

    checkboxWrap: 'size-3.5', checkboxIcon: 'size-2', selectionCircle: 'size-5', selectionCheck: 'size-2.5',
    linkedPosition: 'bottom-0.5 left-0.5',
  },
  sm: {
    statusIcon: 'size-2.5', statusPad: 'p-0.5', dot: 'size-2',
    mlIcon: 'size-3', mlPosition: 'top-1 right-5',
    favoriteIcon: 'size-3', favoritePosition: 'top-1 right-1',
    checkboxWrap: 'size-4', checkboxIcon: 'size-2.5', selectionCircle: 'size-6', selectionCheck: 'size-3',
    linkedPosition: 'bottom-0.5 left-0.5',
  },
  md: {
    statusIcon: 'size-3', statusPad: 'p-0.5', dot: 'size-2.5',
    mlIcon: 'size-4', mlPosition: 'top-1.5 right-7',
    favoriteIcon: 'size-4', favoritePosition: 'top-1.5 right-1.5',
    checkboxWrap: 'size-5', checkboxIcon: 'size-3', selectionCircle: 'size-8', selectionCheck: 'size-4',
    linkedPosition: 'bottom-1 left-1',
  },
  lg: {
    statusIcon: 'size-3.5', statusPad: 'p-0.5', dot: 'size-3',
    mlIcon: 'size-5', mlPosition: 'top-2 right-9',
    favoriteIcon: 'size-5', favoritePosition: 'top-2 right-2',
    checkboxWrap: 'size-6', checkboxIcon: 'size-3.5', selectionCircle: 'size-9', selectionCheck: 'size-4',
    linkedPosition: 'bottom-1.5 left-1.5',
  },
  xl: {
    statusIcon: 'size-4', statusPad: 'p-1', dot: 'size-3.5',
    mlIcon: 'size-5', mlPosition: 'top-2.5 right-11',
    favoriteIcon: 'size-5', favoritePosition: 'top-2.5 right-2.5',
    checkboxWrap: 'size-7', checkboxIcon: 'size-4', selectionCircle: 'size-10', selectionCheck: 'size-5',
    linkedPosition: 'bottom-2 left-2',
  },
};

type CategoryFilter = PhotoCategory | 'all' | 'uncategorized';

export function Gallery() {
  const [images, setImages] = useState<ImageData[]>(mockImages);
  const [filterStatus, setFilterStatus] = useState<EvidenceStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<CategoryFilter>('all');
  const [filterObject, setFilterObject] = useState<string | 'all'>('all');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<ImageData | null>(null);
  const [page, setPage] = useState(1);
  const [thumbSize, setThumbSize] = useState<ThumbSize>('md');
  const [shiftHeld, setShiftHeld] = useState(false);
  const [ctrlHeld, setCtrlHeld] = useState(false);
  const [showSelectionDetail, setShowSelectionDetail] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const lastEscapeTime = useRef(0);

  // Staged bulk state
  const [stagedCategory, setStagedCategory] = useState<PhotoCategory | null>(null);
  const [stagedObjects, setStagedObjects] = useState<Record<string, 'add' | 'remove' | null>>({});

  const hasStagedChanges = stagedCategory !== null || Object.values(stagedObjects).some(v => v !== null);

  const selectionMode = shiftHeld || ctrlHeld;

  const applyBulkChanges = useCallback(() => {
    setImages(prev => prev.map(img => {
      if (!selectedIds.has(img.id)) return img;
      let updated = { ...img };
      if (stagedCategory !== null) {
        updated.category = stagedCategory;
      }
      for (const [objectId, action] of Object.entries(stagedObjects)) {
        if (action === 'add' && !updated.linkedObjectIds.includes(objectId)) {
          updated.linkedObjectIds = [...updated.linkedObjectIds, objectId];
        } else if (action === 'remove') {
          updated.linkedObjectIds = updated.linkedObjectIds.filter(oid => oid !== objectId);
        }
      }
      return updated;
    }));

    for (const [objectId, action] of Object.entries(stagedObjects)) {
      if (action === 'remove' && filterObject === objectId) {
        setFilterObject('all');
        break;
      }
    }

    setSelectedIds(new Set());
    setStagedCategory(null);
    setStagedObjects({});
  }, [selectedIds, stagedCategory, stagedObjects, filterObject]);

  // Track shift and ctrl keys globally
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftHeld(true);
      if (e.key === 'Control' || e.key === 'Meta') setCtrlHeld(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftHeld(false);
      if (e.key === 'Control' || e.key === 'Meta') setCtrlHeld(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', () => { setShiftHeld(false); setCtrlHeld(false); });
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Enter key to apply staged changes
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && hasStagedChanges && selectedIds.size > 0 && !modalImage) {
        e.preventDefault();
        applyBulkChanges();
      }
      // ? key toggles help (only when not typing in an input)
      if (e.key === '?' && !modalImage && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setShowHelp(prev => !prev);
      }
      // Escape closes help, or double-escape deselects all
      if (e.key === 'Escape') {
        if (showHelp) {
          e.preventDefault();
          setShowHelp(false);
        } else if (!modalImage && selectedIds.size > 0) {
          const now = Date.now();
          if (now - lastEscapeTime.current < 400) {
            e.preventDefault();
            setSelectedIds(new Set());
          }
          lastEscapeTime.current = now;
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [hasStagedChanges, selectedIds, modalImage, applyBulkChanges, showHelp]);

  const filteredImages = useMemo(() => {
    let result = images;
    if (filterStatus !== 'all') result = result.filter(img => img.evidenceStatus === filterStatus);
    if (filterCategory === 'uncategorized') {
      result = result.filter(img => !img.category);
    } else if (filterCategory !== 'all') {
      result = result.filter(img => img.category === filterCategory);
    }
    if (filterObject !== 'all') result = result.filter(img => img.linkedObjectIds.includes(filterObject));
    if (filterFavorites) result = result.filter(img => img.isFavorite);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(img => img.filename.toLowerCase().includes(term));
    }
    return result;
  }, [images, filterStatus, filterCategory, filterObject, filterFavorites, searchTerm]);

  const pagedImages = useMemo(() => filteredImages.slice(0, page * PAGE_SIZE), [filteredImages, page]);
  const hasMore = pagedImages.length < filteredImages.length;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const handleScroll = () => {
      if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 200 && hasMore) {
        setPage(p => p + 1);
      }
    };
    grid.addEventListener('scroll', handleScroll);
    return () => grid.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  useEffect(() => { setPage(1); }, [filterStatus, filterCategory, filterObject, filterFavorites, searchTerm]);

  useEffect(() => {
    setStagedCategory(null);
    setStagedObjects({});
  }, [selectedIds]);

  const handleSelect = useCallback((id: string, e: React.MouseEvent) => {
    if (e.shiftKey && lastClickedId) {
      // Range select
      const allIds = filteredImages.map(img => img.id);
      const startIdx = allIds.indexOf(lastClickedId);
      const endIdx = allIds.indexOf(id);
      if (startIdx !== -1 && endIdx !== -1) {
        const [from, to] = startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
        const rangeIds = allIds.slice(from, to + 1);
        setSelectedIds(prev => {
          const next = new Set(prev);
          rangeIds.forEach(rid => next.add(rid));
          return next;
        });
      }
    } else {
      // Individual toggle (ctrl or normal checkbox click)
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      });
    }
    setLastClickedId(id);
  }, [lastClickedId, filteredImages]);

  const handleCardClick = useCallback((image: ImageData, e: React.MouseEvent) => {
    if (selectionMode) {
      handleSelect(image.id, e);
    } else {
      setModalImage(image);
    }
  }, [selectionMode, handleSelect]);

  const selectAll = () => setSelectedIds(new Set(filteredImages.map(img => img.id)));
  const deselectAll = () => { setSelectedIds(new Set()); setShowSelectionDetail(false); };
  const deselectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleFavorite = useCallback((id: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, isFavorite: !img.isFavorite } : img));
    setModalImage(prev => prev && prev.id === id ? { ...prev, isFavorite: !prev.isFavorite } : prev);
  }, []);

  const updateImage = useCallback((updated: ImageData) => {
    setImages(prev => prev.map(img => img.id === updated.id ? updated : img));
    setModalImage(updated);
  }, []);

  const bulkUpdateStatus = (status: EvidenceStatus) => {
    setImages(prev => prev.map(img =>
      selectedIds.has(img.id) ? { ...img, evidenceStatus: status, reviewedAt: new Date().toISOString(), reviewedBy: 'current_user' } : img
    ));
    setSelectedIds(new Set());
  };

  const bulkToggleFavorite = () => {
    const allFav = [...selectedIds].every(id => images.find(img => img.id === id)?.isFavorite);
    setImages(prev => prev.map(img =>
      selectedIds.has(img.id) ? { ...img, isFavorite: !allFav } : img
    ));
  };

  const stageCategory = (category: PhotoCategory) => {
    setStagedCategory(prev => prev === category ? null : category);
  };

  const stageObjectToggle = (objectId: string) => {
    setStagedObjects(prev => {
      const current = prev[objectId];
      const allHave = [...selectedIds].every(id => {
        const img = images.find(i => i.id === id);
        return img?.linkedObjectIds.includes(objectId);
      });
      if (current === null || current === undefined) {
        return { ...prev, [objectId]: allHave ? 'remove' : 'add' };
      } else {
        return { ...prev, [objectId]: null };
      }
    });
  };

  // Right-click on zaakobject = force remove (including partial)
  const forceRemoveObject = (objectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setStagedObjects(prev => {
      const current = prev[objectId];
      // Toggle: if already staged-remove, cancel; otherwise force remove
      return { ...prev, [objectId]: current === 'remove' ? null : 'remove' };
    });
  };

  const selectedImages = images.filter(img => selectedIds.has(img.id));
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: images.length, clear: 0, unclear: 0, onbruikbaar: 0, favorites: 0 };
    for (const img of images) {
      counts[img.evidenceStatus]++;
      if (img.isFavorite) counts.favorites++;
    }
    return counts;
  }, [images]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: images.length, uncategorized: 0 };
    for (const cat of photoCategories) counts[cat] = 0;
    for (const img of images) {
      if (img.category) counts[img.category]++;
      else counts.uncategorized++;
    }
    return counts;
  }, [images]);

  const objectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const obj of caseObjects) counts[obj.id] = 0;
    for (const img of images) {
      for (const oid of img.linkedObjectIds) {
        counts[oid] = (counts[oid] || 0) + 1;
      }
    }
    return counts;
  }, [images]);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (!modalImage) return;
    const idx = filteredImages.findIndex(img => img.id === modalImage.id);
    const newIdx = direction === 'prev' ? idx - 1 : idx + 1;
    if (newIdx >= 0 && newIdx < filteredImages.length) {
      setModalImage(filteredImages[newIdx]);
    }
  }, [modalImage, filteredImages]);

  const clearAllFilters = () => {
    setFilterStatus('all');
    setFilterCategory('all');
    setFilterObject('all');
    setFilterFavorites(false);
    setSearchTerm('');
  };

  const hasActiveFilters = filterStatus !== 'all' || filterCategory !== 'all' || filterObject !== 'all' || filterFavorites || searchTerm;

  const getObjectDisplayState = (objectId: string): 'all' | 'partial' | 'none' | 'staged-add' | 'staged-remove' => {
    const staged = stagedObjects[objectId];
    if (staged === 'add') return 'staged-add';
    if (staged === 'remove') return 'staged-remove';
    if (selectedIds.size === 0) return 'none';
    const withObj = selectedImages.filter(img => img.linkedObjectIds.includes(objectId)).length;
    if (withObj === selectedImages.length) return 'all';
    if (withObj > 0) return 'partial';
    return 'none';
  };

  const currentSizeIdx = thumbSizeOrder.indexOf(thumbSize);
  const canShrink = currentSizeIdx > 0;
  const canGrow = currentSizeIdx < thumbSizeOrder.length - 1;

  // Active filter chips for the toolbar
  const activeFilterChips: { label: string; onClear: () => void }[] = [];
  if (filterStatus !== 'all') {
    const statusLabel = filterStatus === 'clear' ? 'Duidelijk' : filterStatus === 'unclear' ? 'Onduidelijk' : 'Onbruikbaar';
    activeFilterChips.push({ label: statusLabel, onClear: () => setFilterStatus('all') });
  }
  if (filterFavorites) {
    activeFilterChips.push({ label: 'Favorieten', onClear: () => setFilterFavorites(false) });
  }
  if (filterCategory !== 'all') {
    const catLabel = filterCategory === 'uncategorized' ? 'Niet gecategoriseerd' : categoryLabels[filterCategory as PhotoCategory];
    activeFilterChips.push({ label: catLabel, onClear: () => setFilterCategory('all') });
  }
  if (filterObject !== 'all') {
    const objName = caseObjects.find(o => o.id === filterObject)?.name || '';
    activeFilterChips.push({ label: objName, onClear: () => setFilterObject('all') });
  }
  if (searchTerm) {
    activeFilterChips.push({ label: `"${searchTerm}"`, onClear: () => setSearchTerm('') });
  }

  return (
    <div className={`h-full flex overflow-hidden max-w-full ${selectionMode ? 'select-none' : ''}`}>
      {/* Left Sidebar - Filters */}
      <aside className="w-60 bg-white border-r border-border flex flex-col shrink-0 min-w-0">
        <div className="p-4 border-b border-muted">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-1">
              <Filter className="size-4" />
              <span className="text-sm">Filters</span>
            </div>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-[10px] text-destructive hover:text-primary flex items-center gap-0.5">
                <X className="size-2.5" />
                Alles wissen
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Bestanden zoeken..."
              className="w-full pl-8 pr-8 py-1.5 bg-input-background border border-border rounded-lg text-xs text-gray-1 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-1">
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-auto p-2 space-y-1">
          {/* Evidence Status */}
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Bewijsstatus</div>
            {filterStatus !== 'all' && (
              <button onClick={() => setFilterStatus('all')} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
            )}
          </div>
          <button
            onClick={() => { setFilterStatus('all'); setFilterFavorites(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
              filterStatus === 'all' && !filterFavorites ? 'bg-primary text-white' : 'text-gray-1 hover:bg-accent'
            }`}
          >
            <span>Alle afbeeldingen</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterStatus === 'all' && !filterFavorites ? 'bg-white/20 text-white' : 'bg-muted text-gray-2'}`}>{statusCounts.all}</span>
          </button>
          <button
            onClick={() => { setFilterStatus('clear'); setFilterFavorites(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
              filterStatus === 'clear' ? 'bg-primary text-white' : 'text-gray-1 hover:bg-accent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Eye className="size-3.5 text-success" />
              Duidelijk
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterStatus === 'clear' ? 'bg-white/20 text-white' : 'bg-muted text-gray-2'}`}>{statusCounts.clear}</span>
          </button>
          <button
            onClick={() => { setFilterStatus('unclear'); setFilterFavorites(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
              filterStatus === 'unclear' ? 'bg-primary text-white' : 'text-gray-1 hover:bg-accent'
            }`}
          >
            <span className="flex items-center gap-2">
              <EyeOff className="size-3.5 text-destructive" />
              Onduidelijk
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterStatus === 'unclear' ? 'bg-white/20 text-white' : 'bg-muted text-gray-2'}`}>{statusCounts.unclear}</span>
          </button>
          <button
            onClick={() => { setFilterStatus('onbruikbaar'); setFilterFavorites(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
              filterStatus === 'onbruikbaar' ? 'bg-primary text-white' : 'text-gray-1 hover:bg-accent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Ban className="size-3.5 text-muted-foreground" />
              Onbruikbaar (wazig)
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterStatus === 'onbruikbaar' ? 'bg-white/20 text-white' : 'bg-muted text-gray-2'}`}>{statusCounts.onbruikbaar}</span>
          </button>

          <div className="my-1 border-t border-muted" />
          <button
            onClick={() => { setFilterFavorites(!filterFavorites); if (!filterFavorites) setFilterStatus('all'); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
              filterFavorites ? 'bg-primary text-white' : 'text-gray-1 hover:bg-accent'
            }`}
          >
            <span className="flex items-center gap-2">
              <Star className="size-3.5 text-warning" />
              Favorieten
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterFavorites ? 'bg-white/20 text-white' : 'bg-muted text-gray-2'}`}>{statusCounts.favorites}</span>
          </button>

          <div className="my-1 border-t border-muted" />
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Camera className="size-3" />
              Fotocategorie
            </div>
            {filterCategory !== 'all' && (
              <button onClick={() => setFilterCategory('all')} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
            )}
          </div>
          <button
            onClick={() => setFilterCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filterCategory === 'all' ? 'bg-primary text-white' : 'text-gray-1 hover:bg-accent'
            }`}
          >
            <span>Alle categorieën</span>
          </button>
          {photoCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                filterCategory === cat ? 'bg-primary text-white' : 'text-gray-1 hover:bg-accent'
              }`}
            >
              <span>{categoryLabels[cat]}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterCategory === cat ? 'bg-white/20 text-white' : 'bg-muted text-gray-2'}`}>{categoryCounts[cat]}</span>
            </button>
          ))}
          <button
            onClick={() => setFilterCategory('uncategorized')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filterCategory === 'uncategorized' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            <span className="italic">Niet gecategoriseerd</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterCategory === 'uncategorized' ? 'bg-white/20 text-white' : 'bg-muted text-gray-2'}`}>{categoryCounts.uncategorized}</span>
          </button>

          <div className="my-1 border-t border-muted" />
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Car className="size-3" />
              Zaakobjecten
            </div>
            {filterObject !== 'all' && (
              <button onClick={() => setFilterObject('all')} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
            )}
          </div>
          <button
            onClick={() => setFilterObject('all')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filterObject === 'all' ? 'bg-primary text-white' : 'text-gray-1 hover:bg-accent'
            }`}
          >
            <span>Alle objecten</span>
          </button>
          {caseObjects.map(obj => (
            <button
              key={obj.id}
              onClick={() => setFilterObject(obj.id)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                filterObject === obj.id ? 'bg-primary text-white' : 'text-gray-1 hover:bg-accent'
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: obj.color }} />
                <span className="truncate">{obj.name}</span>
                {obj.kenteken && (
                  <span className={`text-[9px] px-1 py-0.5 rounded shrink-0 ${filterObject === obj.id ? 'bg-white/20' : 'bg-accent'}`}>{obj.kenteken}</span>
                )}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ml-1 ${filterObject === obj.id ? 'bg-white/20 text-white' : 'bg-muted text-gray-2'}`}>{objectCounts[obj.id] || 0}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-muted text-[10px] text-muted-foreground">
          {filteredImages.length} van {images.length} afbeeldingen
        </div>
      </aside>

      {/* Center - Gallery Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Gallery toolbar */}
        <div className="bg-white border-b border-border px-4 py-2 flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
            <button
              onClick={selectedIds.size === filteredImages.length ? deselectAll : selectAll}
              className="flex items-center gap-1.5 text-xs text-gray-2 hover:text-primary transition-colors shrink-0"
            >
              {selectedIds.size === filteredImages.length && filteredImages.length > 0 ? (
                <SquareCheckBig className="size-4 text-secondary" />
              ) : (
                <Square className="size-4" />
              )}
              {selectedIds.size > 0 ? `${selectedIds.size} geselecteerd` : 'Alles selecteren'}
            </button>

            {selectedIds.size > 0 && (
              <>
                <button
                  onClick={() => setShowSelectionDetail(!showSelectionDetail)}
                  className="text-[10px] text-secondary hover:text-primary shrink-0 flex items-center gap-0.5"
                >
                  {showSelectionDetail ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                </button>
                <button onClick={deselectAll} className="text-xs text-muted-foreground hover:text-gray-2 shrink-0">
                  <X className="size-3.5" />
                </button>
              </>
            )}

            {/* Active filter chips in toolbar */}
            {activeFilterChips.length > 0 && (
              <div className="flex items-center gap-1 ml-1">
                <span className="text-[10px] text-muted-foreground">|</span>
                {activeFilterChips.map((chip, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
                  >
                    {chip.label}
                    <button onClick={chip.onClear} className="hover:text-destructive"><X className="size-2.5" /></button>
                  </span>
                ))}
                {activeFilterChips.length > 1 && (
                  <button onClick={clearAllFilters} className="text-[10px] text-destructive hover:text-primary shrink-0 ml-0.5">
                    Alles wissen
                  </button>
                )}
              </div>
            )}

            {selectionMode && (
              <span className="text-[10px] bg-secondary text-white px-2 py-0.5 rounded-full animate-pulse shrink-0">
                {shiftHeld ? 'Bereik selectie' : 'Individuele selectie'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Thumbnail size control */}
            <div className="flex items-center gap-0.5 bg-accent rounded-full p-0.5">
              <button
                onClick={() => canShrink && setThumbSize(thumbSizeOrder[currentSizeIdx - 1])}
                disabled={!canShrink}
                className="size-7 flex items-center justify-center rounded-full text-gray-2 hover:bg-white hover:text-primary hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none disabled:hover:text-gray-2"
              >
                <Minus className="size-3" />
              </button>
              <div className="flex items-center gap-0.5 px-1.5">
                <Grid3x3 className="size-3 text-muted-foreground" />
                <span className="text-[10px] text-gray-2 w-5 text-center">{thumbSizeConfig[thumbSize].label}</span>
              </div>
              <button
                onClick={() => canGrow && setThumbSize(thumbSizeOrder[currentSizeIdx + 1])}
                disabled={!canGrow}
                className="size-7 flex items-center justify-center rounded-full text-gray-2 hover:bg-white hover:text-primary hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none disabled:hover:text-gray-2"
              >
                <Plus className="size-3" />
              </button>
            </div>

            <div className="text-xs text-muted-foreground">
              {pagedImages.length}/{filteredImages.length}
            </div>

            <button
              onClick={() => setShowHelp(true)}
              className="size-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
              title="Sneltoetsen (druk op ?)"
            >
              <HelpCircle className="size-4" />
            </button>
          </div>
        </div>

        {/* Selection detail strip */}
        {selectedIds.size > 0 && showSelectionDetail && (
          <div className="bg-primary/5 border-b border-border px-4 py-2 shrink-0">
            <div className="flex flex-wrap gap-1 max-h-20 overflow-auto">
              {selectedImages.map(img => (
                <span
                  key={img.id}
                  className="inline-flex items-center gap-1 bg-white border border-border rounded-full pl-1 pr-1.5 py-0.5 text-[10px] text-gray-1 hover:border-secondary transition-colors"
                >
                  <img src={img.url} alt="" className="size-4 rounded-full object-cover" />
                  <span className="truncate max-w-[80px]">{img.filename.replace('.jpg', '')}</span>
                  <button
                    onClick={() => deselectOne(img.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="size-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        <div ref={gridRef} className="flex-1 overflow-auto p-3 bg-accent">
          {filteredImages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Geen afbeeldingen gevonden voor de huidige filters.
            </div>
          ) : (
            <div className={`grid gap-2 ${thumbSizeConfig[thumbSize].grid}`}>
              {pagedImages.map((image) => {
                const isSelected = selectedIds.has(image.id);
                const linkedObjs = caseObjects.filter(o => image.linkedObjectIds.includes(o.id));
                const ic = thumbIconConfig[thumbSize];
                return (
                  <div
                    key={image.id}
                    onClick={(e) => handleCardClick(image, e)}
                    className={`group relative rounded-xl overflow-hidden bg-white shadow-sm transition-all ${
                      selectionMode ? 'cursor-pointer' : 'cursor-default'
                    } ${
                      isSelected
                        ? 'ring-2 ring-secondary shadow-md'
                        : selectionMode
                        ? 'hover:ring-2 hover:ring-secondary/40 hover:shadow-md'
                        : 'hover:shadow-md'
                    }`}
                  >
                    {/* Selection overlay (shift or ctrl mode) */}
                    {selectionMode && (
                      <div className={`absolute inset-0 z-20 transition-colors rounded-xl ${
                        isSelected ? 'bg-secondary/15' : 'hover:bg-secondary/10'
                      }`}>
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${ic.selectionCircle} rounded-full flex items-center justify-center transition-all ${
                          isSelected ? 'bg-secondary text-white scale-100' : 'bg-white/80 text-muted-foreground scale-90 group-hover:scale-100'
                        }`}>
                          <Check className={ic.selectionCheck} />
                        </div>
                      </div>
                    )}

                    <div className="aspect-square bg-accent relative overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className={`w-full h-full object-cover ${image.evidenceStatus === 'onbruikbaar' ? 'opacity-50 blur-[1px]' : ''}`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                      {image.evidenceStatus === 'unclear' && (
                        <div className={`absolute bottom-1 right-1 bg-destructive/90 rounded-full ${ic.statusPad}`}>
                          <EyeOff className={`${ic.statusIcon} text-white`} />
                        </div>
                      )}
                      {image.evidenceStatus === 'onbruikbaar' && (
                        <div className={`absolute bottom-1 right-1 bg-muted-foreground/90 rounded-full ${ic.statusPad}`}>
                          <Ban className={`${ic.statusIcon} text-white`} />
                        </div>
                      )}

                      {linkedObjs.length > 0 && (
                        <div className={`absolute ${ic.linkedPosition} flex gap-0.5`}>
                          {linkedObjs.map(obj => (
                            <span
                              key={obj.id}
                              className={`${ic.dot} rounded-full border border-white/80 shadow-sm`}
                              style={{ backgroundColor: obj.color }}
                              title={obj.name}
                            />
                          ))}
                        </div>
                      )}

                      {image.detectedObjects && (
                        <div className={`absolute ${ic.mlPosition} opacity-0 group-hover:opacity-100 transition-opacity`}>
                          <Sparkles className={`${ic.mlIcon} text-success drop-shadow`} />
                        </div>
                      )}
                    </div>

                    {!selectionMode && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSelect(image.id, e); }}
                        className={`absolute top-1.5 left-1.5 ${ic.checkboxWrap} rounded-md flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-secondary text-white'
                            : 'bg-white/80 text-transparent group-hover:text-muted-foreground border border-border/60'
                        }`}
                      >
                        <Check className={ic.checkboxIcon} />
                      </button>
                    )}

                    {!selectionMode && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(image.id); }}
                        className={`absolute ${ic.favoritePosition} transition-all ${
                          image.isFavorite
                            ? 'text-warning opacity-100'
                            : 'text-white/70 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Star className={`${ic.favoriteIcon} drop-shadow ${image.isFavorite ? 'fill-warning' : ''}`} />
                      </button>
                    )}

                    <div className="px-1.5 py-1">
                      <div className="truncate text-[10px] text-gray-1">{image.filename}</div>
                      {image.category && (
                        <div className="text-[9px] text-muted-foreground">{categoryLabels[image.category]}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {hasMore && (
            <div className="text-center py-4 text-xs text-muted-foreground">Meer laden...</div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Actions */}
      <aside ref={actionsRef} className="w-72 bg-white border-l border-border flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-muted">
          <h3 className="text-sm text-primary">Acties</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {selectedIds.size > 0
              ? `${selectedIds.size} afbeelding${selectedIds.size > 1 ? 'en' : ''} geselecteerd`
              : 'Selecteer afbeeldingen voor acties'}
          </p>
          {selectedIds.size === 0 && (
            <p className="text-[10px] text-muted-foreground mt-1 italic">
              Tip: Houd Shift of Ctrl ingedrukt
            </p>
          )}
        </div>

        {selectedIds.size > 0 ? (
          <div className="flex-1 overflow-auto flex flex-col">
            <div className="flex-1 overflow-auto">
              <div className="p-4 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Bewijsstatus</div>
                {selectedImages.every(img => img.evidenceStatus === 'onbruikbaar') ? (
                  <button
                    onClick={() => bulkUpdateStatus('clear')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-full text-xs bg-success/10 text-success hover:bg-success/20 transition-colors"
                  >
                    <Eye className="size-3.5" />
                    Markeer als bruikbaar
                  </button>
                ) : (
                  <button
                    onClick={() => bulkUpdateStatus('onbruikbaar')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-full text-xs bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20 transition-colors"
                  >
                    <Ban className="size-3.5" />
                    Markeer als onbruikbaar (wazig)
                  </button>
                )}

                <div className="border-t border-muted my-3" />

                <button
                  onClick={bulkToggleFavorite}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-full text-xs bg-warning/10 text-warning-foreground hover:bg-warning/20 transition-colors"
                >
                  <Star className="size-3.5 text-warning" />
                  Favoriet aan/uit
                </button>
              </div>

              <div className="px-4 pb-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Tag className="size-3" />
                  Categorie toewijzen
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {photoCategories.map(cat => {
                    const isStaged = stagedCategory === cat;
                    const allHaveCat = !isStaged && selectedImages.every(img => img.category === cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => stageCategory(cat)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] transition-colors ${
                          isStaged
                            ? 'bg-secondary text-white ring-2 ring-secondary/40'
                            : allHaveCat
                            ? 'bg-primary text-white'
                            : 'bg-input-background text-gray-1 hover:bg-accent border border-muted'
                        }`}
                      >
                        {categoryLabels[cat]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Car className="size-3" />
                  Zaakobjecten koppelen
                </div>
                <div className="space-y-1.5">
                  {caseObjects.map(obj => {
                    const state = getObjectDisplayState(obj.id);
                    return (
                      <button
                        key={obj.id}
                        onClick={() => stageObjectToggle(obj.id)}
                        onContextMenu={(e) => forceRemoveObject(obj.id, e)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors border ${
                          state === 'staged-add'
                            ? 'border-success bg-success/10 text-success ring-1 ring-success/30'
                            : state === 'staged-remove'
                            ? 'border-destructive bg-destructive/10 text-destructive ring-1 ring-destructive/30'
                            : state === 'all'
                            ? 'border-secondary bg-secondary/10 text-primary'
                            : state === 'partial'
                            ? 'border-secondary/40 bg-secondary/5 text-gray-2'
                            : 'border-muted bg-white text-gray-1 hover:bg-input-background'
                        }`}
                      >
                        <span
                          className="size-3.5 rounded-full shrink-0 border border-white shadow-sm"
                          style={{ backgroundColor: obj.color }}
                        />
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="truncate">{obj.name}</span>
                            {obj.kenteken && (
                              <span className="text-[9px] bg-accent text-gray-2 px-1 py-0.5 rounded shrink-0">{obj.kenteken}</span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">{obj.description}</div>
                        </div>
                        <span className="shrink-0">
                          {state === 'all' && <Check className="size-3 text-secondary" />}
                          {state === 'partial' && <span className="text-[10px] text-secondary">deels</span>}
                          {state === 'staged-add' && <span className="text-[10px]">+</span>}
                          {state === 'staged-remove' && <span className="text-[10px]">-</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Selectie-overzicht</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-2">
                    <span className="flex items-center gap-1.5"><Eye className="size-3" /> Duidelijk</span>
                    <span>{selectedImages.filter(img => img.evidenceStatus === 'clear').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-2">
                    <span className="flex items-center gap-1.5"><EyeOff className="size-3" /> Onduidelijk</span>
                    <span>{selectedImages.filter(img => img.evidenceStatus === 'unclear').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-2">
                    <span className="flex items-center gap-1.5"><Ban className="size-3" /> Onbruikbaar</span>
                    <span>{selectedImages.filter(img => img.evidenceStatus === 'onbruikbaar').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-2">
                    <span className="flex items-center gap-1.5"><Star className="size-3" /> Favorieten</span>
                    <span>{selectedImages.filter(img => img.isFavorite).length}</span>
                  </div>
                </div>
              </div>
            </div>

            {hasStagedChanges && (
              <div className="p-4 border-t border-muted bg-primary/5 shrink-0">
                <div className="text-[10px] text-primary mb-2">
                  {[
                    stagedCategory ? `Categorie: ${categoryLabels[stagedCategory]}` : null,
                    ...Object.entries(stagedObjects)
                      .filter(([, v]) => v !== null)
                      .map(([id, action]) => `${action === 'add' ? '+' : '-'} ${caseObjects.find(o => o.id === id)?.name}`),
                  ].filter(Boolean).join(' · ')}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setStagedCategory(null); setStagedObjects({}); }}
                    className="flex-1 px-3 py-2 rounded-full text-xs bg-white text-gray-2 hover:bg-accent border border-border transition-colors"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={applyBulkChanges}
                    className="flex-1 px-3 py-2 rounded-full text-xs bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    Toepassen op {selectedIds.size}
                  </button>
                </div>
                <div className="text-center text-[9px] text-muted-foreground mt-1.5">
                  of druk op <kbd className="px-1 py-0.5 bg-accent rounded text-[9px]">Enter</kbd>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Car className="size-3" />
                Zaakobjecten
              </div>
              <div className="space-y-2">
                {caseObjects.map(obj => (
                  <div key={obj.id} className="p-2.5 bg-input-background rounded-xl border border-muted overflow-hidden">
                    <div className="flex items-center gap-2 mb-1 min-w-0">
                      <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: obj.color }} />
                      <span className="text-xs text-foreground truncate">{obj.name}</span>
                      <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{obj.vehicleType}</span>
                    </div>
                    {obj.kenteken && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] bg-warning/20 text-gray-1 px-1.5 py-0.5 rounded border border-warning/40 tracking-wider">{obj.kenteken}</span>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-2 truncate">{obj.description}</p>
                    <div className="text-[10px] text-muted-foreground mt-1">{objectCounts[obj.id] || 0} afbeeldingen gekoppeld</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Bewijsstatus</div>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-2 mb-1">
                    <span className="flex items-center gap-1.5"><Eye className="size-3" /> Duidelijk</span>
                    <span>{statusCounts.clear}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-success transition-all" style={{ width: `${images.length > 0 ? (statusCounts.clear / images.length) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-2 mb-1">
                    <span className="flex items-center gap-1.5"><EyeOff className="size-3" /> Onduidelijk</span>
                    <span>{statusCounts.unclear}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-destructive transition-all" style={{ width: `${images.length > 0 ? (statusCounts.unclear / images.length) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-2 mb-1">
                    <span className="flex items-center gap-1.5"><Ban className="size-3" /> Onbruikbaar</span>
                    <span>{statusCounts.onbruikbaar}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-muted-foreground transition-all" style={{ width: `${images.length > 0 ? (statusCounts.onbruikbaar / images.length) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Snelle tips</div>
              <div className="text-[11px] text-gray-2 space-y-2">
                <p>Klik op een afbeelding om de detailweergave te openen.</p>
                <p>Houd <kbd className="px-1 py-0.5 bg-accent rounded text-[10px]">Shift</kbd> ingedrukt voor bereik-selectie.</p>
                <p>Houd <kbd className="px-1 py-0.5 bg-accent rounded text-[10px]">Ctrl</kbd> ingedrukt voor individuele selectie.</p>
                <p>Druk op <kbd className="px-1 py-0.5 bg-accent rounded text-[10px]">Enter</kbd> om wijzigingen toe te passen.</p>
                <p>Rechtermuisklik op een zaakobject om het te verwijderen.</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {modalImage && (
        <ImageDetailModal
          key={modalImage.id}
          image={modalImage}
          onClose={() => setModalImage(null)}
          onUpdate={updateImage}
          onToggleFavorite={toggleFavorite}
          onNavigate={navigateImage}
          hasPrev={filteredImages.findIndex(img => img.id === modalImage.id) > 0}
          hasNext={filteredImages.findIndex(img => img.id === modalImage.id) < filteredImages.length - 1}
        />
      )}

      {/* Help / Shortcuts Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowHelp(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-muted bg-primary">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Keyboard className="size-4 text-secondary" />
                </div>
                <div>
                  <h2 className="text-sm text-white">Sneltoetsen & Interacties</h2>
                  <p className="text-[10px] text-white/60">Alle beschikbare acties in de beeldgallerij</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-auto space-y-6">
              {/* Keyboard shortcuts */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Keyboard className="size-3.5 text-secondary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Toetsenbord</span>
                </div>
                <div className="space-y-0.5">
                  {([
                    { keys: ['Shift'], action: 'Ingedrukt houden', desc: 'Bereik-selectiemodus activeren' },
                    { keys: ['Ctrl', '/', 'Cmd'], action: 'Ingedrukt houden', desc: 'Individuele selectiemodus activeren' },
                    { keys: ['Shift'], action: '+ Klik', desc: 'Alle afbeeldingen tussen twee klikken selecteren' },
                    { keys: ['Ctrl', '/', 'Cmd'], action: '+ Klik', desc: 'Individuele afbeelding aan/uit selectie schakelen' },
                    { keys: ['Enter'], action: 'Druk', desc: 'Gestagede bulk-wijzigingen toepassen' },
                    { keys: ['Esc'], action: 'Druk', desc: 'Detailweergave of dit venster sluiten' },
                    { keys: ['Esc', 'Esc'], action: 'Snel 2×', desc: 'Selectie van alle afbeeldingen opheffen' },
                    { keys: ['?'], action: 'Druk', desc: 'Dit helpvenster openen/sluiten' },
                  ] as const).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-input-background transition-colors">
                      <div className="flex items-center gap-1 shrink-0 w-36">
                        {item.keys.map((key, ki) => (
                          <span key={ki}>
                            {key === '/' ? (
                              <span className="text-[10px] text-muted-foreground mx-0.5">/</span>
                            ) : (
                              <kbd className="px-1.5 py-0.5 bg-accent border border-border rounded text-[10px] text-gray-1 shadow-sm">
                                {key}
                              </kbd>
                            )}
                          </span>
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-1">{item.action}</span>
                      </div>
                      <span className="text-xs text-gray-2">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail modal shortcuts */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="size-3.5 text-secondary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Detailweergave</span>
                </div>
                <div className="space-y-0.5">
                  {([
                    { keys: ['\u2190'], desc: 'Vorige afbeelding' },
                    { keys: ['\u2192'], desc: 'Volgende afbeelding' },
                    { keys: ['Esc'], desc: 'Detailweergave sluiten' },
                    { keys: ['Scrollwiel'], desc: 'In-/uitzoomen op afbeelding' },
                  ] as const).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-input-background transition-colors">
                      <div className="flex items-center gap-1 shrink-0 w-36">
                        {item.keys.map((key, ki) => (
                          <kbd key={ki} className="px-1.5 py-0.5 bg-accent border border-border rounded text-[10px] text-gray-1 shadow-sm">
                            {key}
                          </kbd>
                        ))}
                      </div>
                      <span className="text-xs text-gray-2">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mouse interactions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mouse className="size-3.5 text-secondary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Muis-interacties</span>
                </div>
                <div className="space-y-0.5">
                  {([
                    { icon: 'click', label: 'Klik op afbeelding', desc: 'Detailweergave openen' },
                    { icon: 'check', label: 'Klik op checkbox', desc: 'Afbeelding selecteren/deselecteren' },
                    { icon: 'star', label: 'Klik op ster', desc: 'Favoriet aan/uit schakelen' },
                  ] as const).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-input-background transition-colors">
                      <div className="flex items-center gap-2 shrink-0 w-36">
                        {item.icon === 'click' && <MousePointerClick className="size-3.5 text-gray-2" />}
                        {item.icon === 'check' && <Check className="size-3.5 text-gray-2" />}
                        {item.icon === 'star' && <Star className="size-3.5 text-warning" />}
                        <span className="text-[10px] text-muted-foreground">{item.label}</span>
                      </div>
                      <span className="text-xs text-gray-2">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bulk actions panel */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="size-3.5 text-secondary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Bulk Acties (rechterpaneel)</span>
                </div>
                <div className="space-y-0.5">
                  {([
                    { label: 'Links klik op zaakobject', desc: 'Object koppelen/ontkoppelen (staged)' },
                    { label: 'Rechts klik op zaakobject', desc: 'Object geforceerd verwijderen van selectie' },
                    { label: 'Klik op categorie', desc: 'Categorie staged toewijzen aan selectie' },
                    { label: '"Toepassen" of Enter', desc: 'Alle gestagede wijzigingen doorvoeren' },
                  ] as const).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-input-background transition-colors">
                      <span className="text-[10px] text-muted-foreground shrink-0 w-36">{item.label}</span>
                      <span className="text-xs text-gray-2">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status system explanation */}
              <div className="p-3 bg-primary/5 rounded-xl">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Statussysteem</div>
                <div className="space-y-1.5 text-[11px] text-gray-2">
                  <div className="flex items-start gap-2">
                    <Eye className="size-3.5 text-success mt-0.5 shrink-0" />
                    <span><strong className="text-success">Duidelijk</strong> — automatisch na elke handmatige review-actie (categorie, object, notitie)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <EyeOff className="size-3.5 text-destructive mt-0.5 shrink-0" />
                    <span><strong className="text-destructive">Onduidelijk</strong> — automatisch door ML-model bij lage confidence; verdwijnt na review</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Ban className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <span><strong className="text-muted-foreground">Onbruikbaar (wazig)</strong> — enige handmatig instelbare status; markeer wazige of onbruikbare foto's</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-muted bg-input-background flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Druk op <kbd className="px-1 py-0.5 bg-accent border border-border rounded text-[10px] shadow-sm">?</kbd> of <kbd className="px-1 py-0.5 bg-accent border border-border rounded text-[10px] shadow-sm">Esc</kbd> om te sluiten
              </span>
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-1.5 rounded-full text-xs bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}