export const TOTAL_TIME = 90; // 90 seconds per image
export const INITIAL_POINTS = 1000;
export const HINT_COSTS = [30, 50, 80];
export const BLUR_LEVEL = 200; // Initial blur level
export const BLUR_HEIGHT=Math.random() * 40 + 100
export const BLUR_WIDTH=Math.random() * 40 + 100
export const characters = [
  { name: "IronMan", image: "./ironman.jpeg" },
];

export function getRandomCharacters(n: number) {
  const shuffled = [...characters].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export const COLORS = {
  background: 'bg-gray-900',
  text: 'text-gray-100',
  primary: 'bg-purple-600',
  secondary: 'bg-purple-800',
  accent: 'text-purple-400',
};

