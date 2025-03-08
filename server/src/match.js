export class Match {
    constructor(state, env) {
      this.state = state;
      this.players = [];
      this.text = "The quick brown fox jumps over the lazy dog."; // Static for simplicity
      this.status = "waiting";
      this.webSockets = new Map();
    }
  
    async fetch(request) {
      const data = await request.json();
      const playerId = data.playerId || Math.random().toString(36).substring(7);
  
      if (data.action === "join") {
        this.players.push({ id: playerId, name: data.name, progress: 0, finished: false });
        this.webSockets.set(playerId, this.state.webSocket);
        if (this.players.length >= 2) { // Start when 2+ players join (configurable)
          this.status = "active";
        }
      } else if (data.action === "update") {
        this.updatePlayer(data.playerId || playerId, data.input);
      }
  
      this.broadcastState();
      return new Response(JSON.stringify({ status: this.status, text: this.text, players: this.players }));
    }
  
    updatePlayer(playerId, input) {
      const player = this.players.find(p => p.id === playerId);
      if (!player) return;
  
      player.progress = this.calculateProgress(input, this.text);
      if (player.progress === 100 && input === this.text) {
        player.finished = true;
        this.status = "finished";
      }
    }
  
    calculateProgress(input, text) {
      let correctChars = 0;
      for (let i = 0; i < input.length && i < text.length; i++) {
        if (input[i] === text[i]) correctChars++;
      }
      return Math.min(100, (correctChars / text.length) * 100);
    }
  
    broadcastState() {
      const message = JSON.stringify({ status: this.status, text: this.text, players: this.players });
      for (const ws of this.webSockets.values()) {
        ws.send(message);
      }
    }
  }