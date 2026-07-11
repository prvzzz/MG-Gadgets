import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { setUrl } from "../../features/breadcrumb/navSlice";
import { Card, Spinner } from "flowbite-react";
import images from "../../images";
import "../../renderer/main.css";
import { FaStar } from "react-icons/fa";
import DataRepository from "../../services/dataRepository";
import { useSearchParams } from "react-router";
import { Product } from "../../dto/Product";
import { GLOBAL_CONSTANTS } from "../../global.constants";
import { addItem, show } from "../../features/cart/cartSlice";
import { CartItem } from "../../misc/types";


export { Page }

function Page({ product, loading }: { product: Product, loading: boolean }) {

    const dispatch = useDispatch();
    const [load, setLoad] = useState(loading);
    const [selected_variant, setVariant] = useState(0);
    const [selected_color, setColor] = useState<string | undefined>("");

    // const [searchParams, setSearchParams] = useSearchParams();

    const dataRepo: DataRepository = new DataRepository();

    const populate = async () => {
        // var alias = searchParams.get("alias");
        // setSearchParams(searchParams);
        // if (!alias) return;
        // await dataRepo.getProductByAlias(alias).then(data => { setProduct(data.data); setLoad(false) });
    }

    useEffect(() => {
        populate();
        dispatch(setUrl({ url: window.location.href }));
    }, []);

    useEffect(() => {
        setColor(product?.variants[0].color)
    }, [product])

    useEffect(() => {
        if (selected_color) {
            setVariant(0);
        }
    }, [selected_color])

    function addToCart() {
        dispatch(addItem({
            item: {
                product: product,
                quantity: 1,
                unit_amount: product?.variants.at(selected_variant)?.max_retail_price,
                selected_variant: selected_variant,
                type: "buy"
            } as CartItem
        }))
        dispatch(show({ show: true }))
    }

    return (<>


        {/* <Card id="mainCard" className="max-w-fill  min-md:p-10 pb-20 min-md:m-2  min-md:pl-5 max-sm:p-0"> */}
        {load && <div className="m-auto">
            <Spinner color="gray" />
        </div>}
        <div className="grid min-md:grid-cols-2 max-sm:grid-cols-1 max-sm:w-fill p-2.5">
            <div className="min-md:mr-4">
                <h1 className="text-2xl max-sm:text-1xl font-semibold">
                    {product?.brand.name} {product?.title} {product?.variants?.filter(v => v?.color == selected_color)?.at(selected_variant)?.ram_size}GB {product?.variants?.filter(v => v?.color == selected_color)?.at(selected_variant)?.storage_size}GB - Refurbished
                </h1><br />
                <img className="productImage min-md:ml-50" src={GLOBAL_CONSTANTS.s3Base + product?.product_images.at(0) + ".png"} />
                <br /><br />

            </div>
            <div className="min-md:ml-4 ml-0 max-sm:w-full max-sm:m-0">

                <Card className="max-w-fill mb-2" >
                    <div className="gap-y-0.5">
                        <div style={{ alignItems: "center" }} className="flex">
                            {product?.max_retail_price && <span className="text-black-500" style={{ fontWeight: "bolder", fontSize: "1.8rem", fontFamily: "sans-serif" }}>
                                <span className="fa fa-inr"></span>  {((product?.variants?.filter(v => v?.color == selected_color)?.at(selected_variant)?.max_retail_price || 0) - (product?.variants?.filter(v => v?.color == selected_color)?.at(selected_variant)?.discount || 0)).toLocaleString("en")}
                            </span>}
                            <div style={{ marginLeft: "10px" }}>
                                <span className="original_price lg"><span className="fa fa-inr"></span> {product?.variants?.filter(v => v?.color == selected_color)?.at(selected_variant)?.max_retail_price.toLocaleString("en")}</span>
                                {product?.variants?.filter(v => v?.color == selected_color)?.at(selected_variant)?.max_retail_price && <span className="discount_percent">-{(100 - Number((((product?.variants?.filter(v => v?.color == selected_color)?.at(selected_variant)?.max_retail_price || 0) - (product?.variants?.filter(v => v?.color == selected_color)?.at(selected_variant)?.discount || 0)) / (product?.variants?.filter(v => v?.color == selected_color)?.at(selected_variant)?.max_retail_price || 1)) * 100)).toFixed()}% </span>}
                            </div>
                        </div>

                    </div>



                    {/* Variants Form */}
                    {/* <strong>
                            <h1 className="font-bold">Choose a variant</h1>
                        </strong> */}
                    <form>
                        <div className="flex gap-2">
                            <fieldset className="flex gap-2">
                                {

                                    product?.variants.filter(v => v.color == selected_color).map((variant, index) => {
                                        return <div className="radioGroup">
                                            <label onClick={() => setVariant(index)} htmlFor="variant font-bold">
                                                <div className={"rounded-sm btn primary text-black font-extrabold" + (selected_variant == index ? " hovered" : "")}>
                                                    <p className="font-medium">
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

                    <form>
                        <div className="flex gap-2">
                            <fieldset className="flex gap-2">
                                {

                                    [...(new Set(product?.variants.map(v => v.color)))].map(color => {
                                        return <div className="radioGroup">
                                            <label onClick={() => setColor(color)} htmlFor="variant font-bold">
                                                <div className={"rounded-sm btn primary text-black font-extrabold" + (selected_color == color ? " hovered" : "")}>
                                                    <p className="font-medium">
                                                        {color}
                                                    </p>
                                                </div>
                                            </label>

                                        </div>
                                    })
                                }
                            </fieldset>
                        </div>
                    </form>
                    {/* Variants Form end */}
                    <h1 style={{ fontWeight: "bolder" }} className="font-extrabold text-md">Product Information</h1>

                    <p className="text-sm">
                        {product.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="grid w-1xl grid-cols-2 max-sm:grid-cols-1">
                        <button className="m-2 uppercase text-1xl btn primary hovered text-white">Buy Now</button>
                        <button onClick={() => { addToCart() }} className="m-2 uppercase text-1xl btn primary text-black">Add to Cart</button>
                    </div>
                    {/* CTA Buttons end */}
                    <h1 style={{ fontWeight: "bolder" }} className="font-extrabold text-md">What is MG Verified?</h1>

                    <p className="text-sm">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa a pariatur quo minus expedita provident ratione temporibus suscipit animi sint!
                    </p>

                    <br />
                    <Card className="flash-card max-w-fill mb-2 h-fill flex flex-row" style={{ background: "linear-gradient(rgba(166,183,255,0.25), rgb(201 210 248))", fontFamily: "sans-serif" }}>
                        <div className="w-fill flex flex-row">
                            <h1 className="text-3xl font-extrabold w-fit text-blue-600" style={{ letterSpacing: "3px", textShadow: "0 1px 2px black" }}>
                                15% OFF
                            </h1>
                        </div>
                        {/* <button className="btn text-sm primary w-fit text-black">
                            Get value now <span className="fa fa-arrow-right"></span>
                        </button> */}
                    </Card>

                </Card>


            </div>
        </div>

        {/* </Card> */}
        <div className="custom_container">
            <h1 className="text-left text-md pl-2">Choose a Brand</h1>
            <div
                style={{ overflowX: "scroll" }}
                className="pt-2 pb-2 pl-2 h-fit flex flex-row justify-evenly m-auto align-items-center">

                <a href="/sell-phone/models/apple?get=48">
                    <div className="card_box">
                        <img src={images.logo_apple} />
                    </div>
                </a>
                <a href="/sell-phone/models/samsung?get=9">
                    <div className="card_box">
                        <img src={images.logo_samsung} />
                    </div>
                </a>
                <a href="/sell-phone/models/google?get=107">
                    <div className="card_box">
                        <img src={images.logo_google} />
                    </div>
                </a>
                <a href="/sell-phone/models/one-plus?get=95">
                    <div className="card_box">
                        <img src={images.logo_oneplus} />
                    </div>
                </a>
                <a href="/sell-phone/models/xiaomi?get=80">
                    <div className="card_box">
                        <img src={images.logo_xiaomi} />
                    </div>
                </a>
                <a href="/sell-phone/models/realme?get=118">
                    <div className="card_box">
                        <img src={images.logo_realme} />
                    </div>
                </a>

                <a href="/sell-phone/models/oppo?get=82">
                    <div className="card_box">
                        <img src={images.logo_oppo} />
                    </div></a>
                <a href="/sell-phone/models/vivo?get=98">
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