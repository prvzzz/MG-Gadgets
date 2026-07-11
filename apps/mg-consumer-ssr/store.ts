import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import navReducer from "./features/breadcrumb/navSlice";
import alertReducer from "./features/alert/alertSlice";
import searchReducer from "./features/search/searchSlice";
import cartReducer from "./features/cart/cartSlice";
import checkoutReducer from "./features/checkout/checkoutSlice";
// const initialState = {

// }



const store = configureStore({
    reducer: {
        auth: authReducer,
        nav: navReducer,
        alert: alertReducer,
        search: searchReducer,
        cart: cartReducer,
        checkout: checkoutReducer
    }
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;