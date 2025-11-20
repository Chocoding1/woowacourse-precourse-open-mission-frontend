import { getValue, showAlert, setMessage, show, redirectTo } from "./utils.js";
import { sendEmailCodeApi, verifyEmailCodeApi, signupApi } from "./api.js";

const DOM = {
  email: document.getElementById("email"),
  authCodeContainer: document.getElementById("auth-code-container"),
  authCode: document.getElementById("auth-code"),
  authMsg: document.getElementById("auth-msg"),

  password: document.getElementById("password"),
  name: document.getElementById("name"),

  sendCodeBtn: document.getElementById("send-code-btn"),
  verifyCodeBtn: document.getElementById("verify-code-btn"),
  signupBtn: document.getElementById("signup-btn"),
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

async function handleSendAuthCode() {
  const email = getValue(DOM.email);
  if (!email) return showAlert(MESSAGE.EMAIL_INPUT);

  try {
    await sendEmailCodeApi({ email });
    show(DOM.authCodeContainer);
    showAlert(MESSAGE.SEND_CODE_SUCCESS);
  } catch (err) {
    console.error(err);
    showAlert(err.errorMessage);
  }
}

async function handleVerifyAuthCode() {
  const email = getValue(DOM.email);
  const authCode = getValue(DOM.authCode);

  if (!authCode) return showAlert(MESSAGE.CODE_INPUT);

  try {
    await verifyEmailCodeApi({ email, authCode });

    isEmailVerified = true;
    setMessage(DOM.authMsg, MESSAGE.VERIFY_SUCCESS, "success");
  } catch (err) {
    console.error(err);
    showAlert(err.errorMessage);
  }
}

async function handleSignup() {
  const email = getValue(DOM.email);
  const password = getValue(DOM.password);
  const name = getValue(DOM.name);

  if (!email || !password || !name) return showAlert(MESSAGE.ALL_INFO_INPUT);
  if (!isEmailVerified) return showAlert(MESSAGE.REQUEST_EMAIL_CERT);

  try {
    await signupApi({ email, password, name });
    redirectTo(PATH.LOGIN);
  } catch (err) {
    console.error(err);
    showAlert(err.errorMessage);
  }
}

function initEvents() {
  DOM.sendCodeBtn.addEventListener("click", handleSendAuthCode);
  DOM.verifyCodeBtn.addEventListener("click", handleVerifyAuthCode);
  DOM.signupBtn.addEventListener("click", handleSignup);
}

initEvents();
