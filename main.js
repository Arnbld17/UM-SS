document.addEventListener("DOMContentLoaded", () => {
  const faqRoot = document.querySelector("[data-faq]");
  if (faqRoot) {
    faqRoot.querySelectorAll(".faq-item").forEach((item) => {
      const button = item.querySelector(".faq-question");
      const chevron = item.querySelector(".faq-chevron");
      if (!button) return;

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        faqRoot.querySelectorAll(".faq-item").forEach((other) => {
          other.classList.remove("is-open");
          const otherBtn = other.querySelector(".faq-question");
          const otherChevron = other.querySelector(".faq-chevron");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          if (otherChevron) otherChevron.src = "./assets/chevron-down.svg";
        });

        if (!isOpen) {
          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
          if (chevron) chevron.src = "./assets/chevron-up.svg";
        }
      });
    });
  }

  const phone = document.querySelector("#phone");
  const phoneCount = document.querySelector("[data-phone-count]");
  if (phone && phoneCount) {
    const updateCount = () => {
      phoneCount.textContent = `Current number of characters ${phone.value.length}`;
    };
    phone.addEventListener("input", updateCount);
    updateCount();
  }

  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("お問い合わせ内容を受け付けました。（デモ実装）");
      form.reset();
      if (phoneCount) phoneCount.textContent = "Current number of characters 0";
    });
  }
});
