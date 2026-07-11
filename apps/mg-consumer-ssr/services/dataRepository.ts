import { GLOBAL_CONSTANTS } from "../global.constants";
import { ValidCartData } from "../screens/types";


export default class DataRepository {

    private apiPrefix = GLOBAL_CONSTANTS.apiBase;

    constructor() { }

    public async getProductsByPopularity(popularity: number, filter: any) {

        const SEGMENT = "products/get/popularity/"

        return fetch(this.apiPrefix + SEGMENT + popularity, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "filter": filter }) }).then(data => data.json())

    }

    public async getProductByAlias(alias: string) {

        const SEGMENT = "products/get/"
        try {
            return fetch(this.apiPrefix + SEGMENT + alias, { method: "GET", headers: { "Content-Type": "application/json" } }).then(data => data.json())

        } catch (err) { }

    }

    public async searchForProducts(query: string | null) {

        const SEGMENT = "products/search/"

        return fetch(this.apiPrefix + SEGMENT, { method: "POST", body: JSON.stringify({ query: query }), headers: { "Content-Type": "application/json" } }).then(data => data.json())

    }

    public async getRepairCostsForProduct(alias: string) {

        const SEGMENT = "products/get/repairs"
        try {
            return fetch(this.apiPrefix + SEGMENT, { method: "POST", body: JSON.stringify({ product_alias: alias }), headers: { "Content-Type": "application/json" } }).then(data => data.json())

        } catch (err) { }

    }

    public async getRegionByPincode(pincode: string) {

        const SEGMENT = "user/region?pincode=" + pincode;

        try {
            return fetch(this.apiPrefix + SEGMENT, { method: "GET", headers: { "Content-Type": "application/json" } }).then(data => data.json())

        } catch (err) { }

    }

    /**
     * Cart 
     */

    public async getValidatedCart(body: ValidCartData, token: string) {

        const SEGMENT = "payments/cart/validate";

        try {

            return fetch(this.apiPrefix + SEGMENT, { method: "POST", headers: { "Content-Type": "application/json", [GLOBAL_CONSTANTS.headerTokenKeyAlias]: token }, body: JSON.stringify(body) })

        } catch (err) {

        }

    }

    public async getCalculatedValue(body, token) {

        const SEGMENT = "products/internal/estimation/calculate/" + body.alias + "/" + body.variant;

        try {
            return fetch(this.apiPrefix + SEGMENT, { method: "POST", headers: { "Content-Type": "application/json", [GLOBAL_CONSTANTS.headerTokenKeyAlias]: token }, body: JSON.stringify(body) })

        } catch (err) {

        }

    }

    public async createSellOrder(body, token) {

        const SEGMENT = "orders/place/order";

        try {
            return fetch(this.apiPrefix + SEGMENT, { method: "POST", headers: { "Content-Type": "application/json", [GLOBAL_CONSTANTS.headerTokenKeyAlias]: token }, body: JSON.stringify(body), redirect: "follow" })

        } catch (err) {

        }

    }
}