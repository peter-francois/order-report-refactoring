import { PromotionCodeEnum, PromotionTypeEnum } from "../enum/promotion.enum";

export interface PromotionInterface {
  code: PromotionCodeEnum;
  type: PromotionTypeEnum;
  value: number;
  active: boolean;
}
