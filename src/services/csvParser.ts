import { parse } from "csv-parse/sync";
import * as fs from "fs";
import { CustomerInterface } from "../types/customer.interface";
import { CustomerCurrencyEnum, CustomerLevelEnum } from "../types/enum/customer.enum";
import { ShippingZoneEnum } from "../types/enum/shippingZone.enum";
import { ProductInterface } from "../types/product.interface";
import { ProductCategoryEnum } from "../types/enum/product.enum";

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
