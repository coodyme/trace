let ws;
let matchId;

function connectWebSocket() {
  ws = new WebSocket(`wss://${window.location.host}/websocket`);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateUI(data);
  };
}

function joinMatch() {
  matchId = document.getElementById("match-id").value;
  connectWebSocket();
  ws.onopen = () => {
    ws.send(JSON.stringify({ action: "join", matchId, name: "Player" }));
  };
}

function createMatch() {
  matchId = Math.random().toString(36).substring(7); // Simple random ID
  connectWebSocket();
  ws.onopen = () => {
    ws.send(JSON.stringify({ action: "join", matchId, name: "Player" }));
  };
}

function updateProgress() {
  const input = document.getElementById("text-input").value;
  ws.send(JSON.stringify({ action: "update", matchId, input }));
}

function updateUI(data) {
  if (data.status === "active") {
    document.getElementById("lobby").style.display = "none";
    document.getElementById("race").style.display = "block";
    document.getElementById("text-prompt").textContent = data.text;
    renderProgress(data.players);
  } else if (data.status === "finished") {
    document.getElementById("race").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("winner").textContent = `Winner: ${data.players.find(p => p.finished).name}`;
  }
}

function renderProgress(players) {
  const progressBars = document.getElementById("progress-bars");
  progressBars.innerHTML = "";
  players.forEach(player => {
    const div = document.createElement("div");
    div.className = "progress";
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.style.width = `${player.progress}%`;
    div.textContent = `${player.name}: ${player.progress}%`;
    div.appendChild(bar);
    progressBars.appendChild(div);
  });
}

function restart() {
  document.getElementById("results").style.display = "none";
  document.getElementById("lobby").style.display = "block";
}