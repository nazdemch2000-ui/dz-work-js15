// Обробка подій форми реєстрації:
// focus — підсвічування активного поля,
// blur — перевірка введених даних,
// input — відображення поточного стану заповнення,
// submit — перевірка всієї форми.

const form = document.getElementById("registerForm");
const statusElement = document.getElementById("formStatus");
const messageElement = document.getElementById("formMessage");

const fieldNames = ["name", "email", "password", "confirmPassword"];
const touchedFields = new Set();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const nameMinLength = 2;
const passwordMinLength = 6;

function validateField(name) {
  const value = form.elements[name].value;

  if (name === "name") {
    if (!value.trim()) return "Введіть ім'я";
    if (value.trim().length < nameMinLength) return "Ім'я занадто коротке";
    return "";
  }

  if (name === "email") {
    if (!value.trim()) return "Введіть email";
    if (!emailPattern.test(value.trim())) return "Некоректний email";
    return "";
  }

  if (name === "password") {
    if (!value) return "Введіть пароль";
    if (value.length < passwordMinLength) return "Пароль занадто короткий";
    return "";
  }

  if (!value) return "Підтвердіть пароль";
  if (value !== form.elements.password.value) return "Паролі не збігаються";
  return "";
}

function showError(name, text) {
  const field = form.elements[name];
  const errorElement = document.getElementById("error-" + name);

  field.classList.toggle("invalid", text !== "");
  errorElement.textContent = text;
  errorElement.classList.toggle("visible", text !== "");
}

function updateStatus() {
  const filled = fieldNames.filter(
    (name) => form.elements[name].value.trim() !== "",
  ).length;
  const isComplete = filled === fieldNames.length;

  statusElement.textContent = `Заповнено ${filled} з ${fieldNames.length} полів`;
  statusElement.classList.toggle("complete", isComplete);
}

function showMessage(text, type) {
  messageElement.textContent = text;
  messageElement.className = `form-message visible ${type}`;
}

function refreshField(name) {
  const hasError = form.elements[name].classList.contains("invalid");

  if (touchedFields.has(name) || hasError) {
    showError(name, validateField(name));
  }
}

fieldNames.forEach((name) => {
  const field = form.elements[name];

  field.addEventListener("focus", () => {
    field.classList.add("focused");
    messageElement.className = "form-message";
  });

  field.addEventListener("blur", () => {
    field.classList.remove("focused");
    touchedFields.add(name);
    showError(name, validateField(name));
    updateStatus();
  });

  field.addEventListener("input", () => {
    refreshField(name);
    if (name === "password") refreshField("confirmPassword");
    updateStatus();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let errorCount = 0;
  let firstInvalid = "";

  fieldNames.forEach((name) => {
    const error = validateField(name);

    touchedFields.add(name);
    showError(name, error);

    if (error) {
      errorCount += 1;
      if (!firstInvalid) firstInvalid = name;
    }
  });

  updateStatus();

  if (firstInvalid) {
    form.elements[firstInvalid].focus();
    showMessage(`Форму не надіслано: помилок — ${errorCount}`, "error");
    return;
  }

  showMessage("Реєстрація успішна! Усі дані введено коректно.", "success");
  form.reset();
  touchedFields.clear();
  fieldNames.forEach((name) => showError(name, ""));
  updateStatus();
});

updateStatus();
