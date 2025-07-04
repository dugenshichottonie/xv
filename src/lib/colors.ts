export interface Color {
  value: string;
  label: string;
  personalColor: 'blue' | 'yellow' | 'neutral';
}

export const colors: Color[] = [
  { value: 'red', label: 'Red', personalColor: 'yellow' },
  { value: 'pink', label: 'Pink', personalColor: 'blue' },
  { value: 'coral-pink', label: 'Coral Pink', personalColor: 'yellow' },
  { value: 'orange', label: 'Orange', personalColor: 'yellow' },
  { value: 'yellow', label: 'Yellow', personalColor: 'yellow' },
  { value: 'beige', label: 'Beige', personalColor: 'yellow' },
  { value: 'brown', label: 'Brown', personalColor: 'yellow' },
  { value: 'khaki', label: 'Khaki', personalColor: 'yellow' },
  { value: 'green', label: 'Green', personalColor: 'yellow' },
  { value: 'blue', label: 'Blue', personalColor: 'blue' },
  { value: 'navy', label: 'Navy', personalColor: 'blue' },
  { value: 'purple', label: 'Purple', personalColor: 'blue' },
  { value: 'lavender', label: 'Lavender', personalColor: 'blue' },
  { value: 'bordeaux', label: 'Bordeaux', personalColor: 'blue' },
  { value: 'gray', label: 'Gray', personalColor: 'blue' },
  { value: 'silver', label: 'Silver', personalColor: 'blue' },
  { value: 'gold', label: 'Gold', personalColor: 'yellow' },
  { value: 'white', label: 'White', personalColor: 'neutral' },
  { value: 'black', label: 'Black', personalColor: 'neutral' },
];
