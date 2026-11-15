// --- UPGRADED CONFETTI SYSTEM ---
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiRunning = false;

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

const CONFETTI_COLORS = ['#ff6b6b','#feca57','#48dbfb','#1dd1a1','#a55eea','#ff9ff3','#ff4757','#2ed573'];

function createConfettiPiece(x, y, velocityX, velocityY) {
  return {
    x, y,
    w: Math.random() * 10 + 5,
    h: Math.random() * 6 + 4,
    vx: velocityX + (Math.random() - 0.5) * 8,
    vy: velocityY + (Math.random() - 0.5) * 8 - 4,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 15,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
    gravity: 0.15 + Math.random() * 0.1,
    opacity: 1,
    sway: Math.random() * 2
  };
}

function launchConfetti() {
  // Clear any old confetti
  confettiParticles = [];
  
  // 1. Center Burst - big explosion from middle
  for (let i = 0; i < 120; i++) {
    confettiParticles.push(createConfettiPiece(
      window.innerWidth / 2,
      window.innerHeight / 2 - 50,
      (Math.random() - 0.5) * 15,
      -Math.random() * 12 - 2
    ));
  }

  // 2. Left Cannon
  setTimeout(() => {
    for (let i = 0; i < 70; i++) {
      confettiParticles.push(createConfettiPiece(
        0, window.innerHeight * 0.7,
        Math.random() * 10 + 4,
        -Math.random() * 10 - 3
      ));
    }
  }, 200);

  // 3. Right Cannon
  setTimeout(() => {
    for (let i = 0; i < 70; i++) {
      confettiParticles.push(createConfettiPiece(
        window.innerWidth, window.innerHeight * 0.7,
        -Math.random() * 10 - 4,
        -Math.random() * 10 - 3
      ));
    }
  }, 400);

  // 4. Rain from top - delayed sparkle
  setTimeout(() => {
    for (let i = 0; i < 80; i++) {
      confettiParticles.push(createConfettiPiece(
        Math.random() * window.innerWidth,
        -20,
        (Math.random() - 0.5) * 2,
        Math.random() * 3 + 1
      ));
    }
  }, 700);

  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles = confettiParticles.filter(p => p.y < window.innerHeight + 30 && p.opacity > 0);

  confettiParticles.forEach(p => {
    p.vy += p.gravity;
    p.x += p.vx + Math.sin(p.y * 0.02) * p.sway;
    p.y += p.vy;
    p.vx *= 0.99; // air resistance
    p.rotation += p.rotationSpeed;
    p.opacity -= 0.003;

    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.fillStyle = p.color;

    if (p.shape === 'rect') {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}