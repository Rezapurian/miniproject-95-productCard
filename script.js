const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
const addCartButtons = document.querySelectorAll(".add-cart");
const imgClicked = document.querySelectorAll(".img-box img");
const body = document.querySelector("body");

// Display a modal with the clicked image and a close icon
imgClicked.forEach((clicked) => {
  clicked.addEventListener("click", () => {
    let boxImg = document.createElement("div");
    let closeIcon = document.createElement("i");
    let img = document.createElement("img");

    boxImg.classList.add("show");
    closeIcon.classList.add("fa-solid", "fa-xmark");
    img.src = clicked.src;

    boxImg.appendChild(img);
    boxImg.appendChild(closeIcon);
    body.appendChild(boxImg);

    closeIcon.addEventListener("click", () => boxImg.remove());
  });
});

// Add event listeners to open and close the cart
cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

// Add event listeners to "Add to Cart" buttons
addCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const productBox = e.target.closest(".product-box");
    addToCart(productBox);
  });
});

// Function to add a product to the cart
const cartContent = document.querySelector(".cart-content");
const addToCart = (productBox) => {
  const productImgSrc = productBox.querySelector("img").src;
  const productTitle = productBox.querySelector(".product-title").textContent;
  const productPrice = productBox.querySelector(".price").textContent;

  const cartItems = document.querySelectorAll(".cart-product-title");
  for (let item of cartItems) {
    if (item.textContent === productTitle) {
      alert("This item is already in the cart");
      return;
    }
  }

  const cartBox = document.createElement("div");
  cartBox.classList.add("cart-box");
  cartBox.innerHTML = `
          <img src="${productImgSrc}" class="cart-img">
          <div class="cart-details">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
              <button id="decrement">-</button>
              <span class="number">1</span>
              <button id="increment">+</button>
            </div>
          </div>
          <i class="fa fa-trash cart-remove"></i>
    `;

  cartContent.appendChild(cartBox);

  cartBox.querySelector(".cart-remove").addEventListener("click", () => {
    cartBox.remove();

    updateCartCount(-1);

    updateTotalPrice();
  });

  // Add event listener for incrementing and decrementing the quantity of the item
  cartBox.querySelector(".cart-quantity").addEventListener("click", (e) => {
    const numberElement = cartBox.querySelector(".number");
    const decrementBtn = cartBox.querySelector("#decrement");
    let quantity = numberElement.textContent;

    if (e.target.id === "decrement" && quantity > 1) {
      quantity--;
      if (quantity === 1) {
        decrementBtn.style.color = "#999";
      }
    } else if (e.target.id === "increment") {
      quantity++;
      decrementBtn.style.color = "#333";
    }

    numberElement.textContent = quantity;

    updateTotalPrice();
  });

  updateCartCount(1);

  updateTotalPrice();
};

// Update the total price of items in the cart
const updateTotalPrice = () => {
  const totalPriceElement = document.querySelector(".total-price");
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  let total = 0;

  cartBoxes.forEach((cartBox) => {
    const priceElement = cartBox.querySelector(".cart-price");
    const quantityElement = cartBox.querySelector(".number");
    const price = priceElement.textContent.replace("$", "");
    const quantity = quantityElement.textContent;
    total += price * quantity;
  });
  totalPriceElement.textContent = `$${total}`;
};

// Update the cart item count badge based on the change in the number of items
let cartItemCount = 0;
const updateCartCount = (change) => {
  const cartItemCountBadge = document.querySelector(".cart-item-count");
  cartItemCount += change;
  if (cartItemCount > 0) {
    cartItemCountBadge.style.visibility = "visible";
    cartItemCountBadge.textContent = cartItemCount;
  } else {
    cartItemCountBadge.style.visibility = "hidden";
    cartItemCountBadge.textContent = "";
  }
};

// Handle the "Buy Now" button click event
const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  if (cartBoxes.length === 0) {
    alert("Your cart is empty. Please add items to your cart before buying.");
    return;
  }

  cartBoxes.forEach((cartBox) => cartBox.remove());

  cartItemCount = 0;
  updateCartCount(0);

  updateTotalPrice();

  alert("Thank you for your purchase!");
});
