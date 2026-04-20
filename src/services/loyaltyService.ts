import { LOYALTY_RATIO } from "../constants";
import { OrderInterface } from "../types/order.interface";

export function calculateLoyaltyPoints(orders: OrderInterface[]):Record<string, number>{
    const loyaltyPoints: Record<string, number> = {};
    for (const order of orders){
        const customerId = order.customer_id
        if(!loyaltyPoints[customerId]){
            loyaltyPoints[customerId] = 0;
        }
        loyaltyPoints[customerId] += order.qty * order.unit_price * LOYALTY_RATIO;
    }
return loyaltyPoints
}