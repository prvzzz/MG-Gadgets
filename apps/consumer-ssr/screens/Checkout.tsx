import { Datepicker, Drawer, DrawerHeader, DrawerItems, Spinner } from "flowbite-react"
import { FaMoneyBill, FaTimes, FaArrowLeft } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { useEffect, useState } from "react";
import { showCheckout } from "../features/checkout/checkoutSlice";
import { Cart } from "./Cart";
import { Product } from "../dto/Product";
import { Address, CartItemDTO, RepairCostItem, ValidCartData } from "../misc/types";
import { add } from "lodash";
import DataRepository from "../services/dataRepository";
import { setLoginModalState } from "../features/auth/authSlice";
import AuthRepository from "../services/authRepository";
import PayuFormData from "./PayuFormData";
import { GLOBAL_CONSTANTS } from "../global.constants";
import { LABELS } from "../labels";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { placeSellOrder } from "../controller/OrderController";
import { setAlert } from "../features/alert/alertSlice";
import { show } from "../features/cart/cartSlice";

export function Checkout() {



    const dispatch = useDispatch();
    const [ValidCartData, setValidCartData] = useState<ValidCartData>(null);
    const [readyToPay, setReadyToPay] = useState(false);
    const [paymentInProcess, setPaymentInProcess] = useState(false);
    const [isAddressValid, setAddressIsValid] = useState(false);

    const calculateTotalSaleValue = (items: Array<CartItem>) => {
        var total = 0;

        for (var i in items) {
            var p = items[i];
            var type = p.type;
            total += (items[i].unit_amount * 1);
        }

        return total;
    }
    const getMinPickupDate = () => {
        var d = new Date();
        // next day onwards
        d.setDate(d.getDate() + 1);
        return d;
    }
    const getMaxPickupDate = () => {
        var d = new Date();
        d.setDate(d.getDate() + MAX_PICKUP_DAYS);
        return d;
    }

    const [pickupDate, setPickupDate] = useState((getMinPickupDate()).toString());
    const [step, setStep] = useState(1);

    const [address, setAddress] = useState<Address>({
        city: "",
        line1: "",
        pincode: "",
        state: ""
    });

    const saveAddress = async (e) => {

        e.preventDefault();

        // await authRepo.updateUser({ address: address.line1, pincode: address.pincode, city: address.city }, authState.token).then(data => {
        //     console.log(data);
        // })

        if (cartState.items[0]?.type == "sell") {
            setStep(2);
        } else {
            // We dont want to select pickup dates for a buy order
            setStep(3);
        }
    }

    useEffect(() => {

        console.log(address);

        if (address?.city.length != 0 && (address?.pincode?.length == 6) && (address?.line1?.length > 3)) {
            console.log("Address is valid");
            setAddressIsValid(true);
        } else {
            console.log("Address is invalid");
            setAddressIsValid(false);
        }

    }, [address])

    const MAX_PICKUP_DAYS = 3;

    const authState = useSelector((state: RootState) => state.auth);
    const checkoutState = useSelector((state: RootState) => state.checkout);
    const cartState = useSelector((state: RootState) => state.cart);
    const dataRepo = new DataRepository();
    const authRepo = new AuthRepository();
    const [processing, setProcessing] = useState(false);

    const goBack = () => {

        setReadyToPay(false)
        if (step > 1) {
            setStep(step - 1);
        }
    }

    useEffect(() => {

        if (authState.token) {
            setAddress({
                line1: authState.address,
                city: authState.city,
                state: authState.state,
                pincode: authState.pincode
            })
        }



    }, [authState])



    const setRegion = (e) => {
        var pincode = e.target.value;
        setAddress({ ...address, pincode: pincode })
        if (!pincode) {
            setProcessing(false);
            return;
        };

        setProcessing(true);

        if (pincode && pincode.length == 6) {
            (async function () {
                await dataRepo.getRegionByPincode(pincode).then(data => {
                    console.log(data.data);
                    setProcessing(false);
                    setAddress({ ...address, pincode: pincode, city: data.data["District"] + " , " + data.data["State"] })
                }).catch(err => setProcessing(false))
            })()
        }
    }

    const validateCart = async (body: ValidCartData) => {

        var validatedCart = await dataRepo.getValidatedCart(body, authState.token);
        validatedCart = await validatedCart.json();
        validatedCart = (validatedCart as unknown as any)?.data;

        setValidCartData((validatedCart as unknown as ValidCartData));
    }

    const placeSellOrder = async (items: Array<Product>, pickupDate: string) => {

        setProcessing(true);
        // retreive user's location
        navigator.geolocation.getCurrentPosition((position) => {
            console.log("location:", position.coords);
            console.log("Sell order:", items, pickupDate, position.coords);
            dataRepo.createSellOrder({
                cart: cartState.items.map(item => {
                    return {
                        productId: (item.product as Product).alias,
                        quantity: item.quantity,
                        type: "product",
                        item_condition: item.item_condition,
                        selected_variant: item.selected_variant,
                        title: (item.product as Product).brand.name + " " + (item.product as Product).title + (item.product as Product).variants[0].ram_size + "GB",
                        productImageId: (item.product as Product).product_images[0]
                    }
                }),
                location: {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                },
                pickupDate,
            }, authState.token).then(data => data?.json()).then(data => {
                setProcessing(false);

                if (data.status == 500) {
                    dispatch(setAlert({ message: data.message, show: true }));
                }

                else if (data.status == 200) {
                    dispatch(showCheckout({ show: false }))
                    dispatch(show({ show: false }))
                    window.location.href = "/profile?orb=1";
                } else {
                    dispatch(setAlert({ message: "Please try again in sometime.", show: true }));
                }
                console.log("Response:", data);

            }).catch(err => {
                setProcessing(false);
                dispatch(setAlert({ message: "Please try again in sometime", show: true }));
                console.log("Error:", err);
            })

        })


    }

    useEffect(() => {
        console.log("valid cart:", ValidCartData)
    }, [ValidCartData])

    useEffect(() => {

        if (readyToPay && cartState.items[0].type != "sell") {
            // Call Cart Validation API and populate payu form data
            var items: Array<CartItemDTO> = [];
            cartState.items.forEach(item => {
                const typeOfItem = item.type;

                if (typeOfItem == "buy") {
                    items.push({
                        productId: (item.product as Product).alias,
                        quantity: item.quantity,
                        type: "product",
                        title: (item.product as Product).brand.name + " " + (item.product as Product).title + (item.product as Product).variants[0].ram_size + "GB",
                        productImageId: (item.product as Product).product_images[0]
                    })
                }

                if (typeOfItem == "service") {
                    items.push({
                        title: (item.product as RepairCostItem).name,
                        productId: (item.product as RepairCostItem).product_alias,
                        selected_service_name: (item.product as RepairCostItem).name,
                        // only 1 quantity allowed per repair item
                        quantity: 1,
                        type: "service",
                        productImageId: ""
                    })
                }

                navigator.geolocation.getCurrentPosition(position => {
                    validateCart({
                        email: authState.email,
                        firstName: authState.fullName,
                        items: items,
                        phone: authState.phoneNumber,
                        amount: 0,
                        lastName: "",
                        location: {
                            long: position.coords.longitude,
                            lat: position.coords.latitude
                        }
                    })

                })



            })
        }

    }, [readyToPay])

    const payNow = () => {
        setPaymentInProcess(true);
    }

    const submitSellOrder = async () => {
        await placeSellOrder(cartState.items, pickupDate);
    }

    return (<>

        {/* PayU Form */}
        {ValidCartData && <PayuFormData

            amount={ValidCartData.amount}
            email={ValidCartData.email}
            firstName={ValidCartData.firstName}
            items={ValidCartData.items}
            lastName=""
            phone={authState.phoneNumber}
            txnId={ValidCartData.txnId}
            failedUrl={GLOBAL_CONSTANTS.paymentFailedUrl}
            successUrl={GLOBAL_CONSTANTS.paymentSuccessUrl}
            hash={ValidCartData.hash}
            ready={readyToPay && paymentInProcess}
            orderType={ValidCartData.orderType}
        />}
        {/* PayU Form ends */}

        {authState.token && <Drawer style={{ zIndex: 1101 }} open={checkoutState.show} color="white" onClose={() => { dispatch(showCheckout({ show: false })) }} position="right" className="w-1/3 max-sm:w-full">
            <DrawerHeader titleIcon={() => {
                return (step > 1) ? <FaArrowLeft onClick={() => goBack()} className="mr-3" /> : <FaMoneyBill className="mr-3" />
            }}
                title="Checkout"
            >
            </DrawerHeader>

            <DrawerItems className="h-9/12 overflow-scroll">
                <div className="flex flex-col h-full justify-between align-middle">

                    {/* Address form */}
                    {(step == 1) && <form id="signUpForm" className="space-y-1 p-3.5" method="post" action="#">
                        <h4 style={{ color: "darkslategray" }} className="text-gray-900 mb-2 font-bold">Address</h4>
                        <div>
                            {/* <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your phone number</label> */}
                            <textarea onChange={(e) => setAddress({ ...address, line1: e.target.value })} value={address?.line1} name="add_1" id="add_1" className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 " placeholder="Address" required />
                        </div>
                        <div>
                            {/* <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your phone number</label> */}
                            <input onChange={(e) => setRegion(e)} value={address?.pincode} type="text" name="pincode" id="pincode" className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 " placeholder="Pin code" required />
                        </div>
                        <div className="flex justify-center" style={{ alignItems: "center" }}>
                            {/* <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your phone number</label> */}
                            <input disabled type="text" value={address?.city} name="city" id="city" className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 " placeholder="City" required />
                            {processing && <Spinner color="gray" size="sm" className="m-auto ml-1"></Spinner>}
                        </div>

                        <br />
                        {isAddressValid && <button onClick={(e) => saveAddress(e)} className="btn primary text-black text-sm">{processing && <Spinner style={{ width: "15px", height: "15px" }} color="gray" size="md"></Spinner>} Save and Continue  </button>}
                    </form>}
                    {(step == 2) && <div>
                        <h4 style={{ color: "darkslategray" }} className="text-gray-900 mb-2 font-bold">Choose a date for Pickup</h4>
                        <p className="text-md">
                            Please select a date from the available date slots
                        </p><br />
                        <Datepicker
                            value={new Date(pickupDate)}
                            theme={{
                                "root": {
                                    "base": "relative"
                                },
                                "popup": {
                                    "root": {
                                        "base": "fixed top-10 z-50 left-4/12 block pt-2",
                                        "inline": "relative top-0 z-auto",
                                        "inner": "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700"
                                    },
                                    "header": {
                                        "base": "",
                                        "title": "px-2 py-3 text-center font-semibold text-gray-900 dark:text-white",
                                        "selectors": {
                                            "base": "mb-2 flex justify-between",
                                            "button": {
                                                "base": "rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
                                                "prev": "",
                                                "next": "",
                                                "view": ""
                                            }
                                        }
                                    },
                                    "view": {
                                        "base": "p-1"
                                    },
                                    "footer": {
                                        "base": "mt-2 flex space-x-2",
                                        "button": {
                                            "base": "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-primary-300",
                                            "today": "bg-primary-700 text-white hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700",
                                            "clear": "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                        }
                                    }
                                },
                                "views": {
                                    "days": {
                                        "header": {
                                            "base": "mb-1 grid grid-cols-7",
                                            "title": "h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400"
                                        },
                                        "items": {
                                            "base": "grid w-64 grid-cols-7",
                                            "item": {
                                                "base": "text-white font-medium block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9  hover:bg-green-100  dark:hover:bg-gray-600",
                                                "selected": "bg-green-400 text-white hover:bg-primary-600",
                                                "disabled": "bg-transparent font-light dark:text-gray-50 border-0 text-shadow-gray-600"
                                            }
                                        }
                                    },
                                    "months": {
                                        "items": {
                                            "base": "grid w-64 grid-cols-4",
                                            "item": {
                                                "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                                                "selected": "bg-primary-700 text-white hover:bg-primary-600",
                                                "disabled": "text-gray-500"
                                            }
                                        }
                                    },
                                    "years": {
                                        "items": {
                                            "base": "grid w-64 grid-cols-4",
                                            "item": {
                                                "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                                                "selected": "bg-primary-700 text-white hover:bg-primary-600",
                                                "disabled": "text-gray-500"
                                            }
                                        }
                                    },
                                    "decades": {
                                        "items": {
                                            "base": "grid w-64 grid-cols-4",
                                            "item": {
                                                "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                                                "selected": "bg-primary-700 text-white hover:bg-primary-600",
                                                "disabled": "text-gray-500"
                                            }
                                        }
                                    }
                                }
                            }}
                            inline={false} translate="yes" showTodayButton={false} showClearButton={false} color="gray" id="datepicker" onChange={(d: Date) => setPickupDate(d.toString())} size={100} open={true} autoHide={true} minDate={getMinPickupDate()} maxDate={getMaxPickupDate()} />
                        <br />
                        {pickupDate && <p>
                            Pickup will be scheduled for <strong>
                                {(new Date(pickupDate)).toLocaleDateString("en-us", { month: "long", day: "numeric", year: "numeric" })}
                            </strong>
                        </p>}
                        <br />
                        {<button onClick={() => { setStep(3); setReadyToPay(true) }} className="btn primary text-black text-sm w-full">{processing && <Spinner style={{ width: "15px", height: "15px" }} color="gray" size="md"></Spinner>} Continue  </button>}
                    </div>

                    }
                    {/* Address form ends */}
                    {(step == 3) && <div>
                        <h4 style={{ color: "darkslategray" }} className="text-gray-900 mb-2 font-bold">Summary</h4>

                        <ul className="cartItems checkoutItems">
                            {cartState.items.map(item => {
                                return <><li>

                                    {/* Products without repair services */}
                                    {(item.product && !(item.type == "service")) &&

                                        <div className="gap-3.5">

                                            <div>
                                                <p className="font-bold text-sm">
                                                    {(item.product as Product).title}
                                                </p>
                                                <p className="text-sm">
                                                    {(item.product as Product).variants?.at(item.selected_variant || 0)?.color}, {(item.product as Product).variants.at(item.selected_variant || 0)?.storage_size + "GB"} /  {(item.product as Product).variants.at(item.selected_variant || 0)?.ram_size + "GB"}
                                                </p>


                                            </div>


                                            <p className="flex align-middle gap-1" style={{ alignItems: "center", fontSize: "1.05rem" }}>
                                                {cartState.items[0]?.type != "sell" && <><span className="fa fa-inr" ></span>{(item.quantity * ((item.product as Product).variants.at(item.selected_variant || 0)?.max_retail_price || 0)).toLocaleString("en")}</>}
                                                {cartState.items[0]?.type == "sell" && <><span className="fa fa-inr" ></span>{(1 * item.unit_amount).toLocaleString("en")}</>}
                                            </p>


                                        </div>}
                                    {/* Service Items */}
                                    {(item.product && (item.type == "service")) &&
                                        <div className="gap-3.5">
                                            {/* {ICONS[(item.product as RepairCostItem).name]} */}
                                            <div>
                                                <p className="font-bold text-sm">

                                                    {LABELS[(item.product as RepairCostItem).name]}
                                                </p>
                                                <p className="text-sm">
                                                    For {(item.product as RepairCostItem).product_name}
                                                </p>

                                            </div>

                                            <p className="flex align-middle gap-1" style={{ alignItems: "center", fontSize: "1.05rem" }}>
                                                <span className="fa fa-inr" ></span>{(item).total_amount.toLocaleString("en")}
                                            </p>
                                            {/* <FaTimes onClick={() => removeItem(item)} style={{ margin: "auto" }} color="lightgray" fontSize={"0.9rem"} /> */}

                                        </div>}
                                    {/* Service items end */}
                                </li></>
                            })}
                        </ul><br />
                        <div>
                            <p>Pickup will be scheduled for <p className="font-bold">{(new Date(pickupDate)).toLocaleDateString("en-us", { month: "long", day: "numeric", year: "numeric" })}</p></p>
                        </div>

                    </div>}
                </div>

                <div className="netTotal">
                    {cartState.items[0]?.type != "sell" && <div className="flex justify-between pb-2 gap-3.5">

                        <p>
                            <strong>Net Amount Payable</strong>
                            <p className="text-sm">inclusive of taxes</p>
                        </p>
                        {!ValidCartData?.amount && <div style={{ width: "200px" }}>
                            <Skeleton count={2} />
                        </div>}
                        {ValidCartData?.amount && <div className="price text-2xl">
                            <span className="fa fa-inr"></span>  {ValidCartData.amount.toLocaleString()}
                        </div>}
                        <br />
                    </div>}

                    {cartState.items[0]?.type == "sell" && <div className="flex justify-between pb-2 gap-3.5">

                        <p>
                            <strong>Total Estimated Value</strong>
                            <p className="text-sm">This is an approximated value</p>
                        </p>
                        <div className="price text-2xl">
                            <span className="fa fa-inr"></span>  {calculateTotalSaleValue(cartState.items)}
                        </div>
                        <br />
                    </div>}

                    {readyToPay && cartState.items[0]?.type != "sell" && !processing && <button onClick={() => {
                        payNow();
                        dispatch(showCheckout({ show: false }))
                    }} className="btn text-black primary w-full">Pay now</button>}

                    {readyToPay && cartState.items[0]?.type != "sell" && processing && <button className="btn text-black primary w-full">
                        <Spinner style={{ width: "15px", height: "15px" }} color="gray" size="md"></Spinner>
                    </button>}

                    {cartState.items[0]?.type == "sell" && step == 3 && !processing && <button onClick={() => {
                        submitSellOrder();

                    }} className="btn text-black primary w-full">Place Pick up</button>}

                    {cartState.items[0]?.type == "sell" && processing && <button className="btn text-black primary w-full">
                        <Spinner style={{ width: "15px", height: "15px" }} color="gray" size="md"></Spinner>
                    </button>}





                </div>
            </DrawerItems>
        </Drawer>}

    </>)
}