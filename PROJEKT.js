(function () {
  function by(id){ return document.getElementById(id); }
  function text(node, v){ node.textContent = String(v); }

  function addNumbers(a, b){
    const na = Number(a), nb = Number(b);
    return Number.isFinite(na) && Number.isFinite(nb) ? na + nb : NaN;
  }
  by('btn-add').addEventListener('click', function(){
    const a = by('add-a').value, b = by('add-b').value;
    const rez = addNumbers(a,b);
    text(by('out-add'), Number.isNaN(rez) ? 'Nevažeći unos' : rez);
  });

  function multiplyList(str){
    if (!str || !str.trim()) return 0;
    const parts = str.split(/[, ]+/).map(s => s.trim()).filter(Boolean);
    const nums = parts.map(p => Number(p)).filter(n => Number.isFinite(n));
    if (nums.length === 0) return 0;
    return nums.reduce((acc, x) => acc * x, 1);
  }
  by('btn-mul').addEventListener('click', function(){
    const out = multiplyList(by('mul-input').value);
    text(by('out-mul'), out);
  });

  function reverseString(s){
    return String(s).split('').reverse().join('');
  }
  by('btn-rev').addEventListener('click', function(){
    text(by('out-rev'), reverseString(by('rev-text').value || ''));
  });

  function passwordStrength(pw){
    pw = String(pw || '');
    let score = 0;
    if (pw.length >= 8) score += 2;
    if (pw.length >= 12) score += 1;
    if (/[a-z]/.test(pw)) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    if (pw.length === 0) score = 0;
    return Math.max(0, Math.min(7, score));
  }
  function passLabel(score){
    if (score === 0) return {text: 'Prazno', color: '#e5e7eb', pct: 0};
    if (score <= 2) return {text: 'Vrlo slabo', color: '#ef4444', pct: 20};
    if (score <= 4) return {text: 'Slabo', color: '#f59e0b', pct: 45};
    if (score <= 5) return {text: 'Srednje', color: '#facc15', pct: 65};
    if (score <= 6) return {text: 'Jako', color: '#34d399', pct: 85};
    return {text: 'Vrlo jako', color: '#06b6d4', pct: 100};
  }
  by('btn-pass').addEventListener('click', function(){
    const pw = by('pass-input').value;
    const s = passwordStrength(pw);
    const lbl = passLabel(s);
    const fill = by('pass-meter-fill');
    fill.style.width = lbl.pct + '%';
    fill.style.background = lbl.color;
    text(by('out-pass-text'), lbl.text + (pw ? ` — score ${s}/7` : ''));
  });

  let timerStart = 0;
  let timerElapsed = 0;
  let timerRaf = null;
  const display = by('timer-display');

  function formatTime(ms){
    ms = Math.max(0, Math.floor(ms));
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const msPart = ms % 1000;
    return String(minutes).padStart(2,'0') + ':' +
           String(seconds).padStart(2,'0') + '.' +
           String(msPart).padStart(3,'0');
  }
  function tick(){
    const now = performance.now();
    const cur = timerElapsed + (now - timerStart);
    display.textContent = formatTime(cur);
    timerRaf = requestAnimationFrame(tick);
  }
  by('btn-timer-start').addEventListener('click', function(){
    if (timerRaf) return;
    timerStart = performance.now();
    timerRaf = requestAnimationFrame(tick);
    by('btn-timer-start').textContent = 'Vrti...';
  });
  by('btn-timer-stop').addEventListener('click', function(){
    if (!timerRaf) return;
    cancelAnimationFrame(timerRaf);
    const now = performance.now();
    timerElapsed += (now - timerStart);
    timerRaf = null;
    display.textContent = formatTime(timerElapsed);
    by('btn-timer-start').textContent = 'Nastavi';
  });
  by('btn-timer-reset').addEventListener('click', function(){
    if (timerRaf) cancelAnimationFrame(timerRaf);
    timerStart = 0; timerElapsed = 0; timerRaf = null;
    display.textContent = formatTime(0);
    by('btn-timer-start').textContent = 'Start';
  });

  function calcBMI(weightKg, heightCm){
    const w = Number(weightKg);
    const h = Number(heightCm);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return NaN;
    const hM = h / 100;
    const bmi = w / (hM * hM);
    return Math.round(bmi * 10) / 10;
  }
  function bmiCategory(bmi){
    if (Number.isNaN(bmi)) return '';
    if (bmi < 18.5) return 'Pothranjenost';
    if (bmi < 25) return 'Normalna težina';
    if (bmi < 30) return 'Pretilost (Klasa I)';
    return 'Pretilost (Klasa II+)';
  }
  by('btn-bmi').addEventListener('click', function(){
    const w = by('bmi-weight').value, h = by('bmi-height').value;
    const v = calcBMI(w,h);
    if (Number.isNaN(v)){
      text(by('out-bmi'), 'Unesi ispravne vrijednosti (kg i cm).');
      return;
    }
    text(by('out-bmi'), `BMI = ${v} — ${bmiCategory(v)}`);
  });

  function textStats(s){
    s = String(s || '');
    const chars = s.length;
    const words = s.trim().length === 0 ? 0 : s.trim().split(/\s+/).length;
    const sentences = (s.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0);
    const readingMinutes = words / 200;
    return {chars, words, sentences, readingMinutes};
  }
  by('btn-stats').addEventListener('click', function(){
    const s = by('text-input').value;
    const st = textStats(s);
    const out = by('out-stats');
    out.innerHTML = '';
    const row = document.createElement('div'); row.className = 'stats-row';
    const items = [
      {k: 'Riječi', v: st.words},
      {k: 'Znakovi', v: st.chars},
      {k: 'Rečenice', v: st.sentences},
      {k: 'Vrijeme čitanja', v: `${Math.ceil(st.readingMinutes*60)} sek.`}
    ];
    items.forEach(it => {
      const d = document.createElement('div'); d.className = 'stats-item';
      d.textContent = `${it.k}: ${it.v}`;
      row.appendChild(d);
    });
    out.appendChild(row);
  });
  by('btn-clear-text').addEventListener('click', function(){
    by('text-input').value = '';
    text(by('out-stats'), 'Očišćeno.');
  });

  const quotes = [
    "Učenje danas, uspjeh sutra.",
    "Mali koraci vode do velikih rezultata.",
    "Ne boj se pogriješiti; boj se ne pokušati.",
    "Rad i upornost pobjeđuju talent kad talent ne radi.",
    "Znanje ti nitko ne može oduzeti."
  ];
  function randomQuote(){
    return quotes[Math.floor(Math.random()*quotes.length)];
  }
  by('btn-quote').addEventListener('click', function(){
    const q = randomQuote();
    const out = by('out-quote');
    out.innerHTML = `<div class="quote-text">“${q}”</div><div class="small muted">Autor: nepoznat (primjer)</div>`;
  });
  by('btn-copy-quote').addEventListener('click', function(){
    const txt = by('out-quote').innerText.trim();
    if (!txt) return alert('Nema citata za kopirati.');
    navigator.clipboard?.writeText(txt).then(() => {
      const old = by('btn-copy-quote').textContent;
      by('btn-copy-quote').textContent = 'Kopirano!';
      setTimeout(()=> by('btn-copy-quote').textContent = old, 1000);
    }).catch(()=> alert('Ne mogu kopirati (preglednik).'));
  });

  (function init(){
    text(by('out-add'), 'Pritisni "Zbroji"');
    text(by('out-mul'), 'Pritisni "Izračunaj"');
    text(by('out-rev'), 'Pritisni "Obrni"');
    text(by('out-pass-text'), 'Pritisni "Provjeri"');
    display.textContent = formatTime(0);
    text(by('out-bmi'), 'Pritisni "Izračunaj"');
    text(by('out-stats'), 'Pritisni "Analiziraj"');
    text(by('out-quote'), 'Pritisni "Novi citat" za prikaz.');
  }());

})();
