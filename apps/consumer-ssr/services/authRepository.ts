import { GLOBAL_CONSTANTS } from "../global.constants";
import { UserUpdateDTO } from "../misc/types";


export default class AuthRepository {

    private apiPrefix = GLOBAL_CONSTANTS.apiBase;

    constructor() { }


    public async getAuthContext(token: string) {

        const SEGMENT = "user/context"

        return fetch(this.apiPrefix + SEGMENT, { method: "POST", headers: { "Content-Type": "application/json", [GLOBAL_CONSTANTS.headerTokenKeyAlias]: token }, body: JSON.stringify({}) }).then(data => data.json())

    }

    public async registerUser(body: Object, token: string) {

        const SEGMENT = "user/register?firstTime=true"

        return fetch(this.apiPrefix + SEGMENT, { method: "POST", headers: { "Content-Type": "application/json", [GLOBAL_CONSTANTS.headerTokenKeyAlias]: token }, body: JSON.stringify(body) }).then(data => data.json())

    }


    public async updateUser(body: UserUpdateDTO, token: string) {

        const SEGMENT = "user/update"

        return fetch(this.apiPrefix + SEGMENT, { method: "POST", headers: { "Content-Type": "application/json", [GLOBAL_CONSTANTS.headerTokenKeyAlias]: token }, body: JSON.stringify({ "update": body }) })

    }


    public async getOrders(token: string) {

        const SEGMENT = "user/get/orders"

        return fetch(this.apiPrefix + SEGMENT, { method: "GET", headers: { [GLOBAL_CONSTANTS.headerTokenKeyAlias]: token } })

    }




}