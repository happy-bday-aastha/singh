let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const maxConfettis = 300;
const particles = [];
let animationFrameId;
let isAnimationRunning = true;
const envelopeWrapper = document.getElementById("envelopeWrapper");
const letter = document.getElementById('letter');
const closeButton = document.getElementById('closeButton');

const possibleColors = [
  "DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue",
  "Gold", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"
];

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
  this.x = Math.random() * W;
  this.y = Math.random() * H - H;
  this.r = randomFromTo(11, 33);
  this.d = Math.random() * maxConfettis + 11;
  this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
  this.tilt = Math.floor(Math.random() * 33) - 11;
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
  this.tiltAngle = 0;

  this.draw = function() {
    context.beginPath();
    context.lineWidth = this.r / 2;
    context.strokeStyle = this.color;
    context.moveTo(this.x + this.tilt + this.r / 3, this.y);
    context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
    return context.stroke();
  };
}

function Draw() {
  context.clearRect(0, 0, W, H);

  let remainingParticles = 0;

  for (let particle of particles) {
    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
    particle.tilt = Math.sin(particle.tiltAngle - particles.indexOf(particle) / 3) * 15;

    if (particle.y <= H) {
      remainingParticles++;
    }

    if (particle.y > H || particle.x > W + 30 || particle.x < -30) {
      if (isAnimationRunning) {
        particle.x = Math.random() * W;
        particle.y = -30;
        particle.tilt = Math.floor(Math.random() * 10) - 20;
      }
    }

    particle.draw();
  }

  if (remainingParticles > 0 || isAnimationRunning) {
    animationFrameId = requestAnimationFrame(Draw);
  }
}

// Update canvas size on window resize
function resizeCanvas() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
}
window.addEventListener('resize', resizeCanvas);

// Envelope click to pop up the letter
// Envelope click to pop up the letter
envelopeWrapper.addEventListener('click', function() {
    letter.style.transform = 'translateY(-50px) scale(1.2)'; // Adjust scale for responsiveness
    letter.style.zIndex = '4';
    letter.style.height = 'auto'; // Set height to auto to adapt to content
  });

// Close button to reset the letter
closeButton.addEventListener('click', function(event) {
  event.stopPropagation();
  letter.style.transform = 'translateY(0) scale(1)';
  letter.style.zIndex = '2';
  letter.style.height = '200px';
  letter.style.overflow = 'hidden';

  const paragraph = letter.querySelector('p');
  paragraph.style.fontSize = '20px';
});

// Create confetti particles
for (let i = 0; i < maxConfettis; i++) {
  particles.push(new confettiParticle());
}

// Initialize canvas size and start animation
resizeCanvas(); // Set initial canvas size
Draw();

// Stop creating new confetti after 10 seconds, but allow existing ones to fall
setTimeout(function() {
  isAnimationRunning = false;

  setTimeout(function() {
    envelopeWrapper.style.opacity = '1';
  }, 20);

}, 2000);
