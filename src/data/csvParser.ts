import { parse } from "csv-parse/sync";
import * as fs from "fs";
import { CustomerCurrencyEnum, CustomerLevelEnum } from "../types/enum/customer.enum";
import { ShippingZoneEnum } from "../types/enum/shippingZone.enum";
import { ProductCategoryEnum } from "../types/enum/product.enum";
import { PromotionCodeEnum, PromotionTypeEnum } from "../types/enum/promotion.enum";
import { CustomerInterface } from "../types/interfaces/customer.interface";
import { OrderInterface, ISODateString, ISOTimeString } from "../types/interfaces/order.interface";
import { ProductInterface } from "../types/interfaces/product.interface";
import { PromotionInterface } from "../types/interfaces/promotion.interface";
import { ShippingZoneInterface } from "../types/interfaces/shippingZone.interface";

type RawRecord = Record<string, string>;

// Bug legacy : les fichiers CSV utilisent des fins de ligne Windows (CRLF).
// Le code original split sur \n sans trimmer les valeurs individuelles,
// ce qui laisse un \r sur la dernière colonne de chaque ligne.
// Conséquence : les comparaisons de devise ("USD\r" === "USD") échouent
// toujours, désactivant la conversion de devise.
// Ce comportement est reproduit intentionnellement pour matcher
// le golden master (currency: r.currency + "\r").

export function parseCustomers(filePath: string): Record<string, CustomerInterface> {
  const content = fs.readFileSync(filePath, "utf-8");
  const rows: RawRecord[] = parse(content, { columns: true, skip_empty_lines: true });
  return Object.fromEntries(
    rows.map((r) => [
      r.id,
      {
        id: r.id,
        name: r.name,
        level: (r.level as CustomerLevelEnum) || "BASIC",
        shipping_zone: (r.shipping_zone as ShippingZoneEnum) || "ZONE1",
        currency: ((r.currency + "\r") as CustomerCurrencyEnum) || "EUR",
      },
    ]),
  );
}

export function parseProducts(filePath: string): Record<string, ProductInterface> {
  const content = fs.readFileSync(filePath, "utf-8");
  const rows: RawRecord[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  });
  return Object.fromEntries(
    rows.map((r) => [
      r.id,
      {
        id: r.id,
        name: r.name,
        category: r.category as ProductCategoryEnum,
        price: parseFloat(r.price),
        weight: parseFloat(r.weight || "1.0"),
        // Bug legacy : \r conservé sur taxable, "true\r" === "true" est toujours false
        // ce qui rend tous les produits non-taxables et désactive la taxe globalement
        taxable: r.taxable + "\r" === "true",
      },
    ]),
  );
}

export function parseShippingZones(filePath: string): Record<string, ShippingZoneInterface> {
  const content = fs.readFileSync(filePath, "utf-8");
  const rows: RawRecord[] = parse(content, { columns: true, skip_empty_lines: true });
  return Object.fromEntries(
    rows.map((r) => [
      r.zone,
      {
        zone: r.zone as ShippingZoneEnum,
        base: parseFloat(r.base),
        // Pas de bug \r à reproduire : zone est la première colonne (pas de \r),
        // base et per_kg sont absorbés par parseFloat
        per_kg: parseFloat(r.per_kg || "0.5"),
      },
    ]),
  );
}

export function parsePromotions(filePath: string): Record<string, PromotionInterface> {
  const content = fs.readFileSync(filePath, "utf-8");
  const rows: RawRecord[] = parse(content, { columns: true, skip_empty_lines: true });
  return Object.fromEntries(
    rows.map((r) => [
      r.code,
      {
        code: r.code as PromotionCodeEnum,
        type: r.type as PromotionTypeEnum,
        value: parseInt(r.value),
        // Bug legacy : \r collé sur active, "false\r" !== "false" est toujours true
        // ce qui rend toutes les promotions actives même si active === "false"
        active: r.active + "\r" !== "false",
      },
    ]),
  );
}

export function parseOrders(filePath: string): OrderInterface[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const rows: RawRecord[] = parse(content, { columns: true, skip_empty_lines: true });
  return rows.map((r) => ({
    id: r.id,
    customer_id: r.customer_id,
    product_id: r.product_id,
    qty: parseInt(r.qty),
    unit_price: parseFloat(r.unit_price),
    date: r.date as ISODateString,
    promo_code: r.promo_code as PromotionCodeEnum,
    // Bug legacy : \r conservé sur time, mais n'affecte pas le résultat
    // car parseInt() sur "12:00\r" ignore le \r
    time: (r.time || "12:00") as ISOTimeString,
  }));
}
