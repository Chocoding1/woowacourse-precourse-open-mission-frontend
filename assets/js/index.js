import { axiosInstance } from "./axiosInstance.js";

const DOM = {
  headerRight: document.getElementById("header-right"),
  chatList: document.getElementById("chat-list"),
  messages: document.getElementById("messages"),
  chatInput: document.getElementById("chat-input"),
  sendBtn: document.getElementById("send-btn"),
};

const chatId = new URLSearchParams(window.location.search).get("chatId");

const PATH = {
  LOGIN: "/login.html",
  SIGNUP: "/signup.html",
  HOME: "/index.html",
};

function createElement(tag, text, onClick) {
  const el = document.createElement(tag);
  el.textContent = text ?? "";
  if (onClick) el.onclick = onClick;
  return el;
}

function redirectTo(path) {
  window.location.href = path;
}

function renderHeader() {
  const container = DOM.headerRight;
  container.innerHTML = "";

  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    container.appendChild(createElement("button", "로그아웃", logout));
  } else {
    container.appendChild(
      createElement("button", "로그인", () => redirectTo(PATH.LOGIN))
    );
    container.appendChild(
      createElement("button", "회원가입", () => redirectTo(PATH.SIGNUP))
    );
  }
}

async function renderChatList() {
  const container = DOM.chatList;
  container.innerHTML = "";

  container.append(
    createElement("div", "새 채팅", () => redirectTo(PATH.HOME))
  );

  const chats = await fetchChatList();

  chats.forEach((chat) => {
    container.appendChild(
      createElement("div", chat.title, () =>
        redirectTo(`${PATH.HOME}?chatId=${chat.id}`)
      )
    );
  });
}

function renderMessage(text, isUser = false) {
  const msgEl = createElement("div", text);
  msgEl.className = `message ${isUser ? "user-message" : "bot-message"}`;

  DOM.messages.appendChild(msgEl);
  DOM.messages.scrollTop = DOM.messages.scrollHeight;
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
        redirectTo(`${PATH.HOME}?chatId=${newChatId}`);
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
  const container = DOM.chatInput;
  const prompt = container.value.trim();
  if (!prompt) return;

  renderMessage(prompt, true);
  container.value = "";

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
    redirectTo(PATH.HOME);
  }
}

async function init() {
  renderHeader();
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    DOM.chatList.style.display = "block";
    await renderChatList();

    if (chatId) {
      await fetchChatHistory(chatId);
    }
  }

  DOM.sendBtn.onclick = handleSendMessage;
  DOM.chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendMessage();
  });
}

init();
