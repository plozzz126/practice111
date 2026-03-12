export function fireConfetti() {
  if (typeof window === 'undefined') return;
  
  import('canvas-confetti').then(({ default: confetti }) => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'] });
    fire(0.2, { spread: 60, colors: ['#c77dff', '#ff9a3c', '#00d4ff'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  });
}

export function fireSmallConfetti() {
  import('canvas-confetti').then(({ default: confetti }) => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6bcb77', '#ffd93d', '#4d96ff'],
    });
  });
}
