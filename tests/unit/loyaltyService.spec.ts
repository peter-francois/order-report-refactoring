import { calculateLoyaltyPoints } from "../../src/services/loyaltyService";
import { OrderInterface } from "../../src/types/interfaces/order.interface";


describe("calculateLoyaltyPoints", () => {

  it("should calculate loyalty points per customer", () => {
    const orders: OrderInterface[] = [
      { id: "O001", customer_id: "C001", product_id: "P001", qty: 2, unit_price: 100, date: "2024-01-05", time: "12:00" },
    ];
    const result = calculateLoyaltyPoints(orders);
    expect(result["C001"]).toBeCloseTo(2 * 100 * 0.01);
  });

  it("should accumulate points across multiple orders for same customer", () => {
    const orders: OrderInterface[] = [
      { id: "O001", customer_id: "C001", product_id: "P001", qty: 2, unit_price: 100, date: "2024-01-05", time: "12:00" },
      { id: "O002", customer_id: "C001", product_id: "P002", qty: 1, unit_price: 50, date: "2024-01-06", time: "12:00" },
    ];
    const result = calculateLoyaltyPoints(orders);
    expect(result["C001"]).toBeCloseTo(2.5);
  });

  it("should handle multiple customers independently", () => {
    const orders: OrderInterface[] = [
      { id: "O001", customer_id: "C001", product_id: "P001", qty: 1, unit_price: 100, date: "2024-01-05", time: "12:00" },
      { id: "O002", customer_id: "C002", product_id: "P001", qty: 1, unit_price: 200, date: "2024-01-05", time: "12:00" },
    ];
    const result = calculateLoyaltyPoints(orders);
    expect(result["C001"]).toBeCloseTo(1);
    expect(result["C002"]).toBeCloseTo(2);
  });
});