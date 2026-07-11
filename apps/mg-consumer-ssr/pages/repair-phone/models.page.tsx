import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setUrl } from "../../features/breadcrumb/navSlice";
import { Card, Spinner } from "flowbite-react";
import images from "../../images";
import "../../renderer/main.css";
import { FaBatteryHalf, FaCamera, FaMicrophone, FaMobile, FaSpeakerDeck, FaStar, FaToolbox, FaWaveSquare } from "react-icons/fa";
import DataRepository from "../../services/dataRepository";
import { useSearchParams } from "react-router";
import { Product } from "../../dto/Product";
import { GLOBAL_CONSTANTS } from "../../global.constants";
import { addItem, show } from "../../features/cart/cartSlice";
import { CartItem, RepairCostItem, RepairServiceItem } from "./types";
import QuestionWithOptions from "../../misc/QuestionWithOptions";
import { setAlert } from "../../features/alert/alertSlice";
import { RootState } from "../../store";

export { Page }

function Page({product, loading, repairServices}:{product:Product, loading:boolean, repairServices:RepairServiceItem}) {

    const dispatch = useDispatch();
    const cartState = useSelector((state: RootState) => state.cart);

    const [load, setLoad] = useState(loading);
    
    const [repairItemOptions, setOptions] = useState([]);
    const [selected_services, setServices] = useState<any>([]);

    const [selected_variant, setVariant] = useState(0);
    const [selected_color, setColor] = useState<string | undefined>("");

    const [searchParams, setSearchParams] = useState(new URLSearchParams());

    const dataRepo: DataRepository = new DataRepository();
    useEffect(() => { console.log("product:", product) }, [product])
    const LABELS = {
        "screen": "Screen",
        "battery": "Battery",
        "sensor": "Proximity Sensor",
        "mic": "Microphone",
        "back_camera": "Back Camera",
        "speaker": "Speaker"
    }
    const ICONS = {
        "screen": <FaMobile style={{ width: "22px", height: "22px" }} />,
        "battery": <FaBatteryHalf style={{ width: "22px", height: "22px" }} />,
        "sensor": <FaWaveSquare style={{ width: "22px", height: "22px" }} />,
        "speaker": <FaSpeakerDeck style={{ width: "22px", height: "22px" }} />,
        "mic": <FaMicrophone style={{ width: "22px", height: "22px" }} />,
        "back_camera": <FaCamera style={{ width: "22px", height: "22px" }} />
    }

    const getTotal = () => {
        let costs = selected_services;
        costs = costs.map(i => Number.parseInt(repairItemOptions.at(i - 1).price))
        return costs.reduce((i, j) => i + j, 0);
    }

    const populate = async () => {
        var alias = searchParams.get("alias");
        setSearchParams(searchParams);
        // if (!alias) return;

        await Promise.all([
            // dataRepo.getProductByAlias(alias).then(data => { console.log("prod:", data.data); if (data.data) { setProduct(data.data); } }).catch(err => dispatch(setAlert({ message: "An error occurred", show: true }))),
           
        ]).then(data => setLoad(false))
    }

    useEffect(() => {
        populate();
        setSearchParams(new URLSearchParams(window.location.search))
        dispatch(setUrl({ url: window.location.href }));
    }, []);

    useEffect(() => {
        if (repairServices) {
            var options = repairServices[0]?.repair_costs;
            options = JSON.parse(options);
            setOptions(options);
            console.log(options);

        }
    }, [repairServices])

    useEffect(() => {
        var service_items = cartState.items.filter(i => i.type == "service");

    }, [cartState.items])

    useEffect(() => {



    }, [selected_services])


    return (<>


        <Card style={{ padding: "0px" }} className="max-w-fill  min-md:p-10 pb-20 min-md:m-2 max-sm:m-1 min-md:pl-5 max-sm:p-0">
            {load && <div className="m-auto">
                <Spinner color="gray" />
            </div>}
            <div style={{ padding: "0px" }} className="grid min-md:grid-cols-2 max-sm:grid-cols-1 max-sm:w-fill ">
                <div className="min-md:mr-4">
                    <h1 className="text-2xl max-sm:text-1xl font-semibold">
                        {product?.brand.name} {product?.title}
                    </h1><br />
                    <img className="productImage min-md:ml-50" src={GLOBAL_CONSTANTS.s3Base + product?.product_images.at(0) + ".png"} />
                    <br /><br />
                    <Card className="flash-card max-w-fill mb-2 h-fill flex flex-row" style={{ background: "rgb(179, 255, 138)", fontFamily: "sans-serif" }}>
                        <div className="w-fill flex flex-row">
                            <h1 className="text-3xl font-extrabold w-fit text-green-600" style={{ letterSpacing: "3px", textShadow: "0 1px 2px black" }}>
                                Give your phone a new life
                            </h1>
                        </div>
                        {/* <button className="btn text-sm primary w-fit text-black">
                            Get value now <span className="fa fa-arrow-right"></span>
                        </button> */}
                    </Card>
                </div>
                <div className="min-md:ml-4 ml-0 max-sm:w-full max-sm:hidden">

                    <Card className="max-w-fill mb-2" >
                        <img src={images.screen_touch} style={{ width: "200px", margin: "auto" }} />
                        <div className="gap-y-0.5">
                            <QuestionWithOptions
                                heading="Select the services you wish to get"
                                description=""
                                multiple={true}
                                spread={true}
                                options={
                                    repairItemOptions.map(option => <div className="gap-2 flex" style={{ alignItems: "center" }}>
                                        {ICONS[option.name]}
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <p style={{ fontSize: "0.85rem" }}>{LABELS[option.name]}</p>
                                            <p>
                                                <span className="fa fa-inr"></span>  {Number.parseInt(option.price).toLocaleString("en")}
                                            </p>
                                        </div>
                                    </div>)
                                }
                                selected={selected_services}
                                qb={1}
                                clickHandler={(i, j: number, k) => {
                                    setServices(((prev: number[]) => {
                                        if (prev.includes(j)) {
                                            return prev.filter(l => l != j)
                                        } else {
                                            return [...prev, j]
                                        }
                                    }))


                                    dispatch(addItem({
                                        item: {
                                            product: {
                                                name: repairItemOptions.at(j - 1).name,
                                                product_name: product.title,
                                                product_alias: product.alias,
                                                price: Number.parseInt(repairItemOptions.at(j - 1).price)
                                            } as RepairCostItem,
                                            quantity: 1,
                                            total_amount: Number.parseInt(repairItemOptions.at(j - 1).price),
                                            type: "service"
                                        } as unknown as CartItem
                                    }))
                                    dispatch(show({ show: true }));


                                }}
                            />


                        </div>
                        {/* {selected_services.length > 0 && <div>
                            <h2 className="font-bold">Booking Summary</h2>
                            <hr />
                            {
                                selected_services.map(i => {
                                    return <div style={{ display: "flex", width: "100%", justifyContent: "space-between", paddingTop: "5px" }}>
                                        <p>
                                            {LABELS[repairItemOptions.at(i - 1).name]}
                                        </p>
                                        <p style={{ fontWeight: "normal" }}>
                                            <span className="fa fa-inr">
                                            </span>
                                            {" "} {Number.parseInt(repairItemOptions.at(i - 1).price).toLocaleString("en")}
                                        </p>
                                    </div>
                                })}
                            <br />
                            <hr />
                            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", paddingTop: "5px" }}>
                                <p>
                                    Net Total
                                </p>
                                <p style={{ fontWeight: "normal" }}>
                                    <span className="fa fa-inr">
                                    </span>
                                    {getTotal().toLocaleString()}
                                </p>
                            </div>
                        </div>} */}

                        {/* <button onClick={(e) => {
                            e.preventDefault();
                            // if (product) {

                            // }
                        }} className="btn primary text-black">Book now</button> */}
                    </Card>


                </div>
            </div>

        </Card>
        <div className="custom_container">
            <h1 className="text-left text-md pl-2">Choose a Brand</h1>
            <div
                style={{ overflowX: "scroll" }}
                className="pt-2 pb-2 pl-2 h-fit flex flex-row justify-evenly m-auto align-items-center">

                <a href="/app/sell-phone/models/apple?get=48">
                    <div className="card_box">
                        <img src={images.logo_apple} />
                    </div>
                </a>
                <a href="/app/sell-phone/models/samsung?get=9">
                    <div className="card_box">
                        <img src={images.logo_samsung} />
                    </div>
                </a>
                <a href="/app/sell-phone/models/google?get=107">
                    <div className="card_box">
                        <img src={images.logo_google} />
                    </div>
                </a>
                <a href="/app/sell-phone/models/one-plus?get=95">
                    <div className="card_box">
                        <img src={images.logo_oneplus} />
                    </div>
                </a>
                <a href="/app/sell-phone/models/xiaomi?get=80">
                    <div className="card_box">
                        <img src={images.logo_xiaomi} />
                    </div>
                </a>
                <a href="/app/sell-phone/models/realme?get=118">
                    <div className="card_box">
                        <img src={images.logo_realme} />
                    </div>
                </a>

                <a href="/app/sell-phone/models/oppo?get=82">
                    <div className="card_box">
                        <img src={images.logo_oppo} />
                    </div></a>
                <a href="/app/sell-phone/models/vivo?get=98">
                    <div className="card_box">
                        <img src={images.logo_vivo} />
                    </div>
                </a>

            </div>

            {/* <div className="custom_container" style={{paddingLeft:"0px"}}>
                            <img src={images.banner_4} className="w-fit" />
                        </div> */}


        </div >
        {/* 
            Mobile Sections
        */}

        <div className="min-md:ml-4  md:hidden m-1 mt-2">
            <Card className="max-w-fill mb-2" >
                <strong>
                    <h1 className="font-bold">GET UP TO</h1>
                </strong>
                <div style={{ alignItems: "center" }} className="flex">
                    <span className="text-green-500" style={{ fontWeight: "bolder", fontSize: "1.8rem", fontFamily: "sans-serif" }}>
                        <span className="fa fa-inr"></span> 15,000
                    </span>
                    <span className="ml-2">if you sell it now</span>
                </div>
                <hr style={{ color: "gray" }} />

            </Card>
            <Card className="flash-card max-w-fill mb-2 h-fill flex flex-row" style={{ background: "linear-gradient(rgba(166,183,255,0.25), rgb(201 210 248))", fontFamily: "sans-serif" }}>
                <div className="w-fill flex flex-row">
                    <h1 className="text-3xl font-extrabold w-fit text-blue-600" style={{ letterSpacing: "3px", textShadow: "0 1px 2px black" }}>
                        15% MORE VALUE
                    </h1>
                </div>
                <button className="btn text-sm primary w-fit text-black">
                    Get value now <span className="fa fa-arrow-right"></span>
                </button>
            </Card>
        </div>
        <div className="custom_container">

            <br />
            <div className="w-fill md:columns-2 max-sm:p-0 p-5 pb-16 pt-10 m-1 mt-0 sm:columns-1" style={{ background: "linear-gradient(#000000, #3e3e3e)", borderRadius: "10px" }}>
                <div className="flex flex-col justify-evenly align-center p-10" style={{ color: "white" }}>
                    <h1 className="max-sm:text-4xl text-5xl text-wrap font-extrabold">
                        Get the Best Value!
                    </h1>
                    <br /><br />
                    <ul>
                        <li style={{ display: "flex", alignItems: "center" }} className="text-white text-bold md:text-2xl max-sm:text-md">
                            <FaStar style={{ marginRight: "10px" }} /> Easy mobile <span className="text-green-400 ">&nbsp;selling</span>
                        </li>
                        <li style={{ display: "flex", alignItems: "center" }} className="text-white text-bold md:text-2xl max-sm:text-md">
                            <FaStar style={{ marginRight: "10px" }} /> Free <span className="text-green-400">&nbsp;Pickup&nbsp;</span> and <span className="text-green-400">&nbsp;Shipping&nbsp;</span>
                        </li>
                        <li style={{ display: "flex", alignItems: "center" }} className="text-white text-bold md:text-2xl max-sm:text-md">
                            <FaStar style={{ marginRight: "10px" }} /> Hassle-Free Process
                        </li>

                    </ul>
                </div>
                <div>
                    <img style={{ width: "250px" }} className="w-lg max-sm:m-auto" src={images.banner1} />
                </div>
                <br /><br />
            </div>
            {/* <div className="custom_container" style={{paddingLeft:"0px"}}>
                        <img src={images.banner_4} className="w-fit" />
                    </div> */}


        </div >
        <div className="md:columns-2 max-sm:p-0 p-5 pt-10 pb-16 m-1 sm:columns-1" style={{ background: "linear-gradient(rgb(255, 255, 255), rgb(241 241 241 / 96%))", borderRadius: "10px" }}>
            <div className="flex flex-col justify-evenly align-center p-10" style={{ color: "black" }}>
                <h1 className="max-sm:text-4xl text-5xl text-wrap font-extrabold">
                    Hassle-Free Process!
                </h1>
                <br /><br />
                <ul>
                    <li style={{ display: "flex", alignItems: "center" }} className="text-black text-bold md:text-2xl max-sm:text-md">
                        <FaStar style={{ marginRight: "10px" }} /> Easy mobile <span className="text-green-400 ">&nbsp;selling</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "center" }} className="text-black text-bold md:text-2xl max-sm:text-md">
                        <FaStar style={{ marginRight: "10px" }} /> Free <span className="text-green-400">&nbsp;Pickup&nbsp;</span> and <span className="text-green-400">&nbsp;Shipping&nbsp;</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "center" }} className="text-black text-bold md:text-2xl max-sm:text-md">
                        <FaStar style={{ marginRight: "10px" }} /> Hassle-Free Process
                    </li>

                </ul>

            </div>
            <div>
                <img style={{ width: "250px" }} className="w-lg max-sm:m-auto" src={images.banner1} />
            </div>
        </div>

        {/* 
            Mobile Sections End
        */}

        <div className="w-fill md:columns-2 max-sm:p-0 p-5 pb-16 pt-10 m-1 mt-0 sm:columns-1" style={{ background: "linear-gradient(#000000, #3e3e3e)", borderRadius: "10px" }}>
            <div className="flex flex-col justify-evenly align-center p-10" style={{ color: "white" }}>
                <h1 className="max-sm:text-4xl text-5xl text-wrap font-extrabold">
                    Get the Best Value!
                </h1>
                <br /><br />
                <ul>
                    <li style={{ display: "flex", alignItems: "center" }} className="text-white text-bold md:text-2xl max-sm:text-md">
                        <FaStar style={{ marginRight: "10px" }} /> Easy mobile <span className="text-green-400 ">&nbsp;selling</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "center" }} className="text-white text-bold md:text-2xl max-sm:text-md">
                        <FaStar style={{ marginRight: "10px" }} /> Free <span className="text-green-400">&nbsp;Pickup&nbsp;</span> and <span className="text-green-400">&nbsp;Shipping&nbsp;</span>
                    </li>
                    <li style={{ display: "flex", alignItems: "center" }} className="text-white text-bold md:text-2xl max-sm:text-md">
                        <FaStar style={{ marginRight: "10px" }} /> Hassle-Free Process
                    </li>

                </ul>
            </div>
            <div>
                <img style={{ width: "250px" }} className="w-lg max-sm:m-auto" src={images.banner1} />
            </div>
            <br /><br />
        </div>
        <br />

    </>)

}