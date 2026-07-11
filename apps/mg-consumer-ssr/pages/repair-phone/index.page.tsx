import { FaStar } from "react-icons/fa";
import images from "../../images";

export { Page }

function Page() {


    return (<>
        <div className="grid place-content-center md:columns-2 max-sm:p-0 p-5 pt-10 max-sm:m-0 max-sm:rounded-none max-sm:columns-1 min-h-svh  max-sm:pt-10 " style={{ background: "linear-gradient(#696969, #000000)" }}>
            <div className="col-span-2 flex flex-col justify-evenly align-center p-10 max-sm:p-1.5 max-sm:pt-0 max-sm:pb-10" style={{ color: "white" }}>
                <h1
                    className="text-7xl max-sm:text-3xl font-bold max-sm:font-extrabold text-center animate-fade-up"
                >
                    Coming Soon!
                    The best repair service
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
                    {/* <a href="#latest" className="border-white text-white text-center min-md:w-fill bg-transparent hover:bg-white text-white-500 font-bold hover:text-black py-2 px-4 border border-white-500 hover:border-transparent rounded">
                        Explore now
                    </a>
                    <a href="#latest" className="border-white text-white text-center min-md:w-fill bg-transparent hover:bg-white text-white-500 font-bold hover:text-black py-2 px-4 border border-white-500 hover:border-transparent rounded">
                        Learn more
                    </a> */}
                </div>
            </div>
        </div>


    </>)
}