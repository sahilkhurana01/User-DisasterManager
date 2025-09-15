// API Configuration
export const API_KEYS = {
  GOOGLE_GEMINI: 'AIzaSyB3tlrjdb_PoWreZUNQ9dPAsgqOzo_gDzU',
  MAPTILER: 'xanBpghmk4MnYRATZ0Jd',
} as const;

// MapTiler Configuration
export const MAPTILER_CONFIG = {
  STYLE_URL: `https://api.maptiler.com/maps/satellite/style.json?key=${API_KEYS.MAPTILER}`,
  HYBRID_TILES: `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${API_KEYS.MAPTILER}`,
  SATELLITE_TILES: `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${API_KEYS.MAPTILER}`,
} as const;

// Gemini AI Configuration
export const GEMINI_CONFIG = {
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  API_KEY: API_KEYS.GOOGLE_GEMINI,
} as const;