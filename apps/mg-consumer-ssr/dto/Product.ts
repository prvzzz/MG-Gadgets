

export interface Product {
    title: string,
    description: string,
    product_images: Array<string>,
    max_retail_price: number,
    popularity: number,
    alias: string,
    latest: boolean,
    screen_size?: number,
    storage_size?: number,
    ram_size?: number
    discount: number,
    variants: Array<Variant>,
    brand: {
        name: string
    }

}

interface Variant {
    screen_size: number,
    storage_size: number,
    ram_size: number,
    max_retail_price: number,
    discount: number,
    color: string
}


export interface RepairService{
    name:string,
    price:number,
    
}