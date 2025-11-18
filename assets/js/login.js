import { axiosInstance } from "./axiosInstance.js";

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

const LOGIN_URI = "/login";

const HOME_PATH = "/index.html";
const SIGNUP_PATH = "/signup.html";

const LOGIN_INFO_INPUT_MESSAGE = "이메일과 비밀번호를 입력하세요.";
const LOGIN_FAIL_MESSAGE = "로그인 실패";

function redirectTo(path) {
  window.location.href = path;
}

function showAlert(message) {
  alert(message);
}

function getLoginInfo() {
  return {
    email: emailEl.value.trim(),
    password: passwordEl.value.trim(),
  };
}

function saveTokens(res) {
  const accessToken = res.headers["authorization"]?.replace("Bearer ", "");
  const refreshToken = res.headers["authorization-refresh"];

  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

async function requestLogin(email, password) {
  console.log("requestLogin 실행", email, password);
  return axiosInstance.post(LOGIN_URI, { email, password });
}

async function login() {
  console.log("login 함수 호출됨");
  const { email, password } = getLoginInfo();
  if (!email || !password) {
    return showAlert(LOGIN_INFO_INPUT_MESSAGE);
  }

  try {
    const res = await requestLogin(email, password);

    saveTokens(res);
    redirectTo(HOME_PATH);
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.errorMessage || LOGIN_FAIL_MESSAGE;
    showAlert(message);
  }
}

function startLoginWhenEnter(e) {
  if (e.key === "Enter") login();
}

loginBtn.addEventListener("click", login);
signupBtn.addEventListener("click", () => redirectTo(SIGNUP_PATH));
[emailEl, passwordEl].forEach((el) =>
  el.addEventListener("keypress", startLoginWhenEnter)
);
