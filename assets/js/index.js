import { axiosInstance } from "./axiosInstance.js";

const headerRightEl = document.getElementById("header-right");
const chatListEl = document.getElementById("chat-list");
const messagesEl = document.getElementById("messages");
const chatInputEl = document.getElementById("chat-input");
const sendBtnEl = document.getElementById("send-btn");

const chatId = new URLSearchParams(window.location.search).get("chatId");

const LOGIN_PATH = "/login.html";
const SIGNUP_PATH = "/signup.html";
const HOME_PATH = "/index.html";

function createButton(label, onClick) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.onclick = onClick;
  return btn;
}

function createDiv(label, onClick) {
  const div = document.createElement("div");
  div.textContent = label;
  div.onclick = onClick;
  return div;
}

function renderHeader() {
  headerRightEl.innerHTML = "";
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    const logoutBtn = createButton("로그아웃", logout);
    headerRightEl.appendChild(logoutBtn);
  } else {
    const loginBtn = createButton(
      "로그인",
      () => (window.location.href = LOGIN_PATH)
    );
    const signupBtn = createButton(
      "회원가입",
      () => (window.location.href = SIGNUP_PATH)
    );

    headerRightEl.appendChild(loginBtn);
    headerRightEl.appendChild(signupBtn);
  }
}

async function renderChatList() {
  chatListEl.innerHTML = "";

  const newChatItem = createDiv(
    "새 채팅",
    () => (window.location.href = HOME_PATH)
  );
  chatListEl.append(newChatItem);

  const chats = await fetchChatList();

  chats.forEach((chat) => {
    const item = createDiv(
      chat.title,
      () => (window.location.href = `${HOME_PATH}?chatId=${chat.id}`)
    );
    chatListEl.appendChild(item);
  });
}

function renderMessage(text, isUser = false) {
  const msgEl = document.createElement("div");
  msgEl.className = `message ${isUser ? "user-message" : "bot-message"}`;
  msgEl.textContent = text;
  messagesEl.appendChild(msgEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function fetchChatList() {
  try {
    const res = await axiosInstance.get("/chats/conversations");

    return res.data?.data?.conversationDtos || [];
  } catch (err) {
    console.error("채팅 목록 조회 오류:", err);
    return [];
  }
}

async function fetchChatHistory(chatId) {
  try {
    const res = await axiosInstance.get(`/chats/conversations/${chatId}`);

    const messages = res.data?.data?.messageDtos;
    if (messages) {
      messages.forEach((m) => renderMessage(m.content, m.role === "USER"));
    }
  } catch (err) {
    console.error("채팅방 메시지 조회 오류:", err);
  }
}

async function sendMessageToServer(prompt) {
  const accessToken = localStorage.getItem("accessToken");

  try {
    if (!accessToken) {
      const res = await axiosInstance.post("/chats", { prompt });
      return res.data;
    }

    if (!chatId) {
      const res = await axiosInstance.post("/chats", { prompt });
      const newChatId = res.data?.data?.chatId;

      if (newChatId) {
        window.location.href = `${HOME_PATH}?chatId=${newChatId}`;
      }

      return res.data;
    }

    const res = await axiosInstance.post(`/chats/${chatId}`, { prompt });
    return res.data;
  } catch (err) {
    const errorData = err.response?.data || { errorMessage: "오류 발생" };
    return errorData;
  }
}

async function handleSendMessage() {
  const prompt = chatInputEl.value.trim();
  if (!prompt) return;

  renderMessage(prompt, true);
  chatInputEl.value = "";

  const result = await sendMessageToServer(prompt);

  renderChatList();

  if (result?.errorMessage) {
    renderMessage(result.errorMessage, false);
    return;
  }

  if (result?.data?.message) {
    renderMessage(result.data.message, false);
  }
}

async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    localStorage.removeItem("accessToken");

    await axios.post("http://localhost:8080/logout", null, {
      headers: { Authorization: refreshToken },
    });
  } catch (err) {
    console.error("로그아웃 실패:", err);
  } finally {
    localStorage.removeItem("refreshToken");
    location.href = "index.html";
  }
}

async function init() {
  renderHeader();
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    chatListEl.style.display = "block";

    renderChatList();

    if (chatId) {
      await fetchChatHistory(chatId);
    }
  }

  sendBtnEl.onclick = handleSendMessage;
  chatInputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendMessage();
  });
}

init();
