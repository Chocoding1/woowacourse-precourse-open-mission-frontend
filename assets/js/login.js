import { axiosInstance } from "./axiosInstance.js";

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

const LOGIN_URI = "/login";

const PATH = {
  HOME: "/index.html",
  SIGNUP: "/signup.html",
};

const MESSAGE = {
  LOGIN_INFO_INPUT: "이메일과 비밀번호를 입력하세요.",
  LOGIN_FAIL: "로그인 실패",
};

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

function validateLoginInfo({ email, password }) {
  if (!email || !password) {
    showAlert(MESSAGE.LOGIN_INFO_INPUT);
    return false;
  }
  return true;
}

function saveTokens(res) {
  const accessToken = res.headers["authorization"]?.replace("Bearer ", "");
  const refreshToken = res.headers["authorization-refresh"];

  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

async function requestLogin({ email, password }) {
  return axiosInstance.post(LOGIN_URI, { email, password });
}

async function login() {
  const { email, password } = getLoginInfo();

  if (!validateLoginInfo({ email, password })) {
    return;
  }

  try {
    const res = await requestLogin({ email, password });

    saveTokens(res);
    redirectTo(PATH.HOME);
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.errorMessage || MESSAGE.LOGIN_FAIL;
    showAlert(message);
  }
}

function startLoginWhenEnter(e) {
  if (e.key === "Enter") login();
}

function initEvents() {
  loginBtn.addEventListener("click", login);
  signupBtn.addEventListener("click", () => redirectTo(PATH.SIGNUP));
  [emailEl, passwordEl].forEach((el) =>
    el.addEventListener("keypress", startLoginWhenEnter)
  );
}

initEvents();
