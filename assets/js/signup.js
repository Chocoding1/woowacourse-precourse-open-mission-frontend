import { axiosInstance } from "./axiosInstance.js";

const emailEl = document.getElementById("email");
const emailCodeContainerEl = document.getElementById("email-code-container");
const emailCodeEl = document.getElementById("email-code");
const emailMsgEl = document.getElementById("email-msg");

const passwordEl = document.getElementById("password");
const nameEl = document.getElementById("name");

const sendCodeBtn = document.getElementById("send-code-btn");
const verifyCodeBtn = document.getElementById("verify-code-btn");
const signupBtn = document.getElementById("signup-btn");

const URI = {
  SEND_CODE: "/emails/send-code",
  VERIFY_CODE: "/emails/verify-code",
  SIGNUP: "/members",
};

const PATH = {
  LOGIN: "/login.html",
};

const MESSAGE = {
  EMAIL_INPUT: "이메일을 입력하세요.",
  CODE_INPUT: "인증코드를 입력하세요.",
  SEND_CODE_FAIL: "인증코드 전송 실패",
  SEND_CODE_SUCCESS: "인증코드가 전송되었습니다.",
  VERIFY_FAIL: "인증 실패",
  VERIFY_SUCCESS: "인증 완료",
  ALL_INFO_INPUT: "모든 정보를 입력하세요.",
  REQUEST_EMAIL_CERT: "이메일 인증을 완료하세요.",
  SIGNUP_FAIL: "회원가입 실패",
};

let isEmailVerified = false;

function getValue(el) {
  return el.value.trim();
}

function showAlert(message) {
  alert(message);
}

function setMessage(text, type = "") {
  emailMsgEl.textContent = text;
  emailMsgEl.className = type ? `message ${type}` : "message";
}

function show(el) {
  el.classList.remove("hidden");
}

async function requestPost(uri, data) {
  return await axiosInstance.post(uri, data);
}

async function sendAuthCode() {
  const email = getValue(emailEl);
  if (!email) return showAlert(MESSAGE.EMAIL_INPUT);

  try {
    await requestPost(URI.SEND_CODE, { email });

    show(emailCodeContainerEl);
    showAlert(MESSAGE.SEND_CODE_SUCCESS);
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.errorMessage || MESSAGE.SEND_CODE_FAIL;
    showAlert(message);
  }
}

async function verifyAuthCode() {
  const email = getValue(emailEl);
  const authCode = getValue(emailCodeEl);

  if (!authCode) return showAlert(MESSAGE.CODE_INPUT);

  try {
    await requestPost(URI.VERIFY_CODE, { email, authCode });

    isEmailVerified = true;
    setMessage(MESSAGE.VERIFY_SUCCESS, "success");
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.errorMessage || MESSAGE.VERIFY_FAIL;
    showAlert(message);
  }
}

async function signup() {
  const email = getValue(emailEl);
  const password = getValue(passwordEl);
  const name = getValue(nameEl);

  if (!email || !password || !name) return showAlert(MESSAGE.ALL_INFO_INPUT);
  if (!isEmailVerified) return showAlert(MESSAGE.REQUEST_EMAIL_CERT);

  try {
    await requestPost(URI.SIGNUP, { email, password, name });

    window.location.href = PATH.LOGIN;
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.errorMessage || MESSAGE.SIGNUP_FAIL;
    showAlert(message);
  }
}

function initEvents() {
  sendCodeBtn.addEventListener("click", sendAuthCode);
  verifyCodeBtn.addEventListener("click", verifyAuthCode);
  signupBtn.addEventListener("click", signup);
}

initEvents();
