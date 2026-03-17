import { ImageData, VehicleType, PhotoCategory, EvidenceStatus, CaseObject, CaseInfo, AudioData, TranscriptionStatus } from '../types';

export const caseInfo: CaseInfo = {
  caseNumber: 'FTR-2026-00482',
  title: 'Meervoudig voertuigongeval – Snelweg A12 afrit',
  date: '2026-02-14',
  location: 'Snelweg A12, km 34.2, Afrit Zuid',
  description: 'Meervoudig voertuigongeval met 4 geïdentificeerde objecten. Scènedocumentatie omvat luchtfoto\'s, detailfoto\'s en overzichtsfoto\'s voor reconstructieanalyse.',
};

export const caseObjects: CaseObject[] = [
  {
    id: 'obj-car-1',
    name: 'Auto 1',
    description: 'Gele sedan, schade voorzijde, bestuurderskant impact',
    color: '#EAB308',
    vehicleType: 'car',
    kenteken: 'NL-RB-482',
  },
  {
    id: 'obj-car-2',
    name: 'Auto 2',
    description: 'Bruine SUV, schade achterzijde, schuurschade passagierskant',
    color: '#92400E',
    vehicleType: 'car',
    kenteken: 'H-317-KP',
  },
  {
    id: 'obj-bike-1',
    name: 'Motor 1',
    description: 'Zwarte motorfiets, frame gebogen, 12m van impactpunt gevonden',
    color: '#1F2937',
    vehicleType: 'motorcycle',
    kenteken: 'MF-92-BD',
  },
  {
    id: 'obj-bicycle-1',
    name: 'Fiets 1',
    description: 'Rode racefiets, wiel losgeraakt, gevonden op vluchtstrook',
    color: '#DC2626',
    vehicleType: 'bicycle',
  },
];

const urls = [
  // Accident/damage closeups
  'https://images.unsplash.com/photo-1586272382443-9062d5aeadf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBhY2NpZGVudCUyMGRhbWFnZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcyNTcwMjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Skid marks
  'https://images.unsplash.com/photo-1613887785181-12019614c654?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwc2tpZCUyMG1hcmtzJTIwYXNwaGFsdHxlbnwxfHx8fDE3NzI1NzAyOTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  // Traffic cone
  'https://images.unsplash.com/photo-1764823622846-9aafc16a3f66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFmZmljJTIwY29uZSUyMHJvYWQlMjBiYXJyaWVyfGVufDF8fHx8MTc3MjU3MDI5OHww&ixlib=rb-4.1.0&q=80&w=1080',
  // Headlight
  'https://images.unsplash.com/photo-1563738709982-c0fb4c23466a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBoZWFkbGlnaHQlMjBicm9rZW58ZW58MXx8fHwxNzcyNTcwMjk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Guardrail
  'https://images.unsplash.com/photo-1768459226204-809c7d19dd34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdod2F5JTIwZ3VhcmRyYWlsJTIwZGFtYWdlfGVufDF8fHx8MTc3MjU3MDI5OXww&ixlib=rb-4.1.0&q=80&w=1080',
  // Tire marks
  'https://images.unsplash.com/photo-1767119454121-d57a4b61311e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJlJTIwbWFya3MlMjByb2FkJTIwc3VyZmFjZXxlbnwxfHx8fDE3NzI1NzAzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  // Road debris
  'https://images.unsplash.com/photo-1603999703976-8439bd798042?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwZGVicmlzJTIwYWNjaWRlbnQlMjBzY2VuZXxlbnwxfHx8fDE3NzI1NzAzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  // Yellow sedan
  'https://images.unsplash.com/photo-1715597963926-95346547a4ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBzZWRhbiUyMGNhciUyMHNpZGV8ZW58MXx8fHwxNzcyNTcwMzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Brown SUV
  'https://images.unsplash.com/photo-1690433907269-c16c528913f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMFNVViUyMHZlaGljbGV8ZW58MXx8fHwxNzcyNTcwMzAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Black motorcycle
  'https://images.unsplash.com/photo-1770130636832-bff00259121c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG1vdG9yY3ljbGUlMjBwYXJrZWR8ZW58MXx8fHwxNzcyNTcwMzAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Red bicycle
  'https://images.unsplash.com/photo-1763783337455-ad63a238b400?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBiaWN5Y2xlJTIwcm9hZHxlbnwxfHx8fDE3NzI1NzAzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  // Highway exit aerial
  'https://images.unsplash.com/photo-1630947084429-1e50a42840ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdod2F5JTIwZXhpdCUyMHJhbXAlMjBhZXJpYWx8ZW58MXx8fHwxNzcyNTcwMzAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Windshield crack
  'https://images.unsplash.com/photo-1756363938027-29f1dbe99e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aW5kc2hpZWxkJTIwY3JhY2slMjBkYW1hZ2V8ZW58MXx8fHwxNzcyNTcwMzAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Road markings
  'https://images.unsplash.com/photo-1766199203739-92aa845d04ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwbWFya2luZyUyMHBhaW50JTIwbGluZXN8ZW58MXx8fHwxNzcyNTcwMzAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Rear bumper
  'https://images.unsplash.com/photo-1765903916132-7d2fa8ad4c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwcmVhciUyMGJ1bXBlcnxlbnwxfHx8fDE3NzI1NzAzMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  // Car mirror
  'https://images.unsplash.com/photo-1599849151233-e286ed246627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtaXJyb3IlMjBjbG9zZXVwfGVufDF8fHx8MTc3MjU3MDMwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
  // Traffic sign
  'https://images.unsplash.com/photo-1650041467693-6362c5614eac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFmZmljJTIwc2lnbiUyMHdhcm5pbmd8ZW58MXx8fHwxNzcyNTcwMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Car wheel detail
  'https://images.unsplash.com/photo-1767898000286-41f5a92111df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3aGVlbCUyMHRpcmUlMjBkZXRhaWx8ZW58MXx8fHwxNzcyNTUyNzYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Road shoulder
  'https://images.unsplash.com/photo-1767061568330-3d691f753821?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwc2hvdWxkZXIlMjBncmF2ZWx8ZW58MXx8fHwxNzcyNTcwMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Drone intersection
  'https://images.unsplash.com/photo-1653930534246-5156ebfeddc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcnNlY3Rpb24lMjBvdmVyaGVhZCUyMGRyb25lfGVufDF8fHx8MTc3MjU3MDMwNXww&ixlib=rb-4.1.0&q=80&w=1080',
  // Paint scratch
  'https://images.unsplash.com/photo-1762049297259-f9fdd460ec99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYWludCUyMHNjcmF0Y2glMjBkYW1hZ2V8ZW58MXx8fHwxNzcyNTcwMzA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  // License plate
  'https://images.unsplash.com/photo-1762195656048-2d11402064eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWNlbnNlJTIwcGxhdGUlMjBldXJvcGVhbiUyMGNhcnxlbnwxfHx8fDE3NzI1NzAzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  // Road curb
  'https://images.unsplash.com/photo-1604762537333-e60adda0acdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwY3VyYiUyMHBhdmVtZW50fGVufDF8fHx8MTc3MjU3MDMwNnww&ixlib=rb-4.1.0&q=80&w=1080',
  // Broken glass
  'https://images.unsplash.com/photo-1483151307188-42cffaa8b367?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBnbGFzcyUyMGdyb3VuZHxlbnwxfHx8fDE3NzI1NzAzMDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  // Bicycle wheel
  'https://images.unsplash.com/photo-1758452605290-8d47877a1373?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwd2hlZWwlMjBzcG9rZSUyMGRldGFpbHxlbnwxfHx8fDE3NzI1NzAzMDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  // SUV front grill
  'https://images.unsplash.com/photo-1689011266277-f7c82c6f4ce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTVVYlMjBmcm9udCUyMGdyaWxsJTIwYnVtcGVyfGVufDF8fHx8MTc3MjU3MDMwOHww&ixlib=rb-4.1.0&q=80&w=1080',
  // Highway overpass
  'https://images.unsplash.com/photo-1668992434134-a981b43f63a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdod2F5JTIwb3ZlcnBhc3MlMjBicmlkZ2V8ZW58MXx8fHwxNzcyNTcwMzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  // Car door handle
  'https://images.unsplash.com/photo-1749631432618-4eb59fd26407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBkb29yJTIwaGFuZGxlJTIwZGV0YWlsfGVufDF8fHx8MTc3MjU3MDMwOHww&ixlib=rb-4.1.0&q=80&w=1080',
  // Road surface crack
  'https://images.unsplash.com/photo-1741996950842-c3a280a438a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwc3VyZmFjZSUyMGNyYWNrJTIwZGV0YWlsfGVufDF8fHx8MTc3MjU3MDMwOXww&ixlib=rb-4.1.0&q=80&w=1080',
];

const filenames = [
  'schade_closeup', 'remsporen_asfalt', 'afzetting_pylonen', 'koplamp_detail',
  'vangrail_schade', 'bandensporen_weg', 'brokstukken_scene', 'gele_sedan_zij',
  'bruine_suv_voor', 'motor_zwart_zij', 'rode_fiets_weg', 'afrit_luchtfoto',
  'voorruit_barst', 'wegmarkering_lijn', 'achterbumper_det', 'autospiegel_det',
  'verkeersbord_wrn', 'autoband_detail', 'berm_gravel_det', 'kruispunt_drone',
  'lak_kras_schade', 'kenteken_detail', 'stoeprand_detail', 'glas_grond_det',
  'fietswiel_spaak', 'suv_grille_voor', 'viaduct_ovrzcht', 'portier_handvat',
  'wegdek_scheur',
];

const categoryPool: PhotoCategory[] = ['sky_photo', 'detail_photo', 'overview', 'close_up', 'side_view', 'front_view'];
const objectIds = caseObjects.map(o => o.id);

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateMockImages(): ImageData[] {
  const images: ImageData[] = [];

  for (let i = 0; i < 48; i++) {
    const seed = i + 1;
    const r = (offset: number) => seededRandom(seed * 13 + offset);

    const urlIdx = i % urls.length;
    const fnIdx = i % filenames.length;
    const hasML = r(1) > 0.35;
    const sugCat = categoryPool[Math.floor(r(3) * categoryPool.length)];

    // Randomly assign 1-3 linked objects from the case
    const numLinked = Math.floor(r(4) * 3) + 1;
    const shuffled = [...objectIds].sort(() => r(5 + i) - 0.5);
    const linkedObjectIds = shuffled.slice(0, numLinked);

    const isReviewed = r(2) > 0.4;
    const isUnclear = r(6) > 0.85; // ~15% marked unclear
    const isOnbruikbaar = !isUnclear && r(17) > 0.9; // ~10% marked onbruikbaar/wazig
    const day = Math.floor(r(7) * 28) + 1;
    const hour = Math.floor(r(8) * 24);

    const numDetected = Math.floor(r(9) * 4) + 1;
    const detectedObjects = hasML
      ? Array.from({ length: numDetected }, (_, j) => ({
          id: `det-${i}-${j}`,
          type: caseObjects[Math.floor(r(10 + j) * caseObjects.length)].vehicleType,
          confidence: 0.7 + r(15 + j) * 0.29,
        }))
      : undefined;

    images.push({
      id: String(i + 1),
      url: urls[urlIdx],
      filename: `${filenames[fnIdx]}_${String(i + 1).padStart(3, '0')}.jpg`,
      uploadedAt: `2026-02-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(Math.floor(r(11) * 60)).padStart(2, '0')}:00Z`,
      detectedObjects,
      suggestedCategory: hasML ? sugCat : undefined,
      modelConfidence: hasML ? 0.75 + r(12) * 0.24 : undefined,
      category: isReviewed ? sugCat : undefined,
      linkedObjectIds: isReviewed ? linkedObjectIds : [],
      evidenceStatus: isOnbruikbaar ? 'onbruikbaar' : (isUnclear ? 'unclear' : 'clear'),
      reviewedBy: isReviewed ? `onderzoeker_0${Math.floor(r(13) * 3) + 1}` : undefined,
      reviewedAt: isReviewed ? `2026-03-01T${String(hour).padStart(2, '0')}:30:00Z` : undefined,
      notes: isOnbruikbaar ? 'Wazige foto - onbruikbaar als bewijsmateriaal' : (isUnclear ? 'Beeldkwaliteit onvoldoende voor betrouwbare identificatie' : (isReviewed && r(14) > 0.5 ? 'Goede kwaliteit opname' : undefined)),
      isFavorite: r(16) > 0.8,
    });
  }

  return images;
}

export const mockImages: ImageData[] = generateMockImages();

const mockTranscriptions = [
  "Ik reed op de snelweg A12 richting Utrecht toen ik plotseling remlichten zag voor me. Ik remde af maar kon niet meer stoppen. Er was een gele sedan die leek te slingeren. Ik hoorde een harde klap en zag glas en metaal door de lucht vliegen.",
  "Als getuige zag ik een bruine SUV die van achteren op een gele auto reed. De SUV leek te hard te rijden en reageerde te laat op het verkeer voor hem. Na de botsing zag ik een motorfiets omvallen en een fietser die probeerde uit te wijken.",
  "Ik was aan het werk bij de afrit toen ik het ongeluk hoorde gebeuren. Er waren vier voertuigen betrokken: twee auto's, een motor en een fiets. De weg was nat van de regen en dat speelde waarschijnlijk een rol.",
  "Vanuit mijn positie kon ik zien dat de gele sedan probeerde in te halen maar werd afgesneden door de bruine SUV. De motorrijder probeerde uit te wijken maar raakte de vangrail. De fietser was op de vluchtstrook aan het fietsen.",
];

const mockSummaries = [
  "Getuigenverslag van een bestuurder die een kettingbotsing op A12 beschrijft.",
  "Getuige ziet een SUV achteroprijden en voertuigen uitwijken na een botsing.",
  "Medewerker bij afrit beschrijft vier voertuigen betrokken bij een ongeluk op nat wegdek.",
  "Getuige ziet een inhaalmanoeuvre mislukken waarbij een motor en fiets betrokken zijn.",
];

function generateMockAudio(): AudioData[] {
  const audio: AudioData[] = [];

  for (let i = 0; i < 8; i++) {
    const seed = i + 100;
    const r = (offset: number) => seededRandom(seed * 13 + offset);

    const duration = Math.floor(r(1) * 300) + 30; // 30 seconds to 5 minutes
    const isCompleted = r(2) > 0.3;
    const isFailed = !isCompleted && r(3) > 0.8;
    const status: TranscriptionStatus = isFailed ? 'failed' : (isCompleted ? 'completed' : (r(4) > 0.5 ? 'processing' : 'pending'));

    const transcription = isCompleted ? mockTranscriptions[i % mockTranscriptions.length] : undefined;
    const transcriptionSummary = isCompleted ? mockSummaries[i % mockSummaries.length] : undefined;

    audio.push({
      id: `audio-${String(i + 1).padStart(3, '0')}`,
      url: `mock-audio-${i + 1}.mp3`, // Mock URL
      filename: `interview_getuige_${String(i + 1).padStart(3, '0')}.mp3`,
      uploadedAt: `2026-02-${String(Math.floor(r(5) * 28) + 1).padStart(2, '0')}T${String(Math.floor(r(6) * 24)).padStart(2, '0')}:${String(Math.floor(r(7) * 60)).padStart(2, '0')}:00Z`,
      duration,
      transcription,
      transcriptionSummary,
      transcriptionStatus: status,
      reviewedBy: isCompleted ? `onderzoeker_0${Math.floor(r(8) * 3) + 1}` : undefined,
      reviewedAt: isCompleted ? `2026-03-01T${String(Math.floor(r(9) * 24)).padStart(2, '0')}:30:00Z` : undefined,
      notes: status === 'failed' ? 'Audio kwaliteit onvoldoende voor transcriptie' : (isCompleted ? 'Transcriptie succesvol voltooid' : undefined),
    });
  }

  return audio;
}

export const mockAudio: AudioData[] = generateMockAudio();