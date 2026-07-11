import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { FaMinus, FaPlus, FaShoppingBasket, FaTimes, FaBatteryHalf, FaCamera, FaMicrophone, FaMobile, FaSpeakerDeck, FaWaveSquare } from "react-icons/fa";
import { deleteItem, setLocalItems, show, updateItem } from "../features/cart/cartSlice";
import { GLOBAL_CONSTANTS } from "../global.constants";
import { CartItem, RepairCostItem } from "../misc/types";
import { Product } from "../dto/Product";
import { useEffect } from "react";
import { setTotal } from "../features/checkout/checkoutSlice";
import { showCheckout } from "../features/checkout/checkoutSlice";
import { setLoginModalState } from "../features/auth/authSlice";

export function Cart() {

    const dispatch = useDispatch();
    const cartState = useSelector((state: RootState) => state.cart);
    const authState = useSelector((state: RootState) => state.auth);

    const increaseQtyForItem = (to_update: CartItem) => {
        if (to_update.quantity == 5) return;
        dispatch(updateItem({ item: { ...to_update, quantity: to_update.quantity + 1 } }));
    }

    const decreaseQtyForItem = (to_update: CartItem) => {
        console.log("updating qty", to_update);
        if (to_update.quantity == 1) removeItem(to_update);
        dispatch(updateItem({ item: { ...to_update, quantity: to_update.quantity - 1 } }));
    }

    const removeItem = (to_remove: CartItem) => {

        dispatch(deleteItem({ item: to_remove }));
    }

    const calculateTotalSaleValue = (items: Array<CartItem>) => {
        var total = 0;

        for (var i in items) {
            var p = items[i];
            var type = p.type;
            total += (items[i].unit_amount * items[i].quantity);
        }
        dispatch(setTotal({ total: total }))
        return total;
    }

    const calculateTotal = (items: Array<CartItem>) => {
        var total = 0;

        for (var i in items) {
            var p = items[i];
            var type = p.type;
            if (type == "service") {
                total += p.total_amount;
            }
            if (type == "buy") {
                let item = (p.product as Product);
                total += (item.variants.at(p.selected_variant).max_retail_price) * p.quantity;
            }
        }
        dispatch(setTotal({ total: total }))
        return total;
    }




    useEffect(() => {

        var items = localStorage.getItem("__cart");
        if (items) {
            dispatch(setLocalItems({ items: JSON.parse(items) }))
        } else {

        }

        window.addEventListener("unload", () => {
            if (cartState.items.length != 0) {
                localStorage.setItem("__cart", JSON.stringify(cartState.items));
            }
        })

        window.addEventListener("load", () => {
            console.log("load start, dispatching items");

        })
    }, []);

    const LABELS = {
        "screen": "Screen Repair Service",
        "battery": "Battery Repair Service",
        "sensor": "Proximity Sensor Repair Service",
        "mic": "Microphone Repair Service",
        "back_camera": "Back Camera Repair Service",
        "speaker": "Speaker Repair Service"
    }

    const ICONS = {
        "screen": <FaMobile style={{ width: "22px", height: "22px" }} />,
        "battery": <FaBatteryHalf style={{ width: "22px", height: "22px" }} />,
        "sensor": <FaWaveSquare style={{ width: "22px", height: "22px" }} />,
        "speaker": <FaSpeakerDeck style={{ width: "22px", height: "22px" }} />,
        "mic": <FaMicrophone style={{ width: "22px", height: "22px" }} />,
        "back_camera": <FaCamera style={{ width: "22px", height: "22px" }} />
    }


    return (<>

        {
            <Drawer theme={{
                header: {
                    inner:{
                        titleText:"text-2xl mb-0 text-black pb-0 ",
                        closeIcon:"text-2xl w-4",
                        closeButton:"text-2xl ",
                        titleIcon:"text-2xl b-2",
                        titleCloseIcon:"text-7xl "
                    }
                },
            }} className="w-2/5 max-sm:w-full" style={{ zIndex: 1101 }} open={cartState.show} color="white" onClose={() => { dispatch(show({ show: false })) }} position="right">
                <DrawerHeader titleIcon={() => {
                    return <FaShoppingBasket className="mr-3" />
                }}
                    title="Cart"

                >
                </DrawerHeader>

                <DrawerItems className="h-9/12 overflow-scroll">
                    <div className="flex flex-col h-full justify-between align-middle">
                        {(cartState.items?.length == 0) && <p className="text-center text-black">No items here</p>}
                        {cartState.items && <div>

                            <ul className="cartItems">
                                {cartState.items.map(item => {
                                    return <><li>

                                        {/* Products without repair services */}
                                        {(item.product && !(item.type == "service")) &&

                                            <div className="gap-3.5">
                                                <img src={GLOBAL_CONSTANTS.s3Base + (item.product as Product).product_images[0] + ".png"} />
                                                <div>
                                                    <p className="font-bold text-sm">
                                                        {(item.product as Product).title}
                                                    </p>
                                                    <p className="text-sm">
                                                        {(item.product as Product).variants?.at(item.selected_variant || 0)?.color}, {(item.product as Product).variants.at(item.selected_variant || 0)?.storage_size + "GB"} /  {(item.product as Product).variants.at(item.selected_variant || 0)?.ram_size + "GB"}
                                                    </p>


                                                </div>

                                                {item.type != "sell" && <div style={{ border: "1px solid gray", borderRadius: "5px", padding: "4px", display: "flex", flexDirection: "row", alignSelf: "center", alignItems: "center" }} className="flex flex-row w-full qty">
                                                    {<FaMinus onClick={() => decreaseQtyForItem(item)} size={"0.7rem"} color="gray" stroke="1px" />}
                                                    <p style={{ fontSize: "0.8rem", color: "gray", fontWeight: "bold", paddingLeft: "6px", paddingRight: "6px" }}>
                                                        {item.quantity}
                                                    </p>
                                                    {<FaPlus onClick={() => increaseQtyForItem(item)} size={"0.7rem"} color="gray" stroke="1px" />}

                                                </div>}
                                                <div></div>
                                                {item.type != "sell" && <p className="flex align-middle gap-1" style={{ alignItems: "center", fontSize: "1.05rem" }}>
                                                    <span className="fa fa-inr" ></span>{(item.quantity * ((item.product as Product).variants.at(item.selected_variant || 0)?.max_retail_price || 0)).toLocaleString("en")}
                                                </p>}
                                                {item.type == "sell" && <p className="flex align-middle gap-1" style={{ alignItems: "center", fontSize: "1.05rem" }}>
                                                    <span className="fa fa-inr" ></span>{(item.quantity * item.unit_amount).toLocaleString("en")}
                                                </p>}
                                                <FaTimes onClick={() => removeItem(item)} style={{ margin: "auto" }} color="lightgray" fontSize={"0.9rem"} />

                                            </div>}
                                        {/* Service Items */}
                                        {(item.product && (item.type == "service")) &&
                                            <div className="gap-3.5">
                                                {ICONS[(item.product as RepairCostItem).name]}
                                                <div>
                                                    <p className="font-bold text-sm">
                                                        {LABELS[(item.product as RepairCostItem).name]}
                                                    </p>
                                                    <p className="text-sm">
                                                        For {(item.product as RepairCostItem).product_name}
                                                    </p>


                                                </div>
                                                <div></div>
                                                <div></div>
                                                <p className="flex align-middle gap-1" style={{ alignItems: "center", fontSize: "1.05rem" }}>
                                                    <span className="fa fa-inr" ></span>{(item).total_amount.toLocaleString("en")}
                                                </p>
                                                <FaTimes onClick={() => removeItem(item)} style={{ margin: "auto" }} color="lightgray" fontSize={"0.9rem"} />

                                            </div>}
                                        {/* Service items end */}
                                    </li></>
                                })}
                            </ul>
                        </div>}
                    </div>
                </DrawerItems>
                {(cartState.items?.length > 0) && <div className="bottom-10 pb-20">
                    <hr /><br />
                    <div className="totals grid grid-cols-12 pb-10">
                        <div className="col-span-9 font-bold">Net Total</div>
                        <div className="col-span-3 font-bold">
                            <p className="flex align-middle gap-1" style={{ alignItems: "center", fontSize: "1.2rem" }}>
                                <span className="fa fa-inr"></span>

                                {cartState.items[0].type != "sell" && calculateTotal(cartState.items).toLocaleString()}
                                {cartState.items[0].type == "sell" && calculateTotalSaleValue(cartState.items).toLocaleString()}

                            </p>
                        </div>

                    </div>
                    {/* Go to checkout, hide Cart */}
                    {cartState.items[0].type != "sell" && <button onClick={() => {
                        console.log("Showing checkout");
                        dispatch(showCheckout({ show: true }))
                        // if (authState.sessionStarted) {
                        //     if (authState.token) {
                        //         dispatch(show({ show: false }))
                        //     } else {
                        //         dispatch(setLoginModalState({ showLoginPopup: true }));
                        //     }
                        // }
                    }} className="btn text-black primary w-full">Checkout</button>}
                    {cartState.items[0].type == "sell" && <button onClick={() => {
                        console.log("Showing checkout");
                        dispatch(showCheckout({ show: true }))
                        // if (authState.sessionStarted) {
                        //     if (authState.token) {
                        //         dispatch(show({ show: false }))
                        //     } else {
                        //         dispatch(setLoginModalState({ showLoginPopup: true }));
                        //     }
                        // }
                    }} className="btn text-black primary w-full">Continue</button>}
                    <br /><br />
                    <p className="text-xs pt-2 text-justify">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates esse dolor, deleniti, officia autem molestiae labore dolores sit illum temporibus explicabo amet! Pariatur!
                    </p>
                </div>}
            </Drawer>

        }

    </>)

}