import DataRepository from "../../../services/dataRepository";
import { PageContext } from "../../../renderer/types";

export { onBeforeRender };
export { passToClient };

const dataRepo = new DataRepository();

function capitalizeFirstLetter(val: string | undefined) {
    if (!val) return;
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

async function onBeforeRender(pageContext: PageContext) {

    console.log("Context:", pageContext);
    const data = await getData(BrandsToIdsMap[pageContext.routeParams?.brand.toLowerCase() || ""]);

    return {

        // We already provide `pageContext` here so that `vite-plugin-ssr`
        // will *not* have to call the `addPageContext()` hook defined
        // above in this file.
        pageContext: {
            pageProps: {
                products: data,
                title: capitalizeFirstLetter(pageContext.routeParams?.brand.split("-")?.join(" ")) + (data.length > 0 ? " | " + data.length + " Models to choose from" : ""),
                brand_name: pageContext.routeParams?.brand,
                from: "sell-phone"
            },
            search: pageContext.urlOriginal
        },

    }

}

const passToClient = [
    "routeParams"
]

async function getData(brandId: number) {

    const data = await dataRepo.getProductsByPopularity(4, { brand: brandId });

    return data.data;

}

interface BrandNameToIdMap {
    [k: string]: number
}

const BrandsToIdsMap: BrandNameToIdMap = {
    "apple": 48,
    "samsung": 9,
    "google": 107,
    "one-plus": 95,
    "xiaomi": 80,
    "realme": 118,
    "oppo": 82,
    "vivo": 98
}