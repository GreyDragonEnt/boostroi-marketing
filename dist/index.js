var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import dotenv from "dotenv";
import express2 from "express";
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  caseStudyRequests: () => caseStudyRequests,
  insertCaseStudyRequestSchema: () => insertCaseStudyRequestSchema,
  insertLeadSchema: () => insertLeadSchema,
  insertNewsletterSubscriptionSchema: () => insertNewsletterSubscriptionSchema,
  insertROIAuditSchema: () => insertROIAuditSchema,
  insertROICalculationSchema: () => insertROICalculationSchema,
  insertUserSchema: () => insertUserSchema,
  insertWeeklyMarketingRequestSchema: () => insertWeeklyMarketingRequestSchema,
  leads: () => leads,
  newsletterSubscriptions: () => newsletterSubscriptions,
  roiAudits: () => roiAudits,
  roiCalculations: () => roiCalculations,
  users: () => users,
  weeklyMarketingRequests: () => weeklyMarketingRequests
});
import { pgTable, text, serial, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id")
});
var roiCalculations = pgTable("roi_calculations", {
  id: serial("id").primaryKey(),
  monthlySpend: decimal("monthly_spend", { precision: 10, scale: 2 }).notNull(),
  monthlyRevenue: decimal("monthly_revenue", { precision: 10, scale: 2 }).notNull(),
  industry: text("industry").notNull(),
  channels: text("channels").notNull(),
  projectedRevenue: decimal("projected_revenue", { precision: 10, scale: 2 }),
  additionalProfit: decimal("additional_profit", { precision: 10, scale: 2 }),
  roiImprovement: decimal("roi_improvement", { precision: 5, scale: 2 }),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow()
});
var leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  leadMagnet: text("lead_magnet").notNull(),
  trigger: text("trigger").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow()
});
var newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  status: text("status").notNull().default("active"),
  source: text("source").notNull().default("website"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var roiAudits = pgTable("roi_audits", {
  id: serial("id").primaryKey(),
  // Basic Business Info
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  // Business Details
  industry: text("industry").notNull(),
  businessType: text("business_type").notNull(),
  businessAge: text("business_age").notNull(),
  teamSize: text("team_size").notNull(),
  // Current Marketing
  currentMonthlySpend: text("current_monthly_spend").notNull(),
  currentChannels: json("current_channels").$type().notNull(),
  currentROI: text("current_roi").notNull(),
  biggestChallenge: text("biggest_challenge").notNull(),
  // Goals
  revenueGoal: text("revenue_goal").notNull(),
  primaryGoal: text("primary_goal").notNull(),
  timeline: text("timeline").notNull(),
  // Additional Info
  previousAgencies: boolean("previous_agencies").default(false),
  budget: text("budget").notNull(),
  additionalInfo: text("additional_info"),
  // Consent
  marketingConsent: boolean("marketing_consent").notNull(),
  auditConsent: boolean("audit_consent").notNull(),
  // Status
  status: text("status").notNull().default("pending"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var caseStudyRequests = pgTable("case_study_requests", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  industry: text("industry").notNull(),
  currentResults: text("current_results").notNull(),
  timeframe: text("timeframe").notNull(),
  willingToShare: boolean("willing_to_share").notNull(),
  marketingConsent: boolean("marketing_consent").notNull(),
  status: text("status").notNull().default("pending"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var weeklyMarketingRequests = pgTable("weekly_marketing_requests", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  industry: text("industry").notNull(),
  currentChallenges: text("current_challenges").notNull(),
  desiredOutcomes: text("desired_outcomes").notNull(),
  marketingBudget: text("marketing_budget").notNull(),
  preferredStartDate: timestamp("preferred_start_date"),
  marketingConsent: boolean("marketing_consent").notNull(),
  status: text("status").notNull().default("pending"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true
});
var insertROICalculationSchema = createInsertSchema(roiCalculations).pick({
  monthlySpend: true,
  monthlyRevenue: true,
  industry: true,
  channels: true,
  email: true
});
var insertLeadSchema = createInsertSchema(leads).pick({
  email: true,
  name: true,
  leadMagnet: true,
  trigger: true,
  status: true
});
var insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
  status: true,
  source: true
});
var insertROIAuditSchema = createInsertSchema(roiAudits).pick({
  businessName: true,
  contactName: true,
  email: true,
  phone: true,
  website: true,
  industry: true,
  businessType: true,
  businessAge: true,
  teamSize: true,
  currentMonthlySpend: true,
  currentChannels: true,
  currentROI: true,
  biggestChallenge: true,
  revenueGoal: true,
  primaryGoal: true,
  timeline: true,
  previousAgencies: true,
  budget: true,
  additionalInfo: true,
  marketingConsent: true,
  auditConsent: true
});
var insertCaseStudyRequestSchema = createInsertSchema(caseStudyRequests).pick({
  businessName: true,
  contactName: true,
  email: true,
  phone: true,
  website: true,
  industry: true,
  currentResults: true,
  timeframe: true,
  willingToShare: true,
  marketingConsent: true
});
var insertWeeklyMarketingRequestSchema = createInsertSchema(weeklyMarketingRequests).pick({
  businessName: true,
  contactName: true,
  email: true,
  phone: true,
  website: true,
  industry: true,
  currentChallenges: true,
  desiredOutcomes: true,
  marketingBudget: true,
  preferredStartDate: true,
  marketingConsent: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
var _pool = null;
var _db = null;
function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL must be set. Did you forget to provision a database?");
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
  if (!_pool) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
    _db = drizzle({ client: _pool, schema: schema_exports });
    console.log("Database connection initialized");
  }
  return { pool: _pool, db: _db };
}
function getDatabase() {
  if (!_db) {
    return initializeDatabase();
  }
  return { pool: _pool, db: _db };
}
var pool = new Proxy({}, {
  get() {
    return getDatabase().pool;
  }
});
var db = new Proxy({}, {
  get(target, prop) {
    const { db: database } = getDatabase();
    if (!database) {
      throw new Error("Database not initialized");
    }
    return database[prop];
  }
});

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values({
      ...insertUser,
      email: insertUser.email || null
    }).returning();
    return user;
  }
  async updateUserStripeInfo(id, customerId, subscriptionId) {
    const [user] = await db.update(users).set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId || null
    }).where(eq(users.id, id)).returning();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  async createROICalculation(insertCalculation) {
    const monthlySpend = parseFloat(insertCalculation.monthlySpend);
    const monthlyRevenue = parseFloat(insertCalculation.monthlyRevenue);
    const industryMultipliers = {
      "E-commerce": 2.8,
      "SaaS": 3.2,
      "Professional Services": 2.5,
      "Healthcare": 2,
      "Real Estate": 2.3,
      "Other": 2.4
    };
    const multiplier = industryMultipliers[insertCalculation.industry] || 2.4;
    const projectedRevenue = monthlyRevenue * multiplier;
    const additionalRevenue = projectedRevenue - monthlyRevenue;
    const additionalProfit = additionalRevenue * 0.7;
    const roiImprovement = (projectedRevenue - monthlyRevenue) / monthlyRevenue * 100;
    const [calculation] = await db.insert(roiCalculations).values({
      ...insertCalculation,
      email: insertCalculation.email || null,
      projectedRevenue: projectedRevenue.toFixed(2),
      additionalProfit: additionalProfit.toFixed(2),
      roiImprovement: roiImprovement.toFixed(2)
    }).returning();
    return calculation;
  }
  async getROICalculationsByEmail(email) {
    return await db.select().from(roiCalculations).where(eq(roiCalculations.email, email));
  }
  async createLead(insertLead) {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }
  async createNewsletterSubscription(insertSubscription) {
    const [subscription] = await db.insert(newsletterSubscriptions).values(insertSubscription).returning();
    return subscription;
  }
  async getLeadsByEmail(email) {
    return await db.select().from(leads).where(eq(leads.email, email));
  }
  async getNewsletterSubscriptionByEmail(email) {
    const [subscription] = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
    return subscription || void 0;
  }
  async createROIAudit(insertAudit) {
    const [audit] = await db.insert(roiAudits).values(insertAudit).returning();
    return audit;
  }
  async getROIAuditsByEmail(email) {
    return await db.select().from(roiAudits).where(eq(roiAudits.email, email));
  }
  async updateROIAuditStatus(id, status) {
    const updateData = { status };
    if (status === "completed") {
      updateData.completedAt = /* @__PURE__ */ new Date();
    }
    const [audit] = await db.update(roiAudits).set(updateData).where(eq(roiAudits.id, id)).returning();
    if (!audit) {
      throw new Error(`ROI audit with id ${id} not found`);
    }
    return audit;
  }
  async getAllRequests() {
    const [audits, caseStudies, marketingRequests, leadsList] = await Promise.all([
      db.select().from(roiAudits).orderBy(roiAudits.createdAt),
      db.select().from(caseStudyRequests).orderBy(caseStudyRequests.createdAt),
      db.select().from(weeklyMarketingRequests).orderBy(weeklyMarketingRequests.createdAt),
      db.select().from(leads).orderBy(leads.createdAt)
    ]);
    return {
      roiAudits: audits,
      caseStudyRequests: caseStudies,
      weeklyMarketingRequests: marketingRequests,
      leads: leadsList
    };
  }
  async createCaseStudyRequest(insertRequest) {
    const [request] = await db.insert(caseStudyRequests).values(insertRequest).returning();
    return request;
  }
  async updateCaseStudyRequestStatus(id, status) {
    const updateData = { status };
    if (status === "completed") {
      updateData.completedAt = /* @__PURE__ */ new Date();
    }
    const [request] = await db.update(caseStudyRequests).set(updateData).where(eq(caseStudyRequests.id, id)).returning();
    if (!request) {
      throw new Error(`Case study request with id ${id} not found`);
    }
    return request;
  }
  async createWeeklyMarketingRequest(insertRequest) {
    const [request] = await db.insert(weeklyMarketingRequests).values(insertRequest).returning();
    return request;
  }
  async updateWeeklyMarketingRequestStatus(id, status) {
    const updateData = { status };
    if (status === "completed") {
      updateData.completedAt = /* @__PURE__ */ new Date();
    }
    const [request] = await db.update(weeklyMarketingRequests).set(updateData).where(eq(weeklyMarketingRequests.id, id)).returning();
    if (!request) {
      throw new Error(`Weekly marketing request with id ${id} not found`);
    }
    return request;
  }
};
var storage = new DatabaseStorage();

// server/email.ts
import { MailService } from "@sendgrid/mail";
var mailService = null;
function initializeMailService() {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY environment variable not set - email functionality disabled");
    return false;
  }
  if (!mailService) {
    mailService = new MailService();
    mailService.setApiKey(process.env.SENDGRID_API_KEY);
  }
  return true;
}
async function sendEmail(params) {
  if (!initializeMailService()) {
    console.warn(`Email not sent to ${params.to} - SendGrid not configured`);
    return false;
  }
  try {
    const emailData = {
      to: params.to,
      from: params.from,
      subject: params.subject
    };
    if (params.html) {
      emailData.html = params.html;
    }
    if (params.text) {
      emailData.text = params.text;
    }
    await mailService.send(emailData);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error("SendGrid email error:", error);
    return false;
  }
}
var emailTemplates = {
  roiAuditConfirmation: (businessName, contactName) => ({
    subject: `ROI Audit Request Received - ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5B2E;">Thank you for your ROI Audit request!</h2>
        <p>Hi ${contactName},</p>
        <p>We've received your request for a comprehensive ROI audit for <strong>${businessName}</strong>.</p>
        <p>Our team will review your information and get back to you within 24-48 hours with your personalized audit results.</p>
        <p>What to expect:</p>
        <ul>
          <li>Detailed analysis of your current marketing performance</li>
          <li>Identification of optimization opportunities</li>
          <li>Specific recommendations to boost your ROI</li>
          <li>Custom action plan for implementation</li>
        </ul>
        <p>If you have any questions in the meantime, feel free to reply to this email.</p>
        <br>
        <p>Best regards,<br>The BoostROI Team</p>
        <p style="color: #666; font-size: 12px;">BoostROI Agency - Maximizing Your Marketing Returns</p>
      </div>
    `,
    text: `Thank you for your ROI Audit request!

Hi ${contactName},

We've received your request for a comprehensive ROI audit for ${businessName}.

Our team will review your information and get back to you within 24-48 hours with your personalized audit results.

Best regards,
The BoostROI Team`
  }),
  caseStudyConfirmation: (businessName, contactName) => ({
    subject: `Case Study Request Received - ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5B2E;">Thank you for your interest in our case studies!</h2>
        <p>Hi ${contactName},</p>
        <p>We've received your request for case studies relevant to <strong>${businessName}</strong>.</p>
        <p>Our team will compile the most relevant success stories and send them to you within 24 hours.</p>
        <p>You'll receive:</p>
        <ul>
          <li>Industry-specific case studies</li>
          <li>Detailed results and ROI improvements</li>
          <li>Strategy breakdowns and implementation insights</li>
          <li>Before and after performance metrics</li>
        </ul>
        <p>These real-world examples will show you exactly how we've helped businesses like yours achieve remarkable growth.</p>
        <br>
        <p>Best regards,<br>The BoostROI Team</p>
        <p style="color: #666; font-size: 12px;">BoostROI Agency - Maximizing Your Marketing Returns</p>
      </div>
    `,
    text: `Thank you for your interest in our case studies!

Hi ${contactName},

We've received your request for case studies relevant to ${businessName}.

Our team will compile the most relevant success stories and send them to you within 24 hours.

Best regards,
The BoostROI Team`
  }),
  weeklyMarketingConfirmation: (businessName, contactName) => ({
    subject: `Weekly Marketing Strategy Request Received - ${businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5B2E;">Welcome to our Weekly Marketing Strategy!</h2>
        <p>Hi ${contactName},</p>
        <p>We've received your request for weekly marketing strategies for <strong>${businessName}</strong>.</p>
        <p>Starting this week, you'll receive:</p>
        <ul>
          <li>Weekly actionable marketing strategies</li>
          <li>Industry-specific tips and insights</li>
          <li>Performance optimization recommendations</li>
          <li>Latest marketing trends and opportunities</li>
        </ul>
        <p>Your first weekly strategy email will arrive within the next 2-3 business days.</p>
        <p>Each week, you'll get practical, implementable strategies designed to boost your marketing ROI.</p>
        <br>
        <p>Best regards,<br>The BoostROI Team</p>
        <p style="color: #666; font-size: 12px;">BoostROI Agency - Maximizing Your Marketing Returns</p>
      </div>
    `,
    text: `Welcome to our Weekly Marketing Strategy!

Hi ${contactName},

We've received your request for weekly marketing strategies for ${businessName}.

Your first weekly strategy email will arrive within the next 2-3 business days.

Best regards,
The BoostROI Team`
  }),
  leadCaptureConfirmation: (email) => ({
    subject: `Welcome to BoostROI - Your Marketing Journey Starts Here!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5B2E;">Welcome to BoostROI!</h2>
        <p>Hi there,</p>
        <p>Thank you for your interest in boosting your marketing ROI!</p>
        <p>We've added you to our community of forward-thinking business owners who are committed to maximizing their marketing returns.</p>
        <p>Here's what you can expect:</p>
        <ul>
          <li>Exclusive marketing insights and strategies</li>
          <li>ROI optimization tips and best practices</li>
          <li>Access to our free tools and resources</li>
          <li>Priority updates on new services and offerings</li>
        </ul>
        <p>As a next step, we recommend booking a free strategy call to discuss your specific marketing challenges and opportunities.</p>
        <br>
        <p>Best regards,<br>The BoostROI Team</p>
        <p style="color: #666; font-size: 12px;">BoostROI Agency - Maximizing Your Marketing Returns</p>
      </div>
    `,
    text: `Welcome to BoostROI!

Thank you for your interest in boosting your marketing ROI!

We've added you to our community of forward-thinking business owners who are committed to maximizing their marketing returns.

Best regards,
The BoostROI Team`
  }),
  newsletterConfirmation: (email) => ({
    subject: `Welcome to the BoostROI Newsletter!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF5B2E;">Thank you for subscribing!</h2>
        <p>Hi there,</p>
        <p>Welcome to the BoostROI newsletter! You've successfully subscribed to our weekly marketing insights.</p>
        <p>Every week, you'll receive:</p>
        <ul>
          <li>Latest marketing trends and strategies</li>
          <li>ROI optimization tips from our experts</li>
          <li>Case studies from successful campaigns</li>
          <li>Exclusive tools and resources</li>
          <li>Industry insights and best practices</li>
        </ul>
        <p>Your first newsletter will arrive within the next week, packed with actionable insights to boost your marketing ROI.</p>
        <p>In the meantime, feel free to explore our website for free resources and tools.</p>
        <br>
        <p>Best regards,<br>The BoostROI Team</p>
        <p style="color: #666; font-size: 12px;">BoostROI Agency - Maximizing Your Marketing Returns</p>
        <p style="color: #666; font-size: 10px;">You can unsubscribe at any time by replying to any newsletter email.</p>
      </div>
    `,
    text: `Thank you for subscribing!

Welcome to the BoostROI newsletter! You've successfully subscribed to our weekly marketing insights.

Every week, you'll receive latest marketing trends, ROI optimization tips, case studies, and industry insights.

Your first newsletter will arrive within the next week.

Best regards,
The BoostROI Team`
  })
};

// server/test-storage.ts
import fs from "fs";
import path from "path";
var DATA_DIR = path.join(process.cwd(), "test-data");
var EMAILS_FILE = path.join(DATA_DIR, "emails.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
var TestStorage = class {
  getEmails() {
    try {
      if (fs.existsSync(EMAILS_FILE)) {
        const content = fs.readFileSync(EMAILS_FILE, "utf8");
        return JSON.parse(content);
      }
    } catch (error) {
      console.error("Error reading emails file:", error);
    }
    return [];
  }
  saveEmails(emails) {
    try {
      fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
    } catch (error) {
      console.error("Error saving emails file:", error);
    }
  }
  addEmail(email, type, data) {
    const emails = this.getEmails();
    const entry = {
      id: Date.now(),
      email,
      type,
      data,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    emails.push(entry);
    this.saveEmails(emails);
    console.log(`\u2705 Email stored: ${email} (${type})`);
    return entry;
  }
  getAllEmails() {
    return this.getEmails();
  }
  getEmailsByType(type) {
    return this.getEmails().filter((entry) => entry.type === type);
  }
  getEmailsByAddress(email) {
    return this.getEmails().filter((entry) => entry.email === email);
  }
};
var testStorage = new TestStorage();

// server/routes.ts
import { format, parseISO } from "date-fns";
import path2 from "path";
async function registerRoutes(app2) {
  app2.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      message: "BoostROI Agency API is running"
    });
  });
  app2.post("/api/test-email", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email address required" });
      }
      const success = await sendEmail({
        to: email,
        from: "hello@boostroi.agency",
        subject: "BoostROI Email Test",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF5B2E;">Email Test Successful!</h2>
            <p>This is a test email from your BoostROI Agency application.</p>
            <p>If you received this, your email functionality is working correctly.</p>
            <p>Best regards,<br>The BoostROI Team</p>
          </div>
        `,
        text: "Email Test Successful! Your BoostROI Agency application email functionality is working correctly."
      });
      res.json({
        success,
        message: success ? "Email sent successfully" : "Email failed to send"
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ error: "Failed to send test email" });
    }
  });
  app2.get("/api/status", (req, res) => {
    res.json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      message: "BoostROI Agency API is running"
    });
  });
  app2.post("/api/calc", async (req, res) => {
    try {
      console.log("ROI Calculator request body:", req.body);
      const validatedData = insertROICalculationSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      try {
        const calculation = await storage.createROICalculation(validatedData);
        console.log("Calculation result:", calculation);
        res.json(calculation);
      } catch (dbError) {
        console.log("Database error, falling back to in-memory calculation:", dbError instanceof Error ? dbError.message : String(dbError));
        const monthlySpend = parseFloat(validatedData.monthlySpend);
        const monthlyRevenue = parseFloat(validatedData.monthlyRevenue);
        const industryMultipliers = {
          "E-commerce": 2.8,
          "SaaS": 3.2,
          "Professional Services": 2.5,
          "Healthcare": 2,
          "Real Estate": 2.3,
          "Other": 2.4
        };
        const multiplier = industryMultipliers[validatedData.industry] || 2.4;
        const projectedRevenue = monthlyRevenue * multiplier;
        const additionalRevenue = projectedRevenue - monthlyRevenue;
        const additionalProfit = additionalRevenue * 0.7;
        const roiImprovement = (projectedRevenue - monthlyRevenue) / monthlyRevenue * 100;
        const fallbackCalculation = {
          id: Date.now(),
          monthlySpend: validatedData.monthlySpend,
          monthlyRevenue: validatedData.monthlyRevenue,
          industry: validatedData.industry,
          channels: validatedData.channels,
          email: validatedData.email || null,
          projectedRevenue: projectedRevenue.toFixed(2),
          additionalProfit: additionalProfit.toFixed(2),
          roiImprovement: roiImprovement.toFixed(2),
          createdAt: /* @__PURE__ */ new Date()
        };
        if (validatedData.email) {
          testStorage.addEmail(validatedData.email, "roi-calculation", {
            monthlySpend: validatedData.monthlySpend,
            monthlyRevenue: validatedData.monthlyRevenue,
            industry: validatedData.industry,
            channels: validatedData.channels,
            projectedRevenue: projectedRevenue.toFixed(2),
            additionalProfit: additionalProfit.toFixed(2),
            roiImprovement: roiImprovement.toFixed(2)
          });
        }
        console.log("Fallback calculation result:", fallbackCalculation);
        res.json(fallbackCalculation);
      }
    } catch (error) {
      console.error("Error creating ROI calculation:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: `Invalid calculation data: ${error.message}` });
      } else {
        res.status(400).json({ error: "Invalid calculation data" });
      }
    }
  });
  app2.post("/api/roi-audit", async (req, res) => {
    try {
      const validatedData = insertROIAuditSchema.parse(req.body);
      const audit = await storage.createROIAudit(validatedData);
      const template = emailTemplates.roiAuditConfirmation(
        validatedData.businessName || "Your Business",
        validatedData.contactName || "there"
      );
      await sendEmail({
        to: validatedData.email,
        from: "hello@boostroi.agency",
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
  app2.post("/api/lead-capture", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      try {
        const lead = await storage.createLead(validatedData);
        const template = emailTemplates.leadCaptureConfirmation(validatedData.email);
        await sendEmail({
          to: validatedData.email,
          from: "hello@boostroi.agency",
          subject: template.subject,
          html: template.html,
          text: template.text
        });
        res.json(lead);
      } catch (dbError) {
        console.log("Database error, using test storage for lead:", dbError instanceof Error ? dbError.message : String(dbError));
        const entry = testStorage.addEmail(validatedData.email, "lead", validatedData);
        try {
          const template = emailTemplates.leadCaptureConfirmation(validatedData.email);
          await sendEmail({
            to: validatedData.email,
            from: "hello@boostroi.agency",
            subject: template.subject,
            html: template.html,
            text: template.text
          });
        } catch (emailError) {
          console.log("Email send failed (likely not configured):", emailError instanceof Error ? emailError.message : String(emailError));
        }
        res.json({
          id: entry.id,
          email: entry.email,
          name: validatedData.name,
          leadMagnet: validatedData.leadMagnet,
          trigger: validatedData.trigger,
          status: "new",
          createdAt: entry.timestamp
        });
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(400).json({ error: "Invalid lead data" });
    }
  });
  app2.post("/api/newsletter-signup", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriptionSchema.parse(req.body);
      try {
        const subscription = await storage.createNewsletterSubscription(validatedData);
        res.json(subscription);
      } catch (dbError) {
        console.log("Database error, using test storage for newsletter:", dbError instanceof Error ? dbError.message : String(dbError));
        const entry = testStorage.addEmail(validatedData.email, "newsletter", validatedData);
        try {
          const template = emailTemplates.newsletterConfirmation(validatedData.email);
          await sendEmail({
            to: validatedData.email,
            from: "hello@boostroi.agency",
            subject: template.subject,
            html: template.html,
            text: template.text
          });
        } catch (emailError) {
          console.log("Email send failed (likely not configured):", emailError instanceof Error ? emailError.message : String(emailError));
        }
        res.json({
          id: entry.id,
          email: entry.email,
          status: "active",
          source: validatedData.source || "website",
          createdAt: entry.timestamp
        });
      }
    } catch (error) {
      console.error("Error creating newsletter subscription:", error);
      res.status(400).json({ error: "Invalid subscription data" });
    }
  });
  app2.post("/api/case-study", async (req, res) => {
    try {
      const validatedData = insertCaseStudyRequestSchema.parse(req.body);
      const request = await storage.createCaseStudyRequest(validatedData);
      const template = emailTemplates.caseStudyConfirmation(
        validatedData.businessName || "Your Business",
        validatedData.contactName || "there"
      );
      await sendEmail({
        to: validatedData.email,
        from: "hello@boostroi.agency",
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
  app2.post("/api/weekly-marketing", async (req, res) => {
    try {
      const validatedData = insertWeeklyMarketingRequestSchema.parse(req.body);
      const request = await storage.createWeeklyMarketingRequest(validatedData);
      const template = emailTemplates.weeklyMarketingConfirmation(
        validatedData.businessName || "Your Business",
        validatedData.contactName || "there"
      );
      await sendEmail({
        to: validatedData.email,
        from: "hello@boostroi.agency",
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
  app2.get("/api/admin/requests", async (req, res) => {
    try {
      const requests = await storage.getAllRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching admin requests:", error);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });
  app2.patch("/api/admin/roi-audit/:id", async (req, res) => {
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
  app2.patch("/api/admin/case-study/:id", async (req, res) => {
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
  app2.patch("/api/admin/weekly-marketing/:id", async (req, res) => {
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
  app2.post("/api/checkout", (req, res) => {
    res.json({
      message: "Checkout endpoint (temporarily simplified)",
      received: req.body
    });
  });
  app2.get("/test", (req, res) => {
    const testHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Server Test</title>
          <style>
              body { font-family: Arial, sans-serif; background: #f0f8ff; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
              h1 { color: #007cba; }
              .status { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 15px 0; }
              .logo-test { border: 2px solid #ccc; padding: 20px; margin: 15px 0; text-align: center; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>\u{1F389} BoostROI Server is Working!</h1>
              <div class="status">
                  <strong>\u2705 Server Status: Active</strong><br>
                  <strong>\u{1F4E1} Port:</strong> 9000<br>
                  <strong>\u23F0 Time:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}<br>
                  <strong>\u{1F310} URL:</strong> http://localhost:9000/test
              </div>
              
              <div class="logo-test">
                  <h3>Logo Test:</h3>
                  <img src="/boostroi-logo.svg" alt="BoostROI Logo" style="height: 60px; border: 1px solid #ddd;">
                  <p>If you see the logo above, the file is loading correctly.</p>
              </div>
              
              <p>This page is served directly by the Express server.</p>
              <p><a href="/" style="color: #007cba;">\u2190 Back to React App</a></p>
              <button onclick="window.open('/', '_blank')" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                  Open React App in New Tab
              </button>
          </div>
          <script>
              console.log('\u2705 Server test page loaded');
              console.log('Current time:', new Date());
          </script>
      </body>
      </html>
    `;
    res.send(testHTML);
  });
  app2.post("/api/calc-debug", async (req, res) => {
    console.log("=== ROI CALC DEBUG START ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", req.headers);
    const { monthlySpend, monthlyRevenue, industry, channels, email } = req.body;
    if (!monthlySpend || !monthlyRevenue || !industry || !channels) {
      console.log("Missing required fields");
      return res.status(400).json({
        error: "Missing required fields",
        received: { monthlySpend, monthlyRevenue, industry, channels, email }
      });
    }
    const spend = parseFloat(monthlySpend);
    const revenue = parseFloat(monthlyRevenue);
    if (isNaN(spend) || isNaN(revenue)) {
      console.log("Invalid numbers");
      return res.status(400).json({
        error: "Invalid numbers",
        monthlySpend: { value: monthlySpend, parsed: spend },
        monthlyRevenue: { value: monthlyRevenue, parsed: revenue }
      });
    }
    const result = {
      id: Date.now(),
      monthlySpend: spend.toString(),
      monthlyRevenue: revenue.toString(),
      industry,
      channels,
      email: email || null,
      projectedRevenue: (revenue * 2.5).toFixed(2),
      additionalProfit: (revenue * 1.5 * 0.7).toFixed(2),
      roiImprovement: "150.00",
      createdAt: /* @__PURE__ */ new Date()
    };
    console.log("Calculation result:", result);
    console.log("=== ROI CALC DEBUG END ===");
    res.json(result);
  });
  app2.get("/api/test-emails", (req, res) => {
    try {
      const emails = testStorage.getAllEmails();
      res.json({
        total: emails.length,
        byType: {
          newsletter: testStorage.getEmailsByType("newsletter").length,
          lead: testStorage.getEmailsByType("lead").length,
          "roi-calculation": testStorage.getEmailsByType("roi-calculation").length,
          audit: testStorage.getEmailsByType("audit").length,
          "case-study": testStorage.getEmailsByType("case-study").length
        },
        emails: emails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      });
    } catch (error) {
      console.error("Error retrieving test emails:", error);
      res.status(500).json({ error: "Failed to retrieve emails" });
    }
  });
  app2.get("/email-test", (req, res) => {
    const testPagePath = path2.join(process.cwd(), "email-collection-test.html");
    res.sendFile(testPagePath);
  });
  const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = authHeader.substring(7);
    if (token === "demo-admin-token") {
      req.user = { id: 1, username: "admin" };
      next();
    } else {
      res.status(401).json({ error: "Invalid token" });
    }
  };
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username === "admin" && password === "boost123") {
        const user = { id: 1, username: "admin", email: "admin@boostroi.agency" };
        const token = "demo-admin-token";
        res.json({
          success: true,
          token,
          user
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.get("/api/admin/site-data", authenticateAdmin, async (req, res) => {
    try {
      const emails = testStorage.getAllEmails();
      const recentActivity = emails.slice(-5).map((email) => ({
        type: `${email.type} collection`,
        description: `Email collected: ${email.email}`,
        timestamp: format(parseISO(email.timestamp), "PPP p")
      }));
      res.json({
        totalLeads: testStorage.getEmailsByType("lead").length,
        newsletterSubscribers: testStorage.getEmailsByType("newsletter").length,
        roiCalculations: testStorage.getEmailsByType("roi-calculation").length,
        activeClients: 0,
        // Will be populated when client management is implemented
        recentActivity
      });
    } catch (error) {
      console.error("Error fetching site data:", error);
      res.status(500).json({ error: "Failed to fetch site data" });
    }
  });
  app2.get("/api/admin/clients", authenticateAdmin, async (req, res) => {
    try {
      const demoClients = [
        {
          id: 1,
          businessName: "TechStart Solutions",
          contactName: "Sarah Johnson",
          email: "sarah@techstart.com",
          phone: "+1 (555) 123-4567",
          industry: "SaaS",
          status: "active",
          monthlyRevenue: 15e4,
          lastContact: "2025-07-05T10:00:00Z",
          notes: "Interested in expanding PPC campaigns. Currently running Google Ads with 3.2x ROAS.",
          createdAt: "2025-06-01T09:00:00Z"
        },
        {
          id: 2,
          businessName: "Green Earth Retail",
          contactName: "Mike Chen",
          email: "mike@greenearth.com",
          phone: "+1 (555) 987-6543",
          industry: "E-commerce",
          status: "prospect",
          monthlyRevenue: 85e3,
          lastContact: "2025-07-03T14:30:00Z",
          notes: "E-commerce store looking to improve conversion rates. Discussed social media marketing strategy.",
          createdAt: "2025-06-15T11:00:00Z"
        }
      ];
      res.json(demoClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });
  app2.post("/api/admin/clients", authenticateAdmin, async (req, res) => {
    try {
      const clientData = req.body;
      const newClient = {
        id: Date.now(),
        ...clientData,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log("New client added:", newClient);
      res.json(newClient);
    } catch (error) {
      console.error("Error adding client:", error);
      res.status(500).json({ error: "Failed to add client" });
    }
  });
  app2.put("/api/admin/clients/:id", authenticateAdmin, async (req, res) => {
    try {
      const clientId = req.params.id;
      const clientData = req.body;
      console.log(`Client ${clientId} updated:`, clientData);
      res.json({ id: clientId, ...clientData });
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });
  app2.get("/api/admin/meetings", authenticateAdmin, async (req, res) => {
    try {
      const demoMeetings = [
        {
          id: 1,
          clientId: 1,
          clientName: "TechStart Solutions",
          title: "Q3 Strategy Review",
          type: "video",
          date: "2025-07-10T15:00:00Z",
          duration: 60,
          status: "scheduled",
          notes: "Review current campaigns and discuss Q3 strategy. Prepare ROI analysis.",
          createdAt: "2025-07-05T10:00:00Z"
        },
        {
          id: 2,
          clientId: 2,
          clientName: "Green Earth Retail",
          title: "Initial Consultation",
          type: "call",
          date: "2025-07-08T13:00:00Z",
          duration: 30,
          status: "completed",
          notes: "Discussed current marketing challenges. Client interested in social media expansion.",
          createdAt: "2025-07-03T14:30:00Z"
        }
      ];
      res.json(demoMeetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ error: "Failed to fetch meetings" });
    }
  });
  app2.post("/api/admin/meetings", authenticateAdmin, async (req, res) => {
    try {
      const meetingData = req.body;
      const newMeeting = {
        id: Date.now(),
        ...meetingData,
        status: "scheduled",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log("New meeting scheduled:", newMeeting);
      res.json(newMeeting);
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      res.status(500).json({ error: "Failed to schedule meeting" });
    }
  });
  app2.get("/api/admin/content", authenticateAdmin, async (req, res) => {
    try {
      const demoContent = [
        {
          id: "hero-title",
          section: "Hero Section",
          title: "Main Headline",
          content: "Boost Your Marketing ROI by 200-900% in 90 Days",
          lastUpdated: "2025-07-01T10:00:00Z"
        },
        {
          id: "hero-subtitle",
          section: "Hero Section",
          title: "Subtitle",
          content: "Data-driven marketing strategies that deliver measurable results for Australian businesses",
          lastUpdated: "2025-07-01T10:00:00Z"
        },
        {
          id: "pricing-starter",
          section: "Pricing",
          title: "Starter Package Description",
          content: "Perfect for small businesses ready to optimize their marketing spend and see immediate improvements.",
          lastUpdated: "2025-06-28T14:30:00Z"
        }
      ];
      res.json(demoContent);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });
  app2.put("/api/admin/content/:id", authenticateAdmin, async (req, res) => {
    try {
      const contentId = req.params.id;
      const contentData = req.body;
      const updatedContent = {
        id: contentId,
        ...contentData,
        lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
      };
      console.log(`Content ${contentId} updated:`, updatedContent);
      res.json(updatedContent);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: "0.0.0.0",
    port: 5e3
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv.config({ path: ".env" });
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error("Error:", err);
});
async function startServer() {
  try {
    console.log("1. Starting server setup...");
    if (!process.env.DATABASE_URL) {
      console.error("ERROR: DATABASE_URL environment variable is missing");
      process.exit(1);
    }
    console.log("2. Environment variables checked \u2713");
    app.get("/health", (req, res) => {
      res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    });
    console.log("3. Health check endpoint added \u2713");
    const server = createServer(app);
    console.log("4. HTTP server created \u2713");
    const port = parseInt(process.env.PORT || process.env.REPL_PORT || "5000", 10);
    const host = process.env.HOST || process.env.REPL_HOST || "0.0.0.0";
    console.log(`4.1. Target binding: ${host}:${port}`);
    server.on("error", (error) => {
      console.error("Server error:", error);
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
      }
    });
    const serverTimeout = setTimeout(() => {
      console.error("Server startup timeout - attempting alternative binding");
      process.exit(1);
    }, 3e4);
    server.listen(port, host, async () => {
      clearTimeout(serverTimeout);
      console.log(`5. \u2713 Server listening on ${host}:${port}`);
      console.log(`\u2713 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`\u2713 Process ID: ${process.pid}`);
      console.log(`\u2713 Available environment variables: PORT=${process.env.PORT}, HOST=${process.env.HOST}`);
      log(`serving on port ${port}`);
      try {
        await registerRoutes(app);
        console.log("6. Routes registered successfully \u2713");
      } catch (error) {
        console.error("Warning: Some routes failed to register:", error);
      }
      if (process.env.NODE_ENV !== "development") {
        console.log("7. Setting up static file serving...");
        try {
          serveStatic(app);
          console.log("8. Static file serving ready \u2713");
        } catch (error) {
          console.error("Warning: Static file serving failed:", error);
        }
      }
      if (process.env.NODE_ENV === "development") {
        console.log("9. Setting up Vite in development mode...");
        try {
          await setupVite(app, server);
          console.log("10. Vite setup completed \u2713");
        } catch (error) {
          console.error("Warning: Vite setup failed:", error);
        }
      }
      console.log("\u2713 Server fully initialized and ready for requests");
    });
  } catch (error) {
    console.error("FATAL: Failed to start server:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : String(error));
    console.error("Environment debug info:");
    console.error("- NODE_ENV:", process.env.NODE_ENV);
    console.error("- PORT:", process.env.PORT);
    console.error("- HOST:", process.env.HOST);
    console.error("- DATABASE_URL exists:", !!process.env.DATABASE_URL);
    process.exit(1);
  }
}
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
startServer();
