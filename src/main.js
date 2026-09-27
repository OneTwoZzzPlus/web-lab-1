import { cart } from "./cart.js";
import { renderCatalog } from "./ui/catalog.js";
import { renderCart, getCartTotal } from "./ui/cart.js";

/* Rise to cart button */

const scrollTarget = document.querySelector("body");
const cartScrollButton = document.querySelector("#main-nav-cart");

cartScrollButton.addEventListener("click", () => {
    scrollTarget.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
});

/* Order modal window */

const orderModal = document.querySelector("#order-modal");
const openOrderModal = () => orderModal.classList.add("open");
const closeOrderModal = () => orderModal.classList.remove("open");

const orderCloseButton = document.querySelector("#order-close-button");
orderCloseButton.addEventListener("click", closeOrderModal);

/* Message modal window */

const messageModal = document.querySelector("#message-modal");
const openMessageModal = () => messageModal.classList.add("open");
const closeMessageModal = () => messageModal.classList.remove("open");

const messageCloseButton = document.querySelector("#message-close-button");
messageCloseButton.addEventListener("click", closeMessageModal);

const messageOkButton = document.querySelector("#message-ok-button");
messageOkButton.addEventListener("click", closeMessageModal);

/* Order actions */

const handleOrderStart = () => {
    openOrderModal();
};

const orderStartButton = document.querySelector("#order-start-button");
orderStartButton.addEventListener("click", handleOrderStart);

const handleOrderSubmit = (event) => {
    event.preventDefault();

    closeOrderModal();
    openMessageModal();
    cart.clear();
};

const orderForm = document.querySelector("#order-form");
orderForm.addEventListener("submit", handleOrderSubmit);

/* Initiate catalog and cart */

cart.load();

const catalogList = document.querySelector("#catalog-list");
catalogList.replaceWith(renderCatalog());

const cartTotal = document.querySelector("#cart-total");
const handleRenderCart = () => {
    const cartList = document.querySelector("#cart-list");
    cartList.replaceWith(renderCart());
    const total = getCartTotal();
    cartTotal.textContent = `${getCartTotal()}`;
    orderStartButton.disabled = total === 0;
};
handleRenderCart();
cart.subscribe(null, handleRenderCart);
