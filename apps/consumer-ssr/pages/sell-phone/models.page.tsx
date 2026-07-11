export {Page}

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { setUrl } from "../../features/breadcrumb/navSlice";
import { Card, Spinner } from "flowbite-react";
import images from "../../images";
import "../../renderer/main.css";
import { FaStar } from "react-icons/fa";
import DataRepository from "../../services/dataRepository";
import { Product } from "../../dto/Product";
import { GLOBAL_CONSTANTS } from "../../global.constants";
import { Link } from "../../renderer/Link";

function Page({product, loading}:{product:Product, loading:boolean}) {

    const dispatch = useDispatch();
    const [load, setLoad] = useState(loading);
    const [selected_variant, setVariant] = useState(0);

    const [searchParams, setSearchParams] = useState(new URLSearchParams());

    const dataRepo: DataRepository = new DataRepository();

    const populate = async () => {
        var alias = searchParams.get("alias");
        setSearchParams(searchParams);
        if (!alias) return;
        
    }

    useEffect(() => {
        populate();
        dispatch(setUrl({ url: window.location.href }));
        setSearchParams(new URLSearchParams(window.location.search));
    }, []);

    return (<>


        <Card style={{ padding: "0px" }} className="max-w-fill  min-md:p-10 pb-20 min-md:m-2 max-sm:m-0 min-md:pl-5 max-sm:p-0">
            {load && <div className="m-auto">
                <Spinner color="gy" />
            </div>}
            {product?.title && <div style={{ padding: "0px" }} className="grid min-md:grid-cols-2 max-sm:grid-cols-1 max-sm:w-fill ">
                <div className="min-md:mr-4 max-sm:m-0 max-sm:p-0">
                    <h1 className="text-2xl  font-normal">
                        {product?.brand.name} {product?.title} {product?.variants[selected_variant]?.screen_size}" {product?.variants[selected_variant]?.ram_size}GB {product?.variants[selected_variant]?.storage_size}GB
                    </h1><br />
                    <img className="productImage min-md:ml-50" src={GLOBAL_CONSTANTS.s3Base + product?.product_images.at(0) + ".png"} />
                    <br />
                    <Card className="max-w-fill mb-2 max-sm:hidden " >
                        <h1 className="text-2xl">
                            Get your phone's value right now :)
                        </h1>
                        <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus vitae dolore dignissimos!
                        </p>
                        <Link to={"/sell-phone/" + product?.brand.name + "/calculate/" + product?.alias}>
                            <button className="btn text-md primary w-fit text-black">
                                Calculate value now <span className="fa fa-arrow-right"></span>
                            </button>
                        </Link>
                    </Card>
                </div>
                <div className="min-md:ml-4 ml-0 max-sm:w-full max-sm:hidden">
                    <Card className="max-w-fill mb-2" >
                        <div className="gap-y-0.5">
                            <strong>
                                <h1 className="font-bold">GET UPTO</h1>
                            </strong>
                            <div style={{ alignItems: "center" }} className="flex">
                                {product?.max_retail_price && <span className="text-green-500" style={{ fontWeight: "bolder", fontSize: "1.8rem", fontFamily: "sans-serif" }}>
                                    <span className="fa fa-inr"></span> {(product?.variants[selected_variant]?.max_retail_price - product?.variants[selected_variant]?.discount).toLocaleString("en")}
                                </span>}
                                <span className="ml-2">if you sell it now</span>
                            </div>
                            <div>
                                <span className="original_price lg"><span className="fa fa-inr"></span> {product?.variants[selected_variant]?.max_retail_price.toLocaleString("en")}</span>
                                {product?.variants[selected_variant]?.max_retail_price && <span className="discount_percent">-{(100 - Number(((product?.variants[selected_variant]?.max_retail_price - product?.variants[selected_variant]?.discount) / product?.variants[selected_variant]?.max_retail_price) * 100)).toFixed()}% </span>}
                            </div>
                        </div>

                        <strong>
                            <h1 className="font-bold">Choose a variant</h1>
                        </strong>

                        <form>
                            <div className="flex gap-2">
                                <fieldset className="flex gap-2">
                                    {

                                        product?.variants.map((variant, index) => {
                                            return <div className="radioGroup">
                                                <label onClick={() => setVariant(index)} htmlFor="variant font-bold">
                                                    <div className={"rounded-sm btn primary text-black font-extrabold" + (selected_variant == index ? " hovered" : "")}>
                                                        <p className="font-bold">
                                                            {variant.storage_size}GB
                                                        </p>
                                                    </div>
                                                </label>

                                            </div>
                                        })
                                    }
                                </fieldset>
                            </div>
                        </form>
                        <p>
                            To know the exact value of your phone, click below.
                        </p>
                        <Link to={"/sell-phone/" + product?.brand.name +  "/calculate/" + product?.alias}>
                            <div className="btn primary w-fit text-black">
                                Get Exact Value
                            </div>
                        </Link>
                        <hr style={{ color: "gray" }} />

                        <h1 style={{ fontWeight: "bolder" }} className="font-extrabold text-md">Product Information</h1>

                        <p className="text-sm">
                            {product?.description}
                        </p>

                        <h1 style={{ fontWeight: "bolder" }} className="font-extrabold text-md">What is MG Verified?</h1>

                        <p className="text-sm">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa a pariatur quo minus expedita provident ratione temporibus suscipit animi sint!
                        </p>



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
            </div>}
            
        </Card>
        {/* 
            Mobile Sections
        */}
        <Card className="mb-2 md:hidden mt-2 max-sm:w-full" >
            <h1 className="text-2xl">
                Get your phone's value right now :)
            </h1>
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus vitae dolore dignissimos!
            </p>
            <Link className="m-0 p-0 w-full" to={"/sell-phone/" + product?.brand.name + "/calculate/" + product?.alias}>
                <button className="btn text-md primary w-fit max-sm:w-fill uppercase text-black m-0">
                    Calculate value now <span className="fa fa-arrow-right"></span>
                </button>
            </Link>
        </Card>
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

                <h1 style={{ fontWeight: "bolder" }} className="font-extrabold text-md">Product Information</h1>

                <p className="text-sm">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid magni saepe accusantium reiciendis velit ex nihil, culpa ipsa ullam voluptates debitis. Impedit, nam.
                </p>

                <h1 style={{ fontWeight: "bolder" }} className="font-extrabold text-md">What is MG Verified?</h1>

                <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa a pariatur quo minus expedita provident ratione temporibus suscipit animi sint!
                </p>



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