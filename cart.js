import { products } from "./products.js";

const user_cart = {};

const general_listeners = [];
const listeners = {};

const cleanup = (product_id) => {
    if (!products[product_id]) delete user_cart[product_id];
    return !products[product_id];
};

const commit = (product_id) => {
    localStorage.setItem("shop:cart", JSON.stringify(user_cart));
    if (listeners[product_id]) {
        listeners[product_id].forEach((handler) => {
            handler(user_cart[product_id] || 0);
        });
    }
    general_listeners.forEach((handler) => handler(user_cart));
};

export const cart = {
    load: () => {
        const str_cart = localStorage.getItem("shop:cart");
        if (str_cart) Object.assign(user_cart, JSON.parse(str_cart));
        return { ...user_cart };
    },
    items: () => {
        return { ...user_cart };
    },
    subscribe: (product_id, handler) => {
        if (product_id !== null) {
            if (!listeners[product_id]) listeners[product_id] = [handler];
            else listeners[product_id].push(handler);
        } else {
            general_listeners.push(handler);
        }
    },
    get: (product_id) => {
        if (cleanup(product_id)) return;
        return user_cart[product_id] ? user_cart[product_id] : 0;
    },
    set: (product_id, count) => {
        if (cleanup(product_id)) return;
        if (count < 1) delete user_cart[product_id];
        else user_cart[product_id] = count;
        commit(product_id);
    },
    inc: (product_id) => {
        if (cleanup(product_id)) return;
        if (user_cart[product_id]) user_cart[product_id] += 1;
        else user_cart[product_id] = 1;
        commit(product_id);
    },
    dec: (product_id) => {
        if (cleanup(product_id)) return;
        if (user_cart[product_id] && user_cart[product_id] > 1)
            user_cart[product_id] -= 1;
        else delete user_cart[product_id];
        commit(product_id);
    },
};
