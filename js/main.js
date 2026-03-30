const body = document.body;
const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const contactForm = document.querySelector("[data-contact-form]");
const contactModal = document.querySelector("[data-contact-modal]");
const contactModalCloseButtons = document.querySelectorAll("[data-contact-modal-close]");
const revealItems = document.querySelectorAll("[data-reveal]");
const parallaxSections = document.querySelectorAll("[data-parallax-section]");

const setMenuState = (open) => {
  if (!menu || !menuToggle) return;
  menu.classList.toggle("is-open", open);
  body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
};

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!menu.classList.contains("is-open"));
  });

  menuCloseButtons.forEach((button) => {
    button.addEventListener("click", () => setMenuState(false));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
}

const setContactModalState = (open) => {
  if (!contactModal) return;
  contactModal.classList.toggle("is-open", open);
  contactModal.setAttribute("aria-hidden", String(!open));
};

if (contactForm && contactModal) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setContactModalState(true);
    contactForm.reset();
  });

  contactModalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => setContactModalState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setContactModalState(false);
  });
}

if (header) {
  const syncHeader = () => {
    header.classList.toggle("is-condensed", window.scrollY > 24);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

if (window.AOS) {
  revealItems.forEach((item, index) => {
    item.setAttribute("data-aos", "fade-up");
    item.setAttribute("data-aos-duration", "900");
    item.setAttribute("data-aos-delay", String(Math.min(index * 40, 180)));
    item.setAttribute("data-aos-easing", "ease-out-cubic");
    item.classList.add("is-visible");
  });

  window.AOS.init({
    once: true,
    offset: 80,
    duration: 900,
    easing: "ease-out-cubic"
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (
  parallaxSections.length &&
  window.gsap &&
  window.ScrollTrigger &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  window.innerWidth > 720
) {
  window.gsap.registerPlugin(window.ScrollTrigger);

  parallaxSections.forEach((section) => {
    const bg = section.querySelector("[data-parallax-bg]");
    if (!bg) return;

    window.gsap.set(bg, {
      y: -90,
      scale: 1.14,
      force3D: true
    });

    window.gsap.to(bg, {
      y: 90,
      scale: 1.14,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1,
          invalidateOnRefresh: true
        }
      });
  });

  window.addEventListener("load", () => window.ScrollTrigger.refresh());
}

const faqDetails = document.querySelectorAll(".faq-list details");

if (faqDetails.length) {
  faqDetails.forEach((detail) => {
    const summary = detail.querySelector("summary");
    if (!summary) return;

    let answer = detail.querySelector(".faq-answer");

    if (!answer) {
      answer = document.createElement("div");
      answer.className = "faq-answer";

      const inner = document.createElement("div");
      inner.className = "faq-answer__inner";

      Array.from(detail.children).forEach((child) => {
        if (child !== summary) {
          inner.appendChild(child);
        }
      });

      answer.appendChild(inner);
      detail.appendChild(answer);
    }

    if (detail.open) {
      answer.style.height = `${answer.scrollHeight}px`;
    }

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      const isOpen = detail.open;

      if (isOpen) {
        answer.style.height = `${answer.scrollHeight}px`;

        requestAnimationFrame(() => {
          answer.style.height = "0px";
        });

        const closeDetail = () => {
          detail.open = false;
          answer.removeEventListener("transitionend", closeDetail);
        };

        answer.addEventListener("transitionend", closeDetail);
        return;
      }

      detail.open = true;
      answer.style.height = "0px";

      requestAnimationFrame(() => {
        answer.style.height = `${answer.scrollHeight}px`;
      });
    });
  });
}
