import { cart } from "../cart.js";
import { products } from "../products.js";
import { createPlus, createMinus, createCross } from "./assets.js";

export const getCartTotal = () => {
    let total = 0;
    for (const [product_id, count] of Object.entries(cart.items())) {
        const price = products[product_id].price || 0;
        total += price * count;
    }
    return total;
};

export const renderCart = () => {
    const items = cart.items();

    if (Object.keys(items).length === 0) {
        const wrapper = document.createElement("p");
        wrapper.id = "cart-list";
        wrapper.textContent = "Ничего не добавлено";
        return wrapper;
    }

    const wrapper = document.createElement("ul");
    wrapper.id = "cart-list";
    for (const product_id of Object.keys(items)) {
        wrapper.appendChild(renderCartProduct(product_id));
    }
    return wrapper;
};

export const renderCartProduct = (product_id) => {
    const product = products[product_id];
    const count = cart.get(product_id);

    const element = document.createElement("li");

    const rule = document.createElement("div");
    const name = document.createElement("span");
    name.textContent = product.name || "Название товара";
    rule.appendChild(name);
    const counter = renderCartProductCounter(product_id, count);
    rule.appendChild(counter);
    element.appendChild(rule);

    const summary = document.createElement("div");
    summary.textContent = `${product.price}₽ × ${count}шт. = ${product.price * count} ₽`;
    element.appendChild(summary);

    return element;
};

const renderCartProductCounter = (product_id, count) => {
    const counter = document.createElement("span");

    const incButton = document.createElement("button");
    incButton.type = "button";
    incButton.ariaLabel = "Добавить товар";
    incButton.appendChild(createPlus());
    incButton.addEventListener("click", () => cart.inc(product_id));
    counter.appendChild(incButton);

    const countLabel = document.createElement("span");
    countLabel.textContent = `${count}`;
    counter.appendChild(countLabel);

    const decButton = document.createElement("button");
    decButton.type = "button";
    decButton.ariaLabel = "Убрать товар";
    decButton.appendChild(createMinus());
    decButton.addEventListener("click", () => cart.dec(product_id));
    if (count === 1) decButton.disabled = true;
    counter.appendChild(decButton);

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.ariaLabel = "Удалить";
    clearButton.appendChild(createCross());
    clearButton.addEventListener("click", () => cart.set(product_id, 0));
    counter.appendChild(clearButton);

    return counter;
};
