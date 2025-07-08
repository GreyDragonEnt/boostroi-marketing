import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../server/index";
import request from "supertest";
import { db } from "../server/db";

describe("API Endpoints", () => {
  beforeAll(async () => {
    // Setup test database or use in-memory storage
    process.env.NODE_ENV = "test";
  });

  afterAll(async () => {
    // Cleanup
  });

  describe("Health Check", () => {
    it("should return 200 for health check", async () => {
      const response = await request(app).get("/api/health");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ok");
    });
  });

  describe("ROI Calculator", () => {
    it("should calculate ROI correctly", async () => {
      const testData = {
        monthlySpend: "5000",
        monthlyRevenue: "20000",
        industry: "E-commerce",
        channels: "Google Ads, Facebook",
        email: "test@example.com"
      };

      const response = await request(app)
        .post("/api/calc")
        .send(testData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("projectedRevenue");
      expect(response.body).toHaveProperty("additionalProfit");
      expect(response.body).toHaveProperty("roiImprovement");
    });

    it("should reject invalid data", async () => {
      const invalidData = {
        monthlySpend: "invalid",
        monthlyRevenue: "20000",
      };

      const response = await request(app)
        .post("/api/calc")
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe("Lead Capture", () => {
    it("should capture leads successfully", async () => {
      const leadData = {
        email: "test@example.com",
        name: "Test User",
        leadMagnet: "ROI Calculator",
        trigger: "calculator_completion"
      };

      const response = await request(app)
        .post("/api/lead-capture")
        .send(leadData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe(leadData.email);
    });
  });

  describe("ROI Audit", () => {
    it("should submit audit request successfully", async () => {
      const auditData = {
        businessName: "Test Business",
        contactName: "Test Contact",
        email: "test@business.com",
        phone: "+1234567890",
        industry: "E-commerce",
        businessType: "online",
        businessAge: "1-2 years",
        teamSize: "1-10",
        currentMonthlySpend: "$1000-$5000",
        currentChannels: ["Google Ads", "Facebook"],
        currentROI: "200%",
        biggestChallenge: "Lead generation",
        revenueGoal: "$100k",
        primaryGoal: "Increase sales",
        timeline: "3 months",
        budget: "$5000-$10000",
        marketingConsent: true,
        auditConsent: true
      };

      const response = await request(app)
        .post("/api/roi-audit")
        .send(auditData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
    });
  });
});
