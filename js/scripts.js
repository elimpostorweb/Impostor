const database = {
 "Famosos": ["Lionel Messi", "Cristiano Ronaldo", "Shakira", "Elon Musk", "Rosalía", "Ibai", "Donald Trump","Michael Jackson","Justin Bieber","jeffrey dahmer","P.Diddy","Bad Bunny","Daddy Yankey"],
 "Animales": ["Elefante", "Hámster", "Tiburón", "Jirafa", "León", "Pingüino", "Perro","Tigre","Gorila","Ballena","Mono"],
 "Países": ["España", "México", "Japón", "Brasil", "Egipto", "Francia", "Italia"],
 "Objeto": ["Microondas", "Reloj", "Satélite", "Ascensor", "Paraguas", "Semáforo","Cocina"],
 "Genero_Musical": ["Pop","Rock","Hip Hop","Reggaetón","Jazz","Electrónica","Country","Metal","Salsa","Merengue","Cumbia","Reggae"],
 "Pelicula": ["Avatar","Titanic","Avengers: Endgame","Spider-Man","The Dark Knight","Inception","Interstellar","Jurassic Park","Lord of the Rings","Star Wars","Harry Potter","The Matrix","Gladiator","The Lion King"],
 "Anime": ["Naruto","Dragon Ball","One Piece","Attack on Titan","Death Note","Fullmetal Alchemist","Demon Slayer","My Hero Academia","Jujutsu Kaisen","Tokyo Ghoul","Sword Art Online","One Punch Man","Hunter x Hunter","Bleach","Neon Genesis Evangelion","Pokemon","Digimon","Sailor Moon","Saint Seiya"],
 "Profesiones": ["Doctor","Ingeniero","Abogado","Maestro","Enfermero","Arquitecto","Policía","Bombero","Cocinero","Piloto"],
 "Marcas": ["Nike","Adidas","Apple","Samsung","Coca-Cola","Pepsi","McDonald's","Google","Toyota","Sony"],
 "EquiposFutbol": ["Barcelona","Real Madrid","Manchester United","Manchester City","Liverpool","Chelsea","Arsenal","Bayern Munich","Borussia Dortmund","PSG","Juventus","AC Milan","Inter","Napoli","Benfica","Atletico de Madrid","Sevilla","River Plate","Boca Juniors"],
 "Aleatorio": []
};

let players = [];
let category = "";
let secretWord = "";
let impostorIdx = -1;
let currentIdx = 0;
let timeLeft = 0;
let timerInterval = null;
let isPaused = false;
let isGameEnd = false;
let gameStarted = false;



function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}



function showCustomAlert(title, msg, endOfGame = false) {
 document.getElementById('modal-title').innerText = title;
 document.getElementById('modal-msg').innerText = msg;
 document.getElementById('custom-modal').style.display = 'flex';
 isGameEnd = endOfGame;
}

function closeModal() {
 document.getElementById('custom-modal').style.display = 'none';
 if(isGameEnd) resetForNewRound();
}



function resetForNewRound() {
 category = "";
 secretWord = "";
 impostorIdx = -1;
 currentIdx = 0;
 isPaused = false;
 isGameEnd = false;
 gameStarted = false;

 document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
 nextScreen('screen2');
}



function nextScreen(id) {
 if(id === 'screen2' && players.length < 3) {
   showCustomAlert("¡Faltan Jugadores!", "Añade al menos 3 personas para poder jugar.");
   return;
 }
 if(id === 'screen3' && !category) {
   showCustomAlert("Elige Tema", "Por favor, selecciona una de las tarjetas de categoría.");
   return;
 }
 document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
 document.getElementById(id).classList.add('active');
}



function renderPlayers() {
 const container = document.getElementById('list-names');
 container.innerHTML = "";

 players.forEach((p, index) => {
   const tag = document.createElement("div");
   tag.className = "player-tag";
   tag.style.display = "flex";
   tag.style.justifyContent = "space-between";
   tag.style.alignItems = "center";

   const name = document.createElement("span");
   name.textContent = p;

   const del = document.createElement("button");
   del.textContent = "✕";
   del.style.background = "transparent";
   del.style.border = "none";
   del.style.color = "var(--impostorColor)";
   del.style.fontSize = "1.2rem";
   del.style.cursor = "pointer";

   del.addEventListener("click", (e) => {
     e.stopPropagation();
     eliminarPlayer(index);
   });

   tag.appendChild(name);
   tag.appendChild(del);
   container.appendChild(tag);
 });
}

function eliminarPlayer(index) {
 if (gameStarted) return;
 players.splice(index, 1);
 renderPlayers();
}

function addPlayer() {
 const inp = document.getElementById('input-name');
 const name = inp.value.trim();
 if(name){
   players.push(name);
   renderPlayers();
   inp.value = "";
 }
}



function selectCat(el, cat) {
 document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
 el.classList.add('selected');
 category = cat;
}

function getRandomCategory() {
 const categories = Object.keys(database).filter(cat => cat !== "Aleatorio");
 return categories[Math.floor(Math.random() * categories.length)];
}



function startGame() {
 if (category === "Aleatorio") category = getRandomCategory();

 gameStarted = true;
 shuffleArray(players);

 timeLeft = parseInt(document.getElementById('time-val').value) || 60;
 impostorIdx = Math.floor(Math.random() * players.length);

 const list = database[category];
 secretWord = list[Math.floor(Math.random() * list.length)];

 currentIdx = 0;
 updateRevealScreen();
 nextScreen('screen4');
}

function updateRevealScreen() {
 document.getElementById('player-turn').innerText = players[currentIdx];
 const box = document.getElementById('secret-box');
 box.innerText = "TOCA PARA REVELAR";
 box.style.color = "white";
 box.style.borderColor = "#444";
 document.getElementById('btn-next-turn').style.display = "none";
}

function showSecret() {
 const box = document.getElementById('secret-box');
 if(currentIdx === impostorIdx) {
   box.innerText = "ERES EL\nIMPOSTOR";
   box.style.color = "var(--impostorColor)";
   box.style.borderColor = "var(--impostorColor)";
 } else {
   box.innerText = secretWord;
   box.style.color = "var(--primary)";
   box.style.borderColor = "var(--primary)";
 }
 document.getElementById('btn-next-turn').style.display = "block";
}

function nextTurn() {
 currentIdx++;
 if(currentIdx < players.length) updateRevealScreen();
 else startCounter();
}



function startCounter() {
 nextScreen('screen5');
 const display = document.getElementById('timer-display');
 display.innerText = timeLeft;
 timerInterval = setInterval(() => {
   if(!isPaused) {
     timeLeft--;
     display.innerText = timeLeft;
     if(timeLeft <= 0) finishTimer();
   }
 }, 1000);
}

function togglePause() {
 isPaused = !isPaused;
 document.getElementById('pause-btn').innerText = isPaused ? "Seguir" : "Pausa";
}



function finishTimer() {
 clearInterval(timerInterval);
 nextScreen('screen6');
 const list = document.getElementById('vote-list');
 list.innerHTML = "";

 players.forEach((p, i) => {
   const tag = document.createElement("div");
   tag.className = "player-tag";
   tag.style.display = "flex";
   tag.style.justifyContent = "space-between";
   tag.style.cursor = "pointer";
   tag.textContent = p;

   const span = document.createElement("span");
   span.textContent = "VOTAR";
   span.style.fontSize = "0.7rem";
   span.style.fontWeight = "900";
   span.style.color = "var(--primary)";

   tag.appendChild(span);
   tag.addEventListener("click", () => checkResult(i));
   list.appendChild(tag);
 });
}

function checkResult(idx) {
 if(idx === impostorIdx) {
   showCustomAlert("¡VICTORIA!", `¡Habéis ganado! El impostor era ${players[impostorIdx]}.`, true);
 } else {
   showCustomAlert("¡DERROTA!", `Habéis fallado. El impostor era ${players[impostorIdx]}.`, true);
 }
}



const titulo = document.querySelector('#titulo');
titulo.addEventListener('touchstart', () => {
 titulo.classList.add('animate');
 titulo.addEventListener('animationend', () => {
   titulo.classList.remove('animate');
 }, { once: true });
});
