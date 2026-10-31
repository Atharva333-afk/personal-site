const STORAGE_KEY = "atharva-site-guestbook-v1";
export function initGuestbook() {
  const form = document.querySelector("[data-guestbook]");
  const host = document.querySelector("[data-guestbook-entries]");
  if (!form || !host) return;
  const readEntries = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
  };
  const render = () => {
    host.replaceChildren();
    readEntries().slice().reverse().forEach((entry) => {
      const card = document.createElement("article");
      card.className = "guestbook-entry";
      const name = document.createElement("strong");
      name.textContent = entry.name;
      const message = document.createElement("p");
      message.textContent = entry.message;
      const date = document.createElement("time");
      date.textContent = new Date(entry.date).toLocaleDateString();
      card.append(name, message, date);
      host.append(card);
    });
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const entry = {
      name: String(data.get("name") || "").trim(),
      message: String(data.get("message") || "").trim(),
      date: new Date().toISOString()
    };
    if (!entry.name || !entry.message) return;
    const entries = readEntries();
    entries.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-40)));
    form.reset();
    render();
  });
  render();
}