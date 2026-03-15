import request from "supertest";
import { app } from "../src/index";
import { prismaMock } from "./setup";

describe("Asset API Error Handling", () => {
  it("should return 500 if the database connection fails", async () => {
    //Arrange: Tell the mock to "explode" when called
    prismaMock.asset.findUnique.mockRejectedValue(
      new Error("Database Connection Timeout"),
    );

    //Act: Call the endpoint
    const response = await request(app)
      .post("/api/assets/upsert")
      .set("Authorization", "Bearer fake-token")
      .send({
        symbol: "AAPL",
        shares: 5,
        price: 150,
      });

    // Verify the user gets a clean error message
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});
