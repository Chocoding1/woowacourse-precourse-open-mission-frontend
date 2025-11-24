import { getValue, createElement, redirectTo, showAlert } from "./utils.js";
import {
  getChatListApi,
  getChatHistoryApi,
  sendMessageApi,
  logoutApi as logoutApi,
} from "./api.js";

const DOM = {
  headerRight: document.getElementById("header-right"),
  chatList: document.getElementById("chat-list"),
  messages: document.getElementById("messages"),
  chatInput: document.getElementById("chat-input"),
  sendBtn: document.getElementById("send-btn"),
};

const PATH = {
  LOGIN: "/html/login.html",
  SIGNUP: "/html/signup.html",
  HOME: "/html/index.html",
};

const chatId = new URLSearchParams(window.location.search).get("chatId");

function renderMessage(text, isUser) {
  const msgEl = createElement("div", text);
  msgEl.className = `message ${isUser ? "user-message" : "bot-message"}`;
  DOM.messages.appendChild(msgEl);
  DOM.messages.scrollTop = DOM.messages.scrollHeight;
}

async function handleSendMessage() {
  const prompt = getValue(DOM.chatInput);
  if (!prompt) return;

  renderMessage(prompt, true);
  DOM.chatInput.value = "";

  const accessToken = localStorage.getItem("accessToken");
  try {
    const res = await sendMessageApi(chatId, prompt);

    if (!accessToken) {
      renderMessage(res.data.message, false);
      return;
    }

    if (!chatId) {
      const newChatId = res.data.chatId;
      redirectTo(`${PATH.HOME}?chatId=${newChatId}`);
      return;
    }

    renderChatList();
    renderMessage(res.data.message, false);
  } catch (err) {
    renderMessage(err.errorMessage, false);
  }
}

async function renderChatList() {
  DOM.chatList.innerHTML = "";
  DOM.chatList.appendChild(
    createElement("div", "새 채팅", () => redirectTo(PATH.HOME))
  );

  try {
    const chats = await getChatListApi();

    chats.forEach((chat) => {
      DOM.chatList.appendChild(
        createElement("div", chat.title, () =>
          redirectTo(`${PATH.HOME}?chatId=${chat.id}`)
        )
      );
    });
  } catch (err) {
    console.error(err);
    showAlert(err.errorMessage);
  }
}

function renderHeader() {
  const container = DOM.headerRight;
  container.innerHTML = "";

  const accessToken = localStorage.getItem("accessToken");
  if (accessToken)
    container.appendChild(createElement("button", "로그아웃", logout));
  else {
    container.appendChild(
      createElement("button", "로그인", () => redirectTo(PATH.LOGIN))
    );
    container.appendChild(
      createElement("button", "회원가입", () => redirectTo(PATH.SIGNUP))
    );
  }
}

async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  localStorage.removeItem("accessToken");

  try {
    await logoutApi(refreshToken);
  } catch (err) {
    console.error(err);
    showAlert(err.errorMessage);
  } finally {
    localStorage.removeItem("refreshToken");
    redirectTo(PATH.HOME);
  }
}

async function init() {
  renderHeader();

  if (localStorage.getItem("accessToken")) {
    DOM.chatList.style.display = "block";
    await renderChatList();

    if (chatId) {
      try {
        const messages = await getChatHistoryApi(chatId);
        messages.forEach((m) => renderMessage(m.content, m.role === "USER"));
      } catch (err) {
        console.error(err);
        showAlert(err.errorMessage);
      }
    }
  }

  DOM.sendBtn.addEventListener("click", handleSendMessage);
  DOM.chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendMessage();
  });
}

init();
