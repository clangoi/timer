export function vibrate(pattern: number | number[]) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibration not supported:', error);
    }
  }
}

export const vibrationPatterns = {
  work: [200, 100, 200], // Strong pattern for work phase
  rest: [100], // Light vibration for rest
  longRest: [300, 200, 300, 200, 300], // Distinctive pattern for long rest
  start: [50],
  pause: [100],
  completion: [500, 200, 500, 200, 500], // Celebratory pattern
  next: [75, 50, 75]
};
