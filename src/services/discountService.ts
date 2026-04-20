import { MAX_DISCOUNT } from "../constants";
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
  if (subtotal > 50) {
    volumeDiscount = subtotal * 0.05;
  }
  if (subtotal > 100) {
    volumeDiscount = subtotal * 0.1;
  }
  if (subtotal > 500) {
    volumeDiscount = subtotal * 0.15;
  }
  if (subtotal > 1000 && level === CustomerLevelEnum.PREMIUM) {
    volumeDiscount = subtotal * 0.2;
  }

  // Bonus weekend
  const dayOfWeek = firstOrderDate ? new Date(firstOrderDate).getDay() : 0;
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    volumeDiscount = volumeDiscount * 1.05;
  }

  // Remise fidélité
  let loyaltyDiscount = 0.0;
  if (loyaltyPoints > 100) {
    loyaltyDiscount = Math.min(loyaltyPoints * 0.1, 50.0);
  }
  if (loyaltyPoints > 500) {
    loyaltyDiscount = Math.min(loyaltyPoints * 0.15, 100.0);
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
