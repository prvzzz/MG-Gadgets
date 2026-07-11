import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
    url: string;
}

const initialState = {
    url: ""
}



export const navSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUrl: (state: InitialState, action) => {
            console.log("action:", action);
            state.url = action.payload.url;
        }
    }
}
);

export default navSlice.reducer;

export const { setUrl } = navSlice.actions;