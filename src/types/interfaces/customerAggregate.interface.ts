import { OrderInterface } from "./order.interface";

export interface CustomerAggregateInterface {
  subtotal: number;
  items: OrderInterface[];
  weight: number;
  promoDiscount: number;
  morningBonus: number;
}
