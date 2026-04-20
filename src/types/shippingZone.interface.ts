import { ShippingZoneEnum } from "./enum/shippingZone.enum";

export interface ShippingZoneInterface {
  zone: ShippingZoneEnum;
  base: number;
  per_kg: number;
}
