import path from "path";
import {
  parseCustomers,
  parseOrders,
  parseProducts,
  parsePromotions,
  parseShippingZones,
} from "./csvParser";

const dataFolder = path.join(__dirname, "../../legacy/data");
const custPath = path.join(dataFolder, "customers.csv");
const ordPath = path.join(dataFolder, "orders.csv");
const prodPath = path.join(dataFolder, "products.csv");
const shipPath = path.join(dataFolder, "shipping_zones.csv");
const promoPath = path.join(dataFolder, "promotions.csv");

export function loadData() {
  return {
    customers: loadFile(() => parseCustomers(custPath), "customers"),
    products: loadFile(() => parseProducts(prodPath), "products"),
    shippingZones: loadFile(() => parseShippingZones(shipPath), "shippingZones"),
    promotions: loadFile(() => parsePromotions(promoPath), "promotions"),
    orders: loadFile(() => parseOrders(ordPath), "orders"),
  };
}

function loadFile<T>(fn: () => T, name: string): T {
  // T propage le type de retour de fn vers loadFile
  // sans T, TypeScript perdrait le typage et retournerait any
  try {
    return fn();
  } catch (err) {
    throw new Error(`Erreur lors du chargement de ${name}`, { cause: err });
  }
}
