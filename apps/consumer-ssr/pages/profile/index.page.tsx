import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store";
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle, Card, Modal, Spinner } from "flowbite-react";
import images from "../../images";
import { setUrl } from "../../features/breadcrumb/navSlice";
import StatusPill from "../../components/StatusPill";
import AuthRepository from "../../services/authRepository";
import { OrderLabels, OrderStatus, UserUpdateDTO } from "../../misc/types";
import { FaCross, FaEdit, FaTimes } from "react-icons/fa";
import { setAlert } from "../../features/alert/alertSlice";
import { setUpdateUser, setUser } from "../../features/auth/authSlice";

export { Page }

function Page() {

    const dispatch = useDispatch();
    const authState = useSelector((state: RootState) => state.auth);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [status, setStatus] = useState<OrderStatus>();
    const [orders, setOrders] = useState([]);
    const [orderRcvBanner, setOrb] = useState(false);
    const [user, setUpdateUser] = useState<UserUpdateDTO>({});
    const [edit, setEdit] = useState(false);
    const [processing, setProcessing] = useState(false);

    const authRepo = new AuthRepository();

    let dismissOrb = () => {
        var params = new URLSearchParams(window.location.search);
        params.delete("orb");
        window.location.search = params.toString();

    }

    let func = async () => {
        if(!authState.token) return;
        authRepo.getOrders(authState.token).then(data => data.json()).then(data => { console.log(data); setOrders(data.data) });

    }

    let updateUser = async () => {

        setProcessing(true);
        if(!authState.token) return;
        authRepo.updateUser(user, authState.token).then(data => data.json()).then(data => {

            setProcessing(false);
            console.log(data.data);
            if (data && data?.code == "USER_UPDATED") {
                if (user.first_name) {
                    dispatch(setUser({
                        ...authState,
                        fullName: user.first_name,
                        email: user.email
                    }))
                }
                dispatch(setAlert({ message: "Profile updated", show: true }));
            } else {
                dispatch(setAlert({ message: "An error occurred", show: true }));
            }
        })

    }

    useEffect(() => {
        if ((selectedOrder as unknown as any).status) {
            document.querySelector("#details")?.scrollIntoView();
            setStatus((selectedOrder as unknown as any).status as OrderStatus);
        }
    }, [selectedOrder])

    useEffect(() => {

        if (authState.fullName) {
            setUpdateUser({
                first_name: authState.fullName,
                address: authState.address,
                city: authState.city,
                email: authState.email,
                pincode: authState.pincode,
            })
        }

    }, [authState.fullName])

    useEffect(() => {
        var params = new URLSearchParams(window.location.search);
        if (params.get("orb") == "1") {
            setOrb(true);
        }
        dispatch(setUrl({ url: window.location.href }))

    }, [])

    useEffect(() => {
        if (authState.token) func();
    }, [authState.token])

    return (<>
        {orderRcvBanner && <Card
            style={{ padding: "0px", margin: "0px", borderRadius: "0px", width: "100%", border: "none !important" }}
            className="border-0 revealNav col-span-9 w-full bg-black text-white flex flex-col items-center justify-center text-center py-10 px-6"
        >
            <h2 className="text-3xl font-bold mb-3">✅ Order Received</h2>
            <p className="text-base text-gray-300 max-w-xl">
                Thank you for placing your order. Our team has received your request and is now processing it.
                You’ll be notified as soon as the next steps begin.
            </p>
            <button onClick={() => dismissOrb()} className="p-1" style={{ width: "fit-content", margin: "auto" }}>Dismiss</button>
        </Card>}



        <div className="grid grid-cols-12 gap-2.5 p-1">

            <Card id="card" style={{ margin: "0px", padding: "0px", rowGap: "0px", gap: "0px" }} className="col-span-3 gap-0 max-w-fill place-content-center place-items-center min-md:p-10 pb-20 min-md:m-2 max-sm:m-1 min-md:pl-5 max-sm:p-0 max-sm:col-span-12">
                <div style={{ gap: "4px" }}>
                    <img src={images.mg_verified} style={{ borderRadius: "100%", width: "120px", height: "120px", margin: "auto" }} />
                    {authState.fullName && <h2 className="text-center font-bold text-2xl">{authState.fullName}</h2>}
                    {authState.email && <h2 className="text-left w-fit  font-normal">{authState.email}</h2>}
                    {authState.phoneNumber && <h2 className="text-left w-fit  font-normal">{authState.phoneNumber}</h2>}
                    {/* {authState.email && <h2 className="text-2xl">{authState.}</h2>} */}
                </div>
            </Card>
            <Card
                style={{ padding: "0px" }}
                className="col-span-9 w-fill bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 text-black flex flex-col items-center justify-center text-center w-fill min-md:p-10 gap-0 max-sm:col-span-12"
            >
                <h2 className="text-3xl font-bold mb-3">
                    🎉 Get 15% Off for a Limited Time!
                </h2>
                <p className="text-base text-gray-700 mb-5 max-w-xl">
                    Don’t miss out on this exclusive deal. Upgrade your phone today and enjoy extra savings before the offer expires.
                </p>
                <a
                    href="/exclusive-offer"
                    className="px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
                >
                    Claim Offer
                </a>
            </Card>

            {/* <Card style={{ padding: "0px" }} className="col-span-9 max-w-fill  min-md:p-10 pb-20 min-md:m-2 max-sm:m-1 min-md:pl-5 max-sm:p-0 max-sm:col-span-12">

            </Card> */}
        </div>
        <Card >

            <div style={{ alignItems: "center" }} className="p-7 max-sm:p-1 flex justify-between  gap-2.5">
                <h2 className="text-left w-fit  font-bold text-3xl w-sm:2xl">About you</h2>
                {!edit && <FaEdit onClick={() => setEdit(true)} size={"20px"} />}
                {edit && <FaTimes onClick={() => setEdit(false)} size={"20px"} />}
            </div>
            <div className="flex flex-col p-7 max-sm:p-1 pt-0 gap-2">
                <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-0 w-fit  max-sm:flex-col">
                    <h2 className="font-semibold w-fit">Full name</h2>
                    {authState.fullName && !edit && <h2 className="text-left w-fit  font-normal max-sm:block">{authState.fullName}</h2>}
                    {user.first_name && edit && <input onChange={(e) => setUpdateUser({ ...user, first_name: e.target.value })} style={{ borderBottom: "1px solid" }} className="w-fit" value={user.first_name} />}
                </div>
                <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-0 w-fit  max-sm:flex-col">
                    <h2 className="font-semibold w-fit">E-mail</h2>

                    {authState.email && !edit && <h2 className="text-left w-fit  font-normal">{authState.email}</h2>}
                    {user.email && edit && <input onChange={(e) => setUpdateUser({ ...user, email: e.target.value })} style={{ borderBottom: "1px solid" }} className="w-fit" value={user.email} />}
                </div>
                <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-0 w-fit  max-sm:flex-col">
                    <h2 className="font-semibold w-fit">Phone number</h2>

                    {authState.phoneNumber && <h2 className="text-left w-fit  font-normal">{authState.phoneNumber}</h2>}

                </div>
                <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-0 w-fit  max-sm:flex-col">
                    <h2 className="font-semibold w-fit">Address</h2>
                    {authState.address && !edit && <h2 className="text-left w-fit  font-normal">{authState.address}</h2>}
                    {user.address && edit && <input onChange={(e) => setUpdateUser({ ...user, address: e.target.value })} style={{ borderBottom: "1px solid" }} className="w-fit" value={user.address} />}
                </div>
                <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-0 w-fit  max-sm:flex-col">
                    <h2 className="font-semibold w-fit">PIN code</h2>
                    {authState.pincode && !edit && <h2 className="text-left w-fit  font-normal">{authState.pincode}</h2>}
                    {user.pincode && edit && <input onChange={(e) => setUpdateUser({ ...user, pincode: e.target.value })} style={{ borderBottom: "1px solid" }} className="w-fit" value={user.pincode} />}
                </div>
                <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-0 w-fit  max-sm:flex-col">
                    <h2 className="font-semibold w-fit">State</h2>
                    {authState.state && edit && <h2 className="text-left w-fit  font-normal">{authState.state}</h2>}
                </div>
                {edit && <button onClick={() => updateUser()} className="btn primary text-black text-sm w-fit m-auto mr-0">Save {processing && <Spinner style={{ width: "10px", height: "10px" }} color="gray" size="md"></Spinner>}</button>}
            </div>
        </Card>
        <div className="p-7">
            <h2 className="text-center font-bold text-3xl w-sm:2xl">Order History</h2>
        </div>
        {/* <Card style={{ padding: "0px", rowGap: "10px", gap: "0px", width: "fit-content" }} className="gap-0 place-content-center place-items-center min-md:p-10 pb-20 min-md:m-2 max-sm:m-1 min-md:pl-5 max-sm:p-0"> */}
        <div className="w-fill flex-wrap justify-center gap-2.5 flex p-3.5 max-sm:flex-col" >
            {(!orders || orders.length == 0) && <Spinner style={{ margin: "auto" }} color="gray" />}
            {(orders && orders.length == 0) && <p className="text-center block">It seems you have no orders yet</p>}
            {orders &&
                orders.map(order => {
                    var status: OrderStatus = ((order as unknown as any).status as OrderStatus);
                    return <Card onClick={() => setSelectedOrder((order as unknown as any))} style={{ padding: "0px", borderRadius: "0px" }} className={`w-1/3 max-sm:w-full ${(selectedOrder as unknown as any).transaction_id == (order as unknown as any).transaction_id && "bg-gray-100"}`}>
                        <div className="flex flex-col justify-start" style={{ height: "100%" }}>
                            <div className="flex flex-row justify-between">
                                <div style={{ height: "100%" }}>
                                    <div>
                                        <h4 className="font-semibold">
                                            {(order as unknown as any).transaction_id}
                                        </h4>
                                        <p className="font-medium">{new Date((order as unknown as any).createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold">&#8377; {((order as unknown as any).total as number).toLocaleString("en-in")}</span>
                            </div>

                        </div>

                        {
                            (
                                status == OrderStatus.CANCELLED ||
                                status == OrderStatus.PAYMENT_FAILED ||
                                status == OrderStatus.ORDER_NOT_VALIDATED ||
                                status == OrderStatus.ORDER_COMPLETE_FAILED
                            ) && <StatusPill status="error" content={OrderLabels[status]} />
                        }

                        {
                            (
                                status == OrderStatus.NOT_ALLOTTED ||
                                status == OrderStatus.ORDER_IN_TRANSIT ||
                                status == OrderStatus.AGENT_ARRIVED
                            ) && <StatusPill status="info" content={OrderLabels[status]} />
                        }

                        {
                            (
                                status == OrderStatus.ORDER_COMPLETE_SUCCESS ||
                                status == OrderStatus.ORDER_VALIDATED ||
                                status == OrderStatus.PAYMENT_FAILED
                            ) && <StatusPill status="success" content={OrderLabels[status]} />
                        }

                    </Card>
                })
            }




        </div>

        {/* </Card> */}
        <div id="details" className="p-3"></div>
        {(selectedOrder as unknown as any).transaction_id &&
            <Card >

                <div style={{ alignItems: "center" }} className="p-7 max-sm:p-1 flex justify-between  gap-2.5">
                    <h2 className="text-left w-fit  font-bold text-3xl w-sm:2xl">Details</h2>
                    {
                        (
                            status == OrderStatus.CANCELLED ||
                            status == OrderStatus.PAYMENT_FAILED ||
                            status == OrderStatus.ORDER_NOT_VALIDATED ||
                            status == OrderStatus.ORDER_COMPLETE_FAILED
                        ) && <StatusPill status="error" content={OrderLabels[status]} />
                    }

                    {
                        (
                            status == OrderStatus.NOT_ALLOTTED ||
                            status == OrderStatus.ORDER_IN_TRANSIT ||
                            status == OrderStatus.AGENT_ARRIVED
                        ) && <StatusPill status="info" content={OrderLabels[status]} />
                    }

                    {
                        (
                            status == OrderStatus.ORDER_COMPLETE_SUCCESS ||
                            status == OrderStatus.ORDER_VALIDATED ||
                            status == OrderStatus.PAYMENT_FAILED
                        ) && <StatusPill status="success" content={OrderLabels[status]} />
                    }
                </div>
                <div className="flex flex-col p-7 max-sm:p-1 pt-0 gap-2">
                    <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-4 w-fit ">
                        <h2 className="font-semibold">Order Id</h2>
                        <p>
                            {(selectedOrder as unknown as any).transaction_id}
                        </p>
                    </div>
                    <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-4 w-fit ">
                        <h2 className="font-semibold">Order Amount</h2>
                        <p>
                            &#8377; {((selectedOrder as unknown as any).total as number)?.toLocaleString("en-in")}
                        </p>
                    </div>
                    <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-4 w-fit ">
                        <h2 className="font-semibold">Order Type</h2>
                        <p className="uppercase">
                            {(selectedOrder as unknown as any).order_type}
                        </p>
                    </div>
                    <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-4 w-fit ">
                        <h2 className="font-semibold">Current Status</h2>
                        <p>
                            {OrderLabels[(selectedOrder as unknown as any).status]}
                        </p>
                    </div>
                    <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-4 w-fit ">
                        <h2 className="font-semibold">Items</h2>
                        <p>
                            {(selectedOrder as unknown as any).items && JSON.parse((selectedOrder as unknown as any).items).map(it => {
                                return <p>{it.title}</p>
                            })}
                        </p>
                    </div>
                    <div className="flex justify-between w-2xl gap-48 max-sm:w-md max-sm:gap-4 w-fit ">
                        <h2 className="font-semibold">Placed on</h2>
                        <p>
                            {new Date((selectedOrder as unknown as any).createdAt).toLocaleDateString()} &nbsp;
                            {new Date((selectedOrder as unknown as any).createdAt).toLocaleTimeString()}
                        </p>
                    </div>

                </div>
            </Card>
        }
        <br />
        <Card >
            <div style={{ alignItems: "center" }} className="p-7 pb-3 max-sm:p-1 flex justify-between  gap-2.5">
                <h2 className="text-left w-fit  font-bold text-3xl w-sm:2xl">Contact us</h2>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-row p-7 gap-4 max-sm:p-1">
                    <h3 className="font-semibold">Support</h3>
                    <p>support@mggadgets.in</p>
                </div>
            </div>
        </Card>
        <Card >
            <div style={{ alignItems: "center" }} className="p-7 pb-3 max-sm:p-1 flex justify-between  gap-2.5">
                <h2 className="text-left w-fit  font-bold text-3xl w-sm:2xl">FAQs</h2>
            </div>
            <Accordion className="w-full max-sm:w-fill m-auto" style={{ borderRadius: "0px" }} flush={false}>
                <AccordionPanel className="w-fill" style={{ background: "white" }} flush={false}>
                    <AccordionTitle style={{ color: "black" }}>Who are we?</AccordionTitle>
                    <AccordionContent>
                        <p className="mb-2 text-gray-500 ">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum aperiam excepturi suscipit libero, commodi voluptates unde perspiciatis. Dignissimos tenetur necessitatibus animi quas? Repellat.
                        </p>
                    </AccordionContent>
                </AccordionPanel>
                <AccordionPanel style={{ background: "white" }} flush={false}>
                    <AccordionTitle style={{ color: "black" }}>What is the process?</AccordionTitle>
                    <AccordionContent>
                        <p className="mb-2 text-gray-500 ">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum aperiam excepturi suscipit libero, commodi voluptates unde perspiciatis. Dignissimos tenetur necessitatibus animi quas? Repellat.
                        </p>
                    </AccordionContent>
                </AccordionPanel>
                <AccordionPanel style={{ background: "white" }} flush={false}>
                    <AccordionTitle style={{ color: "black" }}>When will i get the money?</AccordionTitle>
                    <AccordionContent>
                        <p className="mb-2 text-gray-500 ">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum aperiam excepturi suscipit libero, commodi voluptates unde perspiciatis. Dignissimos tenetur necessitatibus animi quas? Repellat.
                        </p>
                    </AccordionContent>
                </AccordionPanel>
                <AccordionPanel style={{ background: "white" }} flush={false}>
                    <AccordionTitle style={{ color: "black" }}>How to contact us?</AccordionTitle>
                    <AccordionContent>
                        <p className="mb-2 text-gray-500 ">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum aperiam excepturi suscipit libero, commodi voluptates unde perspiciatis. Dignissimos tenetur necessitatibus animi quas? Repellat.
                        </p>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </Card>

    </>)
}