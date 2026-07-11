import { useDispatch, useSelector } from "react-redux";

import images from "../images";
import { setLoginModalState, setPartnerRegistrationModalState } from "../features/auth/authSlice";
import { RootState } from "../store";
import { FaShoppingBasket, FaUserCircle } from "react-icons/fa";
import { setQuery } from "../features/search/searchSlice";
import DataRepository from "../services/dataRepository";
import { useEffect, useState } from "react";
import { Product } from "../dto/Product";
import { GLOBAL_CONSTANTS } from "../global.constants";
import { show } from "../features/cart/cartSlice";
import { PageContext } from "vite-plugin-ssr/types";
import Skeleton from "react-loading-skeleton";



export default function Header(props: any) {

    const dispatch = useDispatch();
    const authState = useSelector((state: RootState) => state.auth);
    const searchState = useSelector((state: RootState) => state.search);
    const [results, setResults] = useState<Array<Product>>();
    const [params, setParams] = useState(new URLSearchParams());
    const dataRepo = new DataRepository();

    const initLogin = () => {
        (document.querySelector(".mobileNav") as HTMLElement).style.display = "none";
        dispatch(setLoginModalState({ showLoginPopup: true }));
    }

    const initPartnerRegistration = () => {
        dispatch(setPartnerRegistrationModalState({ showPartnerRegistrationModal: true }))
    }

    function search(value: string) {
        dispatch(setQuery({ q: value }))

        let qp = new URLSearchParams(params);
        if (value.replace(/ /g, "").length > 2) {
            qp.set("q", value);
            setParams(qp);
        } else {
            qp.delete("q");
            setParams(qp);
        }

        // window.location.search = qp.toString();
    }

    function showCart() {
        dispatch(show({ show: true }));
    }

    useEffect(() => {



        if (params.get("q") != null) {
            populate(params.get("q"));

        }
        if (params.get("q") == null || params.get("q") == "") {
            setResults([]);
        }


    }, [params]);

    const populate = async (q: string | null) => {
        await dataRepo.searchForProducts(q).then(data => setResults(data.data)).catch(err => console.log(err));
    }

    let openMenu = () => {
        let elem = document.querySelector(".mobileNav") as HTMLElement;
        if (elem) {
            elem.style.display = "block";
        }
    }

    let closeMenu = () => {
        document.querySelector("#closeMenu")?.addEventListener("click", (e) => {
            (document.querySelector(".mobileNav") as HTMLElement).style.display = "none";
        });
    }

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
        // set initial parameters
        setParams(new URLSearchParams());
    }, [])


    return (<>

        <header id="header" className="bg-gradient-to-b from-black to-black pb-2 border-b-0" >
            <div id="sticky-header" className="bg-gradient-to-b from-black to-black m-0 p-3 pt-4.5 pb-5 w-full grid grid-cols-8 align-middle max-sm:flex max-sm:flex-row max-sm:justify-between max-sm:align-center max-sm:p-0 border-b-0 border-gray-100">


                <div id="header__logo" className="max-sm:hidden max-sm:opacity-0 h-full mr-2.5 col-span-2 md:w-8/12 max-md:w-52 flex flex-col justify-center align-middle max-md:mr-1 w-full place-self-end mr-2.5">
                    <a className="text-white text-2xl" href="/" style={{fontFamily:"Josefin Sans Bold", fontWeight:"bold"}}>
                        {/* MG GADGETS */}
                        <img alt="MG Gadgets Logo" className="w-full max-sm:hidden" src={images.logo} />
                    </a>
                </div>
                <div className="header__logo_mobile md:hidden flex justify-between gap-0 max-sm:gap-3.5" style={{ width: "100%", alignItems:"center", padding:"0px" }}>

                    <a href="/" className="text-white font-bolder" style={{fontWeight:"bolder", fontFamily:"Josefin Sans Bold"}}>
                        <img alt="MG Gadgets Logo" style={{ width: "150px" }} className="w-fit font-bold" src={images.logo} />
                        {/* MG GADGETS */}
                    </a>
                    <div id="header__icons" className="md:hidden text-white flex gap-2.5 justify-center align-middle pr-1 max-sm:pr-0">
                    {authState.token && <FaShoppingBasket onClick={() => showCart()} style={{ width: "26px", height: "26px", margin:"5px", marginRight:"7px" }} color="white" />}
                    <span onClick={() => openMenu()} className="fa-solid fa-bars text-white m-0 burgerMenu p-2.5" style={{ fontSize: "1.2rem" }}></span>

                    </div>
                </div>
                <div id="header__search" className="max-sm:hidden place-items-center max-sm:col-span-5  col-span-4 w-fill h-fit p-2 rounded-lg" style={{ background: "white" }}>
                    <form id="header__searchForm" className="w-full h-fit flex">
                        <span style={{ color: "#000000" }} className="fa-solid fa-search m-auto"></span>
                        <input onChange={(e) => { search(e.target.value) }} value={searchState.query} type="text" className="searchinput w-full pl-2 pt-1 pb-1 pr-1 text-sm" placeholder="Search mobiles, brands and more" style={{ color: "black" }} />
                        {results && results?.length > 0 && <span onClick={() => search("")} style={{ color: "#7f7f7f87" }} className="fa-solid fa-close m-auto"></span>}
                    </form>
                    {/* <div onClick={() => search("")} className="searchWrapper"></div> */}
                    {
                        (results && results?.length > 0) && <div>
                            <div className="searchResults">

                                <ul style={{ animationName: (results.length > 0) ? "expand" : "collapse" }} className="itemsList">
                                    {
                                        results.map(result => {
                                            return <li>
                                                <a data-result="true" href={"/sell-phone/models/" + result.brand + "/" + result.alias} style={{ width: "100%", height: "100%" }}>
                                                    <div>
                                                        <img src={GLOBAL_CONSTANTS.s3Base + result.product_images[0] + ".png"} />
                                                        <p>
                                                            {result.title}
                                                        </p>
                                                    </div>
                                                </a>
                                            </li>
                                        })
                                    }
                                </ul>


                            </div>
                        </div>
                    }

                </div>

                {!authState.sessionStarted && <div id="headerIconsSkeleton"><Skeleton className="max-sm:hidden sm:hidden" style={{ marginLeft: "5px" }} baseColor="black" highlightColor="gray" count={2} width={"200px"} /></div>}
                {authState.sessionStarted && !authState.token && <div id="header__icons" className="col-span-2 ml-2 max-sm:hidden" >
                    <button onClick={() => initLogin()} className="mr-2 btn primary btn-sm text-white">Login</button>

                    <button onClick={() => initPartnerRegistration()} className="mr-2 btn primary btn-sm text-white">Become a Partner</button>
                </div>}

                {authState.token && <div className="w-full flex align-middle justify-start gap-8  ml-8 max-sm:col-span-1 sm:col-span-2 container max-md:hidden" style={{ alignItems: "center" }}>

                    <FaShoppingBasket onClick={() => showCart()} style={{ width: "30px", height: "30px" }} color="white" />

                    <a href="/profile" className="flex justify-start align-middle gap-1.5">
                        <FaUserCircle style={{ width: "30px", height: "30px" }} color="white" />
                        <p className="text-white mt-1">
                            {authState.fullName}
                        </p>
                    </a>

                </div>}



            </div>

            <div id="header__search" className="md:hidden bg-grey-500  max-sm:col-span-5 mt-2 col-span-4 w-fit h-fit p-2.5 rounded-lg" style={{ boxShadow: "0 0 1px 1px rgba(211, 211, 211, 0.354)", width: "94%", marginLeft: "3%", background: "white" }}>
                <form id="header__searchForm" className="w-full h-fit flex">
                    <span style={{ color: "#black" }} className="fa-solid fa-search m-auto"></span>
                    <input style={{ background: "white", color: "black" }} onChange={(e) => { search(e.target.value) }} value={searchState.query} type="text" className="searchinput w-full pl-2 pt-1 pb-1 pr-1 text-sm" placeholder="Search mobiles, brands and more" />
                </form>

                {(results && results?.length > 0) && <div>
                    <div onClick={() => search("")} className="searchWrapper">
                        <div onClick={() => search("")} className="searchResults">
                            {/* mobile */}
                            <ul style={{ animationPlayState: (results.length > 0) ? "running" : "" }} className="itemsList">
                                {
                                    results.map(result => {
                                        return <li>
                                            <a data-result="true" className="w-fill h-fill" href={"/sell-phone/models/" + result.brand + "/" + result.alias} style={{ width: "100%", height: "100%" }}>
                                                <div>
                                                    <img src={GLOBAL_CONSTANTS.s3Base + result.product_images[0] + ".png"} />
                                                    <p>
                                                        {result.title}
                                                    </p>
                                                </div>
                                            </a>
                                        </li>
                                    })
                                }
                            </ul>


                        </div>
                    </div>

                </div>}
            </div>

        </header>
        <nav id="navbar" className="md:hidden mobileNav bg-black w-full p-1.5">
            <span onClick={() => closeMenu()} id="closeMenu" style={{ position: "absolute", "top": "15px", "right": "15px", padding: "15px" }} className="fa-solid fa-times text-black"></span>
            {authState.sessionStarted && !authState.token && <div id="header__icons" className="col-span-2 ml-2 mt-9 mr-2" >
                <button onClick={() => initLogin()} className="btn primary btn-md text-black w-full">Login</button><br />

                <button onClick={() => initPartnerRegistration()} className="btn primary btn-md mt-2 text-black w-full">Become a Partner</button>
            </div>}
            <ul className="parentContainer font-medium w-full p-3 pb-0 flex flex-row justify-center align-middle md:text-white space-x-14 mt-1.5">
                <li>

                </li>
                <li style={{ width: "100%" }}>
                    {authState.token && <a href="/profile" className="flex justify-start align-middle gap-1.5 text-black">
                        <FaUserCircle style={{ width: "30px", height: "30px" }} color="black" />
                        <p className="text-black mt-1 font-semibold text-2xl">
                            {authState.fullName}
                        </p>
                    </a>}
                </li>
                <li className="dropdown-container parent">
                    <a href="/">Home</a>
                </li>
                <li className="dropdown-container parent">
                    <a href="/buy-phone/">Buy Phone&nbsp;<i className="fa fa-plus"></i>
                    </a>
                    <i className="fa fa-minus"></i>
                    <ul className="dropdown parent">
                        <li>
                            <a href="/buy-phone/models/apple">Apple</a>
                        </li>
                        <li>
                            <a href="/buy-phone/models/samsung">Samsung</a>
                        </li>

                        <li>
                            <a href="/buy-phone/models/google">Google</a>
                        </li>
                        <li>
                            <a href="/buy-phone/models/xiaomi">Xiaomi</a>
                        </li>
                        <li>
                            <a href="/buy-phone/models/one-plus">One Plus</a>
                        </li>
                        {/* <li className="dropdown-container child">
                            <a href="/">Item 1</a>
                            <ul className="dropdown child">
                                <li>
                                    <a href="">Item Child</a>
                                    <li className="dropdown-container child">
                                        <a href="">Item Child 2</a>
                                        <ul className="dropdown child">
                                            <li>
                                                <a href="">Item Child Child</a>
                                            </li>
                                        </ul>
                                    </li>
                                </li>

                            </ul>
                        </li> */}
                    </ul>

                </li>
                <li className="dropdown-container parent">
                    <a href="/sell-phone">Sell Phone&nbsp;<i className="fa fa-plus"></i>
                        <i className="fa fa-minus"></i>
                    </a>
                    <ul className="dropdown parent">
                        <li>
                            <a href="/buy-phone/models/apple">Apple</a>
                        </li>
                        <li>
                            <a href="/buy-phone/models/samsung">Samsung</a>
                        </li>

                        <li>
                            <a href="/buy-phone/models/google">Google</a>
                        </li>
                        <li>
                            <a href="/buy-phone/models/xiaomi">Xiaomi</a>
                        </li>
                        <li>
                            <a href="/buy-phone/models/one-plus">One Plus</a>
                        </li>
                        {/* <li className="dropdown-container child">
                            <a href="/">Item 1</a>
                            <ul className="dropdown child">
                                <li>
                                    <a href="">Item Child</a>
                                    <li className="dropdown-container child">
                                        <a href="">Item Child 2</a>
                                        <ul className="dropdown child">
                                            <li>
                                                <a href="">Item Child Child</a>
                                            </li>
                                        </ul>
                                    </li>
                                </li>

                            </ul>
                        </li> */}
                    </ul>
                </li>
                <li className="dropdown-container parent">
                    <a href="/repair-phone">Repair Phone&nbsp;<i className="fa fa-plus"></i>
                    </a>

                </li>
                <li>
                    <a href="#">Partner Program</a>
                </li>
                <li>
                    <a href="#">Blog</a>
                </li>
                <li>
                    <a href="#">About</a>
                </li>
            </ul>

            <ul className="max-sm:hidden w-full p-3 pb-0 flex flex-row justify-center align-middle md:text-white space-x-14">
                <li className="dropdown-container parent">
                    <a href="/">Home</a>
                </li>
                <li className="dropdown-container parent">
                    <a href="/buy-phone/">Buy Phone&nbsp;<i className="fa fa-angle-down"></i></a>
                    <ul className="dropdown parent">
                        <li>
                            <a href="/">Item 1</a>
                        </li>
                        <li>
                            <a href="/">Item 1</a>
                        </li>
                        <li className="dropdown-container child">
                            <a href="/">Item 1</a>
                            <ul className="dropdown child">
                                <li>
                                    <a href="">Item Child</a>
                                </li>
                                <li className="dropdown-container child">
                                    <a href="">Item Child 2</a>
                                    <ul className="dropdown child">
                                        <li>
                                            <a href="">Item Child Child</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="/">Item 1</a>
                        </li>
                        <li>
                            <a href="/">Item 1</a>
                        </li>
                        <li>
                            <a href="/">Item 1</a>
                        </li>
                        <li className="dropdown-container child">
                            <a href="/">Item 1</a>
                            <ul className="dropdown child">
                                <li>
                                    <a href="">Item Child</a>
                                </li>
                                <li className="dropdown-container child">
                                    <a href="">Item Child 2</a>
                                    <ul className="dropdown child">
                                        <li>
                                            <a href="">Item Child Child</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li className="dropdown-container parent">
                    <a href="/sell-phone">Sell Phone&nbsp;<i className="fa fa-angle-down"></i></a>
                </li>
                <li className="dropdown-container parent">
                    <a href="/repair-phone">Repair Phone&nbsp;<i className="fa fa-angle-down"></i></a>
                    <ul className="dropdown parent">
                        <li>
                            <a href="">Test Item</a>
                        </li>
                        <li className="dropdown-container child">
                            <a href="">Test Item</a>
                            <ul className="dropdown child">
                                <li>
                                    <a href="">
                                        Child Test Item
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#">Partner Program</a>
                </li>
                <li>
                    <a href="#">Blog</a>
                </li>
                <li>
                    <a href="#">About</a>
                </li>
            </ul>
        </nav>
        <nav id="navbar" className="max-sm:hidden bg-black w-full p-1.5">

            <ul className="max-md:hidden parentContainer font-medium w-full p-3 pb-0 flex flex-row justify-center align-middle md:text-white space-x-14">
                <li className="dropdown-container parent">
                    <a href="/">Home</a>
                </li>
                <li className="dropdown-container parent">
                    <a href="/buy-phone/">Buy Phone&nbsp;<i className="fa fa-angle-down"></i></a>
                    <ul className="dropdown parent">
                        <li>
                            <a href="/buy-phone/models/apple">Apple</a>
                        </li>
                        <li>
                            <a href="/buy-phone/models/samsung">Samsung</a>
                        </li>

                        <li>
                            <a href="/buy-phone/models/google">Google</a>
                        </li>
                        <li>
                            <a href="/buy-phone/models/xiaomi">Xiaomi</a>
                        </li>
                        <li>
                            <a href="/buy-phone/models/one-plus">One Plus</a>
                        </li>
                        {/* <li className="dropdown-container child">
                            <a href="/">Item 1</a>
                            <ul className="dropdown child">
                                <li>
                                    <a href="">Item Child</a>
                                    <li className="dropdown-container child">
                                        <a href="">Item Child 2</a>
                                        <ul className="dropdown child">
                                            <li>
                                                <a href="">Item Child Child</a>
                                            </li>
                                        </ul>
                                    </li>
                                </li>

                            </ul>
                        </li> */}
                    </ul>
                </li>
                <li className="dropdown-container parent">
                    <a href="/sell-phone">Sell Phone&nbsp;<i className="fa fa-angle-down"></i></a>
                    <ul className="dropdown parent">
                        <li>
                            <a href="/sell-phone/models/apple">Apple</a>
                        </li>
                        <li>
                            <a href="/sell-phone/models/samsung">Samsung</a>
                        </li>

                        <li>
                            <a href="/sell-phone/models/google">Google</a>
                        </li>
                        <li>
                            <a href="/sell-phone/models/xiaomi">Xiaomi</a>
                        </li>
                        <li>
                            <a href="/sell-phone/models/one-plus">One Plus</a>
                        </li>
                        {/* <li className="dropdown-container child">
                            <a href="/">Item 1</a>
                            <ul className="dropdown child">
                                <li>
                                    <a href="">Item Child</a>
                                    <li className="dropdown-container child">
                                        <a href="">Item Child 2</a>
                                        <ul className="dropdown child">
                                            <li>
                                                <a href="">Item Child Child</a>
                                            </li>
                                        </ul>
                                    </li>
                                </li>

                            </ul>
                        </li> */}
                    </ul>
                </li>
                <li className="dropdown-container parent">
                    <a href="/repair-phone">Repair Phone</a>

                </li>
                <li>
                    <a href="#">Partner Program</a>
                </li>
                <li>
                    <a href="#">Blog</a>
                </li>
                <li>
                    <a href="#">About</a>
                </li>
            </ul>


        </nav>

    </>)
}