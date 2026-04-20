import path from "path";
import { parseCustomers, parseProducts, parsePromotions, parseShippingZones } from "../../src/services/csvParser";

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

describe("parseProducts", () => {
  it("should return a record indexed by product id", () => {
    const products = parseProducts(path.join(fixturesPath, "products.csv"));
    expect(products["P001"]).toBeDefined();
  });

  it("should parse numeric fields correctly", () => {
    const products = parseProducts(path.join(fixturesPath, "products.csv"));
    expect(typeof products["P001"].price).toBe("number");
    expect(typeof products["P001"].weight).toBe("number");
  });

  it("should reproduce legacy \\r bug on taxable, making all products non-taxable", () => {
    const products = parseProducts(path.join(fixturesPath, "products.csv"));
    expect(products["P001"].taxable).toBe(false);
  });

  it("should fallback to 1.0 if weight is missing", () => {
    const products = parseProducts(path.join(fixturesPath, "products.csv"));
    expect(products["P002"].weight).toBe(1.0);
  });
});

describe("parseShippingZones", () => {
  it("should return a record indexed by zone", () => {
    const zones = parseShippingZones(path.join(fixturesPath, "shipping_zones.csv"));
    expect(zones["ZONE1"]).toBeDefined();
  });

  it("should fallback to 0.5 if per_kg is missing", () => {
    const zones = parseShippingZones(path.join(fixturesPath, "shipping_zones.csv"));
    expect(zones["ZONE2"].per_kg).toBe(0.5);
  });
});

describe("parsePromotions", () => {
  it("should return a record indexed by promo code", () => {
    const promotions = parsePromotions(path.join(fixturesPath, "promotions.csv"));
    expect(promotions["PROMO10"]).toBeDefined();
  });

  it("should reproduce legacy \\r bug on active, making all promotions active", () => {
    const promotions = parsePromotions(path.join(fixturesPath, "promotions.csv"));
    expect(promotions["PROMO20"].active).toBe(true);
  });
});
