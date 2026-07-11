import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
    query: string;
}

const initialState = {
    query: ""
}



export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setQuery: (state: InitialState, action) => {
            console.log("action:", action);
            state.query = action.payload.q;
        }
    }
}
);

export default searchSlice.reducer;

export const { setQuery } = searchSlice.actions;