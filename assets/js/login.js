import { getValue, showAlert, redirectTo } from "./utils.js";
import { loginApi } from "./api.js";

const DOM = {
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  loginBtn: document.getElementById("login-btn"),
  signupBtn: document.getElementById("signup-btn"),
};

const PATH = {
  HOME: "/html/index.html",
  SIGNUP: "/html/signup.html",
};

const MESSAGE = {
  LOGIN_INFO_INPUT: "이메일과 비밀번호를 입력하세요.",
};

function saveTokens(res) {
  const accessToken = res.headers["authorization"]?.replace("Bearer ", "");
  const refreshToken = res.headers["authorization-refresh"];

  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

async function handelLogin() {
  const email = getValue(DOM.email);
  const password = getValue(DOM.password);

  if (!email || !password) {
    return showAlert(MESSAGE.LOGIN_INFO_INPUT);
  }

  try {
    const res = await loginApi({ email, password });
    saveTokens(res);
    redirectTo(PATH.HOME);
  } catch (err) {
    console.error(err);
    showAlert(err.errorMessage);
  }
}

function startLoginWhenEnter(e) {
  if (e.key === "Enter") handelLogin();
}

function initEvents() {
  DOM.loginBtn.addEventListener("click", handelLogin);
  DOM.signupBtn.addEventListener("click", () => redirectTo(PATH.SIGNUP));
  [DOM.email, DOM.password].forEach((el) =>
    el.addEventListener("keypress", startLoginWhenEnter)
  );
}

initEvents();
