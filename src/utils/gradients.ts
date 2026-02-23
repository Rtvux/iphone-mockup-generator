export interface GradientPreset {
  id: string;
  name: string;
  topColor: string;
  bottomColor: string;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  { id: 'sakura', name: 'Sakura', topColor: '#F9C5D1', bottomColor: '#FFFFFF' },
  { id: 'aizome', name: 'Aizome', topColor: '#1B1464', bottomColor: '#0D47A1' },
  { id: 'matcha', name: 'Matcha', topColor: '#8DB48E', bottomColor: '#F5F0E1' },
  { id: 'yuuhi', name: 'Yuuhi', topColor: '#FF6B35', bottomColor: '#F7C948' },
  { id: 'fuji', name: 'Fuji', topColor: '#7B6BA8', bottomColor: '#E8DFF5' },
  { id: 'sumi', name: 'Sumi', topColor: '#2C2C2C', bottomColor: '#5A5A5A' },
  { id: 'umi', name: 'Umi', topColor: '#0077B6', bottomColor: '#CAF0F8' },
  { id: 'momiji', name: 'Momiji', topColor: '#C0392B', bottomColor: '#F5B041' },
];
