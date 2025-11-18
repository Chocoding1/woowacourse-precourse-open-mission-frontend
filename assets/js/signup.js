const emailEl = document.getElementById("email");
const emailCodeContainer = document.getElementById("email-code-container");
const emailCodeEl = document.getElementById("email-code");
const emailMsg = document.getElementById("email-msg");
const passwordEl = document.getElementById("password");
const nameEl = document.getElementById("name");

const sendCodeBtn = document.getElementById("send-code-btn");
const verifyCodeBtn = document.getElementById("verify-code-btn");
const signupBtn = document.getElementById("signup-btn");

const BASE_URL = "http://localhost:8080";
const SEND_CODE_URL = `${BASE_URL}/emails/send-code`;
const VERIFY_CODE_URL = `${BASE_URL}/emails/verify-code`;
const SIGNUP_URL = `${BASE_URL}/members`;

const LOGIN_PATH = "/login.html";

const EMAIL_INPUT_MESSAGE = "이메일을 입력하세요.";
const CODE_INPUT_MESSAGE = "인증코드를 입력하세요.";
const SEND_CODE_FAIL_MESSAGE = "인증코드 전송 실패";
const SEND_CODE_SUCCESS_MESSAGE = "인증코드가 전송되었습니다.";
const SERVER_ERROR_MESSAGE = "서버 오류가 발생했습니다.";
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

async function postRequest(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

async function sendAuthCode() {
  const email = emailEl.value.trim();
  if (!email) return showAlert(EMAIL_INPUT_MESSAGE);

  try {
    const res = await postRequest(SEND_CODE_URL, { email });

    if (!res.ok) {
      const err = await res.json();
      return setMessage(err.errorMessage || SEND_CODE_FAIL_MESSAGE);
    }

    emailCodeContainer.classList.remove("hidden");
    showAlert(SEND_CODE_SUCCESS_MESSAGE);
  } catch (err) {
    console.error(err);
    showAlert(SERVER_ERROR_MESSAGE);
  }
}

async function verifyAuthCode() {
  const email = emailEl.value.trim();
  const authCode = emailCodeEl.value.trim();

  if (!authCode) return showAlert(CODE_INPUT_MESSAGE);

  try {
    const res = await postRequest(VERIFY_CODE_URL, { email, authCode });

    if (!res.ok) {
      const err = await res.json();
      return setMessage(err.errorMessage || VERIFY_FAIL_MESSAGE);
    }

    emailVerified = true;
    setMessage(VERIFY_SUCCESS_MESSAGE, "success");
  } catch (err) {
    console.error(err);
    showAlert(SERVER_ERROR_MESSAGE);
  }
}

async function signup() {
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();
  const name = nameEl.value.trim();

  if (!email || !password || !name) return showAlert(ALL_INFO_INPUT_MESSAGE);
  if (!emailVerified) return showAlert(REQUEST_EMAIL_CERT_MESSAGE);

  try {
    const res = await postRequest(SIGNUP_URL, { email, password, name });

    if (!res.ok) {
      const err = await res.json();
      return showAlert(err.errorMessage || SIGNUP_FAIL_MESSAGE);
    }

    window.location.href = LOGIN_PATH;
  } catch (err) {
    console.error(err);
    showAlert(SERVER_ERROR_MESSAGE);
  }
}

sendCodeBtn.addEventListener("click", sendAuthCode);
verifyCodeBtn.addEventListener("click", verifyAuthCode);
signupBtn.addEventListener("click", signup);
