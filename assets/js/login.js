const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

const LOGIN_URL = "http://localhost:8080/login";
const HOME_PATH = "/index.html";
const SIGNUP_PATH = "/signup.html";

const LOGIN_INFO_INPUT_MESSAGE = "이메일과 비밀번호를 입력하세요.";
const LOGIN_FAIL_MESSAGE = "로그인 실패";
const SERVER_ERROR_MESSAGE = "서버 오류가 발생했습니다.";

function redirectTo(path) {
  window.location.href = path;
}

function showAlert(message) {
  alert(message);
}

function getLoginInfo() {
  return {
    email: emailEl.value.trim(),
    passwrd: passwordEl.value.trim(),
  };
}

function saveTokens(res) {
  const access = res.headers.get("Authorization");
  const refresh = res.headers.get("Authorization-Refresh");

  if (access) localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
}

async function requestLogin(email, password) {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
}

async function login() {
  const { email, password } = getLoginInfo();
  if (!email || !password) {
    return showAlert(LOGIN_INFO_INPUT_MESSAGE);
  }

  try {
    const res = requestLogin(email, password);

    if (!res.ok) {
      const err = await res.json();
      return showAlert(err.errorMessage || LOGIN_FAIL_MESSAGE);
    }

    saveTokens(res);
    redirectTo(HOME_PATH);
  } catch (err) {
    console.error(err);
    showAlert(SERVER_ERROR_MESSAGE);
  }
}

function startLoginWhenEnter(e) {
  if (e.key == "Enter") login();
}

loginBtn.addEventListener("click", login);
signupBtn.addEventListener("click", () => redirectTo(SIGNUP_PATH));
[emailEl, passwordEl].forEach((el) =>
  el.addEventListener("keypress", startLoginWhenEnter)
);
