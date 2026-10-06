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

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const siteNav = document.querySelector("#site-nav");
  const closeMenu = () => {
    if (!menuToggle || !siteNav) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "メニューを開く");
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const willOpen = !siteNav.classList.contains("is-open");
      siteNav.classList.toggle("is-open", willOpen);
      menuToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      menuToggle.setAttribute("aria-label", willOpen ? "メニューを閉じる" : "メニューを開く");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const toTop = document.querySelector("[data-to-top]");
  if (toTop) {
    const toggleToTop = () => {
      const show = window.scrollY > 420;
      toTop.hidden = !show;
    };

    window.addEventListener("scroll", toggleToTop, { passive: true });
    toggleToTop();

    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
