import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const roiCalculations = pgTable("roi_calculations", {
  id: serial("id").primaryKey(),
  monthlySpend: decimal("monthly_spend", { precision: 10, scale: 2 }).notNull(),
  monthlyRevenue: decimal("monthly_revenue", { precision: 10, scale: 2 }).notNull(),
  industry: text("industry").notNull(),
  channels: text("channels").notNull(),
  projectedRevenue: decimal("projected_revenue", { precision: 10, scale: 2 }),
  additionalProfit: decimal("additional_profit", { precision: 10, scale: 2 }),
  roiImprovement: decimal("roi_improvement", { precision: 5, scale: 2 }),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  leadMagnet: text("lead_magnet").notNull(),
  trigger: text("trigger").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  status: text("status").notNull().default("active"),
  source: text("source").notNull().default("website"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const roiAudits = pgTable("roi_audits", {
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
  currentChannels: json("current_channels").$type<string[]>().notNull(),
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const caseStudyRequests = pgTable("case_study_requests", {
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const weeklyMarketingRequests = pgTable("weekly_marketing_requests", {
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertROICalculationSchema = createInsertSchema(roiCalculations).pick({
  monthlySpend: true,
  monthlyRevenue: true,
  industry: true,
  channels: true,
  email: true,
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  email: true,
  name: true,
  leadMagnet: true,
  trigger: true,
  status: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
  status: true,
  source: true,
});

export const insertROIAuditSchema = createInsertSchema(roiAudits).pick({
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
  auditConsent: true,
});

export const insertCaseStudyRequestSchema = createInsertSchema(caseStudyRequests).pick({
  businessName: true,
  contactName: true,
  email: true,
  phone: true,
  website: true,
  industry: true,
  currentResults: true,
  timeframe: true,
  willingToShare: true,
  marketingConsent: true,
});

export const insertWeeklyMarketingRequestSchema = createInsertSchema(weeklyMarketingRequests).pick({
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
  marketingConsent: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertROICalculation = z.infer<typeof insertROICalculationSchema>;
export type ROICalculation = typeof roiCalculations.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertROIAudit = z.infer<typeof insertROIAuditSchema>;
export type ROIAudit = typeof roiAudits.$inferSelect;
export type InsertCaseStudyRequest = z.infer<typeof insertCaseStudyRequestSchema>;
export type CaseStudyRequest = typeof caseStudyRequests.$inferSelect;
export type InsertWeeklyMarketingRequest = z.infer<typeof insertWeeklyMarketingRequestSchema>;
export type WeeklyMarketingRequest = typeof weeklyMarketingRequests.$inferSelect;
