const btn = document.getElementById('colorBtn');

function randomHex() {

  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
}

function setTextContrast(hex) {

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  document.body.style.color = luma < 140 ? '#ffffff' : '#111111';
}

btn.addEventListener('click', () => {
  const color = randomHex();
  document.body.style.background = color;
  setTextContrast(color);
});


const countBtn = document.getElementById('countBtn');
const countDisplay = document.getElementById('countDisplay');
let count = 0;

if (countBtn && countDisplay) {
  countBtn.addEventListener('click', () => {
    count += 1;
    countDisplay.textContent = count;
  });
}



const explodeBtn = document.getElementById('explodeBtn');

function rand(min, max){ return Math.random() * (max - min) + min; }

function createParticle(x, y){
    
  const p = document.createElement('div');
  p.className = 'particle';
    
  const size = Math.floor(rand(6, 14));
    
  p.style.width = size + 'px';
  p.style.height = size + 'px';
  p.style.left = (x - size/2) + 'px';
  p.style.top = (y - size/2) + 'px';
  p.style.background = randomHex();


  p.style.transform = 'translate(0px, 0px) scale(1)';
  p.style.opacity = '1';

  document.body.appendChild(p);


  const angle = rand(0, Math.PI * 2);
  const distance = rand(40, 220);
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;


  requestAnimationFrame(() => {
    p.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
    p.style.opacity = '0';
  });


  setTimeout(() => {
    p.remove();
  }, 800);
}

if (explodeBtn) {
  explodeBtn.addEventListener('click', (e) => {
    
    const rect = explodeBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;


    const particles = 20;
    for (let i = 0; i < particles; i++) {
      createParticle(x, y);
    }
  });
}