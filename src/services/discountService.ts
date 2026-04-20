import {
  DISCOUNT_TIER_1_RATE,
  DISCOUNT_TIER_1_THRESHOLD,
  DISCOUNT_TIER_2_RATE,
  DISCOUNT_TIER_2_THRESHOLD,
  DISCOUNT_TIER_3_RATE,
  DISCOUNT_TIER_3_THRESHOLD,
  DISCOUNT_TIER_4_RATE,
  DISCOUNT_TIER_4_THRESHOLD,
  LOYALTY_TIER_1_CAP,
  LOYALTY_TIER_1_RATE,
  LOYALTY_TIER_1_THRESHOLD,
  LOYALTY_TIER_2_CAP,
  LOYALTY_TIER_2_RATE,
  LOYALTY_TIER_2_THRESHOLD,
  MAX_DISCOUNT,
  WEEKEND_BONUS_RATE,
} from "../constants";
import { CustomerLevelEnum } from "../types/enum/customer.enum";
import { DiscountResult } from "../types/interfaces/discount.interface";
export function calculateTotalDiscount(
  level: CustomerLevelEnum,
  subtotal: number,
  firstOrderDate: string,
  loyaltyPoints: number,
): DiscountResult {
  // Remise par paliers : chaque if écrase le précédent (bug intentionnel du legacy)
  // ex: subtotal=600 → passe dans >50, >100, >500 → seul >500 compte (15%)
  let volumeDiscount = 0.0;
  if (subtotal > DISCOUNT_TIER_1_THRESHOLD) {
    volumeDiscount = subtotal * DISCOUNT_TIER_1_RATE;
  }
  if (subtotal > DISCOUNT_TIER_2_THRESHOLD) {
    volumeDiscount = subtotal * DISCOUNT_TIER_2_RATE;
  }
  if (subtotal > DISCOUNT_TIER_3_THRESHOLD) {
    volumeDiscount = subtotal * DISCOUNT_TIER_3_RATE;
  }
  if (subtotal > DISCOUNT_TIER_4_THRESHOLD && level === CustomerLevelEnum.PREMIUM) {
    volumeDiscount = subtotal * DISCOUNT_TIER_4_RATE;
  }

  const dayOfWeek = firstOrderDate ? new Date(firstOrderDate).getDay() : 0;
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    volumeDiscount = volumeDiscount * WEEKEND_BONUS_RATE;
  }

  let loyaltyDiscount = 0.0;
  if (loyaltyPoints > LOYALTY_TIER_1_THRESHOLD) {
    loyaltyDiscount = Math.min(loyaltyPoints * LOYALTY_TIER_1_RATE, LOYALTY_TIER_1_CAP);
  }
  if (loyaltyPoints > LOYALTY_TIER_2_THRESHOLD) {
    loyaltyDiscount = Math.min(loyaltyPoints * LOYALTY_TIER_2_RATE, LOYALTY_TIER_2_CAP);
  }

  // Plafond global MAX_DISCOUNT : si dépassé, on réduit proportionnellement
  // les deux remises pour que leur somme reste exactement à MAX_DISCOUNT
  let totalDiscount = volumeDiscount + loyaltyDiscount;
  if (totalDiscount > MAX_DISCOUNT) {
    const ratio = MAX_DISCOUNT / totalDiscount;
    volumeDiscount = volumeDiscount * ratio;
    loyaltyDiscount = loyaltyDiscount * ratio;
    totalDiscount = MAX_DISCOUNT;
  }

  return { totalDiscount, volumeDiscount, loyaltyDiscount };
}
