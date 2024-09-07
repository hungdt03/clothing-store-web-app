import { CartResource } from "../resources"

export function getCart() {
    const cartString = localStorage.getItem('cart')
    const cart = (cartString ? JSON.parse(cartString) : {
        cartItems: [],
        total: 0
    }) as CartResource
    return cart
}