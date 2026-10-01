# Магазинчик

[ТЗ на работу](https://github.com/Dasha2101/WEB2025Q26) ●
[Развернутая страница](onetwozzzplus.github.io/web-lab-1)

[![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Запуск

Запустить простой http сервер, открыть сайт, например

```bash
python3 -m http.server 8000
```

## Структура

Основная структура в [`index.html`](./index.html), все стили в [`style.css`](./style.css), иконки в [`/assets`](./assets/), картинки товаров в [`/public`](./public/).

В [`/src`](./src/) js код: [`main.js`](./src/main.js) - точка входа, [`products.js`](./src/products.js) - словарь товаров, [`cart`](./src/cart.js) - pub-sub объект тележки. В [`/src/ui`](./src/ui/) компоненты рендера каталога карточек товаров и тележки.

### Cart API

Состояние — `{ product_id: count }`, хранится в `localStorage` под ключом `shop:cart`.

| Метод                           | Описание                            |
| ------------------------------- | ----------------------------------- |
| `cart.load()`                   | Загрузить корзину из `localStorage` |
| `cart.items()`                  | Копия содержимого корзины           |
| `cart.get(id)`                  | Количество товара (или `0`)         |
| `cart.set(id, count)`           | Задать количество; `< 1` — удалить  |
| `cart.inc(id)` / `cart.dec(id)` | +1 / −1 (на единице — удалить)      |
| `cart.clear()`                  | Очистить корзину                    |
| `cart.subscribe(id, handler)`   | Подписка на конкретный товар        |
| `cart.subscribe(null, handler)` | Подписка на любые изменения         |

```js
cart.load();
cart.subscribe(null, () => handleRenderCart()); // корзина
cart.subscribe(product_id, (count) => {}); // карточка товара
```

`commit()` после каждого изменения пишет в `localStorage` и вызывает слушателей: по `id` — конкретные, затем общие.

### Генерация каталога

`renderCatalog()` в [`src/ui/catalog.js`](./src/ui/catalog.js) обходит `Object.keys(products)` и для каждого товара создаёт `<li><article class="product">` с фото, названием, ценой и счётчиком.

Счётчик карточки подписан на свой товар и перерисовывается сам:

```js
let counter = renderProductCardCounter(product_id, cart.get(product_id));
cart.subscribe(product_id, (count) => {
    const new_counter = renderProductCardCounter(product_id, count);
    counterWrapper.replaceChild(new_counter, counter);
    counter = new_counter;
});
```

`renderProductCardCounter(id, count)` переключает два состояния:

- `count === 0` → кнопка «Добавить в корзину» (`cart.inc`);
- `count > 0` → `− N +` (`cart.dec` / `cart.inc`).

### Генерация корзины

Устроена так же, но слушает всю корзину целиком.

`renderCart()` строит `<ul id="cart-list">` из `cart.items()` — или `<p>` «В корзине пусто». Для каждой позиции — название, счётчик `[−] N [+] [✕]` и строка `price₽ × count шт. = sum ₽`.

`getCartTotal()` суммирует `products[id].price × count` по всем позициям.

В [`src/main.js`](./src/main.js) блок корзины подписан на общие изменения:

```js
const handleRenderCart = () => {
    cartList.replaceWith(renderCart());
    cartTotal.textContent = getCartTotal();
    orderStartButton.disabled = getCartTotal() === 0;
};

handleRenderCart();
cart.subscribe(null, handleRenderCart);
```

Кнопка «Оформить заказ» блокируется, пока итог равен нулю.
