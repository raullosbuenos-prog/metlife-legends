/* Add the deployed Google Apps Script Web App URL in FORM_ENDPOINT before launch. */
const FORM_ENDPOINT = "";
const statusText = {
  ready: "Recebemos seu contato. A Equipe Legends falará com você em breve.",
  error: "Não foi possível enviar agora. Tente novamente mais tarde."
};

document.querySelectorAll(".lead-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!FORM_ENDPOINT) {
      event.preventDefault();
      form.querySelector(".form-status").textContent =
        "O formulário está em preparação. Entre em contato com a Equipe Legends pelo canal em que recebeu este link.";
      return;
    }

    const status = form.querySelector(".form-status");
    const button = form.querySelector("button[type=submit]");
    status.textContent = "Enviando…";
    button.disabled = true;
    button.style.opacity = ".65";
    form.action = FORM_ENDPOINT;
    form.method = "POST";
    form.target = "submitFrame";

    const handleMessage = (event) => {
      if (!event.data || event.data.type !== "legends-lead") return;
      window.removeEventListener("message", handleMessage);
      status.textContent = event.data.ok ? statusText.ready : statusText.error;
      button.disabled = false;
      button.style.opacity = "1";
      if (event.data.ok) form.reset();
    };
    window.addEventListener("message", handleMessage);
  });
});
