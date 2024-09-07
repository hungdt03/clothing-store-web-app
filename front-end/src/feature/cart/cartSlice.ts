import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { getCart } from "../../utils/cart"
import { RootState } from "../../app/store";
import { ProductResource, VariantResource } from "../../resources";

export type CartItemPayload = {
    quantity: number;
    variant: VariantResource;
    price: number;
    product: ProductResource
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: getCart(),
    reducers: {
        addNewOrIncreaseQuantity(state, action: PayloadAction<CartItemPayload>) {
            const index = state.cartItems.findIndex(item => item.variant.id === action.payload.variant.id);
            const increaseTotal = action.payload.quantity * action.payload.price;
            if (index > -1) {
                state.cartItems[index].quantity += action.payload.quantity;
                state.cartItems[index].subTotal += increaseTotal;
            } else {
                state.cartItems.push({
                    ...action.payload,
                    subTotal: increaseTotal
                })
            }

            state.total += increaseTotal;
            localStorage.setItem('cart', JSON.stringify(state))
           
        },
        increaseQuantity(state, action: PayloadAction<number>) {
            const index = state.cartItems.findIndex(item => item.variant.id === action.payload);

            if (index > -1) {
                state.cartItems[index].quantity += 1;
                state.cartItems[index].subTotal += state.cartItems[index].price;
                state.total += state.cartItems[index].price;
            }
            localStorage.setItem('cart', JSON.stringify(state))
        },
        descreaseQuantity(state, action: PayloadAction<number>) {
            const index = state.cartItems.findIndex(item => item.variant.id === action.payload);

            if (index > -1) {
                if (state.cartItems[index].quantity > 0) {
                    state.cartItems[index].quantity -= 1;
                    state.cartItems[index].subTotal -= state.cartItems[index].price;
                    state.total -= state.cartItems[index].price;
                }
            }
            localStorage.setItem('cart', JSON.stringify(state))
        },
        removeItem(state, action: PayloadAction<number>) {
            state.cartItems = state.cartItems.filter(item => item.variant.id !== action.payload);
            state.total = state.cartItems.reduce((prev, cur) => cur.subTotal + prev, 0)
            localStorage.setItem('cart', JSON.stringify(state))
        },
        clearCart(state) {
            localStorage.removeItem('cart')
            state.cartItems = []
            state.total = 0
        }
    },
})

export const selectCart = (state: RootState) => state.cart;
export const { addNewOrIncreaseQuantity, clearCart, increaseQuantity, descreaseQuantity, removeItem } = cartSlice.actions
export default cartSlice.reducer