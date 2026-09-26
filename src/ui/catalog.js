import { cart } from "../cart.js";
import { products } from "../products.js";
import { createPlus, createMinus } from "./assets.js";

export const renderCatalog = () => {
    const wrapper = document.createElement("ul");
    wrapper.id = "catalog-list";
    for (const product_id of Object.keys(products)) {
        const element = document.createElement("li");
        element.appendChild(renderProductCard(product_id));
        wrapper.appendChild(element);
    }
    return wrapper;
};

const renderProductCard = (product_id) => {
    const wrapper = document.createElement("article");
    wrapper.classList.add("product");

    const product = products[product_id];
    const img = document.createElement("img");
    img.src = product.image || "assets/box.svg";
    img.alt = product.name || "Название товара";
    wrapper.appendChild(img);
    const name = document.createElement("h4");
    name.textContent = product.name || "Название товара";
    wrapper.appendChild(name);
    const price = document.createElement("p");
    price.textContent = `${product.price}₽` || "0₽";
    wrapper.appendChild(price);

    const counterWrapper = document.createElement("div");
    let counter = renderProductCardCounter(product_id, cart.get(product_id));
    cart.subscribe(product_id, (count) => {
        const new_counter = renderProductCardCounter(product_id, count);
        counterWrapper.replaceChild(new_counter, counter);
        counter = new_counter;
    });
    counterWrapper.appendChild(counter);
    wrapper.appendChild(counterWrapper);

    return wrapper;
};

const renderProductCardCounter = (product_id, count) => {
    const counter = document.createElement("div");
    if (count === 0) {
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.ariaLabel = "Добавить товар";
        addButton.textContent = "Добавить в корзину";
        addButton.addEventListener("click", () => cart.inc(product_id));
        counter.appendChild(addButton);
    } else {
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
        counter.appendChild(decButton);
    }

    return counter;
};
