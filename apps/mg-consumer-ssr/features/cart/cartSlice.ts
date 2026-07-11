import { createSlice } from "@reduxjs/toolkit";
import { CartItem, RepairCostItem } from "../../misc/types";
import { Product } from "../../dto/Product";
import { ValueEstimate } from "../../dto/ValueEstimate";



interface InitialState {
    items: Array<CartItem>,
    show: boolean,
    itemCondition?: ValueEstimate
}

const initialState = {
    items: new Array<CartItem>(),
    show: false
}



export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setLocalItems: (state, action) => {
            state.items = action.payload.items;
            console.log("setLocalItems:", state.items, action.payload.items);
        },
        addItem: (state: InitialState, action) => {
            console.log("addItem:", state.items);
            var toInsert: CartItem = action.payload.item;
            if(toInsert.type == "sell"){
                // allow only one item per sell order
                state.items = [toInsert];
                return;
            }
            if (toInsert.type == "service") {
                let existing = state.items.findIndex(it => (it.product as RepairCostItem).name == (toInsert.product as RepairCostItem).name);
                console.log("existing:", existing);
                console.log("toInsert:", toInsert);
                if (existing == -1) {
                    state.items.push(toInsert);
                } else {
                    state.items = state.items.filter(it => (it.product as RepairCostItem).name != (toInsert.product as RepairCostItem).name);
                }

                return;
            }
            var existing: number = state.items.findIndex(it => (it.product as Product)?.alias == (toInsert.product as Product)?.alias);
            console.log("Adding:", existing);
            console.log("existing:", existing);
            if (existing != -1) {
                toInsert.quantity = state.items[existing].quantity + 1;
                state.items[existing] = toInsert;
            } else {
                state.items.push(toInsert)
            }

        },
        updateItem: (state: InitialState, action) => {
            var toUpdate: CartItem = action.payload.item;
            var existing: number = state.items.findIndex(it => (it.product as Product).alias == (toUpdate.product as Product).alias);
            console.log("Existing:", state.items[existing]);
            if (existing >= 0) {
                state.items[existing] = toUpdate;
            }

        },
        deleteItem: (state: InitialState, action) => {
            if (action.payload.item?.type == "service") {
                state.items = state.items.filter(it => (it.product as RepairCostItem).name != (action.payload.item).product.name);
            } else {

                state.items = state.items.filter(it => (it.product as Product).alias != (action.payload.item).product.alias);
            }
        },
        show: (state: InitialState, action) => {
            state.show = action.payload.show;
        }
    }
}
);

export default cartSlice.reducer;

export const { setLocalItems, addItem, show, updateItem, deleteItem } = cartSlice.actions;





