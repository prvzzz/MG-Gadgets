import React from "react";
import { Product } from "../dto/Product";
import { ValueEstimate } from "../dto/ValueEstimate";


interface Question {
    id?: number,
    heading: string,
    description: string,
    options?: Array<React.ReactElement>,
    selected: number | Array<number>,
    multiple?: boolean,
    qb?: number
}

interface ValueMap {
    id: number,
    qb?: number,
    selected: number | Array<number>
}

interface CartItem {
    product: Product | RepairCostItem,
    quantity: number,
    unit_amount: number,
    total_amount: number,
    selected_variant?: number,
    type: "service" | "buy" | "sell",
    item_condition?: ValueEstimate
}

interface CartItemDTO {
    title: string,
    productId: string,
    productImageId: string,
    quantity: number,
    selected_service_name?: string,
    type: "service" | "product"
}

interface RepairServiceItem {
    product_id: string,
    hide_options: string,
    repair_costs: Array<RepairCostItem>
}

interface RepairCostItem {
    name: string,
    price: number,
    product_name: string,
    product_alias: string
}

interface Address {
    line1: string,
    state: string,
    city: string,
    pincode: string
}

interface ValidCartData {
    txnId?: string,
    items: Array<CartItemDTO>,
    amount: number,
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    product?: string,
    hash?: string,
    orderType?: string,
    location: {
        long: number,
        lat: number
    }
}

interface PayUFormData extends ValidCartData {
    successUrl: string,
    failedUrl: string,
    ready: boolean
}

interface UserUpdateDTO {
    address?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    city?: string;
    state_code?: string;
    pincode?: string;
}

export enum OrderStatus {
    "NOT_ALLOTTED" = "order_initiated",
    "PAYMENT_SUCCESS" = "order_paid",
    "PAYMENT_FAILED" = "order_pending",
    "ORDER_IN_TRANSIT" = "order_in_transit",
    "AGENT_ARRIVED" = "agent_arrived",
    "ORDER_VALIDATED" = "order_validated",
    "ORDER_NOT_VALIDATED" = "order_not_validated",
    "ORDER_COMPLETE_SUCCESS" = "order_success",
    "ORDER_COMPLETE_FAILED" = "order_failed",
    "CANCELLED" = "user_cancelled"
}


export const OrderLabels: { [k: string]: string } = {
    "order_initiated": "Order Initiated",
    "order_paid": "Payment Successful",
    "order_pending": "Payment Pending",
    "order_in_transit": "Order in Transit",
    "agent_arrived": "Agent Arrived",
    "order_validated": "Order Validated",
    "order_not_validated": "Order Not Validated",
    "order_success": "Order Completed Successfully",
    "order_failed": "Order Completion Failed",
    "user_cancelled": "Order Cancelled by User"
}




export type { UserUpdateDTO, Question, ValueMap, CartItem, RepairServiceItem, RepairCostItem, Address, ValidCartData, PayUFormData, CartItemDTO };