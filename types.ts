export enum SongLanguage {
  English = 'English',
  Hindi = 'Hindi',
  Tamil = 'Tamil',
  Sanskrit = 'Sanskrit',
  Maithili = 'Maithili',
  Bengali = 'Bengali'
}

export enum SongMood {
  Happy = 'Happy',
  Sad = 'Sad',
  Romantic = 'Romantic',
  Energetic = 'Energetic',
  Melancholic = 'Melancholic',
  Funny = 'Funny',
  Inspirational = 'Inspirational',
  Angry = 'Angry',
  Relaxed = 'Relaxed',
  Scary = 'Scary'
}

export enum SongOccasion {
  None = 'No Specific Occasion',
  Birthday = 'Birthday',
  Wedding = 'Wedding',
  Anniversary = 'Anniversary',
  Breakup = 'Breakup',
  Graduation = 'Graduation',
  Festival = 'Festival',
  Party = 'Party',
  Travel = 'Travel',
  NewYear = 'New Year',
  Christmas = 'Christmas',
  Valentines = "Valentine's Day",
  Halloween = 'Halloween'
}

export enum SongSpeed {
  VeryFast = 'Very Fast',
  Fast = 'Fast',
  Medium = 'Medium',
  Slow = 'Slow',
  VerySlow = 'Very Slow'
}

export interface SongRequest {
  situation: string;
  mood: SongMood;
  occasion: SongOccasion;
  speed: SongSpeed;
  language: SongLanguage;
}

export interface GeneratedSong {
  title: string;
  styleDescription: string;
  lyrics: string;
}

export interface ApiError {
  message: string;
}