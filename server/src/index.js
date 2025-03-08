export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (url.pathname === "/websocket") {
        if (request.headers.get("Upgrade") === "websocket") {
          const [client, server] = Object.pipe(new WebSocketPair());
          server.accept();
          this.handleWebSocket(server, env);
          return new Response(null, { status: 101, webSocket: client });
        }
        return new Response("Expected WebSocket", { status: 400 });
      }
      return new Response("Not Found", { status: 404 });
    },
  
    handleWebSocket(ws, env) {
      ws.addEventListener("message", async (event) => {
        const data = JSON.parse(event.data);
        const matchId = data.matchId;
        const match = env.MATCHES.get(env.MATCHES.idFromName(matchId));
        const response = await match.fetch(new Request("update", {
          method: "POST",
          body: JSON.stringify(data),
        }));
        ws.send(await response.text());
      });
    },
  };
  
  export { Match } from "./match.js";