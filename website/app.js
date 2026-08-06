// =============================================
// Supermarket Sales Tracker — Interactive Demo
// Mirrors the Python/Tkinter app logic in JS
// =============================================

// ===== INVENTORY DATA (same as supermarket.py) =====
const inventory = {
  "Apple":      { price: 10,  stock: 50,  unit: "Kg" },
  "Milk":       { price: 30,  stock: 20,  unit: "Litre" },
  "Bread":      { price: 25,  stock: 15,  unit: "Piece" },
  "Eggs":       { price: 5,   stock: 100, unit: "Piece" },
  "Juice":      { price: 50,  stock: 25,  unit: "Litre" },
  "Rice":       { price: 60,  stock: 40,  unit: "Kg" },
  "Soap":       { price: 20,  stock: 60,  unit: "Piece" },
  "Toothpaste": { price: 35,  stock: 30,  unit: "Piece" },
  "Oil":        { price: 120, stock: 25,  unit: "Litre" },
  "Sugar":      { price: 45,  stock: 50,  unit: "Kg" }
};

// ===== CART =====
const cart = {};

// ===== DOM REFERENCES =====
const itemSelect     = document.getElementById("itemSelect");
const quantityInput  = document.getElementById("quantityInput");
const inventoryTable = document.getElementById("inventoryTable");
const cartItems      = document.getElementById("cartItems");
const cartEmpty      = document.getElementById("cartEmpty");
const cartTotal      = document.getElementById("cartTotal");
const cartTotalAmt   = document.getElementById("cartTotalAmount");
const itemInfo       = document.getElementById("itemInfo");
const infoPrice      = document.getElementById("infoPrice");
const infoUnit       = document.getElementById("infoUnit");
const infoStock      = document.getElementById("infoStock");
const billOverlay    = document.getElementById("billOverlay");
const billDate       = document.getElementById("billDate");
const billItems      = document.getElementById("billItems");
const billTotal      = document.getElementById("billTotal");

// ===== INITIALIZATION =====
function init() {
  populateDropdown();
  renderInventory();
  renderCart();

  // Show item info when selection changes
  itemSelect.addEventListener("change", function () {
    const item = this.value;
    if (item && inventory[item]) {
      infoPrice.textContent = `₹${inventory[item].price}`;
      infoUnit.textContent  = inventory[item].unit;
      infoStock.textContent = `${inventory[item].stock} ${inventory[item].unit}`;
      itemInfo.classList.add("show");
    } else {
      itemInfo.classList.remove("show");
    }
  });
}

function populateDropdown() {
  // Clear existing options (except the placeholder)
  itemSelect.innerHTML = '<option value="">— Select a product —</option>';
  for (const item in inventory) {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = `${item} — ₹${inventory[item].price}/${inventory[item].unit}`;
    itemSelect.appendChild(opt);
  }
}

// ===== RENDER INVENTORY TABLE =====
function renderInventory() {
  inventoryTable.innerHTML = "";
  for (const item in inventory) {
    const info = inventory[item];
    const tr = document.createElement("tr");

    // Determine stock badge class
    let badgeClass = "stock-badge-high";
    if (info.stock <= 0) badgeClass = "stock-badge-low";
    else if (info.stock <= 15) badgeClass = "stock-badge-medium";
    else if (info.stock <= 25) badgeClass = "stock-badge-medium";

    tr.innerHTML = `
      <td style="font-weight:600;">${item}</td>
      <td>₹${info.price}</td>
      <td>${info.unit}</td>
      <td>
        <span class="stock-badge ${badgeClass}">
          <span class="stock-badge-dot"></span>
          ${info.stock}
        </span>
      </td>
    `;
    inventoryTable.appendChild(tr);
  }
}

// ===== RENDER CART =====
function renderCart() {
  const items = Object.keys(cart);
  if (items.length === 0) {
    cartEmpty.style.display = "block";
    cartItems.innerHTML = "";
    cartTotal.style.display = "none";
    return;
  }

  cartEmpty.style.display = "none";
  cartItems.innerHTML = "";
  let total = 0;

  for (const item of items) {
    const info = cart[item];
    const amount = info.price * info.quantity;
    total += amount;

    const div = document.createElement("div");
    div.className = "demo-cart-item";
    div.innerHTML = `
      <div>
        <div class="demo-cart-item-name">${item}</div>
        <div class="demo-cart-item-detail">${info.quantity} × ₹${info.price}/${inventory[item].unit}</div>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span class="demo-cart-item-price">₹${amount}</span>
        <button class="demo-cart-item-remove" onclick="removeFromCart('${item}')" title="Remove item">✕</button>
      </div>
    `;
    cartItems.appendChild(div);
  }

  cartTotal.style.display = "flex";
  cartTotalAmt.textContent = `₹${total}`;
}

// ===== ADD TO CART (mirrors Python add_to_cart) =====
function addToCart() {
  const item = itemSelect.value;
  const qtyRaw = quantityInput.value.trim();

  if (!item) {
    showToast("warning", "Please select a product first.");
    return;
  }

  if (!qtyRaw || isNaN(qtyRaw) || parseInt(qtyRaw) <= 0) {
    showToast("warning", "Please enter a valid quantity.");
    return;
  }

  const quantity = parseInt(qtyRaw);

  if (!(item in inventory)) {
    showToast("error", "Invalid item.");
    return;
  }

  if (quantity > inventory[item].stock) {
    showToast("error", `Insufficient stock — only ${inventory[item].stock} ${inventory[item].unit} available.`);
    return;
  }

  // Update inventory stock
  inventory[item].stock -= quantity;

  // Update cart
  if (item in cart) {
    cart[item].quantity += quantity;
  } else {
    cart[item] = { price: inventory[item].price, quantity: quantity };
  }

  showToast("success", `${quantity} ${inventory[item].unit} of ${item} added to cart.`);

  // Re-render
  renderInventory();
  renderCart();
  updateItemInfo();

  // Reset input
  quantityInput.value = "";
}

// ===== REMOVE FROM CART =====
function removeFromCart(item) {
  if (item in cart) {
    // Restore stock
    inventory[item].stock += cart[item].quantity;
    delete cart[item];

    showToast("success", `${item} removed from cart.`);
    renderInventory();
    renderCart();
    updateItemInfo();
  }
}

// ===== CLEAR CART =====
function clearCart() {
  if (Object.keys(cart).length === 0) {
    showToast("warning", "Cart is already empty.");
    return;
  }

  // Restore all stock
  for (const item in cart) {
    inventory[item].stock += cart[item].quantity;
  }

  // Clear cart
  for (const key in cart) delete cart[key];

  showToast("success", "Cart cleared.");
  renderInventory();
  renderCart();
  updateItemInfo();
}

// ===== GENERATE BILL (mirrors Python generate_bill) =====
function generateBill() {
  if (Object.keys(cart).length === 0) {
    showToast("error", "Cart is empty. Add items first.");
    return;
  }

  const now = new Date();
  const dateStr = now.toLocaleString("en-IN", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false
  });

  billDate.textContent = dateStr;
  billItems.innerHTML = "";
  let total = 0;

  for (const item in cart) {
    const info = cart[item];
    const amount = info.price * info.quantity;
    total += amount;

    const row = document.createElement("div");
    row.className = "demo-bill-item-row";
    row.innerHTML = `
      <span class="demo-bill-item-name">${item} × ${info.quantity} ${inventory[item].unit}</span>
      <span class="demo-bill-item-amount">₹${amount}</span>
    `;
    billItems.appendChild(row);
  }

  billTotal.textContent = `₹${total}`;

  // Show bill modal
  billOverlay.classList.add("show");

  // Clear cart after bill
  for (const key in cart) delete cart[key];
  renderCart();
}

function closeBill() {
  billOverlay.classList.remove("show");
}

// Close bill on overlay click
billOverlay.addEventListener("click", function (e) {
  if (e.target === billOverlay) closeBill();
});

// Close bill on Escape
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeBill();
});

// ===== UPDATE ITEM INFO PANEL =====
function updateItemInfo() {
  const item = itemSelect.value;
  if (item && inventory[item]) {
    infoStock.textContent = `${inventory[item].stock} ${inventory[item].unit}`;
  }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(type, message) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.add("toast-exit");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ===== HAMBURGER MENU =====
document.getElementById("navHamburger").addEventListener("click", function () {
  document.getElementById("navLinks").classList.toggle("open");
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".animate-on-scroll").forEach(el => {
  observer.observe(el);
});

// ===== START =====
init();
