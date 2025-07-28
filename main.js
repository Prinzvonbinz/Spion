// --- DOM-Elemente ---
const mainMenu = document.getElementById("mainMenu");
const roleScreen = document.getElementById("roleScreen");
const votingScreen = document.getElementById("votingScreen");
const resultScreen = document.getElementById("resultScreen");

const addPlayerInput = document.getElementById("addPlayerInput");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const clearPlayersBtn = document.getElementById("clearPlayersBtn");
const playersList = document.getElementById("playersList");

const categorySelect = document.getElementById("categorySelect");
const spyCountInput = document.getElementById("spyCountInput");

const startGameBtn = document.getElementById("startGameBtn");
const errorMessage = document.getElementById("errorMessage");

const roleName = document.getElementById("roleName");
const roleInfo = document.getElementById("roleInfo");
const nextRoleBtn = document.getElementById("nextRoleBtn");

const votingName = document.getElementById("votingName");
const voteInput = document.getElementById("voteInput");
const voteBtn = document.getElementById("voteBtn");

const resultText = document.getElementById("resultText");
const playAgainBtn = document.getElementById("playAgainBtn");

// --- Spielvariablen ---
let players = [];
let spies = [];
let roles = [];
let currentRoleIndex = 0;
let spyCount = 0;
let category = "";
let roleStep = 0;
let votingIndex = 0;
let votes = {};

// --- Kategorien ---
const categoriesData = {
  Tiere: [
    "Löwe", "Elefant", "Tiger", "Giraffe", "Pinguin", "Fuchs", "Bär", "Wolf", "Känguru", "Koala",
    "Adler", "Delfin", "Hai", "Eule", "Krokodil", "Schlange", "Papagei", "Nilpferd", "Zebra", "Chamäleon"
  ],
  Orte: [
    "Berlin", "Paris", "London", "Rom", "New York", "Tokio", "Sydney", "Moskau", "Amsterdam", "Barcelona",
    "Venedig", "Dubai", "Kairo", "Rio", "Mexiko-Stadt", "Bangkok", "San Francisco", "Istanbul", "Lissabon", "Mumbai"
  ],
  Fahrzeuge: [
    "Auto", "Motorrad", "Fahrrad", "Lastwagen", "Bus", "Traktor", "Helikopter", "Flugzeug", "Segelboot", "U-Boot",
    "Straßenbahn", "Roller", "Skateboard", "E-Scooter", "Taxi", "Zug", "Kutsche", "Rikscha", "Rakete", "Hoverboard"
  ],
  Filme: [
    "Inception", "Titanic", "Matrix", "Star Wars", "Avengers", "Frozen", "Gladiator", "Joker", "Avatar", "Interstellar",
    "Harry Potter", "Forrest Gump", "Shrek", "Der Pate", "Herr der Ringe", "Jurassic Park", "The Dark Knight", "Up", "Alien", "Toy Story"
  ],
  Berufe: [
    "Arzt", "Lehrer", "Ingenieur", "Polizist", "Bäcker", "Koch", "Architekt", "Mechaniker", "Friseur", "Pilot",
    "Journalist", "Designer", "Elektriker", "Schreiner", "Landwirt", "Tänzer", "Zahnarzt", "Anwalt", "Fotograf", "Maler"
  ],
  Essen: [
    "Pizza", "Burger", "Spaghetti", "Sushi", "Salat", "Kuchen", "Steak", "Pommes", "Eis", "Sandwich",
    "Taco", "Pfannkuchen", "Risotto", "Bratwurst", "Muffin", "Suppe", "Lasagne", "Donut", "Quiche", "Kebab"
  ],
  Promis: [
    "Beyoncé", "Elon Musk", "Taylor Swift", "Leonardo DiCaprio", "Oprah Winfrey", "Cristiano Ronaldo", "Ariana Grande",
    "Dwayne Johnson", "Rihanna", "Bill Gates", "Kylie Jenner", "Brad Pitt", "Angelina Jolie", "Justin Bieber",
    "Kim Kardashian", "Serena Williams", "Tom Cruise", "Jennifer Lopez", "Eminem", "Shakira"
  ]
};

// --- Spieler hinzufügen ---
function updatePlayersList() {
  playersList.innerHTML = "";
  players.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    playersList.appendChild(li);
  });
}

function addPlayer() {
  const name = addPlayerInput.value.trim();
  errorMessage.textContent = "";
  if (!name || players.includes(name)) {
    errorMessage.textContent = "Ungültiger oder doppelter Name.";
    return;
  }
  players.push(name);
  addPlayerInput.value = "";
  updatePlayersList();
}

function clearPlayers() {
  players = [];
  updatePlayersList();
  errorMessage.textContent = "";
}

// --- Spielstart prüfen ---
function validateStart() {
  errorMessage.textContent = "";
  spyCount = parseInt(spyCountInput.value);
  category = categorySelect.value;

  if (players.length < 3) {
    errorMessage.textContent = "Mindestens 3 Spieler.";
    return false;
  }
  if (isNaN(spyCount) || spyCount < 1 || spyCount >= players.length) {
    errorMessage.textContent = "Ungültige Spionanzahl.";
    return false;
  }
  if (!categoriesData[category]) {
    errorMessage.textContent = "Kategorie fehlt.";
    return false;
  }
  return true;
}

// --- Rollen zuweisen ---
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function assignRoles() {
  roles = [];
  const shuffled = shuffle([...players]);
  spies = shuffled.slice(0, spyCount);
  const innocents = shuffled.slice(spyCount);
  const wordList = categoriesData[category];
  const secretWord = wordList[Math.floor(Math.random() * wordList.length)];

  players.forEach(name => {
    if (spies.includes(name)) {
      roles.push({ name, role: "Spion", word: "" });
    } else {
      roles.push({ name, role: "Unschuldig", word: secretWord });
    }
  });

  roles = shuffle(roles);
}

// --- Rollenanzeige ---
function showRoleScreen() {
  mainMenu.classList.add("hidden");
  roleScreen.classList.remove("hidden");
  votingScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");

  currentRoleIndex = 0;
  roleStep = 0;
  showNextRoleStep();
}

function showNextRoleStep() {
  const person = roles[currentRoleIndex];
  if (roleStep === 0) {
    roleName.textContent = person.name;
    roleInfo.textContent = "Klicke um Rolle zu sehen";
    roleStep = 1;
  } else if (roleStep === 1) {
    roleInfo.innerHTML = `<strong>Rolle:</strong> ${person.role}` + (person.word ? `<br><em>Wort:</em> ${person.word}` : "");
    nextRoleBtn.textContent = "Nächster";
    roleStep = 2;
  } else {
    currentRoleIndex++;
    if (currentRoleIndex < roles.length) {
      roleStep = 0;
      nextRoleBtn.textContent = "Zeige Rolle";
      showNextRoleStep();
    } else {
      startVoting();
    }
  }
}

// --- Voting ---
function startVoting() {
  roleScreen.classList.add("hidden");
  votingScreen.classList.remove("hidden");
  votingIndex = 0;
  votes = {};
  updateVotingScreen();
}

function updateVotingScreen() {
  if (votingIndex >= roles.length) {
    showResults();
    return;
  }
  votingName.textContent = roles[votingIndex].name;
  voteInput.value = "";
  voteInput.focus();
}

function submitVote() {
  const voted = voteInput.value.trim();
  const voter = roles[votingIndex].name;
  if (!players.includes(voted)) {
    alert("Name ungültig.");
    return;
  }
  votes[voted] = (votes[voted] || 0) + 1;
  votingIndex++;
  updateVotingScreen();
}

// --- Ergebnis ---
function showResults() {
  votingScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  let maxVotes = 0;
  let votedOut = [];

  for (const [name, count] of Object.entries(votes)) {
    if (count > maxVotes) {
      maxVotes = count;
      votedOut = [name];
    } else if (count === maxVotes) {
      votedOut.push(name);
    }
  }

  const spiesOut = votedOut.filter(name => spies.includes(name));
  const win = spiesOut.length > 0;

  resultText.innerHTML = win
    ? `Die Spione ${spiesOut.join(", ")} wurden enttarnt!<br><br>Rollen:<br>${formatRoles()}`
    : `Spione haben überlebt!<br><br>Rollen:<br>${formatRoles()}`;
}

function formatRoles() {
  return roles.map(r => `${r.name}: ${r.role}${r.word ? " – " + r.word : ""}`).join("<br>");
}

// --- Neustart ---
function resetGame() {
  resultScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");
  updatePlayersList();
}

// --- Event-Listener ---
addPlayerBtn.addEventListener("click", addPlayer);
clearPlayersBtn.addEventListener("click", clearPlayers);
startGameBtn.addEventListener("click", () => {
  if (validateStart()) {
    assignRoles();
    showRoleScreen();
  }
});
nextRoleBtn.addEventListener("click", showNextRoleStep);
voteBtn.addEventListener("click", submitVote);
playAgainBtn.addEventListener("click", resetGame);
