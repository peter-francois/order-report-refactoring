import path from "path";
import { parseCustomers } from "../../src/services/csvParser";

const fixturesPath = path.join(__dirname, "../fixtures");

describe("parseCustomers", () => {
  it("should return a record indexed by customer id", () => {
    const customers = parseCustomers(path.join(fixturesPath, "customers.csv"));
    expect(customers["C001"]).toBeDefined();
    expect(customers["C002"]).toBeDefined();
  });

  it("should parse customer fields correctly", () => {
    const customers = parseCustomers(path.join(fixturesPath, "customers.csv"));
    expect(customers["C001"].name).toBe("Alice Martin");
    expect(customers["C001"].level).toBe("BASIC");
    expect(customers["C001"].shipping_zone).toBe("ZONE1");
  });

  it("should reproduce legacy \\r bug on currency", () => {
    const customers = parseCustomers(path.join(fixturesPath, "customers.csv"));
    expect(customers["C001"].currency).toBe("EUR\r");
  });
});