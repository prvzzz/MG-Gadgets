import { FaStar, FaMobileAlt, FaMoneyBillWave, FaSyncAlt } from "react-icons/fa";
import images from "../../images";

import "../../renderer/main.css";
import { Button } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUrl } from "../../features/breadcrumb/navSlice";

export { Page };

function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    const style = `<style>.breadcrumb{display:"none"}</style>`;
    // document.body.innerHTML+=style;
    dispatch(setUrl({ url: window.location.href }));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div
        className="w-full p-6 sm:p-12 pb-16 sm:pb-20"
        style={{ background: "linear-gradient(#696969, #000000)" }}
      ><br />
        <div className="flex flex-col justify-center items-center text-white text-center sm:text-left">
          <h1
            className="text-7xl max-sm:text-4xl font-bold max-sm:font-extrabold text-center animate-fade-up"
          >
            Get the Best Deals for your Phone
          </h1>

          <p className="mt-6 text-base sm:text-lg leading-relaxed text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus at ad asperiores
            inventore quod iusto aliquid? Consectetur vitae dignissimos magnam optio inventore!
          </p>

          <ul className="mt-8 space-y-4 sm:space-y-6 text-left w-full sm:w-auto">
            <li className="flex items-center text-white font-semibold text-lg sm:text-2xl">
              <FaStar className="mr-3 text-green-400" /> Easy mobile{" "}
              <span className="text-green-400">&nbsp;selling</span>
            </li>
            <li className="flex items-center text-white font-semibold text-lg sm:text-2xl">
              <FaStar className="mr-3 text-green-400" /> Free{" "}
              <span className="text-green-400">&nbsp;Pickup&nbsp;</span> and{" "}
              <span className="text-green-400">&nbsp;Shipping&nbsp;</span>
            </li>
            <li className="flex items-center text-white font-semibold text-lg sm:text-2xl">
              <FaStar className="mr-3 text-green-400" /> Hassle-Free Process
            </li>
          </ul>
        </div>
      </div>

      {/* Banner Section */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center p-6 sm:p-12 text-white"
        style={{ background: "linear-gradient(#000000, #696969)" }}
      >
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            The <span className="text-white">best</span> second-hand phones online
          </h1>
          <p className="mt-4 text-base sm:text-lg font-medium">
            Get the best value today, and get paid within minutes
          </p>
        </div>
        <div className="flex justify-center sm:justify-end">
          <img
            style={{ width: "220px" }}
            className="max-w-full"
            src={images.banner1}
            alt="Banner"
          />
        </div>
      </div>

      {/* Services Section */}
      <section className="py-16 px-6 bg-gray-50 text-white max-sm:p-3 max-sm:px-3" style={{ background: "linear-gradient(#696969, #000000)" }}>
        <div className="min-w-min text-center">
          <h2 className="text-3xl font-bold mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Service 1 */}
            <div className="bg-black shadow-md p-8 flex flex-col hover:shadow-lg transition">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Sell Your Phone</h3>
              <p className="text-white-600 mb-6 flex-grow">
                Get instant offers for your old devices. Hassle-free process with doorstep pickup.
              </p>
              <a
                href="/sell-phone"
                className="btn btn-light primary text-light w-full block text-center px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition mt-auto"
              >
                Sell Now
              </a>
            </div>

            {/* Service 2 */}
            <div className="bg-black shadow-md p-8 flex flex-col hover:shadow-lg transition">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Buy Refurbished Phones</h3>
              <p className="text-white-600 mb-6 flex-grow">
                Shop certified refurbished smartphones at the best prices, tested for quality.
              </p>
              <a
                href="/buy-phone"
                className="btn primary w-full block text-center px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition mt-auto"
              >
                Shop Now
              </a>
            </div>

            {/* Service 3 */}
            <div className="bg-black shadow-md p-8 flex flex-col hover:shadow-lg transition">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Quick & Secure Payments</h3>
              <p className="text-white-600 mb-6 flex-grow">
                Enjoy fast and secure payment options when buying or selling your phone.
              </p>
              <a
                href="/payments"
                className="btn primary w-full block text-center px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition mt-auto"
              >
                Learn More
              </a>
            </div>

          </div>
        </div>
        <br /><br /><br /><br /><br />
      </section>

    </>
  );
}
