import { el } from "../components/dom.js";
import {
  createRoom,
  joinRoom,
  registerTeamUI,
  showRoom,
  leaveRoom,
  setMyName,
} from "../features/team/team.js";
import { loadRoom , loadName} from "../storage/storage.js";


export function renderTeam(container) {
  const createBtn = el("button", { text: "＋ Create Group" });
  const joinInput = el("input", { type: "text", placeholder: "Enter group code" });
  const joinBtn = el("button", { text: "Join" });
  const leaveBtn = el("button", { class: "btn-danger", text: "Leave Group" });

  const roomTitle = el("h3", { class: "team-room-title", text: "" });
  const usersList = el("ul", { class: "team-users" });

  const roomPanel = el("div", { class: "team-room card" }, [
    el("div", { class: "team-room-header" }, [
      roomTitle,
      leaveBtn
    ]),
    el("p", { class: "team-users-label", text: "Active users" }),
    usersList
  ]);
  const savedName = loadName();
  const nameInput = el("input", {
    type: "text",
    placeholder: "Your name",
    value: savedName || ""
  });
  const nameBtn = el("button", { text: "Set Name" });
  nameBtn.onclick = () => setMyName(nameInput.value);
  
  registerTeamUI(roomTitle, usersList);

  const savedRoom = loadRoom();
  if (savedRoom) {
    showRoom(savedRoom);
  } else {
    leaveBtn.style.display = "none";
    roomPanel.style.display = "none";
  }

  createBtn.onclick = createRoom;
  joinBtn.onclick = () => {
    const code = joinInput.value.trim().toUpperCase();
    if (!code) return;
    joinRoom(code);
  };
  leaveBtn.onclick = leaveRoom;

  container.appendChild(
    el("div", { class: "team-panel" }, [
      el("div", { class: "card" }, [
        el("h2", { text: "Team Up" }),
        el("div", { class: "team-name-row" }, [
          nameInput,
          nameBtn
        ]),
        el("div", { class: "team-actions" }, [
          createBtn,
          el("div", { class: "team-join-row" }, [
            joinInput,
            joinBtn
          ])
        ])
      ]),
      roomPanel
    ])
  );
}