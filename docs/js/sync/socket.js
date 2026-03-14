import { loadName } from "../storage/storage.js";
let socket = null;

export function getApi() {
  if (location.hostname === "localhost" || location.hostname.match(/^192\.168\./)) {
    return "192.168.1.110:8080";
  }
  return "plansmart-production.up.railway.app";
}

export function getProtocol() {
  return location.protocol === "https:" ? "https://" : "http://";
}

export function getWsProtocol() {
  return location.protocol === "https:" ? "wss://" : "ws://";
}

export function connect(code, options = {}) {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  const savedName = loadName();
  const nameParam = savedName ? `?name=${encodeURIComponent(savedName)}` : "";
  socket = new WebSocket(`${getWsProtocol()}${getApi()}/rooms/${code}/ws${nameParam}`);

  socket.onmessage = (e) => {
    let msg;
    try { msg = JSON.parse(e.data); } catch { return; }
    if (msg.type === "PLAN_UPDATE") { console.log("PLAN_UPDATE received", msg.plan); window.__applyRemotePlan(msg.plan);}
    if (msg.type === "USERS") window.__updateTeamUsers(msg.count, msg.names, msg.yourName);
  };

  socket.onopen = () => {
    console.log("Connected to room");
    if (options.broadcastOnOpen && window.__broadcastPlan) {
      window.__broadcastPlan(); // only the creator pushes on connect
    }
  };

  socket.onclose = () => console.log("Socket closed");
}

export function sendPlan(plan) {

  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify({
    type: "PLAN_UPDATE",
    plan
  }));
}

export function sendName(name) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "SET_NAME", name }));
}

export function sendLeave() {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "LEAVE" }));
}

export function disconnect() {
  if (socket) {
    socket.close();
    socket = null;
  }
}