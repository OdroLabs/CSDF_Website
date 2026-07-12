const siteHeader = document.getElementById("site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.getElementById("site-nav");
const backToTopButton = document.getElementById("back-to-top");
const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");
const contrastToggle = document.getElementById("contrast-toggle");
const fontScaleButtons = document.querySelectorAll("[data-font-scale]");
const counters = document.querySelectorAll(".counter");
const testimonials = document.querySelectorAll(".testimonial");
const sliderButtons = document.querySelectorAll("[data-slide]");

let testimonialIndex = 0;
let currentFontScale = 1;

const setHeaderState = () => {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("scrolled", window.scrollY > 24);
};

const toggleMenu = () => {
  if (!menuToggle || !siteNav) {
    return;
  }

  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
};

const closeMenuOnNavigate = () => {
  if (!siteNav || !menuToggle) {
    return;
  }

  siteNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

const animateCounters = () => {
  if (!counters.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, watch) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const counter = entry.target;
        const target = Number(counter.dataset.target || 0);
        const suffix = counter.dataset.suffix || "+";
        let value = 0;
        const step = Math.max(1, Math.ceil(target / 60));

        const tick = () => {
          value = Math.min(target, value + step);
          counter.textContent = `${value}${suffix}`;

          if (value < target) {
            window.requestAnimationFrame(tick);
          }
        };

        tick();
        watch.unobserve(counter);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((counter) => observer.observe(counter));
};

const renderTestimonial = () => {
  testimonials.forEach((testimonial, index) => {
    testimonial.classList.toggle("active", index === testimonialIndex);
  });
};

const moveTestimonial = (direction) => {
  if (!testimonials.length) {
    return;
  }

  testimonialIndex =
    direction === "next"
      ? (testimonialIndex + 1) % testimonials.length
      : (testimonialIndex - 1 + testimonials.length) % testimonials.length;

  renderTestimonial();
};

const setupSlider = () => {
  if (!testimonials.length) {
    return;
  }

  renderTestimonial();
  sliderButtons.forEach((button) => {
    button.addEventListener("click", () => moveTestimonial(button.dataset.slide));
  });

  window.setInterval(() => moveTestimonial("next"), 6000);
};

const setupAccessibility = () => {
  if (contrastToggle) {
    contrastToggle.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast");
    });
  }

  fontScaleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.fontScale;

      if (action === "up") {
        currentFontScale = Math.min(1.2, currentFontScale + 0.05);
      }

      if (action === "down") {
        currentFontScale = Math.max(0.9, currentFontScale - 0.05);
      }

      if (action === "reset") {
        currentFontScale = 1;
      }

      document.documentElement.style.setProperty("--base-size", `${16 * currentFontScale}px`);
    });
  });
};

const setupNewsletter = () => {
  if (!newsletterForm || !newsletterMessage) {
    return;
  }

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    newsletterMessage.textContent = "Thanks for subscribing. CSDF updates will reach your inbox soon.";
    newsletterForm.reset();
  });
};

const setupBackToTop = () => {
  if (!backToTopButton) {
    return;
  }

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

const setupShop = () => {
  const shopGrid = document.querySelector(".shop-grid");

  if (!shopGrid) {
    return;
  }

  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const cartItemsEl = document.getElementById("cart-items");
  const cartEmptyEl = document.getElementById("cart-empty");
  const cartDrawer = document.getElementById("cart-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const cartToggle = document.getElementById("cart-toggle");
  const cartClose = document.getElementById("cart-close");
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutMessage = document.getElementById("checkout-message");
  const filterChips = document.querySelectorAll(".shop-filters .chip");

  const modal = document.getElementById("product-modal");
  const modalMedia = document.getElementById("modal-media");
  const modalTag = document.getElementById("modal-tag");
  const modalName = document.getElementById("modal-name");
  const modalDesc = document.getElementById("modal-desc");
  const modalPrice = document.getElementById("modal-price");
  const modalAdd = document.getElementById("modal-add");
  const modalClose = document.getElementById("modal-close");

  const cart = new Map();
  let activeProduct = null;

  const formatPrice = (value) => `$${value}`;

  const renderCart = () => {
    let count = 0;
    let total = 0;
    cartItemsEl.innerHTML = "";

    cart.forEach((item, name) => {
      count += item.qty;
      total += item.qty * item.price;

      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <div class="cart-row-img" style="background-image:url('${item.img}')"></div>
        <div class="cart-row-info">
          <strong>${name}</strong>
          <span>${formatPrice(item.price)} each</span>
        </div>
        <div class="cart-qty">
          <button type="button" data-action="dec" aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button type="button" data-action="inc" aria-label="Increase">+</button>
        </div>`;

      row.querySelector('[data-action="inc"]').addEventListener("click", () => {
        item.qty += 1;
        renderCart();
      });
      row.querySelector('[data-action="dec"]').addEventListener("click", () => {
        item.qty -= 1;
        if (item.qty <= 0) {
          cart.delete(name);
        }
        renderCart();
      });

      cartItemsEl.appendChild(row);
    });

    if (cartCount) {
      cartCount.textContent = String(count);
      cartCount.classList.toggle("has-items", count > 0);
    }
    if (cartTotal) {
      cartTotal.textContent = formatPrice(total);
    }
    if (cartEmptyEl) {
      cartEmptyEl.style.display = count === 0 ? "block" : "none";
    }
    if (checkoutMessage) {
      checkoutMessage.textContent = "";
    }
  };

  const addToCart = (name, price, img) => {
    if (cart.has(name)) {
      cart.get(name).qty += 1;
    } else {
      cart.set(name, { price, img, qty: 1 });
    }
    renderCart();
  };

  const openDrawer = () => {
    cartDrawer?.classList.add("open");
    cartDrawer?.setAttribute("aria-hidden", "false");
    if (drawerOverlay) {
      drawerOverlay.hidden = false;
    }
  };

  const closeDrawer = () => {
    cartDrawer?.classList.remove("open");
    cartDrawer?.setAttribute("aria-hidden", "true");
    if (drawerOverlay) {
      drawerOverlay.hidden = true;
    }
  };

  const openModal = (card) => {
    activeProduct = {
      name: card.dataset.name,
      price: Number(card.dataset.price || 0),
      img: card.dataset.img,
    };
    modalMedia.style.backgroundImage = `url('${card.dataset.img}')`;
    modalTag.textContent = card.dataset.tag || "";
    modalName.textContent = card.dataset.name || "";
    modalDesc.textContent = card.dataset.desc || "";
    modalPrice.textContent = formatPrice(activeProduct.price);
    modal.hidden = false;
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll(".shop-card").forEach((card) => {
    const addBtn = card.querySelector(".btn-cart");
    const name = card.dataset.name;
    const price = Number(card.dataset.price || 0);
    const img = card.dataset.img;

    addBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(name, price, img);
      addBtn.textContent = "Added ✓";
      openDrawer();
      window.setTimeout(() => {
        addBtn.textContent = "Add to Cart";
      }, 1000);
    });

    card.addEventListener("click", () => openModal(card));
  });

  modalAdd?.addEventListener("click", () => {
    if (activeProduct) {
      addToCart(activeProduct.name, activeProduct.price, activeProduct.img);
      closeModal();
      openDrawer();
    }
  });

  cartToggle?.addEventListener("click", openDrawer);
  cartClose?.addEventListener("click", closeDrawer);
  drawerOverlay?.addEventListener("click", closeDrawer);
  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closeDrawer();
    }
  });

  checkoutBtn?.addEventListener("click", () => {
    if (cart.size === 0) {
      if (checkoutMessage) {
        checkoutMessage.textContent = "Your cart is empty. Add items before checkout.";
      }
      return;
    }

    let total = 0;
    cart.forEach((item) => {
      total += item.qty * item.price;
    });
    cart.clear();
    renderCart();
    if (checkoutMessage) {
      checkoutMessage.textContent = `Thank you! Your order of ${formatPrice(total)} is confirmed. A team member will follow up shortly.`;
    }
  });

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.textContent.trim().toLowerCase();

      document.querySelectorAll(".shop-card").forEach((card) => {
        const tag = (card.dataset.tag || "").toLowerCase();
        const show = filter === "all" || tag === filter;
        card.style.display = show ? "flex" : "none";
      });
    });
  });

  renderCart();
};

window.addEventListener("scroll", () => {
  setHeaderState();

  if (backToTopButton) {
    backToTopButton.classList.toggle("visible", window.scrollY > 420);
  }
});

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu);
}

if (siteNav) {
  siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenuOnNavigate));
}

setHeaderState();
animateCounters();
setupSlider();
setupAccessibility();
setupNewsletter();
setupBackToTop();
setupShop();