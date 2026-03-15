import request from "supertest";
import { app } from "../src/index"; 
import { prismaMock } from "./setup";

describe("Asset API Integration", () => {
  it("should calculate the new weighted average and update the database", async () => {
    prismaMock.asset.findUnique.mockResolvedValue({
      id: 1,
      symbol: "AAPL",
      shares: 10,
      avgPrice: 100,
      userId: 1,
    } as any);

    prismaMock.asset.update.mockResolvedValue({
      id: 1,
      symbol: "AAPL",
      shares: 20, // 10 existing + 10 new
      avgPrice: 150, // (10*100 + 10*200) / 20
    } as any);

    const response = await request(app)
      .post("/api/assets/upsert")
      .set("Authorization", "Bearer fake-test-token") // Simulate auth
      .send({
        symbol: "AAPL",
        shares: 10,
        price: 200,
      });

    expect(response.status).toBe(200);
    expect(response.body.avgPrice).toBe(150);

    expect(prismaMock.asset.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ avgPrice: 150 }),
      }),
    );
  });
});
