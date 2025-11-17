const headerRightEl = document.getElementById("header-right");
const chatListEl = document.getElementById("chat-list");
const messagesEl = document.getElementById("messages");
const chatInputEl = document.getElementById("chat-input");
const sendBtnEl = document.getElementById("send-btn");

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get("chatId");

// =============================
// 공통 응답 파서
// =============================
async function parseResponse(res) {
  const resData = await res.json();
  if (res.ok) {
    return { ok: true, data: resData.data, message: resData.message };
  }
  return {
    ok: false,
    error: {
      status: resData.status,
      errorCode: resData.errorCode,
      errorMessage: resData.errorMessage,
      errorFields: resData.errorFields,
      redirectUri: resData.redirectUri,
    },
  };
}

// =============================
// 헤더 렌더링
// =============================
function renderHeader() {
  headerRightEl.innerHTML = "";
  if (accessToken) {
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "로그아웃";
    logoutBtn.onclick = handleLogout;
    headerRightEl.appendChild(logoutBtn);
  } else {
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "로그인";
    loginBtn.onclick = () => (window.location.href = "/login.html");

    const signupBtn = document.createElement("button");
    signupBtn.textContent = "회원가입";
    signupBtn.onclick = () => (window.location.href = "/signup.html");

    headerRightEl.appendChild(loginBtn);
    headerRightEl.appendChild(signupBtn);
  }
}

// =============================
// 채팅 목록 출력
// =============================
function renderChatList(chats) {
  chatListEl.innerHTML = "";

  const newChatItem = document.createElement("div");
  newChatItem.textContent = "새 채팅";
  newChatItem.style.fontWeight = "bold";
  newChatItem.onclick = () => (window.location.href = "index.html");
  chatListEl.append(newChatItem);

  chats.forEach((chat) => {
    const item = document.createElement("div");
    item.textContent = chat.title;
    item.onclick = () =>
      (window.location.href = `index.html?chatId=${chat.id}`);
    chatListEl.appendChild(item);
  });
}

// =============================
// 메시지 출력
// =============================
function renderMessage(text, isUser = false) {
  const msgEl = document.createElement("div");
  msgEl.className = `message ${isUser ? "user-message" : "bot-message"}`;
  msgEl.textContent = text;
  messagesEl.appendChild(msgEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// =============================
// API: 채팅 목록
// =============================
async function fetchChatList() {
  try {
    const res = await fetch("http://localhost:8080/chats/conversations", {
      headers: { Authorization: accessToken },
    });

    const result = await parseResponse(res);
    if (!result.ok) return [];

    return result.data.conversationDtos;
  } catch (err) {
    console.error("채팅 목록 조회 오류:", err);
    return [];
  }
}

// =============================
// API: 채팅 히스토리
// =============================
async function fetchChatHistory(chatId) {
  try {
    const res = await fetch(
      `http://localhost:8080/chats/conversations/${chatId}`,
      {
        headers: { Authorization: accessToken },
      }
    );

    const result = await parseResponse(res);
    if (!result.ok) return;

    const messages = result.data?.messageDtos;
    if (messages) {
      messages.forEach((m) => renderMessage(m.content, m.role === "USER"));
    }
  } catch (err) {
    console.error("채팅방 메시지 조회 오류:", err);
  }
}

// =============================
// API: 메시지 전송
// =============================
async function sendMessageToServer(prompt) {
  const isLoggedIn = !!accessToken;

  // 비로그인
  if (!isLoggedIn) {
    const res = await fetch("http://localhost:8080/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    return parseResponse(res);
  }

  // 로그인 + 신규 채팅
  if (!chatId) {
    const res = await fetch("http://localhost:8080/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({ prompt }),
    });

    const result = await parseResponse(res);

    if (result.ok && result.data?.chatId) {
      window.location.href = `index.html?chatId=${result.data.chatId}`;
    }

    return result;
  }

  // 로그인 + 기존 채팅
  const res = await fetch(`http://localhost:8080/chats/${chatId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify({ prompt }),
  });

  return parseResponse(res);
}

// =============================
// 로그아웃
// =============================
async function handleLogout() {
  try {
    await fetch("http://localhost:8080/logout", {
      method: "POST",
      headers: { Authorization: refreshToken },
    });
  } catch (err) {
    console.error("로그아웃 실패:", err);
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  location.href = "index.html";
}

// =============================
// 메시지 전송 처리
// =============================
async function handleSendMessage() {
  const prompt = chatInputEl.value.trim();
  if (!prompt) return;

  renderMessage(prompt, true);
  chatInputEl.value = "";

  const result = await sendMessageToServer(prompt);

  if (!result.ok) {
    if (result.error.redirectUri) {
      alert(result.error.errorMessage);
      window.location.href = result.error.redirectUri;
      return;
    }
    renderMessage(result.error.errorMessage, false);
    return;
  }

  if (result.data?.message) {
    renderMessage(result.data.message, false);
  }
}

// =============================
// 초기 실행
// =============================
async function init() {
  renderHeader();

  if (accessToken) {
    chatListEl.style.display = "block";

    const chats = await fetchChatList();
    if (chats) renderChatList(chats);

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
