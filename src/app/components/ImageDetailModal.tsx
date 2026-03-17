import { useState, useEffect, useRef, useCallback } from "react";
import { ImageData, PhotoCategory } from "../types";
import { caseObjects } from "../data/mockData";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  Ban,
  Tag,
  Car,
  HelpCircle,
  Keyboard,
  Mouse,
} from "lucide-react";

const photoCategories: PhotoCategory[] = ['sky_photo', 'detail_photo', 'overview', 'close_up', 'side_view', 'front_view'];

const categoryLabels: Record<PhotoCategory, string> = {
  sky_photo: 'Luchtfoto',
  detail_photo: 'Detailfoto',
  overview: 'Overzicht',
  close_up: 'Close-up',
  side_view: 'Zijaanzicht',
  front_view: 'Vooraanzicht',
};

interface Props {
  image: ImageData;
  onClose: () => void;
  onUpdate: (image: ImageData) => void;
  onToggleFavorite: (id: string) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function ImageDetailModal({ image, onClose, onUpdate, onToggleFavorite, onNavigate, hasPrev, hasNext }: Props) {
  const [localImage, setLocalImage] = useState<ImageData>(image);
  const [showHelp, setShowHelp] = useState(false);

  // Zoom & pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const dragDistance = useRef(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalImage(prev => {
      // Reset zoom/pan only when navigating to a different image
      if (prev.id !== image.id) {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
      return image;
    });
  }, [image]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showHelp) { setShowHelp(false); return; }
        onClose();
      }
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate('prev');
      if (e.key === 'ArrowRight' && hasNext) onNavigate('next');
      if (e.key === '?' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setShowHelp(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onNavigate, hasPrev, hasNext, showHelp]);

  // Non-passive wheel listener for zoom
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(prev => {
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        const next = Math.min(5, Math.max(1, prev + delta));
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsPanning(true);
    dragDistance.current = 0;
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    dragDistance.current = Math.sqrt(dx * dx + dy * dy);
    setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Click on dark area to close (only if not dragging)
  const handleImageAreaClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && dragDistance.current < 5) {
      onClose();
    }
  }, [onClose]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const save = (updated: ImageData) => {
    const reviewed: ImageData = {
      ...updated,
      evidenceStatus: updated.evidenceStatus === 'onbruikbaar' ? 'onbruikbaar' : 'clear',
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'current_user',
    };
    setLocalImage(reviewed);
    onUpdate(reviewed);
  };

  const updateCategory = (category: PhotoCategory) => {
    save({ ...localImage, category });
  };

  const toggleObject = (objectId: string) => {
    const has = localImage.linkedObjectIds.includes(objectId);
    save({
      ...localImage,
      linkedObjectIds: has
        ? localImage.linkedObjectIds.filter(id => id !== objectId)
        : [...localImage.linkedObjectIds, objectId],
    });
  };

  const setStatus = (status: ImageData['evidenceStatus']) => {
    setLocalImage(prev => {
      const updated = { ...prev, evidenceStatus: status, reviewedAt: new Date().toISOString(), reviewedBy: 'current_user' };
      onUpdate(updated);
      return updated;
    });
  };

  const hasML = localImage.detectedObjects && localImage.detectedObjects.length > 0;
  const linkedObjs = caseObjects.filter(o => localImage.linkedObjectIds.includes(o.id));

  return (
    <div className="fixed inset-0 z-50 flex bg-black/70">
      <div className="flex w-full h-full">
        {/* Image area */}
        <div
          ref={imageContainerRef}
          className={`flex-1 flex items-center justify-center relative min-w-0 overflow-hidden ${
            zoom > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
          }`}
          onClick={handleImageAreaClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {hasPrev && (
            <button
              onClick={() => onNavigate('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-primary/60 text-white flex items-center justify-center hover:bg-primary/80 transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={() => onNavigate('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-primary/60 text-white flex items-center justify-center hover:bg-primary/80 transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 size-9 rounded-full bg-primary/60 text-white flex items-center justify-center hover:bg-primary/80 transition-colors"
          >
            <X className="size-5" />
          </button>

          <button
            onClick={() => onToggleFavorite(localImage.id)}
            className="absolute top-4 left-16 z-10 size-9 rounded-full bg-primary/60 text-white flex items-center justify-center hover:bg-primary/80 transition-colors"
          >
            <Star className={`size-5 ${localImage.isFavorite ? 'fill-warning text-warning' : ''}`} />
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="absolute top-4 left-[6.5rem] z-10 size-9 rounded-full bg-primary/60 text-white flex items-center justify-center hover:bg-primary/80 transition-colors"
            title="Sneltoetsen (druk op ?)"
          >
            <HelpCircle className="size-5" />
          </button>

          {hasML && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-success/90 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs">
              <Sparkles className="size-3.5" />
              ML: {localImage.detectedObjects!.length} objecten ({Math.round((localImage.modelConfidence || 0) * 100)}%)
            </div>
          )}

          {linkedObjs.length > 0 && (
            <div className="absolute bottom-4 left-4 z-10 flex gap-1.5">
              {linkedObjs.map(obj => (
                <span
                  key={obj.id}
                  className="px-2.5 py-1 rounded-full text-[11px] text-white flex items-center gap-1.5 shadow-sm"
                  style={{ backgroundColor: obj.color + 'CC' }}
                >
                  <span className="size-2 rounded-full bg-white/40" />
                  {obj.name}
                </span>
              ))}
            </div>
          )}

          {/* Zoom indicator */}
          {zoom > 1 && (
            <button
              onClick={resetZoom}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs hover:bg-black/80 transition-colors"
            >
              {Math.round(zoom * 100)}% — Klik om te resetten
            </button>
          )}

          <img
            src={localImage.url}
            alt={localImage.filename}
            className="max-w-full max-h-full object-contain p-8 select-none"
            draggable={false}
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transition: isPanning ? 'none' : 'transform 0.15s ease-out',
            }}
          />
        </div>

        {/* Right panel - combined metadata */}
        <div className="w-80 bg-white flex flex-col shrink-0 h-full">
          {/* Header */}
          <div className="p-4 border-b border-muted">
            <h3 className="text-sm text-primary truncate" title={localImage.filename}>{localImage.filename}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {new Date(localImage.uploadedAt).toLocaleString('nl-NL')}
            </p>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] ${
                localImage.evidenceStatus === 'clear' ? 'bg-success/10 text-success' : localImage.evidenceStatus === 'onbruikbaar' ? 'bg-muted-foreground/10 text-muted-foreground' : 'bg-destructive/10 text-destructive'
              }`}>
                {localImage.evidenceStatus === 'clear' ? <Eye className="size-3" /> : localImage.evidenceStatus === 'onbruikbaar' ? <Ban className="size-3" /> : <EyeOff className="size-3" />}
                {localImage.evidenceStatus === 'clear' ? 'Duidelijk' : localImage.evidenceStatus === 'onbruikbaar' ? 'Onbruikbaar' : 'Onduidelijk'}
              </span>
              {localImage.isFavorite && (
                <Star className="size-3.5 text-warning fill-warning" />
              )}
              {localImage.category && (
                <span className="text-[10px] bg-accent text-primary px-2 py-0.5 rounded-full">
                  {categoryLabels[localImage.category]}
                </span>
              )}
            </div>
          </div>

          {/* Single scrollable content area */}
          <div className="flex-1 overflow-auto p-4 space-y-5">
            {/* Onbruikbaar toggle */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  const isOnbruikbaar = localImage.evidenceStatus === 'onbruikbaar';
                  setStatus(isOnbruikbaar ? 'clear' : 'onbruikbaar');
                }}
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs whitespace-nowrap transition-colors ${
                  localImage.evidenceStatus === 'onbruikbaar'
                    ? 'bg-success/10 text-success hover:bg-success/20'
                    : 'bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20'
                }`}
              >
                {localImage.evidenceStatus === 'onbruikbaar'
                  ? <Eye className="size-3.5" />
                  : <Ban className="size-3.5" />
                }
                {localImage.evidenceStatus === 'onbruikbaar' ? 'Markeer als bruikbaar' : 'Markeer als onbruikbaar (wazig)'}
              </button>

              {/* Favorite toggle button in panel */}
              <button
                onClick={() => onToggleFavorite(localImage.id)}
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs whitespace-nowrap transition-colors ${
                  localImage.isFavorite
                    ? 'bg-warning/10 text-warning-foreground hover:bg-warning/20'
                    : 'bg-warning/10 text-warning-foreground hover:bg-warning/20'
                }`}
              >
                <Star className={`size-3.5 text-warning ${localImage.isFavorite ? 'fill-warning' : ''}`} />
                {localImage.isFavorite ? 'Favoriet verwijderen' : 'Favoriet toevoegen'}
              </button>
            </div>

            {/* Photo Category */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Tag className="size-3" />
                Fotocategorie
              </div>
              {localImage.suggestedCategory && localImage.category !== localImage.suggestedCategory && (
                <div className="mb-3 p-2 bg-success/10 rounded-lg text-[11px] flex items-center gap-1.5">
                  <Sparkles className="size-3 text-success" />
                  <span className="text-gray-2">ML suggestie:</span>
                  <span className="text-success">{categoryLabels[localImage.suggestedCategory]}</span>
                  <button
                    onClick={() => updateCategory(localImage.suggestedCategory!)}
                    className="ml-auto text-[10px] text-secondary hover:text-primary"
                  >
                    Toepassen
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-1.5">
                {photoCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => updateCategory(cat)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] transition-colors truncate ${
                      localImage.category === cat
                        ? 'bg-primary text-white'
                        : 'bg-input-background text-gray-1 hover:bg-accent border border-muted'
                    }`}
                    title={categoryLabels[cat]}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Case Objects */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Car className="size-3" />
                Gekoppelde zaakobjecten
              </div>
              {hasML && (
                <div className="mb-2.5 p-2 bg-success/10 rounded-lg">
                  <div className="text-[10px] uppercase tracking-wider text-success mb-1">ML gedetecteerd</div>
                  <div className="space-y-0.5">
                    {localImage.detectedObjects!.map(obj => (
                      <div key={obj.id} className="flex items-center justify-between text-xs">
                        <span className="text-success capitalize">{obj.type}</span>
                        <span className="text-success text-[10px]">{Math.round((obj.confidence || 0) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                {caseObjects.map(obj => {
                  const isLinked = localImage.linkedObjectIds.includes(obj.id);
                  return (
                    <button
                      key={obj.id}
                      onClick={() => toggleObject(obj.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors border ${
                        isLinked
                          ? 'border-secondary bg-secondary/10 text-primary'
                          : 'border-muted bg-white text-gray-1 hover:bg-input-background'
                      }`}
                    >
                      <span
                        className="size-3.5 rounded-full shrink-0 border-2 border-white shadow-sm"
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
                      {isLinked && <Check className="size-3.5 text-secondary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Opmerkingen</div>
              <textarea
                value={localImage.notes || ''}
                onChange={e => save({ ...localImage, notes: e.target.value })}
                placeholder="Voeg observaties of notities toe..."
                className="w-full px-3 py-2 border border-border rounded-lg text-xs text-gray-1 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none bg-input-background"
                rows={4}
              />
            </div>

            {/* File Info */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Bestandsinformatie</div>
              <div className="space-y-1.5 text-xs text-gray-2">
                <div className="flex justify-between"><span>ID</span><span className="text-foreground">#{localImage.id}</span></div>
                <div className="flex justify-between"><span>Geüpload</span><span className="text-foreground">{new Date(localImage.uploadedAt).toLocaleDateString('nl-NL')}</span></div>
                {localImage.reviewedBy && (
                  <div className="flex justify-between"><span>Beoordeeld door</span><span className="text-foreground">{localImage.reviewedBy}</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help overlay */}
      {showHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => setShowHelp(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-muted bg-primary">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Keyboard className="size-4 text-secondary" />
                </div>
                <div>
                  <h2 className="text-sm text-white">Detailweergave sneltoetsen</h2>
                  <p className="text-[10px] text-white/60">Navigatie, zoom & interacties</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Keyboard */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Keyboard className="size-3.5 text-secondary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Toetsenbord</span>
                </div>
                <div className="space-y-0.5">
                  {[
                    { keys: ['\u2190'], desc: 'Vorige afbeelding' },
                    { keys: ['\u2192'], desc: 'Volgende afbeelding' },
                    { keys: ['Esc'], desc: 'Detailweergave sluiten' },
                    { keys: ['?'], desc: 'Dit helpvenster openen/sluiten' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-input-background transition-colors">
                      <div className="flex items-center gap-1 shrink-0 w-24">
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

              {/* Mouse */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mouse className="size-3.5 text-secondary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Muis</span>
                </div>
                <div className="space-y-0.5">
                  {[
                    { label: 'Scrollwiel', desc: 'In-/uitzoomen op afbeelding' },
                    { label: 'Slepen', desc: 'Pannen wanneer ingezoomd' },
                    { label: 'Klik op achtergrond', desc: 'Detailweergave sluiten' },
                    { label: 'Klik op zoom-indicator', desc: 'Zoom resetten' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-input-background transition-colors">
                      <span className="text-[10px] text-muted-foreground shrink-0 w-24">{item.label}</span>
                      <span className="text-xs text-gray-2">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
