import { createSlice } from "@reduxjs/toolkit";
import { CartItem } from "../../screens/types";



interface InitialState {
    items: Array<CartItem>,
    show: boolean,
    total: number
}

const initialState = {
    items: new Array<CartItem>(),
    show: false,
    total: 0
}



export const checkoutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        showCheckout: (state: InitialState, action) => {
            state.show = action.payload.show;
        },
        setTotal: (state: InitialState, action) => {
            state.total = action.payload.total
        }
    }
}
);

export default checkoutSlice.reducer;

export const { showCheckout, setTotal } = checkoutSlice.actions;