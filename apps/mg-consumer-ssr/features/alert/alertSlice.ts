import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    message: undefined,
    show:false

}

export const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        setAlert: (state, action) => {
            // console.log("action", action);
            state.message = action.payload.message;
            state.show = action.payload.show;
        }
    }
});

export default alertSlice.reducer;

export const { setAlert } = alertSlice.actions;