import { cart } from "../cart.js";
import { products } from "../products.js";

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

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.ariaLabel = "Добавить товар";
    addButton.textContent = "+";
    addButton.addEventListener("click", () => cart.inc(product_id));
    counter.appendChild(addButton);

    const countLabel = document.createElement("span");
    countLabel.textContent = `${count}`;
    counter.appendChild(countLabel);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.ariaLabel = "Убрать товар";
    removeButton.textContent = "-";
    removeButton.addEventListener("click", () => cart.dec(product_id));
    counter.appendChild(removeButton);

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.ariaLabel = "Удалить";
    clearButton.textContent = "×";
    clearButton.addEventListener("click", () => cart.set(product_id, 0));
    counter.appendChild(clearButton);

    return counter;
};
