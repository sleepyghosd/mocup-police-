export type VehicleType = 'car' | 'bicycle' | 'motorcycle' | 'truck' | 'van' | 'bus' | 'other';

export type PhotoCategory = 'sky_photo' | 'detail_photo' | 'overview' | 'close_up' | 'side_view' | 'front_view';

export type EvidenceStatus = 'clear' | 'unclear' | 'onbruikbaar';

export interface CaseObject {
  id: string;
  name: string;
  description: string;
  color: string;
  vehicleType: VehicleType;
  kenteken?: string;
}

export interface CaseInfo {
  caseNumber: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface DetectedObject {
  id: string;
  type: VehicleType;
  confidence?: number;
  position?: { x: number; y: number; width: number; height: number };
}

export type VehicleType = 'car' | 'bicycle' | 'motorcycle' | 'truck' | 'van' | 'bus' | 'other';

export type PhotoCategory = 'sky_photo' | 'detail_photo' | 'overview' | 'close_up' | 'side_view' | 'front_view';

export type EvidenceStatus = 'clear' | 'unclear' | 'onbruikbaar';

export interface CaseObject {
  id: string;
  name: string;
  description: string;
  color: string;
  vehicleType: VehicleType;
  kenteken?: string;
}

export interface CaseInfo {
  caseNumber: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface DetectedObject {
  id: string;
  type: VehicleType;
  confidence?: number;
  position?: { x: number; y: number; width: number; height: number };
}

export interface ImageData {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;

  detectedObjects?: DetectedObject[];
  suggestedCategory?: PhotoCategory;
  modelConfidence?: number;

  category?: PhotoCategory;
  linkedObjectIds: string[];
  evidenceStatus: EvidenceStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  isFavorite?: boolean;
}

export type TranscriptionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AudioData {
  id: string;
  url?: string; // Optional for uploaded files
  filename: string;
  uploadedAt: string;
  duration?: number; // in seconds
  transcription?: string;
  transcriptionStatus: TranscriptionStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  file?: File; // For newly uploaded files
}
