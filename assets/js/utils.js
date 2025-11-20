export function getValue(el) {
  return el.value.trim();
}

export function showAlert(message) {
  alert(message);
}

export function redirectTo(path) {
  window.location.href = path;
}

export function createElement(tag, text = "", onClick = null) {
  const el = document.createElement(tag);
  el.textContent = text;
  if (onClick) el.onclick = onClick;
  return el;
}

export function setMessage(el, text, type = "") {
  el.textContent = text;
  el.className = type ? `message ${type}` : "message";
}

export function show(el) {
  el.classList.remove("hidden");
}
