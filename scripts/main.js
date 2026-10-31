import { initNavigation } from "./features/navigation.js";
import { initGuestbook } from "./features/guestbook.js";

initNavigation();
initGuestbook();
document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const activityHost = document.querySelector("[data-activities]");
if (activityHost) {
  fetch("../../data/activities.json")
    .then((response) => response.ok ? response.json() : [])
    .then((items) => {
      if (!items.length) return;
      activityHost.replaceChildren(...items.map((item) => {
        const article = document.createElement("article");
        article.className = "activity-item";
        const date = document.createElement("span");
        date.className = "activity-date";
        date.textContent = item.date || "";
        const copy = document.createElement("div");
        const title = document.createElement("h2");
        title.textContent = item.title;
        const description = document.createElement("p");
        description.textContent = item.description || "";
        copy.append(title, description);
        article.append(date, copy);
        return article;
      }));
    })
    .catch(() => {});
}