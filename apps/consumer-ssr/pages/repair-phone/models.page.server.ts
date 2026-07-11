import { Product } from "../../dto/Product";
import { PageContext } from "../../renderer/types";
import DataRepository from "../../services/dataRepository";

const dataRepo = new DataRepository();

export { onBeforeRender, getFullNameForPhone, passToClient }

const getFullNameForPhone = (product:Product)=>{

    return product.brand.name + " " + product.title + " " + product.variants[0].storage_size + "GB Storage" + " " + product.variants[0].ram_size + "GB RAM";

}

async function onBeforeRender(pageContext: PageContext) {

    console.log("Context:", pageContext);

    var productData = (await getData(pageContext.routeParams?.alias));
    var repairCosts = (await getRepairCostsForProduct(pageContext.routeParams?.alias));
console.log("repair costs:", repairCosts);
    return {

        // We already provide `pageContext` here so that `vite-plugin-ssr`
        // will *not* have to call the `addPageContext()` hook defined
        // above in this file.

        pageContext: {
            pageProps: {
                product: productData,
                loading: productData.title ? false : true,
                repairServices: repairCosts,
                title: getFullNameForPhone(productData) + " - Sell at the best price",
            },
            search: pageContext.urlOriginal
        },

    }

}

const passToClient = [
    "routeParams"
]




const getData = async (alias: string | undefined): Promise<any> => {

    if (!alias) return {};

    const data = await dataRepo.getProductByAlias(alias);

    return data.data;

}

const getRepairCostsForProduct = async (alias:string | undefined):Promise<any> => {
    
    if(!alias) return {}
    console.log("ALIAS:", alias);
    const data = await dataRepo.getRepairCostsForProduct(alias);
    console.log("DATA:", data);
    return data.data;
}
