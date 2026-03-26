// Product catalog:
// Change names, prices, descriptions, stories, calories, or emoji placeholders here.
const PRODUCTS = [
  {
    id: "alfajor-chocolate",
    name: "Alfajor Chocolate",
    shortDescription: "Tapas suaves de cacao con corazon de dulce de leche y bano brillante.",
    story:
      "Preparamos cada alfajor con masa de cacao bien tierna, los dejamos enfriar a temperatura ambiente y los rellenamos a mano con dulce de leche repostero para que cada mordida tenga ese sabor clasico de merienda argentina.",
    calories: 285,
    price: 3,
    category: "alfajor",
    emoji: "🍫",
  },
  {
    id: "alfajor-maicena",
    name: "Alfajor Maicena",
    shortDescription: "Liviano, delicado y terminado con coco rallado alrededor.",
    story:
      "La masa lleva maicena y vainilla para lograr una textura que se desarma apenas la mordes. Despues los rellenamos con dulce de leche y los pasamos por coco rallado para ese toque casero que nos recuerda a las reuniones familiares.",
    calories: 260,
    price: 3,
    category: "alfajor",
    emoji: "🥥",
  },
  {
    id: "brownie-ddl",
    name: "Brownie con dulce de leche",
    shortDescription: "Chocolate intenso con centro humedo y una capa generosa de dulce de leche.",
    story:
      "Horneamos el brownie en tandas pequenas para mantener el centro humedo y el borde apenas crocante. Cuando enfria, sumamos dulce de leche argentino en una capa pareja y terminamos con un toque de sal para equilibrar el sabor.",
    calories: 340,
    price: 3.5,
    category: "other",
    emoji: "🍮",
  },
  {
    id: "lemonies",
    name: "Lemonies",
    shortDescription: "Cuadrados de limon frescos, suaves y con final citrico.",
    story:
      "Usamos ralladura y jugo de limon recien exprimido para que salgan perfumados, humedos y con esa acidez que limpia el paladar. Son ideales para acompanar un cafe o para equilibrar una caja mas golosa.",
    calories: 230,
    price: 3.2,
    category: "other",
    emoji: "🍋",
  },
  {
    id: "coco-ddl",
    name: "Coco + dulce de leche",
    shortDescription: "Bocado humedo de coco con relleno suave y bien argentino.",
    story:
      "Mezclamos coco rallado con una base ligera para que quede una miga humeda y perfumada. El centro de dulce de leche se agrega despues del horneado para que mantenga toda su cremosidad y el contraste sea perfecto.",
    calories: 310,
    price: 3.5,
    category: "other",
    emoji: "🥥",
  },
  {
    id: "box-degustacion",
    name: "Box Degustacion",
    shortDescription: "Caja surtida con 6 piezas para compartir o probar de todo un poco.",
    story:
      "Armamos esta caja mezclando nuestros favoritos del dia para que puedas probar texturas, rellenos y sabores distintos en una sola compra. Es la opcion ideal para regalar o para descubrir cual va a ser tu proximo antojo fijo.",
    calories: 1680,
    price: 18,
    category: "box",
    emoji: "📦",
  },
];

const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((product) => [product.id, product]));

const euro = new Intl.NumberFormat("es-MT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const state = {
  selectedProductId: null,
  cartOpen: false,
  cart: [],
  quantities: PRODUCTS.reduce((accumulator, product) => {
    accumulator[product.id] = 1;
    return accumulator;
  }, {}),
  formData: {
    name: "",
    whatsapp: "",
    address: "",
  },
  errors: [],
  successMessage: "",
};

function formatPrice(value) {
  return euro.format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getAlfajorCount() {
  return state.cart.reduce((sum, item) => {
    const product = PRODUCT_MAP[item.id];
    return product && product.category === "alfajor" ? sum + item.quantity : sum;
  }, 0);
}

function getIndividualItemCount() {
  return state.cart.reduce((sum, item) => {
    const product = PRODUCT_MAP[item.id];
    return product && product.category !== "box" ? sum + item.quantity : sum;
  }, 0);
}

function hasBoxOnlyOrder() {
  return state.cart.length > 0 && state.cart.every((item) => PRODUCT_MAP[item.id]?.category === "box");
}

// Navbar:
// Edit the navigation labels, brand text, or cart dropdown text here.
function renderNavbar() {
  const cartCount = getCartCount();
  const cartDropdown =
    state.cart.length === 0
      ? `
        <div class="cart-dropdown-empty">
          Tu carrito está vacio. Agrega productos desde la tienda.
        </div>
      `
      : `
        <div class="cart-dropdown-list">
          ${state.cart
            .map(
              (item) => `
                <div class="cart-dropdown-item">
                  <div>
                    <strong>${escapeHtml(item.name)}</strong>
                    <div class="cart-dropdown-meta">${item.quantity} x ${formatPrice(item.price)}</div>
                  </div>
                  <span class="cart-dropdown-total">${formatPrice(item.quantity * item.price)}</span>
                </div>
              `
            )
            .join("")}
          <div class="cart-dropdown-summary">
            <span>Total</span>
            <strong>${formatPrice(getCartTotal())}</strong>
          </div>
          <a class="cart-dropdown-link" href="#carrito">Ver carrito completo</a>
        </div>
      `;

  return `
    <header class="navbar">
      <div class="container navbar-inner">
        <a class="brand" href="#inicio" aria-label="Ir al inicio">
          <span class="brand-mark">BA</span>
          <span>BienArgento</span>
        </a>

        <nav class="nav-links" aria-label="Navegacion principal">
          <a class="nav-link" href="#shop">Shop</a>
          <a class="nav-link" href="#quienes-somos">Quienes somos</a>
          <div class="cart-nav">
            <button
              type="button"
              class="cart-toggle ${state.cartOpen ? "is-open" : ""}"
              data-action="toggle-cart"
              aria-expanded="${state.cartOpen ? "true" : "false"}"
              aria-label="Abrir carrito"
            >
              <span class="cart-toggle-icon">🛒</span>
              <span class="cart-toggle-count">${cartCount}</span>
            </button>
            ${state.cartOpen ? `<div class="cart-dropdown">${cartDropdown}</div>` : ""}
          </div>
        </nav>
      </div>
    </header>
  `;
}

// Hero section:
// Edit the main headline, subtext, CTA buttons, and support items here.
function renderHero() {
  const supportItems = [
    {
      icon: "✦",
      title: "Recetas caseras",
      copy: "Todo sale de cocina artesanal, en tandas chicas y con foco en textura, frescura y sabor.",
    },
    {
      icon: "↗",
      title: "Listo en 48 horas",
      copy: "Preparamos tu pedido especialmente para vos y coordinamos entrega dentro de Malta.",
    },
    {
      icon: "◌",
      title: "Compra simple",
      copy: "Armas el carrito, completas tus datos y terminas el pedido directo por WhatsApp.",
    },
  ];

  return `
    <section class="hero" id="inicio">
      <div class="container">
        <div class="hero-card">
          <div class="hero-content">
            <div class="eyebrow">Hecho en Malta con corazon argentino</div>
            <h1 class="hero-title">Sabores argentinos, hechos en casa 🇦🇷</h1>
            <p class="hero-copy">
              Produccion artesanal, tandas pequenas y entrega en 48hs en Malta. Dulce
              de leche, coco, cacao y recetas que nacen como en casa.
            </p>

            <div class="hero-actions">
              <a class="button" href="#productos">Ver productos</a>
              <a class="ghost-button" href="#shop">Hacer mi pedido</a>
            </div>

            <div class="hero-meta">
              <div class="meta-pill">Entrega en toda Malta 🇲🇹</div>
              <div class="meta-pill">Horario 07:00 - 17:00</div>
              <div class="meta-pill">Pedido minimo: 3 items o 1 box</div>
            </div>
          </div>
        </div>

        <div class="hero-support">
          ${supportItems
            .map(
              (item) => `
                <article class="support-item">
                  <div class="support-icon" aria-hidden="true">${item.icon}</div>
                  <div>
                    <h3 class="support-title">${item.title}</h3>
                    <p class="support-copy">${item.copy}</p>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

// Quienes somos section:
// Edit the about title and paragraph here.
function renderAbout() {
  return `
    <section class="section" id="quienes-somos">
      <div class="container">
        <div class="about-card">
          <div class="eyebrow">Quienes somos</div>
          <h2 class="section-title">Un proyecto chiquito, dulce y bien argentino</h2>
          <p class="section-copy">
            BienArgento nace para compartir esos postres que siempre aparecen en la mesa familiar:
            alfajores, brownies y cajas surtidas hechas con mimo. Hoy cocinamos en Malta, manteniendo
            el sabor casero, la produccion artesanal y la calidez de pedirle algo rico a alguien de confianza.
          </p>
        </div>
      </div>
    </section>
  `;
}

// Product preview section:
// Edit the section heading text here. Product card content comes from PRODUCTS above.
function renderProductsPreview() {
  const cards = PRODUCTS.map(
    (product) => `
      <article class="product-card">
        <button
          type="button"
          class="product-button"
          data-action="open-modal"
          data-product-id="${product.id}"
          aria-label="Ver mas sobre ${escapeHtml(product.name)}"
        >
          <div class="product-image">
            <div class="dessert-badge" aria-hidden="true">${product.emoji}</div>
          </div>
          <div class="product-body">
            <h3 class="product-name">${escapeHtml(product.name)}</h3>
            <p class="product-description">${escapeHtml(product.shortDescription)}</p>
            <span class="product-link">Ver historia + calorias</span>
          </div>
        </button>
      </article>
    `
  ).join("");

  return `
    <section class="section" id="productos">
      <div class="container">
        <div class="eyebrow">Productos</div>
        <h2 class="section-title">Postres para una merienda bien hecha</h2>
        <p class="section-copy">
          Toca cualquier tarjeta para conocer la historia de preparacion, las calorias estimadas y el perfil de cada producto.
        </p>

        <div class="product-grid" style="margin-top: 1.8rem;">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

// Shop / Arma tu pedido section:
// Edit the section title and helper text here. The product cards use data from PRODUCTS above.
function renderShopSection() {
  const items = PRODUCTS.map((product) => {
    const quantity = state.quantities[product.id];

    return `
      <article class="order-card">
        <div class="order-card-visual">
          <div class="order-card-badge" aria-hidden="true">${product.emoji}</div>
        </div>
        <div class="order-card-body">
          <h3 class="order-card-title">${escapeHtml(product.name)}</h3>
          <p class="order-card-price">${formatPrice(product.price)}</p>
          <p class="order-card-copy">${escapeHtml(product.shortDescription)}</p>
        </div>
        <div class="order-card-controls">
          <button
            type="button"
            class="order-adjust"
            data-action="set-quantity"
            data-product-id="${product.id}"
            data-value="${Math.max(1, quantity - 1)}"
            aria-label="Reducir cantidad de ${escapeHtml(product.name)}"
          >-</button>
          <span class="order-qty">${quantity}</span>
          <button
            type="button"
            class="order-adjust"
            data-action="set-quantity"
            data-product-id="${product.id}"
            data-value="${quantity + 1}"
            aria-label="Aumentar cantidad de ${escapeHtml(product.name)}"
          >+</button>
        </div>
        <button type="button" class="order-add" data-action="add-to-cart" data-product-id="${product.id}">
          Agregar
        </button>
      </article>
    `;
  }).join("");

  return `
    <section id="shop" class="shop-builder">
      <div class="shop-header">
        <div class="eyebrow">Shop</div>
        <h2 class="section-title">Arma tu pedido</h2>
        <p class="section-copy">
          Elegi tus favoritos, ajusta la cantidad y pasa al checkout de abajo.
        </p>
      </div>

      <div class="order-grid">${items}</div>
    </section>
  `;
}

// Final checkout section:
// Edit checkout headings, helper text, form labels, and order summary labels here.
function renderCheckout() {
  const total = getCartTotal();
  const individualItemCount = getIndividualItemCount();
  const errors = state.errors.length
    ? `
      <div class="error-box" role="alert">
        ${state.errors.map((error) => `<div>${escapeHtml(error)}</div>`).join("")}
      </div>
    `
    : "";

  const success = state.successMessage
    ? `<div class="success-box" role="status">${escapeHtml(state.successMessage)}</div>`
    : "";

  const summary =
    state.cart.length === 0
      ? `<p class="empty-cart">Tu carrito está vacio por ahora. Suma algunos postres para empezar el pedido.</p>`
      : `
        <div class="checkout-summary">
          <div class="checkout-summary-list">
            ${state.cart
              .map(
                (item) => `
                  <div class="checkout-summary-item">
                    <div>
                      <h3 class="cart-item-name">${escapeHtml(item.name)}</h3>
                      <p class="cart-note">${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(
                        item.quantity * item.price
                      )}</p>
                    </div>
                    <div class="checkout-summary-actions">
                      <div class="quantity-control">
                        <button
                          type="button"
                          class="qty-button"
                          data-action="update-cart"
                          data-product-id="${item.id}"
                          data-delta="-1"
                          aria-label="Reducir cantidad de ${escapeHtml(item.name)}"
                        >-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button
                          type="button"
                          class="qty-button"
                          data-action="update-cart"
                          data-product-id="${item.id}"
                          data-delta="1"
                          aria-label="Aumentar cantidad de ${escapeHtml(item.name)}"
                        >+</button>
                      </div>
                      <button
                        type="button"
                        class="icon-button"
                        data-action="remove-item"
                        data-product-id="${item.id}"
                        aria-label="Eliminar ${escapeHtml(item.name)}"
                      >×</button>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>

          <div class="summary-box">
            <div class="cart-summary-row">
              <span>Total del carrito</span>
              <span class="summary-total">${formatPrice(total)}</span>
            </div>
            <div class="summary-meta">
              <span>Items individuales: ${individualItemCount}</span>
              <span>Produccion estimada: 48 horas</span>
              <span>Zona de entrega: Malta</span>
            </div>
          </div>
        </div>
      `;

  return `
    <div class="checkout-panel">
      <div class="eyebrow">Checkout</div>
      <h2 class="section-title">Finaliza tu pedido</h2>
      <p class="checkout-copy">
        Completa tus datos y te llevamos directo al mensaje listo para enviar al negocio.
      </p>

      <div class="checkout-two-column">
        <div class="checkout-side checkout-cart-side">
          <h3 class="checkout-side-title">Tu carrito</h3>
          ${summary}
        </div>

        <div class="checkout-side checkout-form-side">
          <h3 class="checkout-side-title">Finalizar tu pedido</h3>
          ${errors}
          ${success}

          <form class="checkout-form" id="checkout-form">
            <label>
              Nombre
              <input
                class="input"
                type="text"
                name="name"
                value="${escapeHtml(state.formData.name)}"
                placeholder="Tu nombre"
                required
              />
            </label>

            <label>
              WhatsApp
              <input
                class="input"
                type="tel"
                name="whatsapp"
                value="${escapeHtml(state.formData.whatsapp)}"
                placeholder="Ej: 99999999"
                required
              />
            </label>

            <label>
              Direccion / punto de encuentro
              <textarea
                class="textarea"
                name="address"
                placeholder="Ej: Sliema frente al mar"
                required
              >${escapeHtml(state.formData.address)}</textarea>
            </label>

            <p class="field-help">
              Compras validas solo para Malta. Horario de atencion: 07:00 - 17:00.
            </p>

            <button type="submit" class="button" ${state.cart.length === 0 ? "disabled" : ""}>
              Enviar pedido por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

// Footer:
// Edit business info, quick links text, and bottom legal text here.
function renderFooter() {
  return `
    <footer class="footer-bar">
      <div class="container footer-shell">
        <div class="footer-bar-grid">
        <div class="footer-branding">
          <div class="footer-logo-row">
            <span class="footer-logo-mark">BA</span>
            <h3 class="footer-title">BienArgento</h3>
          </div>
          <p class="footer-copy">Authentic homemade Argentine desserts delivered straight to your door in Malta. Baked fresh with love.</p>
        </div>

        <div class="footer-column">
            <h3 class="footer-title">Important Info</h3>
          <ul class="footer-list">
            <li>Minimum order: 3 individual items or 1 box</li>
            <li>Production time: 48 hours</li>
            <li>Delivery: Only within Malta</li>
            <li>Hours: 07:00 - 17:00</li>
          </ul>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">Quick Links</h3>
          <div class="footer-links">
            <a href="#inicio">Home</a>
            <a href="#shop">Shop Menu</a>
            <a href="#quienes-somos">Our Story</a>
            <a href="#carrito">Shopping Cart</a>
          </div>
        </div>
        </div>

        <div class="footer-bottom-row">
          <div>
            © 2026 BienArgento. All rights reserved.
          </div>
          <div>Made with ❤️ in Malta</div>
        </div>
      </div>
    </footer>
  `;
}

// Product modal:
// Edit modal labels here. Product story, calories, and image placeholder emoji come from PRODUCTS above.
function renderModal() {
  if (!state.selectedProductId) {
    return "";
  }

  const product = PRODUCT_MAP[state.selectedProductId];

  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-card">
        <div class="modal-layout">
          <div class="modal-image">
            <div class="dessert-badge" aria-hidden="true">${product.emoji}</div>
          </div>

          <div class="modal-body">
            <div class="modal-top">
              <div>
                <div class="eyebrow">Detalle del producto</div>
                <h3 class="modal-title" id="modal-title">${escapeHtml(product.name)}</h3>
              </div>
              <button type="button" class="icon-button" data-action="close-modal" aria-label="Cerrar modal">×</button>
            </div>

            <p class="modal-copy">${escapeHtml(product.shortDescription)}</p>
            <p class="modal-story">${escapeHtml(product.story)}</p>

            <div class="modal-facts">
              <span class="fact-pill">Calorias estimadas: ${product.calories} kcal</span>
              <span class="fact-pill">Precio: ${formatPrice(product.price)}</span>
              <span class="fact-pill">Produccion artesanal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Full page render:
// This is the main website structure and the order in which sections appear on the page.
function renderApp() {
  const root = document.getElementById("root");

  root.innerHTML = `
    <div class="page-shell">
      ${renderNavbar()}
      ${renderHero()}
      ${renderAbout()}
      ${renderProductsPreview()}
      <section class="section">
        <div class="container checkout-layout">
          ${renderShopSection()}
          ${renderCheckout()}
        </div>
      </section>
      ${renderFooter()}
      ${renderModal()}
    </div>
  `;

  document.body.style.overflow = state.selectedProductId ? "hidden" : "";
}

// Shop quantity selector:
// Controls the amount chosen before adding a product to the cart.
function setQuantity(productId, value) {
  state.quantities[productId] = Math.max(1, Number(value) || 1);
  renderApp();
}

// Add to cart:
// Adds selected products into the shopping cart state.
function addToCart(productId) {
  const product = PRODUCT_MAP[productId];
  const quantityToAdd = state.quantities[productId];
  const existingItem = state.cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantityToAdd;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantityToAdd,
    });
  }

  state.successMessage = `${product.name} agregado al carrito.`;
  state.errors = [];
  renderApp();
}

// Cart quantity update:
// Changes quantity from the checkout/cart controls.
function updateCart(productId, delta) {
  state.cart = state.cart
    .map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    )
    .filter((item) => item.quantity > 0);

  renderApp();
}

// Remove product from cart.
function removeItem(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  renderApp();
}

// WhatsApp checkout flow:
// Edit validation messages or the WhatsApp message format here.
function submitCheckout(formElement) {
  const formData = new FormData(formElement);

  state.formData = {
    name: String(formData.get("name") || "").trim(),
    whatsapp: String(formData.get("whatsapp") || "").trim(),
    address: String(formData.get("address") || "").trim(),
  };

  const nextErrors = [];

  if (state.cart.length === 0) {
    nextErrors.push("El carrito está vacio. Agrega productos antes de enviar el pedido.");
  }

  const individualItemCount = getIndividualItemCount();
  const boxOnlyOrder = hasBoxOnlyOrder();

  if (!boxOnlyOrder && individualItemCount < 3) {
    nextErrors.push("El pedido debe incluir al menos 3 items individuales. Las boxes pueden comprarse solas.");
  }

  if (!state.formData.name) {
    nextErrors.push("El nombre es obligatorio.");
  }

  if (!state.formData.whatsapp) {
    nextErrors.push("El número de WhatsApp es obligatorio.");
  }

  if (!state.formData.address) {
    nextErrors.push("La dirección o punto de encuentro es obligatorio.");
  }

  if (nextErrors.length > 0) {
    state.errors = nextErrors;
    state.successMessage = "";
    renderApp();
    return;
  }

  const lines = [
    "Nuevo pedido BienArgento 🇦🇷",
    "",
    ...state.cart.map((item) => `* ${item.quantity} ${item.name}`),
    "",
    `Total: ${formatPrice(getCartTotal())}`,
    "",
    `Nombre: ${state.formData.name}`,
    `WhatsApp: ${state.formData.whatsapp}`,
    `Direccion: ${state.formData.address}`,
  ];

  const message = encodeURIComponent(lines.join("\n"));
  const whatsappUrl = `https://wa.me/35699476221?text=${message}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  state.errors = [];
  state.successMessage = "Tu pedido está listo 🚀 Solo presioná enviar en WhatsApp para finalizar";
  renderApp();
}

// Global click events:
// Handles modal open/close, cart toggle, quantity changes, and add/remove actions.
document.addEventListener("click", (event) => {
  const actionElement = event.target.closest("[data-action]");

  if (!actionElement) {
    if (state.cartOpen && !event.target.closest(".cart-nav")) {
      state.cartOpen = false;
      renderApp();
      return;
    }

    if (event.target.classList.contains("modal-backdrop")) {
      state.selectedProductId = null;
      renderApp();
    }
    return;
  }

  const { action, productId, value, delta } = actionElement.dataset;

  if (action === "open-modal") {
    state.selectedProductId = productId;
    state.cartOpen = false;
    renderApp();
  }

  if (action === "close-modal") {
    state.selectedProductId = null;
    renderApp();
  }

  if (action === "toggle-cart") {
    state.cartOpen = !state.cartOpen;
    renderApp();
  }

  if (action === "set-quantity") {
    setQuantity(productId, value);
  }

  if (action === "add-to-cart") {
    addToCart(productId);
  }

  if (action === "update-cart") {
    updateCart(productId, Number(delta));
  }

  if (action === "remove-item") {
    removeItem(productId);
  }
});

// Checkout form submission.
document.addEventListener("submit", (event) => {
  if (event.target.id === "checkout-form") {
    event.preventDefault();
    submitCheckout(event.target);
  }
});

// Keyboard shortcuts:
// Escape closes the modal or cart dropdown.
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.selectedProductId) {
    state.selectedProductId = null;
    renderApp();
  }

  if (event.key === "Escape" && state.cartOpen) {
    state.cartOpen = false;
    renderApp();
  }
});

// Initial website render.
renderApp();
