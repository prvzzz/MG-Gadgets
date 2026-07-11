import { Product } from "../dto/Product";

export const placeSellOrder = async (items: Array<Product>, pickupDate:string) => {

    // retreive user's location
    const location = navigator.geolocation.getCurrentPosition((position)=>{
        console.log("location:", position.coords);
        console.log("Sell order:", items, pickupDate, position.coords);

    })




}