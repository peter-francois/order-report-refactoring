import { PromotionCodeEnum } from "../enum/promotion.enum";

export type ISODateString = `${number}-${number}-${number}`;

export type ISOTimeString = `${number}${number}:${number}${number}`;

export interface OrderInterface {
  id: string;
  customer_id: string;
  product_id: string;
  qty: number;
  unit_price: number;
  date: ISODateString;
  promo_code?: PromotionCodeEnum;
  time: ISOTimeString;
}
