import { CustomerCurrencyEnum, CustomerLevelEnum } from "./enum/customer.enum";
import { ShippingZoneEnum } from "./enum/shippingZone.enum";

export interface CustomerInterface {
  id: string;
  name: string;
  level: CustomerLevelEnum;
  shipping_zone: ShippingZoneEnum;
  currency: CustomerCurrencyEnum;
}
