const emailEl = document.getElementById("email");
const emailCodeContainer = document.getElementById("email-code-container");
const emailCodeEl = document.getElementById("email-code");
const emailMsg = document.getElementById("email-msg");
const passwordEl = document.getElementById("password");
const nameEl = document.getElementById("name");

let emailVerified = false;

// 이메일 인증 코드 전송
document.getElementById("send-code-btn").addEventListener("click", async () => {
  const email = emailEl.value.trim();
  if (!email) return alert("이메일을 입력하세요.");

  try {
    const res = await fetch("http://localhost:8080/emails/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const err = await res.json();
      emailMsg.textContent = err.errorMessage || "인증코드 전송 실패";
      emailMsg.className = "message";
      return;
    }

    emailCodeContainer.classList.remove("hidden");
    alert("인증코드가 전송되었습니다.");
  } catch (err) {
    console.error(err);
    alert("서버 오류가 발생했습니다.");
  }
});

// 인증 코드 확인
document
  .getElementById("verify-code-btn")
  .addEventListener("click", async () => {
    const email = emailEl.value.trim();
    const authCode = emailCodeEl.value.trim();
    if (!authCode) return alert("인증코드를 입력하세요.");

    try {
      const res = await fetch("http://localhost:8080/emails/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, authCode }),
      });

      if (!res.ok) {
        const err = await res.json();
        emailMsg.textContent = err.errorMessage || "인증 실패";
        emailMsg.className = "message";
        return;
      }

      emailVerified = true;
      emailMsg.textContent = "인증 완료";
      emailMsg.className = "message success";
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  });

// 회원가입 처리
document.getElementById("signup-btn").addEventListener("click", async () => {
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();
  const name = nameEl.value.trim();

  if (!email || !password || !name) return alert("모든 정보를 입력하세요.");
  if (!emailVerified) return alert("이메일 인증을 완료하세요.");

  try {
    const res = await fetch("http://localhost:8080/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const err = await res.json();
      return alert(err.errorMessage || "회원가입 실패");
    }

    window.location.href = "/login.html";
  } catch (err) {
    console.error(err);
    alert("서버 오류가 발생했습니다.");
  }
});
