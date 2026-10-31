export function initNavigation() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.textContent = isOpen ? "Menu" : "Close";
    nav.classList.toggle("is-open", !isOpen);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      button.setAttribute("aria-expanded", "false");
      button.textContent = "Menu";
      nav.classList.remove("is-open");
    }
  });
}