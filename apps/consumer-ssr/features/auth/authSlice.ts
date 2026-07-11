import { createSlice } from "@reduxjs/toolkit";

// interface InitialState {
//     userName: string;
//     userDpUrl: string;
//     fullName: string;
//     userType: number | string;
//     email: string;
//     showLoginPopup?: boolean;
//     token?: string;
//     sessionStarted?:boolean;
// }

const initialState = {
    userName: "",
    fullName: "",
    userDpUrl: "",
    userType: -1,
    email: "",
    showLoginPopup: false,
    showPartnerRegistrationModal: false,
    token: "",
    sessionStarted: false,
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
}



export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            console.log("action:", action);
            state.fullName = action.payload.fullName;
            state.userName = action.payload.userName;
            state.userDpUrl = action.payload.userDpUrl;
            state.email = action.payload.email;
            state.userType = action.payload.userType;
            state.address = action.payload.address;
            state.city = action.payload.city;
            state.state = action.payload.state;
            state.pincode = action.payload.pincode;

        },
        setUserType: (state, action) => {
            console.log("action", action);
            state.userType = action.payload.userType;
        },
        setLoginModalState: (state, action) => {
            console.log("Setting login modal state:", action.payload);
            state.showLoginPopup = action.payload.showLoginPopup;
        },
        setPartnerRegistrationModalState: (state, action) => {
            state.showPartnerRegistrationModal = action.payload.showPartnerRegistrationModal;
        },
        setToken: (state, action) => {
            state.token = action.payload.token;
        },
        setSessionState: (state, action) => {
            state.sessionStarted = action.payload.sessionState;
        },
        setPhoneNumberAction: (state, action) => {
            state.phoneNumber = action.payload.phoneNumber;
        }
    }
});

export default authSlice.reducer;

export const { setPhoneNumberAction, setUser, setUserType, setPartnerRegistrationModalState, setLoginModalState, setToken, setSessionState } = authSlice.actions;