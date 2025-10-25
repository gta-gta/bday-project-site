// gallery.js
window.addEventListener("load", () => {
  setTimeout(() => {
    console.log("Starting gallery after animation");
    const gameSection = document.querySelector(".gameapp");
    if (gameSection) {
      gameSection.style.display = "block";
    }
  }, 12000); 
});

// --- Helper utilities ---
// Use q() and qAll() to avoid conflict with jQuery's $
const q = sel => document.querySelector(sel);
const qAll = sel => Array.from(document.querySelectorAll(sel));

// Screens
const screens = {
  welcome: q('#welcome'), 
  level1: q('#level1'), 
  level2: q('#level2'), 
  level3: q('#level3'), 
  surprise: q('#surprise')
};

function show(screen) { 
  Object.values(screens).forEach(s => s.classList.remove('active')); 
  screens[screen].classList.add('active'); 
}

// Music controls
const bgm = q('#bgm'); 
const muteBtn = q('#muteBtn'); 
let muted = false;

if (muteBtn) {
  muteBtn.addEventListener('click', () => { 
    muted = !muted; 
    bgm.muted = muted; 
    muteBtn.textContent = muted ? '🔇' : '🔈'; 
  });
}

// Start
const startBtn = q('#startBtn');
if (startBtn) {
  startBtn.addEventListener('click', () => { 
    if (bgm) bgm.play().catch(() => {}); 
    show('level1'); 
    startLevel1(); 
    generateConfetti(16); 
  });
}

const resetBtn = q('#resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => location.reload());
}

const howBtn = q('#howBtn');
if (howBtn) {
  howBtn.addEventListener('click', () => alert('Flip cards to find matching pairs. Level 1 has 3 pairs, Level 2 has 6 pairs. Then solve the final riddle to reveal the surprise card.'));
}

// --- Memory Game Logic ---
function createGrid(container, items, cols) {
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${cols}, auto)`;
  items.forEach((symbol, idx) => {
    const card = document.createElement('div'); 
    card.className = 'card'; 
    card.dataset.symbol = symbol; 
    card.dataset.idx = idx;
    const inner = document.createElement('div'); 
    inner.className = 'card-inner';
    const f1 = document.createElement('div'); 
    f1.className = 'face front'; 
    f1.innerHTML = '';
    const f2 = document.createElement('div'); 
    f2.className = 'face back'; 
    f2.innerHTML = symbol;
    inner.appendChild(f1); 
    inner.appendChild(f2); 
    card.appendChild(inner);
    container.appendChild(card);
  });
}

function shuffle(a) { 
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); 
    [a[i], a[j]] = [a[j], a[i]];
  } 
  return a;
}

// Level 1 (3 pairs)
let l1State = {first: null, second: null, lock: false, moves: 0, matches: 0};

function startLevel1() {
  const symbols = ['🎈', '🎂', '🎁'];
  const pool = shuffle([...symbols, ...symbols]);
  createGrid(q('#grid1'), pool, 3);
  l1State = {first: null, second: null, lock: false, moves: 0, matches: 0};
  updateL1Status();
  q('#grid1').addEventListener('click', l1Click);
}

function updateL1Status() { 
  q('#l1moves').textContent = 'Moves: ' + l1State.moves; 
  q('#l1matches').textContent = 'Matches: ' + l1State.matches + ' / 3'; 
}

function l1Click(e) { 
  const card = e.target.closest('.card'); 
  if (!card || l1State.lock) return; 
  if (card.classList.contains('flipped')) return; 
  card.classList.add('flipped');
  
  if (!l1State.first) { 
    l1State.first = card; 
    return;
  }
  
  l1State.second = card; 
  l1State.lock = true; 
  l1State.moves++;
  
  if (l1State.first.dataset.symbol === l1State.second.dataset.symbol) { // match
    l1State.matches++; 
    l1State.first = null; 
    l1State.second = null; 
    l1State.lock = false; 
    updateL1Status(); 
    if (l1State.matches === 3) level1Complete();
  } else { 
    setTimeout(() => { 
      l1State.first.classList.remove('flipped'); 
      l1State.second.classList.remove('flipped'); 
      l1State.first = null; 
      l1State.second = null; 
      l1State.lock = false; 
      updateL1Status(); 
    }, 700); 
  }
  updateL1Status(); 
}

function level1Complete() { 
  generateConfetti(20); 
  q('#toLevel2').style.display = 'inline-block'; 
  q('#toLevel2').addEventListener('click', () => { 
    q('#grid1').removeEventListener('click', l1Click); 
    show('level2'); 
    startLevel2(); 
  }); 
}

// Level 2 (6 pairs)
let l2State = {first: null, second: null, lock: false, moves: 0, matches: 0};

function startLevel2() {
  const symbols = ['🌟', '💖', '🍰', '📸', '🎵', '🌸'];
  const pool = shuffle([...symbols, ...symbols]);
  createGrid(q('#grid2'), pool, 4);
  l2State = {first: null, second: null, lock: false, moves: 0, matches: 0}; 
  updateL2Status();
  q('#grid2').addEventListener('click', l2Click);
}

function updateL2Status() { 
  q('#l2moves').textContent = 'Moves: ' + l2State.moves; 
  q('#l2matches').textContent = 'Matches: ' + l2State.matches + ' / 6'; 
}

function l2Click(e) { 
  const card = e.target.closest('.card'); 
  if (!card || l2State.lock) return; 
  if (card.classList.contains('flipped')) return; 
  card.classList.add('flipped');
  
  if (!l2State.first) { 
    l2State.first = card; 
    return;
  }
  
  l2State.second = card; 
  l2State.lock = true; 
  l2State.moves++;
  
  if (l2State.first.dataset.symbol === l2State.second.dataset.symbol) { 
    l2State.matches++; 
    l2State.first = null; 
    l2State.second = null; 
    l2State.lock = false; 
    updateL2Status(); 
    if (l2State.matches === 6) level2Complete(); 
  } else { 
    setTimeout(() => { 
      l2State.first.classList.remove('flipped'); 
      l2State.second.classList.remove('flipped'); 
      l2State.first = null; 
      l2State.second = null; 
      l2State.lock = false; 
      updateL2Status(); 
    }, 700); 
  }
  updateL2Status(); 
}

function level2Complete() { 
  generateConfetti(24); 
  q('#toLevel3').style.display = 'inline-block'; 
  q('#toLevel3').addEventListener('click', () => { 
    q('#grid2').removeEventListener('click', l2Click); 
    show('level3'); 
  }); 
}

// Level 3 Riddle
const submitRiddleBtn = q('#submitRiddle');
if (submitRiddleBtn) {
  submitRiddleBtn.addEventListener('click', () => { 
    const val = q('#riddleAnswer').value.trim().toLowerCase(); 
    if (!val) { 
      q('#riddleMsg').textContent = 'Please type an answer.'; 
      return;
    } 
    if (['sakshi sharma','sakshi', 'sakshisharma', 'Sakshi'].includes(val)) { 
      q('#riddleMsg').textContent = 'Correct! Opening surprise...'; 
      generateConfetti(40); 
      setTimeout(() => show('surprise'), 900); 
    } else { 
      q('#riddleMsg').textContent = 'Not quite — try again!'; 
    } 
  });
}

// Surprise card flip
const gift = q('#gift'); 
const flipCardBtn = q('#flipCardBtn');
if (flipCardBtn) {
  flipCardBtn.addEventListener('click', () => { 
    gift.classList.toggle('flipped'); 
  });
}
if (gift) {
  gift.addEventListener('click', () => { 
    gift.classList.toggle('flipped'); 
  });
}

// Replay
const replayBtn = q('#replayBtn');
if (replayBtn) {
  replayBtn.addEventListener('click', () => { 
    location.reload(); 
  });
}

// Simple confetti generator (creates short lived elements)
function generateConfetti(count = 20) { 
  const area = q('#confettiArea'); 
  if (!area) return;
  
  const colors = ['#ffdd57', '#ff7ab6', '#7b5cff', '#56f0ff', '#ffd1f0']; 
  for (let i = 0; i < count; i++) { 
    const el = document.createElement('div'); 
    el.className = 'confetti'; 
    el.style.left = Math.random() * 100 + '%'; 
    el.style.top = (-10 - Math.random() * 20) + 'vh'; 
    el.style.width = (6 + Math.random() * 8) + 'px'; 
    el.style.height = (10 + Math.random() * 12) + 'px'; 
    el.style.background = colors[Math.floor(Math.random() * colors.length)]; 
    el.style.transform = `rotate(${Math.random() * 360}deg)`; 
    el.style.animationDuration = (2.4 + Math.random() * 1.6) + 's'; 
    area.appendChild(el); 
    setTimeout(() => el.remove(), 4000); 
  } 
}

// Auto-play music in some browsers may not work until user interacts — start on first click
document.addEventListener('click', () => { 
  if (bgm && bgm.paused && !muted) { 
    bgm.play().catch(() => {}); 
  } 
}, {once: true});

// small UX: allow Enter to submit riddle
const riddleAnswer = q('#riddleAnswer');
if (riddleAnswer) {
  riddleAnswer.addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') q('#submitRiddle').click(); 
  });
}

// Notes: replace music.mp3 and surprise.jpg in same folder for audio + image