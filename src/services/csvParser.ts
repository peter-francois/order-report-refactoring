import { parse } from "csv-parse/sync";
import * as fs from "fs";

// Bug legacy : les fichiers CSV utilisent des fins de ligne Windows (CRLF).
// Le code original split sur \n sans trimmer les valeurs individuelles, ce qui laisse un \r sur la dernière colonne de chaque ligne.
// Conséquence : les comparaisons de devise ("USD\r" === "USD") échouent
// toujours, désactivant la conversion de devise.
// Ce comportement est reproduit intentionnellement pour matcher le golden master (currency: r.currency + "\r").

export function parseCustomers(filePath: string): Record<string, any> {
  const content = fs.readFileSync(filePath, "utf-8");
  const rows = parse(content, { columns: true, skip_empty_lines: true });
  return Object.fromEntries(rows.map((r: any) => [r.id, { ...r, currency: r.currency + "\r" }]));
}
