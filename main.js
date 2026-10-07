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
  let scrollAnimId = 0;

  const closeMenu = () => {
    if (!menuToggle || !siteNav) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "メニューを開く");
  };

  const stopScrollAnim = () => {
    if (scrollAnimId) {
      cancelAnimationFrame(scrollAnimId);
      scrollAnimId = 0;
    }
  };

  const scrollToY = (targetY) => {
    stopScrollAnim();

    const endY = Math.max(0, targetY);
    const startY = window.scrollY || window.pageYOffset;
    const delta = endY - startY;

    if (Math.abs(delta) < 2) {
      window.scrollTo(0, endY);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      window.scrollTo(0, endY);
      return;
    }

    // Calm ease — cancel previous jump so clicks never fight up/down.
    const duration = Math.min(750, Math.max(450, Math.abs(delta) * 0.45));
    const started = performance.now();
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      window.scrollTo(0, startY + delta * easeInOutCubic(progress));
      if (progress < 1) {
        scrollAnimId = requestAnimationFrame(tick);
      } else {
        scrollAnimId = 0;
        window.scrollTo(0, endY);
      }
    };

    scrollAnimId = requestAnimationFrame(tick);
  };

  const getScrollOffset = () =>
    window.matchMedia("(max-width: 1200px)").matches ? 8 : 16;

  const scrollToId = (id) => {
    const target = document.getElementById(id);
    if (!target) return false;

    const top =
      target.getBoundingClientRect().top +
      (window.scrollY || window.pageYOffset) -
      getScrollOffset();

    scrollToY(top);
    return true;
  };

  const handleAnchorClick = (event) => {
    const link = event.currentTarget;
    const href = link.getAttribute("href");
    if (!href || href.charAt(0) !== "#" || href.length < 2) return;

    const id = decodeURIComponent(href.slice(1));
    if (!document.getElementById(id)) return;

    event.preventDefault();
    event.stopPropagation();

    closeMenu();
    stopScrollAnim();

    // Let the mobile menu finish closing, then measure and jump once.
    window.setTimeout(() => {
      scrollToId(id);
      if (history.pushState) {
        history.pushState(null, "", href);
      }
    }, 100);
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const willOpen = !siteNav.classList.contains("is-open");
      siteNav.classList.toggle("is-open", willOpen);
      menuToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      menuToggle.setAttribute("aria-label", willOpen ? "メニューを閉じる" : "メニューを開く");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", handleAnchorClick);
  });

  const toTop = document.querySelector("[data-to-top]");
  if (toTop) {
    const toggleToTop = () => {
      toTop.hidden = window.scrollY <= 420;
    };

    window.addEventListener("scroll", toggleToTop, { passive: true });
    toggleToTop();

    toTop.addEventListener("click", () => {
      closeMenu();
      scrollToY(0);
    });
  }
});
