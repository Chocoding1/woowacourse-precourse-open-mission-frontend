import { axiosInstance } from "./axiosInstance.js";

const emailEl = document.getElementById("email");
const emailCodeContainer = document.getElementById("email-code-container");
const emailCodeEl = document.getElementById("email-code");
const emailMsg = document.getElementById("email-msg");
const passwordEl = document.getElementById("password");
const nameEl = document.getElementById("name");

const sendCodeBtn = document.getElementById("send-code-btn");
const verifyCodeBtn = document.getElementById("verify-code-btn");
const signupBtn = document.getElementById("signup-btn");

const SEND_CODE_URI = "/emails/send-code";
const VERIFY_CODE_URI = "/emails/verify-code";
const SIGNUP_URI = "/members";

const LOGIN_PATH = "/login.html";

const EMAIL_INPUT_MESSAGE = "이메일을 입력하세요.";
const CODE_INPUT_MESSAGE = "인증코드를 입력하세요.";
const SEND_CODE_FAIL_MESSAGE = "인증코드 전송 실패";
const SEND_CODE_SUCCESS_MESSAGE = "인증코드가 전송되었습니다.";
const VERIFY_FAIL_MESSAGE = "인증 실패";
const VERIFY_SUCCESS_MESSAGE = "인증 완료";
const ALL_INFO_INPUT_MESSAGE = "모든 정보를 입력하세요.";
const REQUEST_EMAIL_CERT_MESSAGE = "이메일 인증을 완료하세요.";
const SIGNUP_FAIL_MESSAGE = "회원가입 실패";

let emailVerified = false;

function showAlert(message) {
  alert(message);
}

function setMessage(text, type = "") {
  emailMsg.textContent = text;
  emailMsg.className = type ? `message ${type}` : "message";
}

async function sendAuthCode() {
  const email = emailEl.value.trim();
  if (!email) return showAlert(EMAIL_INPUT_MESSAGE);

  try {
    const res = await axiosInstance.post(SEND_CODE_URI, { email });

    emailCodeContainer.classList.remove("hidden");
    showAlert(SEND_CODE_SUCCESS_MESSAGE);
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.errorMessage || SEND_CODE_FAIL_MESSAGE;
    showAlert(message);
  }
}

async function verifyAuthCode() {
  const email = emailEl.value.trim();
  const authCode = emailCodeEl.value.trim();

  if (!authCode) return showAlert(CODE_INPUT_MESSAGE);

  try {
    const res = await axiosInstance.post(VERIFY_CODE_URI, { email, authCode });

    emailVerified = true;
    setMessage(VERIFY_SUCCESS_MESSAGE, "success");
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.errorMessage || VERIFY_FAIL_MESSAGE;
    showAlert(message);
  }
}

async function signup() {
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();
  const name = nameEl.value.trim();

  if (!email || !password || !name) return showAlert(ALL_INFO_INPUT_MESSAGE);
  if (!emailVerified) return showAlert(REQUEST_EMAIL_CERT_MESSAGE);

  try {
    const res = await axiosInstance.post(SIGNUP_URI, { email, password, name });

    window.location.href = LOGIN_PATH;
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.errorMessage || SIGNUP_FAIL_MESSAGE;
    showAlert(message);
  }
}

sendCodeBtn.addEventListener("click", sendAuthCode);
verifyCodeBtn.addEventListener("click", verifyAuthCode);
signupBtn.addEventListener("click", signup);
