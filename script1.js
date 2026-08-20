console.log("Script loaded");

const input = document.getElementById("question-input");
const sendBtn = document.getElementById("send-btn");
const chatWindow = document.getElementById("chat-window");
const historyList = document.getElementById("historyList");
const welcomeScreen = document.getElementById("welcome-screen");


let chats = [];          // stores all chats
let currentChat = [];    // stores current conversation

sendBtn.addEventListener("click", handleSend);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});

async function handleSend() {
  const question = input.value.trim();
  if (!question) return;
if(welcomeScreen) welcomeScreen.style.display = "none";
  showMessage("user", question);
  document.getElementById("welcome-screen").style.display = "none";
  currentChat.push({ role: "user", parts: [{ text: question }] });
  input.value = "";

  showLoading();

  try {
    const res = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();

    removeLoading();
    showMessage("model", data.answer);
    currentChat.push({ role: "model", parts: [{ text: data.answer }] });
  } catch (err) {
    removeLoading();
    showMessage("model", "❌ Server not running or request failed");
  }
}

function formatText(text) {
  return text
    // Replace markdown headers
    .replace(/^####\s?(.*)$/gm, '<h4>$1</h4>')
    .replace(/^###\s?(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s?(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#\s?(.*)$/gm, '<h1>$1</h1>')

    // Bold text: **bold**
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')

    // Italics: *italic*
    .replace(/\*(.*?)\*/g, '<i>$1</i>')

    // Bullet points: - or •
    .replace(/^- (.*)$/gm, '• $1')

    // Line breaks
    .replace(/\n/g, '<br>');
}


function showMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = formatText(text);

  msg.appendChild(bubble);
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

let loadingMsg;
function showLoading() {
  loadingMsg = document.createElement("div");
  loadingMsg.className = "message model";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `
  <div class="typing-bubble">
    <div class="bot-icon">
    <img src="./images/logo.png" class="bot-icon-img" />
</div>
    <div class="dot-typing">
      <span></span><span></span><span></span>
    </div>
  </div>
`;

  loadingMsg.appendChild(bubble);
  chatWindow.appendChild(loadingMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeLoading() {
  if (loadingMsg) chatWindow.removeChild(loadingMsg);
}

function newChat() {
  if (currentChat.length > 0) {
    chats.push([...currentChat]); // Save previous chat
  }

  currentChat = [];
  chatWindow.innerHTML = "";
  
  if (welcomeScreen) welcomeScreen.style.display = "flex"; // Show welcome again

  renderHistory();
}


function setExample(exampleText) {
  input.value = exampleText;
}

function renderHistory() {
  historyList.innerHTML = "";

  if (chats.length === 0) {
    historyList.innerHTML = "<p style='font-size: 0.8rem;'>No chats yet</p>";
    return;
  }

  chats.forEach((chat, index) => {
    const btn = document.createElement("button");
    const firstLine = chat.find(m => m.role === "user")?.parts[0].text || `Chat ${index + 1}`;
    btn.textContent = firstLine.length > 20 ? firstLine.slice(0, 20) + "..." : firstLine;
    btn.className = "history-button";
    btn.onclick = () => loadChat(index);
    historyList.appendChild(btn);
  });
}

function loadChat(index) {
  if (welcomeScreen) welcomeScreen.style.display = "none";
  chatWindow.innerHTML = "";
  currentChat = [...chats[index]];
  currentChat.forEach(entry => {
    showMessage(entry.role, entry.parts[0].text);
  });
}
