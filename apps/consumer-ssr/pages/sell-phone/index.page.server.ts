import { title } from "process";
import { Product } from "../../dto/Product";
import DataRepository from "../../services/dataRepository";
import { PageContext } from "../../renderer/types";

export { onBeforeRender };
export { passToClient };

const dataRepo = new DataRepository();


async function onBeforeRender(pageContext: PageContext) {

    console.log("Context:", pageContext);

    return {

        // We already provide `pageContext` here so that `vite-plugin-ssr`
        // will *not* have to call the `addPageContext()` hook defined
        // above in this file.
        pageContext: {
            pageProps: {
                latestItems: (await getData()).latestItems,
                otherItems: (await getData()).otherItems,
                title: "MG Gadgets | Sell Phone in Seconds",
            },
            search: pageContext.urlOriginal
        },

    }

}

const passToClient = [
    "routeParams"
]

async function getData() {

    const latestItems = (await dataRepo.getProductsByPopularity(4, {})).data;
    const otherItems = (await dataRepo.getProductsByPopularity(4, { brand: 9 })).data;

    return {
        latestItems,
        otherItems
    };

}

