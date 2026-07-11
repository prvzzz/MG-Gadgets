import images from "../../images";
import { FaStar } from "react-icons/fa";
import { Accordion, AccordionPanel, AccordionTitle, AccordionContent } from "flowbite-react";
import { useEffect, useState } from "react";
import DataRepository from "../../services/dataRepository";
import { Product } from "../../dto/Product";
import { GLOBAL_CONSTANTS } from "../../global.constants";
import { useDispatch } from "react-redux";
import { setUrl } from "../../features/breadcrumb/navSlice";

export { Page }

function Page({ latestItems, otherItems }: { latestItems: Product[], otherItems: Product[] }) {


    const dispatch = useDispatch();

    const dataRepo = new DataRepository();

    const populate = async () => {


    }

    useEffect(() => {
        dispatch(setUrl({ url: window.location.href }));
        populate();
    }, [])

    return (<>

        <div className="grid place-content-center md:columns-2 max-sm:p-0 p-5 pt-10 max-sm:m-0 max-sm:rounded-none max-sm:columns-1 min-h-svh max-sm:min-h-96 max-sm:pt-10 " style={{ background: "linear-gradient(#696969, #000000)" }}>
            <div className="col-span-2 flex flex-col justify-evenly align-center p-10 max-sm:p-1.5 max-sm:pt-0 max-sm:pb-10" style={{ color: "white" }}>
                <h1
                    className="text-7xl max-sm:text-4xl font-bold max-sm:font-extrabold text-center animate-fade-up"
                >
                    Buy the best Refurbished phones
                </h1>

            </div>
            <div className="pl-3.5 pr-3.5 col-span-2 place-content-center min-md:m-auto">
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

                </ul><br />
                <div className="flex gap-3 md:justify-start justify-start max-sm:flex-col w-full pb-6 mt-8">
                    <a href="#latest" className="border-white text-white text-center min-md:w-fill bg-transparent hover:bg-white text-white-500 font-bold hover:text-black py-2 px-4 border border-white-500 hover:border-transparent rounded">
                        Explore now
                    </a>
                    <a href="#latest" className="border-white text-white text-center min-md:w-fill bg-transparent hover:bg-white text-white-500 font-bold hover:text-black py-2 px-4 border border-white-500 hover:border-transparent rounded">
                        Learn more
                    </a>
                </div>
            </div>
        </div>
        <div id="latest" className="custom_container">
            <h1 className="text-left text-sm pl-2">Latest in 2025</h1>
            <span data-controller="1" className="fa-solid fa-angle-left"></span>
            <span data-controller="1" className="fa-solid fa-angle-right"></span>
            <div data-item-container="1" className="items_container flex flex-row w-full">
                {latestItems && latestItems.map((item: Product) => {
                    return <div className="grid-cols-1 mobile_card grid-rows-5">
                        <img className="mgVerified" src={images.mg_verified} />
                        <img src={GLOBAL_CONSTANTS.s3Base + item.product_images[0] + ".png"} />
                        <div className="rating">

                            <span className="fa fa-star" style={{ "color": "gold" }}></span> {(item.popularity).toFixed(1)}
                        </div>
                        <div className="discount_strip">
                            <span className="fa fa-inr"></span> {item.discount.toLocaleString("en")} off
                        </div>
                        <div className="title">


                            <a href={"/buy-phone/models/" + item.brand.name.toLowerCase() + "/" + item.alias}>
                                {item.title} {item.screen_size + "\""} {item.ram_size + "GB"} {item.storage_size + "GB"}
                            </a>
                        </div>
                        <div className="pricing">

                            <div className="price">
                                <span className="fa fa-inr"> </span> {item.max_retail_price.toLocaleString("en")}
                            </div>
                            <span className="original_price">{item.max_retail_price.toLocaleString("en")}</span>
                            <span className="discount_percent">-{Number(((item.max_retail_price - item.discount) / item.max_retail_price) * 100)}% </span>

                        </div>
                    </div>
                })}
            </div>
        </div>
        <div className="custom_container">
            <h1 className="text-left text-md pl-2">Excellent Condition</h1>
            <span data-controller="1" className="fa-solid fa-angle-left"></span>
            <span data-controller="1" className="fa-solid fa-angle-right"></span>
            <div data-item-container="1" className="items_container flex flex-row w-full">
                {otherItems && otherItems.map((item: Product) => {
                    return <div className="grid-cols-1 mobile_card grid-rows-5">
                        <img className="mgVerified" src={images.mg_verified} />
                        <img src={GLOBAL_CONSTANTS.s3Base + item.product_images[0] + ".png"} />
                        <div className="rating">

                            <span className="fa fa-star" style={{ "color": "gold" }}></span> {(item.popularity).toFixed(1)}
                        </div>
                        <div className="discount_strip">
                            <span className="fa fa-inr"></span> {item.discount.toLocaleString("en")} off
                        </div>
                        <div className="title">

                            <a href={"/buy-phone/models/" + item.brand.name + "/" + item.alias}>
                                {item.title} {item.screen_size + "\""} {item.ram_size + "GB"} {item.storage_size + "GB"}
                            </a>
                        </div>
                        <div className="pricing">

                            <div className="price">
                                <span className="fa fa-inr"> </span> {item.max_retail_price.toLocaleString("en")}
                            </div>
                            <span className="original_price">{item.max_retail_price.toLocaleString("en")}</span>
                            <span className="discount_percent">-{Number(((item.max_retail_price - item.discount) / item.max_retail_price) * 100)}% </span>

                        </div>
                    </div>
                })}
            </div>
        </div>
        <div className="custom_container">
            <h1 className="text-left text-md pl-2">Smooth Process</h1>


            <div className="w-fill max-w-6xl mx-auto">

                {/*Vertical Timeline #2 */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">

                    {/*Item #1 */}
                    <div className="relative flex items-center justify-center md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/*Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-black-300 group-[.is-active]:bg-black text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="10">
                                <path fill-rule="nonzero" d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z" />
                            </svg>
                        </div>
                        {/*Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow timeline-card">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-slate-900">Check Price</div>
                                <time className="font-caveat font-medium text-indigo-500">Today</time>
                            </div>
                            <div className="text-slate-500">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam aliquid explicabo rem quae architecto?
                            </div>
                        </div>
                    </div>

                    {/*Item #2 */}
                    <div className="relative flex items-center justify-center md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/*Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-black text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="10">
                                <path fill-rule="nonzero" d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z" />
                            </svg>
                        </div>
                        {/*Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow timeline-card">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-slate-900">Schedule Pickup</div>
                                <time className="font-caveat font-medium text-indigo-500">Today</time>
                            </div>
                            <div className="text-slate-500">Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.</div>
                        </div>
                    </div>

                    {/*Item #3 */}
                    <div className="relative flex items-center justify-center md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/*Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-black text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="12" height="10">
                                <path fill-rule="nonzero" d="M10.422 1.257 4.655 7.025 2.553 4.923A.916.916 0 0 0 1.257 6.22l2.75 2.75a.916.916 0 0 0 1.296 0l6.415-6.416a.916.916 0 0 0-1.296-1.296Z" />
                            </svg>
                        </div>
                        {/*Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow timeline-card">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-slate-900">Get Paid</div>
                                <time className="font-caveat font-medium text-indigo-500">Within 3 days</time>
                            </div>
                            <div className="text-slate-500">Pretium lectus quam id leo. Urna et pharetra aliquam vestibulum morbi blandit cursus risus.</div>
                        </div>
                    </div>


                </div>
                {/*End: Vertical Timeline #2 */}

            </div>


        </div>
        <div className="custom_container">
            <h1 className="text-left text-md pl-2">Choose a Brand</h1>
            <div
                style={{ overflowX: "scroll" }}
                className="pt-2 pb-2 pl-2 h-fit flex flex-row justify-evenly m-auto align-items-center">

                <div className="card_box">
                    <img src={images.mobile1} />
                </div>
                <div className="card_box">
                    <img src={images.mobile2} />
                </div>
                <div className="card_box">
                    <img src={images.mobile3} />
                </div>
                <div className="card_box">
                    <img src={images.mobile4} />
                </div>
                <div className="card_box">
                    <img src={images.mobile5} />
                </div>
                <div className="card_box">
                    <img src={images.mobile6} />
                </div>
                <div className="card_box">
                    <img src={images.mobile7} />
                </div>
                <div className="card_box">
                    <img src={images.mobile7} />
                </div>
                <div className="card_box">
                    <img src={images.mobile8} />
                </div>
                <div className="card_box">
                    <img src={images.mobile9} />
                </div>
                <div className="card_box">
                    <img src={images.mobile10} />
                </div>


            </div>
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


        </div>
        <div className="custom_container">
            <h1 className="text-left text-md pl-2">Frequently Asked Questions</h1>
            <br />
            <Accordion className="w-fill max-sm:w-fill m-auto" style={{ borderRadius: "0px" }} flush={false}>
                <AccordionPanel style={{ background: "white" }} flush={false}>
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
        </div>
        <br />
    </>)

}   