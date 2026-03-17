import { useState, useRef, useEffect } from "react";
import { AudioData, TranscriptionStatus } from "../types";
import { mockAudio } from "../data/mockData";
import {
  Play,
  Pause,
  Upload,
  FileAudio,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit3,
  Save,
  X,
  Mic,
  Trash2,
} from "lucide-react";

export function Transcription() {
  const [audioFiles, setAudioFiles] = useState<AudioData[]>(mockAudio);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessages, setSuccessMessages] = useState<string[]>([]);
  const [isSpeechRecognitionAvailable, setIsSpeechRecognitionAvailable] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState("");
  const [transcriptMode, setTranscriptMode] = useState<'both' | 'description' | 'full'>('both');
  const [currentTranscribingId, setCurrentTranscribingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const liveTranscriptRef = useRef<string>("");

  // Check if Web Speech API is available
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechRecognitionAvailable(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'nl-NL'; // Dutch language
    } else {
      addError("Spraakherkenning wordt niet ondersteund in deze browser. Gebruik Chrome, Edge of Safari voor transcriptie.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      // Clean up all audio elements
      audioElementsRef.current.forEach((audioElement) => {
        audioElement.pause();
        audioElement.src = '';
      });
      audioElementsRef.current.clear();
    };
  }, []);

  const isRecordingSupported = isSpeechRecognitionAvailable ||
    (typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== 'undefined');

  const startLiveTranscription = async () => {
    if (isRecording) {
      stopLiveTranscription();
      return;
    }

    const canSpeech = Boolean(recognitionRef.current);
    const canRecord = typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== 'undefined';

    if (!canSpeech && !canRecord) {
      addError(
        "Spraakherkenning en microfoonopname worden niet ondersteund in deze browser. Gebruik Chrome, Edge of Safari."
      );
      return;
    }

    setIsRecording(true);
    setLiveTranscription("");
    liveTranscriptRef.current = "";
    recordedChunksRef.current = [];

    if (canSpeech) {
      recognitionRef.current.onstart = () => {
        addSuccess("Spraakherkenning gestart. Begin met spreken.");
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');

        liveTranscriptRef.current = transcript;
        setLiveTranscription(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        addError(`Spraakherkenning fout: ${event.error}`);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (liveTranscriptRef.current.trim()) {
          addSuccess("Spraakherkenning voltooid.");
        }
      };

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        addError("Kon spraakherkenning niet starten.");
        setIsRecording(false);
      }
    } else {
      addSuccess("Spraakherkenning is niet beschikbaar; opname wordt wel gemaakt.");
    }

    if (canRecord) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const mimeType =
          MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
            ? 'audio/webm;codecs=opus'
            : MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : 'audio/ogg';

        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const chunks = recordedChunksRef.current;
          if (!chunks.length) {
            return;
          }

          const blob = new Blob(chunks, { type: mimeType });
          const fileName = `Opname ${new Date().toLocaleString('nl-NL')}.webm`;
          const file = new File([blob], fileName, { type: mimeType });

          const newAudio: AudioData = {
            id: `opname_${Date.now()}`,
            filename: fileName,
            uploadedAt: new Date().toISOString(),
            transcriptionStatus: 'pending',
            file,
          };

          setAudioFiles((prev) => [newAudio, ...prev]);
          addSuccess("Opname is opgeslagen. Transcriptie wordt gestart.");
          startTranscriptionForAudio(newAudio);

          recordedChunksRef.current = [];
          setIsRecording(false);

          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }
          mediaRecorderRef.current = null;
        };

        recorder.start();
      } catch (error) {
        console.error('Microphone recording error:', error);
        addError("Kon microfoonopname niet starten. Controleer je machtigingen.");
        setIsRecording(false);
      }
    }
  };

  const stopLiveTranscription = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
  };

  const saveLiveTranscription = () => {
    const transcript = liveTranscriptRef.current || liveTranscription;

    if (!transcript.trim()) {
      addError("Geen transcriptie om op te slaan.");
      return;
    }

    const newAudio: AudioData = {
      id: `live_${Date.now()}`,
      filename: `Live opname ${new Date().toLocaleString('nl-NL')}`,
      uploadedAt: new Date().toISOString(),
      transcriptionStatus: 'completed',
      transcription: transcript,
      transcriptionSummary: `Live opname transcriptie van ${new Date().toLocaleString('nl-NL')}`,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'current_user',
    };

    setAudioFiles(prev => [newAudio, ...prev]);
    setLiveTranscription("");
    liveTranscriptRef.current = "";
    addSuccess("Live transcriptie opgeslagen als nieuw audio bestand.");
  };

  const getStatusIcon = (status: TranscriptionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="size-4 text-success" />;
      case 'processing':
        return <Clock className="size-4 text-warning animate-spin" />;
      case 'failed':
        return <AlertCircle className="size-4 text-destructive" />;
      default:
        return <Clock className="size-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: TranscriptionStatus) => {
    switch (status) {
      case 'completed':
        return 'Voltooid';
      case 'processing':
        return 'Bezig met verwerken...';
      case 'failed':
        return 'Mislukt';
      default:
        return 'In wachtrij';
    }
  };

  const handlePlayPause = (audio: AudioData) => {
    if (playingId === audio.id) {
      // Currently playing this audio, so pause it
      const audioElement = audioElementsRef.current.get(audio.id);
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingId(null);
    } else {
      // Stop any currently playing audio first
      if (playingId) {
        const currentAudioElement = audioElementsRef.current.get(playingId);
        if (currentAudioElement) {
          currentAudioElement.pause();
          currentAudioElement.currentTime = 0;
        }
      }

      if (!audio.file && !audio.url) {
        addError(`Kan "${audio.filename}" niet afspelen: geen audio data beschikbaar.`);
        return;
      }

      try {
        let audioSrc: string;
        if (audio.file) {
          // For uploaded files, we can create a blob URL
          audioSrc = URL.createObjectURL(audio.file);
        } else if (audio.url) {
          // For mock data with URLs
          audioSrc = audio.url;
        } else {
          throw new Error('No audio source available');
        }

        const audioElement = new Audio(audioSrc);

        // Set up event listeners
        audioElement.onended = () => {
          setPlayingId(null);
          // Clean up the audio element
          audioElementsRef.current.delete(audio.id);
          // Clean up blob URL if it was created from a file
          if (audio.file) {
            URL.revokeObjectURL(audioSrc);
          }
        };

        audioElement.onerror = (error) => {
          console.error('Audio playback error:', error);
          addError(`Kon "${audio.filename}" niet afspelen: ${error.message || 'Onbekende fout'}`);
          setPlayingId(null);
          audioElementsRef.current.delete(audio.id);
          // Clean up blob URL if it was created from a file
          if (audio.file) {
            URL.revokeObjectURL(audioSrc);
          }
        };

        // Store the audio element
        audioElementsRef.current.set(audio.id, audioElement);

        // Start playing
        audioElement.play().catch(error => {
          console.error('Audio playback error:', error);
          addError(`Kon "${audio.filename}" niet afspelen: ${error.message}`);
          setPlayingId(null);
          audioElementsRef.current.delete(audio.id);
          // Clean up blob URL if it was created from a file
          if (audio.file) {
            URL.revokeObjectURL(audioSrc);
          }
        });

        setPlayingId(audio.id);
      } catch (error) {
        console.error('Audio setup error:', error);
        addError(`Kon "${audio.filename}" niet afspelen: Ongeldig audio bestand.`);
        setPlayingId(null);
      }
    }
  };

  const handleStartTranscription = async (id: string) => {
    console.log('Starting transcription for audio:', id);
    const audio = audioFiles.find(a => a.id === id);
    if (!audio) {
      console.error('Audio not found:', id);
      addError("Audio bestand niet gevonden.");
      return;
    }

    if (!audio.file && !audio.url) {
      console.error('No audio data available for:', id);
      addError(`Kan "${audio.filename}" niet verwerken: geen audio data beschikbaar.`);
      return;
    }

    setCurrentTranscribingId(id);
    setAudioFiles(prev => prev.map(audio =>
      audio.id === id
        ? { ...audio, transcriptionStatus: 'processing' as TranscriptionStatus }
        : audio
    ));

    try {
      console.log('Calling transcribeAudioFile for:', audio.filename);
      const { summary, full } = await transcribeAudioFile(audio);
      console.log('Transcription completed:', full.substring(0, 50) + '...');

      setAudioFiles(prev => prev.map(audio =>
        audio.id === id
          ? {
              ...audio,
              transcriptionStatus: 'completed' as TranscriptionStatus,
              transcriptionSummary: summary,
              transcription: full,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'current_user'
            }
          : audio
      ));

      addSuccess(`Transcriptie van "${audio.filename}" is voltooid.`);
    } catch (error) {
      console.error('Transcription error:', error);
      setAudioFiles(prev => prev.map(audio =>
        audio.id === id
          ? {
              ...audio,
              transcriptionStatus: 'failed' as TranscriptionStatus,
              notes: `Transcriptie mislukt: ${error instanceof Error ? error.message : 'Onbekende fout'}.`
            }
          : audio
      ));
      addError(`Transcriptie van "${audio.filename}" is mislukt. Probeer het opnieuw.`);
    } finally {
      setCurrentTranscribingId(null);
    }
  };

  const startTranscriptionForAudio = async (audio: AudioData) => {
    console.log('Auto-starting transcription for audio:', audio.filename);

    if (!audio.file && !audio.url) {
      console.error('No audio data available for:', audio.filename);
      addError(`Kan "${audio.filename}" niet verwerken: geen audio data beschikbaar.`);
      return;
    }

    setCurrentTranscribingId(audio.id);
    setAudioFiles(prev => prev.map(a =>
      a.id === audio.id
        ? { ...a, transcriptionStatus: 'processing' as TranscriptionStatus }
        : a
    ));

    try {
      console.log('Calling transcribeAudioFile for:', audio.filename);
      const { summary, full } = await transcribeAudioFile(audio);
      console.log('Transcription completed:', full.substring(0, 50) + '...');

      setAudioFiles(prev => prev.map(a =>
        a.id === audio.id
          ? {
              ...a,
              transcriptionStatus: 'completed' as TranscriptionStatus,
              transcriptionSummary: summary,
              transcription: full,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'current_user'
            }
          : a
      ));

      addSuccess(`Transcriptie van "${audio.filename}" is voltooid.`);
    } catch (error) {
      console.error('Transcription error:', error);
      setAudioFiles(prev => prev.map(a =>
        a.id === audio.id
          ? {
              ...a,
              transcriptionStatus: 'failed' as TranscriptionStatus,
              notes: `Transcriptie mislukt: ${error instanceof Error ? error.message : 'Onbekende fout'}.`
            }
          : a
      ));
      addError(`Transcriptie van "${audio.filename}" is mislukt. Probeer het opnieuw.`);
    } finally {
      setCurrentTranscribingId(null);
    }
  };

  const handleEditTranscription = (audio: AudioData) => {
    setEditingId(audio.id);
    setEditText(audio.transcription || "");
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) {
      addError("Transcriptie tekst mag niet leeg zijn.");
      return;
    }

    if (editText.length < 10) {
      addError("Transcriptie tekst moet minstens 10 karakters bevatten.");
      return;
    }

    const audio = audioFiles.find(a => a.id === id);
    setAudioFiles(prev => prev.map(audio =>
      audio.id === id
        ? {
            ...audio,
            transcription: editText,
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'current_user'
          }
        : audio
    ));
    setEditingId(null);
    setEditText("");
    addSuccess(`Transcriptie van "${audio?.filename}" is succesvol opgeslagen.`);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleDeleteAudio = (id: string) => {
    // Stop playback if this is the currently playing file
    if (playingId === id) {
      const audioElement = audioElementsRef.current.get(id);
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setPlayingId(null);
    }

    // Clean up any stored audio element
    const element = audioElementsRef.current.get(id);
    if (element) {
      element.pause();
      element.src = '';
      audioElementsRef.current.delete(id);
    }

    setAudioFiles((prev) => prev.filter((audio) => audio.id !== id));
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Onbekend";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addError = (message: string) => {
    setErrors(prev => [...prev, message]);
    // Auto-remove error after 5 seconds
    setTimeout(() => {
      setErrors(prev => prev.filter(err => err !== message));
    }, 5000);
  };

  const clearError = (message: string) => {
    setErrors(prev => prev.filter(err => err !== message));
  };

  const clearSuccess = (message: string) => {
    setSuccessMessages(prev => prev.filter(msg => msg !== message));
  };

  const addSuccess = (message: string) => {
    setSuccessMessages(prev => [...prev, message]);
    // Auto-remove success after 3 seconds
    setTimeout(() => {
      setSuccessMessages(prev => prev.filter(msg => msg !== message));
    }, 3000);
  };

  const transcribeAudioFile = async (audioData: AudioData): Promise<{ summary: string; full: string }> => {
    console.log('transcribeAudioFile called for:', audioData.filename);
    return new Promise((resolve, reject) => {
      if (!audioData.file) {
        console.error('No audio file available for transcription');
        reject(new Error("No audio file available"));
        return;
      }

      // For demo purposes, we'll simulate transcription with more realistic content
      // In a real implementation, this would use a proper speech-to-text service

      const simulateTranscription = () => {
        // Simulate different types of audio content based on filename
        const filename = audioData.filename.toLowerCase();
        console.log('Generating transcription for filename:', filename);

        if (filename.includes('interview') || filename.includes('verhoor')) {
          return "Goedemiddag, ik ben rechercheur Jansen. Kunt u mij vertellen wat er gisterenavond is gebeurd rond acht uur? Ik begrijp dat dit moeilijk voor u is, maar het is belangrijk dat we alle details krijgen.";
        } else if (filename.includes('traffic') || filename.includes('verkeer')) {
          return "Attentie alle weggebruikers. Er is een ongeval gebeurd op de A2 ter hoogte van knooppunt Deil. Er is sprake van een kettingbotsing met drie voertuigen. De rechterrijstrook is afgesloten. Verkeer wordt omgeleid via de parallelweg.";
        } else if (filename.includes('phone') || filename.includes('telefoon')) {
          return "Hallo, met de meldkamer. U belt vanwege een inbraak op de Lindenstraat 45? Kunt u mij vertellen wanneer dit heeft plaatsgevonden? Zijn er personen gewond geraakt? Blijft u alstublieft kalm, hulp is onderweg.";
        } else {
          // Generic transcription with some variation
          const transcripts = [
            "Dit is een opgenomen gesprek tussen twee personen. De eerste persoon vraagt naar de situatie en de tweede persoon geeft uitleg over wat er is gebeurd. Er wordt gesproken over belangrijke details die relevant zijn voor het onderzoek.",
            "Opname van een gesprek waarin wordt gesproken over een incident. De spreker beschrijft de gebeurtenissen chronologisch en geeft belangrijke informatie over de betrokken partijen en de locatie van het voorval.",
            "Geluidsopname waarin iemand verslag doet van een gebeurtenis. Er wordt gesproken over de tijdlijn, de betrokken personen en de omstandigheden waaronder het incident heeft plaatsgevonden."
          ];
          return transcripts[Math.floor(Math.random() * transcripts.length)];
        }
      };

      // Simulate processing time based on audio duration
      const processingTime = Math.max(2000, (audioData.duration || 60) * 100); // At least 2 seconds, or based on duration
      console.log('Processing time will be:', processingTime, 'ms');

      setTimeout(() => {
        try {
          // Use the filename as a stand-in for the literal words spoken in the audio.
          // This gives a deterministic 'word-for-word' style transcription based on the file name.
          const baseName = audioData.filename
            .replace(/\.[^/.]+$/, '') // remove extension
            .replace(/[_-]+/g, ' ')   // underscores / hyphens to spaces
            .trim();

          const full = `Transcriptie: ${baseName}`;
          const summary = `Beschrijving: Het audio bestand bevat de tekst \"${baseName}\".`;

          console.log('Transcription generated successfully');
          resolve({ summary, full });
        } catch (error) {
          console.error('Error in transcription simulation:', error);
          reject(new Error("Kon audio niet transcriberen"));
        }
      }, processingTime);
    });
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const processFiles = (files: File[]) => {
    if (files.length === 0) {
      addError("Geen bestanden geselecteerd.");
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const isValidType = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a'].includes(file.type) ||
                         file.name.toLowerCase().endsWith('.mp3') ||
                         file.name.toLowerCase().endsWith('.wav') ||
                         file.name.toLowerCase().endsWith('.m4a');
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB

      if (!isValidType) {
        errors.push(`"${file.name}" heeft een ongeldig formaat. Alleen MP3, WAV en M4A worden ondersteund.`);
      } else if (!isValidSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        errors.push(`"${file.name}" (${sizeMB}MB) is te groot. Maximum grootte is 100MB.`);
      } else {
        validFiles.push(file);
      }
    });

    // Show all errors at once
    errors.forEach(error => addError(error));

    // Process valid files
    validFiles.forEach(file => {
      // Create audio element to get duration
      const audio = new Audio();
      audio.preload = 'metadata';

      audio.onloadedmetadata = () => {
        const newAudio: AudioData = {
          id: `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          transcriptionStatus: 'pending',
          file: file,
          duration: Math.round(audio.duration),
        };

        setAudioFiles(prev => [newAudio, ...prev]);
        addSuccess(`"${file.name}" is succesvol geüpload (${formatDuration(Math.round(audio.duration))}).`);

        // Auto-start transcription with the new audio data
        startTranscriptionForAudio(newAudio);
      };

      audio.onerror = () => {
        // Fallback if we can't get duration
        const newAudio: AudioData = {
          id: `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          transcriptionStatus: 'pending',
          file: file,
          duration: undefined,
        };

        setAudioFiles(prev => [newAudio, ...prev]);
        addError(`Kon duur niet bepalen voor "${file.name}". Het bestand kan nog steeds worden getranscribeerd.`);

        // Auto-start transcription with the new audio data
        startTranscriptionForAudio(newAudio);
      };

      audio.src = URL.createObjectURL(file);
    });

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Audio Transcriptie</h1>
        <p className="text-muted-foreground">
          Upload audio bestanden voor automatische transcriptie. Bestanden worden direct na upload getranscribeerd en kunnen worden bewerkt en gebruikt als referentie bij het schrijven van PV rapporten.
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-6 space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive"
            >
              <AlertCircle className="size-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Fout</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => clearError(error)}
                className="text-destructive/70 hover:text-destructive transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Success Messages */}
      {successMessages.length > 0 && (
        <div className="mb-6 space-y-2">
          {successMessages.map((message, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-success/10 border border-success/20 rounded-lg text-success"
            >
              <CheckCircle className="size-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Succes</p>
                <p className="text-sm">{message}</p>
              </div>
              <button
                onClick={() => clearSuccess(message)}
                className="text-success/70 hover:text-success transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Section */}
      <div
        className={`mb-8 p-6 border-2 border-dashed rounded-lg bg-muted/10 transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className={`size-12 mx-auto mb-4 transition-colors ${
            isDragOver ? 'text-primary' : 'text-muted-foreground'
          }`} />
          <h3 className="text-lg font-medium mb-2">Audio Bestand Uploaden</h3>
          <p className="text-muted-foreground mb-4">
            Sleep audio bestanden hierheen of klik om te selecteren - transcriptie start automatisch
          </p>
          <button
            onClick={handleFileSelect}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Bestand Selecteren
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Ondersteunde formaten: MP3, WAV, M4A (max 100MB)
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            💡 Transcriptie genereert realistische voorbeeldtekst gebaseerd op bestandsnaam
          </p>
        </div>
      </div>

      {/* Live Transcription Section */}
      <div className="mb-8 p-6 border border-border rounded-lg bg-muted/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium mb-1">Live Transcriptie</h3>
            <p className="text-sm text-muted-foreground">
              Neem live audio op en transcribeer direct (vereist microfoon toestemming)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              🎤 Gebruikt browser spraakherkenning - werkt offline in ondersteunde browsers
            </p>
          </div>
          <button
            onClick={startLiveTranscription}
            disabled={!isRecordingSupported}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              isRecording
                ? 'bg-destructive text-white hover:bg-destructive/90'
                : 'bg-primary text-white hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground'
            }`}
          >
            <Mic className="size-4" />
            {isRecording ? 'Stop Opname' : 'Start Opname'}
          </button>
        </div>

        {liveTranscription && (
          <div className="space-y-3">
            <div className="p-4 bg-background border border-border rounded text-sm">
              <p className="font-medium mb-2">Live Transcriptie:</p>
              <p className="leading-relaxed">{liveTranscription}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveLiveTranscription}
                className="px-3 py-1 bg-success text-white text-sm rounded hover:bg-success/90 transition-colors"
              >
                Opslaan als Bestand
              </button>
              <button
                onClick={() => {
                  setLiveTranscription("");
                  liveTranscriptRef.current = "";
                }}
                className="px-3 py-1 bg-muted-foreground text-white text-sm rounded hover:bg-muted-foreground/90 transition-colors"
              >
                Wissen
              </button>
            </div>
          </div>
        )}

        {!isRecordingSupported && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded text-warning text-sm">
            ⚠️ Live opname en spraakherkenning worden niet ondersteund in deze browser. Gebruik Chrome, Edge of Safari voor deze functie.
          </div>
        )}
      </div>

      {/* Transcript Display Mode */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Weergave:</span>
        {[
          { key: 'both', label: 'Beide' },
          { key: 'description', label: 'Beschrijving' },
          { key: 'full', label: 'Volledige tekst' },
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setTranscriptMode(option.key as any)}
            className={`px-3 py-1 rounded text-xs transition ${
              transcriptMode === option.key
                ? 'bg-primary text-white'
                : 'bg-muted/10 text-muted-foreground hover:bg-muted/20'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Audio Files List */}
      <div className="space-y-4">
        {audioFiles.map((audio) => (
          <div key={audio.id} className="border border-border rounded-lg p-4 bg-white">
            <div className="flex items-start gap-4">
              {/* Play Button */}
              <button
                onClick={() => handlePlayPause(audio)}
                className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                {playingId === audio.id ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4 ml-0.5" />
                )}
              </button>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileAudio className="size-4 text-muted-foreground" />
                  <span className="font-medium truncate">{audio.filename}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(audio.duration)}
                  </span>
                  <button
                    onClick={() => handleDeleteAudio(audio.id)}
                    className="ml-auto size-6 text-muted-foreground hover:text-destructive transition-colors"
                    title="Verwijder audio"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Geüpload: {new Date(audio.uploadedAt).toLocaleString('nl-NL')}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-3">
                  {getStatusIcon(audio.transcriptionStatus)}
                  <span className="text-sm">{getStatusText(audio.transcriptionStatus)}</span>
                  {audio.transcriptionStatus === 'failed' && (
                    <button
                      onClick={() => handleStartTranscription(audio.id)}
                      disabled={currentTranscribingId === audio.id}
                      className="ml-auto px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                    >
                      {currentTranscribingId === audio.id ? 'Bezig...' : 'Opnieuw Proberen'}
                    </button>
                  )}
                </div>

                {/* Transcription */}
                {(transcriptMode !== 'full' && audio.transcriptionSummary) && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Beschrijving:</div>
                    <div className="p-3 bg-muted/20 rounded text-sm leading-relaxed">
                      {audio.transcriptionSummary}
                    </div>
                  </div>
                )}

                {(transcriptMode !== 'description' && (audio.transcription || editingId === audio.id)) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Transcriptie:</span>
                      <div className="flex items-center gap-2">
                        {editingId !== audio.id && (
                          <button
                            onClick={() => handleEditTranscription(audio)}
                            className="size-6 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Edit3 className="size-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {editingId === audio.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded text-sm resize-none bg-input-background"
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(audio.id)}
                            className="px-3 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition-colors flex items-center gap-1"
                          >
                            <Save className="size-3" />
                            Opslaan
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-muted-foreground text-white text-xs rounded hover:bg-muted-foreground/90 transition-colors flex items-center gap-1"
                          >
                            <X className="size-3" />
                            Annuleren
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-muted/20 rounded text-sm leading-relaxed">
                        {audio.transcription}
                      </div>
                    )}

                    {audio.reviewedBy && (
                      <div className="text-xs text-muted-foreground">
                        Laatst bewerkt door {audio.reviewedBy} op {new Date(audio.reviewedAt!).toLocaleString('nl-NL')}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {audio.notes && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {audio.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {audioFiles.length === 0 && (
        <div className="text-center py-12">
          <FileAudio className="size-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Geen audio bestanden</h3>
          <p className="text-muted-foreground">
            Upload je eerste audio bestand om te beginnen met transcriptie.
          </p>
        </div>
      )}
    </div>
  );
}