const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");

async function login() {
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();

  if (!email || !password) {
    return alert("이메일과 비밀번호를 입력하세요.");
  }

  try {
    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      return alert(err.errorMessage || "로그인 실패");
    }

    const access = res.headers.get("Authorization");
    const refresh = res.headers.get("Authorization-Refresh");
    if (access) localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);

    window.location.href = "/index.html";
  } catch (err) {
    console.error(err);
    alert("서버 오류가 발생했습니다.");
  }
}

document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("signup-btn").addEventListener("click", () => {
  window.location.href = "/signup.html";
});

// Enter 키 이벤트
[emailEl, passwordEl].forEach((el) =>
  el.addEventListener("keypress", (e) => {
    if (e.key === "Enter") login();
  })
);
