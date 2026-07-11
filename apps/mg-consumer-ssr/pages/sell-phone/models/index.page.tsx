import DataRepository from "../../../services/dataRepository";
import { useEffect, useState } from "react";
import { Product } from "../../../dto/Product";
import { useDispatch } from "react-redux";
import { setUrl } from "../../../features/breadcrumb/navSlice";
import { GLOBAL_CONSTANTS } from "../../../global.constants";
import { Spinner } from "flowbite-react";
import { setAlert } from "../../../features/alert/alertSlice";

export {Page}

function Page({products, brand_name, from}:{products:Product[], brand_name:string, from:string}) {

    const dataRepo = new DataRepository();
    const dispatch = useDispatch();

    function capitalizeFirstLetter(val: string | undefined) {
        if (!val) return;
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

 

    interface BrandNameToIdMap{
        [k:string]:number
    }


    const BrandsToIdsMap: BrandNameToIdMap = {
        "apple":48,
        "samsung":9,
        "google":107,
        "one-plus":95,
        "xiaomi":80,
        "realme":118,
        "oppo":82,
        "vivo":98
    }

    const populate = async () => {
        // setProducts([]);
        // const brandId = (new URLSearchParams(params)).get("get");
        // if (!brandId) {
        //     return;
        // }
        // if (BrandsToIdsMap[Number(brandId)] != brand_name?.toString()) {
        //     dispatch(setAlert({ message: "An error occurred", show: true }));
        //     return;
        // }
        // dataRepo.getProductsByPopularity(4, { brand: brandId }).then(data => setProducts(data.data)).catch(err => console.log(err));
    }

    useEffect(() => {
        dispatch(setUrl({ url: window.location.href }));
        populate();
    }, []);

    return (<>


        <div id="latest" className="custom_container">

            <h1 className="text-center text-sm pl-2">
                Trending phones in {capitalizeFirstLetter(brand_name?.split("-")?.join(" "))}
            </h1><br />
            {products.length == 0 && <div className="m-auto w-fill flex justify-center">
                <Spinner color="gray" />
            </div>}
            <div data-item-container="1" className="grid grid-cols-5 w-fit m-auto max-sm:grid-cols-2 max-sm:w-full">

                {products && products.map((item: Product) => {
                    return <a className="text-center w-fill capitalize text-sm" href={`/${from}/models/` + item.brand.name.toLowerCase() + "/" + item.alias}>
                        <div className="grid-cols-1 mobile_card small grid-rows-5">
                            {/* <img className="mgVerified" src={images.mg_verified} /> */}
                            <img src={GLOBAL_CONSTANTS.s3Base + item.product_images[0] + ".png"} />
                            {/* <div className="rating">

                            <span className="fa fa-star" style={{ "color": "gold" }}></span> {(item.popularity).toFixed(1)}
                        </div> */}
                            {/* <div className="discount_strip">
                            <span className="fa fa-inr"></span> {item.discount.toLocaleString("en")} off
                        </div> */}
                            <div style={{ fontSize: "0.8rem", textAlign: "center" }} className="title text-center uppercase w-fill">
                                {item.title} 
                            </div>
                            {/* <div className="pricing">

<div className="price">
<span className="fa fa-inr"> </span> {item.max_retail_price.toLocaleString("en")}
</div>
<span className="original_price">{item.max_retail_price.toLocaleString("en")}</span>
<span className="discount_percent">-{Number(((item.max_retail_price - item.discount) / item.max_retail_price) * 100)}% </span>

</div> */}
                        </div>
                    </a>
                })}
            </div>
        </div>
        <br /><br />

    </>)

}