import { Outlet, useSearchParams } from "react-router";
import Breadcrumb from "./Breadcrumb";
import Header from "./Header";
import Footer from "./Footer";
import Alert from "./Alert";
import Login from "../screens/Login";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModalState } from "../features/auth/authSlice";
import { RootState } from "../store";
import { Cart } from "../screens/Cart";

import Skeleton from "react-loading-skeleton";
import { Checkout } from "../screens/Checkout";

export default function Layout() {

    const [params] = useSearchParams();

    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    useEffect(() => {
        var queries = new URLSearchParams(params);
        var isLogin = queries.get("login");
        console.log("is login", isLogin);
        if (isLogin && isLogin == "true" && auth.sessionStarted && !auth.token) {
            dispatch(setLoginModalState({ showLoginPopup: true }));
        }

    }, [auth.sessionStarted]);

    useEffect(() => {
        document.querySelector(".burgerMenu")?.addEventListener("click", (e) => {
            console.log("Opening Menu");
            let elem = document.querySelector(".mobileNav") as HTMLElement;
            if (elem) {
                elem.style.display = "block";
            }
        });

        document.querySelector("#closeMenu")?.addEventListener("click", (e) => {
            (document.querySelector(".mobileNav") as HTMLElement).style.display = "none";
        });
        
    }, [])

    return (
        <>
            <div className="content">

                <Outlet />
            </div>

        </>
    )

}