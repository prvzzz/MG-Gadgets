import images from "../images";

export default function Footer() {
    return (<>

        <footer className="grid bg-black w-full p-8 sm:p-12 lg:p-20 md:grid-cols-5 max-sm:grid-cols-1 text-white gap-8">
            {/* Logo + Socials */}
            <div className="col-span-1 flex flex-col items-center md:items-start">

                <div className="text-center md:text-left text-white">
                    <p className="text-sm text-white-300">Follow us on</p>
                    <div className="flex flex-row justify-center md:justify-start gap-4 text-2xl mt-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500">
                            <span className="fa-brands fa-facebook"></span>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500">
                            <span className="fa-brands fa-x-twitter"></span>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500">
                            <span className="fa-brands fa-instagram"></span>
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500">
                            <span className="fa-brands fa-youtube"></span>
                        </a>
                    </div>
                </div>
                
            </div>

            {/* Empty spacers for desktop layout */}
            <div className="max-sm:hidden"></div>
            <div className="max-sm:hidden"></div>

            {/* Footer Nav */}
            <div className="md:col-span-2 max-sm:col-span-1 text-white">
                <div className="footer_nav grid md:grid-cols-3 gap-8 max-sm:grid-cols-1 text-center sm:text-left">

                    {/* Buy Phone */}
                    <ul>
                        <li className="font-semibold pb-2">Buy Phone</li>
                        <li><a href="/buy-phone/models/apple" className="hover:text-green-500">Buy Refurbished iPhones</a></li>
                        <li><a href="/buy-phone/models/samsung" className="hover:text-green-500">Buy Refurbished Samsung</a></li>
                        <li><a href="/buy-phone/models/one-plus" className="hover:text-green-500">Buy Refurbished One Plus</a></li>
                        <li><a href="/buy-phone/models/xiaomi" className="hover:text-green-500">Buy Refurbished Xiaomi</a></li>
                        <li><a href="/buy-phone/" className="hover:text-green-500">View All Phones</a></li>
                    </ul>

                    {/* Sell Phone */}
                    <ul>
                        <li className="font-semibold pb-2">Sell Phone</li>
                        <li><a href="/sell-phone/models/apple" className="hover:text-green-500">Sell iPhone</a></li>
                        <li><a href="/sell-phone/models/samsung" className="hover:text-green-500">Sell Samsung</a></li>
                        <li><a href="/sell-phone/models/xiaomi" className="hover:text-green-500">Sell Xiaomi</a></li>
                        <li><a href="/sell-phone/models/one-plus" className="hover:text-green-500">Sell One Plus</a></li>
                        
                    </ul>

                    {/* Legal */}
                    <ul>
                        <li className="font-semibold pb-2">Legal</li>
                        <li><a href="/privacy-policy" className="hover:text-green-500">Privacy Policy</a></li>
                        <li><a href="/shipping-policy" className="hover:text-green-500">Shipping Policy</a></li>
                    </ul>

                </div>
            </div>
                <img className="w-32 sm:w-96 max-sm:w-40 mb-6 m-auto" src={images.logo} alt="Logo" />

        </footer>

        <p style={{ color: "lightgray" }} className="text-sm text-center p-3 bg-black">Copyright <i className="far fa-copyright"></i>
            <span id="year"></span> MG Gadgets All Rights Reserved
        </p>
    </>)
}