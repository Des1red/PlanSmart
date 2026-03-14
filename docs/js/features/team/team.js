import { connect, getApi, getProtocol, disconnect, sendName, sendLeave } from "../../sync/socket.js";
import { uiAlert } from "../../components/ui.js";
import { saveRoom, loadRoom, deleteRoom, saveName } from "../../storage/storage.js";
import { emit } from "../../state/events.js";

let currentRoom = null;
let usersList = null;
let roomTitle = null;
let lastUserCount = null;
let lastUserNames = null;
let lastYourName = null;

export function restoreRoom() {

  const savedRoom = loadRoom();

  if (!savedRoom) return;

  connect(savedRoom);
}

export function registerTeamUI(titleEl, usersEl) {
    roomTitle = titleEl;
    usersList = usersEl;
    if (lastUserNames !== null) {
        renderUsers(lastUserCount, lastUserNames, lastYourName);
    }
}

function renderUsers(count, names, yourName) {
    if (!usersList) return;
    usersList.innerHTML = "";

    const countEl = document.createElement("li");
    countEl.textContent = `${count} connected`;
    countEl.classList.add("team-user-count");
    usersList.appendChild(countEl);
    if (!Array.isArray(names)) return;

    for (const name of names) {
        const li = document.createElement("li");
        li.textContent = name === yourName ? `${name} (you)` : name;
        if (name === yourName) li.classList.add("team-user-you");
        usersList.appendChild(li);
    }
}

export function showRoom(code) {

  currentRoom = code;

  if (!roomTitle || !usersList) return;

  roomTitle.textContent = `Room: ${code}`;
}

export async function createRoom() {
  const res = await fetch(`${getProtocol()}${getApi()}/rooms`, { method: "POST" });
  const data = await res.json();
  connect(data.code, { broadcastOnOpen: true });
  saveRoom(data.code);
  showRoom(data.code);
  emit();
  uiAlert(`Room created\nCode: ${data.code}`);
}
export async function joinRoom(code) {

  const res = await fetch(`${getProtocol()}${getApi()}/rooms/${code}`);

  if (!res.ok) {
    uiAlert("Room not found");
    return;
  }

  connect(code);
  saveRoom(code);
  showRoom(code);
  emit();
}

export async function setMyName(name) {
  const trimmed = name.trim();
  if (!trimmed) return;
  saveName(trimmed);
  sendName(trimmed);
  emit();
}

export function leaveRoom() {
  sendLeave();
  disconnect();
  deleteRoom();
  currentRoom = null;
  lastUserCount = null;
  lastUserNames = null;
  lastYourName = null; 
  if (roomTitle) roomTitle.textContent = "";
  if (usersList) usersList.innerHTML = "";
  emit();
}

window.__updateTeamUsers = function(count, names, yourName) {
    lastUserCount = count;
    lastUserNames = Array.isArray(names) ? names : [];
    lastYourName = yourName;
    renderUsers(count, names, yourName);
};