import { Link } from "../renderer/Link";
import "./skeleton.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";


export default function Breadcrumb() {

    const [slug, setSlug] = useState("");
    const [queries, setQueries] = useState<string>("");
    const [location, setLocation] = useState("");
    const [linkParts, setParts] = useState<string[]>([]);


    function capitalizeFirstLetter(val: string) {
        console.log(slug);
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    function getValueFromQuery(val: string) {
        return val?.replace("/", "").replace(/%20/g, " ");
    }

    function getLink(index: number) {
        return linkParts.slice(1, index).join("/");
    }

    const links = [
        {
            "label": "Home",
            "active": true,
            "link": "/",
            "urlPart": "app"
        },
        {
            "label": "Sell Phone",
            "active": true,
            "link": "/sell-phone",
            "urlPart": "sell-phone"
        },
        {
            "label": "Buy Phone",
            "active": true,
            "link": "/buy-phone",
            "urlPart": "buy-phone"
        },
         {
            "label": "Repair Phone",
            "active": true,
            "link": "/repair-phone",
            "urlPart": "repair-phone"
        },
        // {
        //     "label": "Models",
        //     "active": true,
        //     "link": getLink(4),
        //     "urlPart": "models"
        // },
        {
            "label": "Calculate now",
            "active": true,
            "link": "#",
            "urlPart": "calculate"
        },
        {
            "label": null,
            "active": true,
            "link": "/details/estimate/",
            "urlPart": null
        }

    ]

    const navState = useSelector((state: RootState) => state.nav);

    useEffect(() => {
        setLocation(navState.url);
    }, [navState.url]);

    useEffect(() => {
        console.log("location:", location);
        if (!location) return;

        const url = location.split("?").at(0);
        const queries = location.split("?").at(1);

        if (queries) {
            setQueries("?" + queries);
        }

        if (!url) return;

        setParts(url.split("/").slice(3,));
        console.log(linkParts);
        // window.addEventListener("popstate", refreshLocation);

    }, [location]);

    useEffect(() => {
        var slug_: string | any = "";
        const url = window.location.href;

        if (url.includes("models") || url.includes("calculate")) {

            slug_ = linkParts.filter(l => l.includes("%")).at(0)?.replace("/", "").replace(/%20/g, " ");
            console.log("Slug:", slug_);
            // slug_ = slug_.replace("%20"," ");    
            setSlug(slug_);
        } else {
            setSlug("");
        }
    }, [linkParts]);
    // console.log("link parts:", linkParts);

    return (<>

        {(linkParts.length > 1) && <ul className="breadcrumb">
            {/* <li className="breadcrumb-link link">
                <Link to={"/"}>
                    Home
                </Link>
            </li> */}

            {linkParts && linkParts.map((linkPart, ind) => {
                console.log(linkPart);
                var link = links.filter(l => l.urlPart == linkPart).at(0);
                // console.log("Link:", link);
                if (link?.label != null && link?.label != "") {
                    return <li className="breadcrumb-link link text-xs">
                        <Link to={(link ? link.link : "/")}>
                            {link?.label}
                        </Link>

                    </li>
                } else if (linkPart.includes("%")) {
                    return <li className="breadcrumb-link link text-xs">
                        <Link to={getLink(ind) + "/" + linkPart + queries}>
                            {getValueFromQuery(linkPart)}
                        </Link>

                    </li>
                } else {
                    return <li className="breadcrumb-link link text-xs">
                        <Link to="" onClick={() => window.history.back()}>
                        {capitalizeFirstLetter(linkPart)}
                    </Link>

                    </li>
        }
            })

            }

        {/* {
                slug && <li className="breadcrumb-link link text-xs">
                    {slug}
                </li>
            } */}

    </ul >}

    </>)

}

