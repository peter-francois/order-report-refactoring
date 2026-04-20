import { CustomerAggregateInterface } from "../types/interfaces/customerAggregate.interface";
import { OrderInterface } from "../types/interfaces/order.interface";
import { ProductInterface } from "../types/interfaces/product.interface";
import { PromotionInterface } from "../types/interfaces/promotion.interface";


export function aggregateOrders(
  orders: OrderInterface[],
  products: Record<string, ProductInterface>,
  promotions: Record<string, PromotionInterface>,
): Record<string, CustomerAggregateInterface> {
  const totalsByCustomer: Record<string, CustomerAggregateInterface> = {};
  for (const order of orders) {
    const customerId = order.customer_id;

    // Récupération du produit avec fallback
    const product: ProductInterface = products[order.product_id] || {};
    const basePrice = product.price !== undefined ? product.price : order.unit_price;

    // Application de la promo (logique complexe et bugguée)
    const promoCode = order.promo_code;
    let discountRate = 0;
    let fixedDiscount = 0;

    if (promoCode && promotions[promoCode]) {
      const promo = promotions[promoCode];
      if (promo.active) {
        if (promo.type === "PERCENTAGE") {
          discountRate = promo.value / 100;
        } else if (promo.type === "FIXED") {
          // Bug intentionnel: appliqué par ligne au lieu de global
          fixedDiscount = promo.value;
        }
      }
    }

    // Calcul ligne avec réduction promo
    let lineTotal = order.qty * basePrice * (1 - discountRate) - fixedDiscount * order.qty;

    // Bonus matin (règle cachée basée sur l'heure)
    const hour = parseInt(order.time.split(":")[0]);
    let morningBonus = 0;
    if (hour < 10) {
      morningBonus = lineTotal * 0.03; // 3% de réduction supplémentaire
    }
    lineTotal = lineTotal - morningBonus;

    if (!totalsByCustomer[customerId]) {
      totalsByCustomer[customerId] = {
        subtotal: 0.0,
        items: [],
        weight: 0.0,
        promoDiscount: 0.0,
        morningBonus: 0.0,
      };
    }

    totalsByCustomer[customerId].subtotal += lineTotal;
    totalsByCustomer[customerId].weight += (product.weight || 1.0) * order.qty;
    totalsByCustomer[customerId].items.push(order);
    totalsByCustomer[customerId].morningBonus += morningBonus;
  }
  return totalsByCustomer
}
