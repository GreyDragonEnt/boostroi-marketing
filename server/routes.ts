import type { Express } from "express";
import { storage } from "./storage";
import { sendEmail, emailTemplates } from "./email";
import { insertROICalculationSchema, insertLeadSchema, insertNewsletterSubscriptionSchema, insertROIAuditSchema, insertCaseStudyRequestSchema, insertWeeklyMarketingRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<void> {
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      message: "BoostROI Agency API is running"
    });
  });

  // Test email endpoint
  app.post("/api/test-email", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email address required" });
      }

      const success = await sendEmail({
        to: email,
        from: 'hello@boostroi.agency',
        subject: 'BoostROI Email Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF5B2E;">Email Test Successful!</h2>
            <p>This is a test email from your BoostROI Agency application.</p>
            <p>If you received this, your email functionality is working correctly.</p>
            <p>Best regards,<br>The BoostROI Team</p>
          </div>
        `,
        text: 'Email Test Successful! Your BoostROI Agency application email functionality is working correctly.'
      });

      res.json({ 
        success, 
        message: success ? 'Email sent successfully' : 'Email failed to send'
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ error: "Failed to send test email" });
    }
  });

  // Status endpoint
  app.get("/api/status", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      message: "BoostROI Agency API is running"
    });
  });

  // ROI Calculator endpoint
  app.post("/api/calc", async (req, res) => {
    try {
      const validatedData = insertROICalculationSchema.parse(req.body);
      const calculation = await storage.createROICalculation(validatedData);
      res.json(calculation);
    } catch (error) {
      console.error("Error creating ROI calculation:", error);
      res.status(400).json({ error: "Invalid calculation data" });
    }
  });

  // ROI Audit endpoint
  app.post("/api/roi-audit", async (req, res) => {
    try {
      const validatedData = insertROIAuditSchema.parse(req.body);
      const audit = await storage.createROIAudit(validatedData);
      
      // Send confirmation email
      const template = emailTemplates.roiAuditConfirmation(
        validatedData.businessName || 'Your Business',
        validatedData.contactName || 'there'
      );
      
      await sendEmail({
        to: validatedData.email,
        from: 'hello@boostroi.agency',
        subject: template.subject,
        html: template.html,
        text: template.text
      });
      
      res.json(audit);
    } catch (error) {
      console.error("Error creating ROI audit:", error);
      res.status(400).json({ error: "Invalid audit data" });
    }
  });

  // Lead capture endpoint
  app.post("/api/lead-capture", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      
      // Send confirmation email
      const template = emailTemplates.leadCaptureConfirmation(validatedData.email);
      
      await sendEmail({
        to: validatedData.email,
        from: 'hello@boostroi.agency',
        subject: template.subject,
        html: template.html,
        text: template.text
      });
      
      res.json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(400).json({ error: "Invalid lead data" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter-signup", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.createNewsletterSubscription(validatedData);
      res.json(subscription);
    } catch (error) {
      console.error("Error creating newsletter subscription:", error);
      res.status(400).json({ error: "Invalid subscription data" });
    }
  });

  // Case study request endpoint
  app.post("/api/case-study", async (req, res) => {
    try {
      const validatedData = insertCaseStudyRequestSchema.parse(req.body);
      const request = await storage.createCaseStudyRequest(validatedData);
      
      // Send confirmation email
      const template = emailTemplates.caseStudyConfirmation(
        validatedData.businessName || 'Your Business',
        validatedData.contactName || 'there'
      );
      
      await sendEmail({
        to: validatedData.email,
        from: 'hello@boostroi.agency',
        subject: template.subject,
        html: template.html,
        text: template.text
      });
      
      res.json(request);
    } catch (error) {
      console.error("Error creating case study request:", error);
      res.status(400).json({ error: "Invalid case study data" });
    }
  });

  // Weekly marketing request endpoint
  app.post("/api/weekly-marketing", async (req, res) => {
    try {
      const validatedData = insertWeeklyMarketingRequestSchema.parse(req.body);
      const request = await storage.createWeeklyMarketingRequest(validatedData);
      
      // Send confirmation email
      const template = emailTemplates.weeklyMarketingConfirmation(
        validatedData.businessName || 'Your Business',
        validatedData.contactName || 'there'
      );
      
      await sendEmail({
        to: validatedData.email,
        from: 'hello@boostroi.agency',
        subject: template.subject,
        html: template.html,
        text: template.text
      });
      
      res.json(request);
    } catch (error) {
      console.error("Error creating weekly marketing request:", error);
      res.status(400).json({ error: "Invalid marketing request data" });
    }
  });

  // Admin endpoints
  app.get("/api/admin/requests", async (req, res) => {
    try {
      const requests = await storage.getAllRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching admin requests:", error);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  // Update request status endpoints
  app.patch("/api/admin/roi-audit/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const audit = await storage.updateROIAuditStatus(id, status);
      res.json(audit);
    } catch (error) {
      console.error("Error updating ROI audit status:", error);
      res.status(400).json({ error: "Failed to update audit status" });
    }
  });

  app.patch("/api/admin/case-study/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const request = await storage.updateCaseStudyRequestStatus(id, status);
      res.json(request);
    } catch (error) {
      console.error("Error updating case study status:", error);
      res.status(400).json({ error: "Failed to update case study status" });
    }
  });

  app.patch("/api/admin/weekly-marketing/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const request = await storage.updateWeeklyMarketingRequestStatus(id, status);
      res.json(request);
    } catch (error) {
      console.error("Error updating weekly marketing status:", error);
      res.status(400).json({ error: "Failed to update marketing request status" });
    }
  });

  app.post("/api/checkout", (req, res) => {
    res.json({ 
      message: "Checkout endpoint (temporarily simplified)",
      received: req.body 
    });
  });

  // Routes registered successfully
}
