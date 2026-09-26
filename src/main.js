import { cart } from "./cart.js";
import { renderCatalog } from "./ui/catalog.js";
import { renderCart, getCartTotal } from "./ui/cart.js";

/* Initiate catalog and cart */

cart.load();

const catalogList = document.querySelector("#catalog-list");
catalogList.replaceWith(renderCatalog());

const cartTotal = document.querySelector("#cart-total");
const handleRenderCart = () => {
    const cartList = document.querySelector("#cart-list");
    cartList.replaceWith(renderCart());
    cartTotal.textContent = `${getCartTotal()}`;
};
handleRenderCart();
cart.subscribe(null, handleRenderCart);

/* Rise to cart button */

const cartScrollButton = document.querySelector("#cart-scroll-button");

cartScrollButton.addEventListener("click", () => {
    cartSection.scrollIntoView({
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
};

const orderForm = document.querySelector("#order-form");
orderForm.addEventListener("submit", handleOrderSubmit);
