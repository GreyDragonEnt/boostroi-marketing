import { users, roiCalculations, leads, newsletterSubscriptions, roiAudits, caseStudyRequests, weeklyMarketingRequests, type User, type InsertUser, type ROICalculation, type InsertROICalculation, type Lead, type InsertLead, type NewsletterSubscription, type InsertNewsletterSubscription, type ROIAudit, type InsertROIAudit, type CaseStudyRequest, type InsertCaseStudyRequest, type WeeklyMarketingRequest, type InsertWeeklyMarketingRequest } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(id: number, customerId: string, subscriptionId?: string): Promise<User>;
  createROICalculation(calculation: InsertROICalculation): Promise<ROICalculation>;
  getROICalculationsByEmail(email: string): Promise<ROICalculation[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getLeadsByEmail(email: string): Promise<Lead[]>;
  getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined>;
  createROIAudit(audit: InsertROIAudit): Promise<ROIAudit>;
  getROIAuditsByEmail(email: string): Promise<ROIAudit[]>;
  updateROIAuditStatus(id: number, status: string): Promise<ROIAudit>;
  // Admin interface methods
  getAllRequests(): Promise<{
    roiAudits: ROIAudit[];
    caseStudyRequests: CaseStudyRequest[];
    weeklyMarketingRequests: WeeklyMarketingRequest[];
    leads: Lead[];
  }>;
  createCaseStudyRequest(request: InsertCaseStudyRequest): Promise<CaseStudyRequest>;
  updateCaseStudyRequestStatus(id: number, status: string): Promise<CaseStudyRequest>;
  createWeeklyMarketingRequest(request: InsertWeeklyMarketingRequest): Promise<WeeklyMarketingRequest>;
  updateWeeklyMarketingRequestStatus(id: number, status: string): Promise<WeeklyMarketingRequest>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private roiCalculations: Map<number, ROICalculation>;
  private roiAudits: Map<number, ROIAudit>;
  private leads: Map<number, Lead>;
  private currentUserId: number;
  private currentROIId: number;
  private currentAuditId: number;
  private currentLeadId: number;

  constructor() {
    this.users = new Map();
    this.roiCalculations = new Map();
    this.roiAudits = new Map();
    this.leads = new Map();
    this.currentUserId = 1;
    this.currentROIId = 1;
    this.currentAuditId = 1;
    this.currentLeadId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser,
      email: insertUser.email || null,
      id,
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(id: number, customerId: string, subscriptionId?: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = {
      ...user,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId || user.stripeSubscriptionId
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createROICalculation(insertCalculation: InsertROICalculation): Promise<ROICalculation> {
    const id = this.currentROIId++;
    
    // Calculate projections based on industry and current performance
    const monthlySpend = parseFloat(insertCalculation.monthlySpend);
    const monthlyRevenue = parseFloat(insertCalculation.monthlyRevenue);
    
    // Industry multipliers for ROI improvement
    const industryMultipliers: Record<string, number> = {
      'E-commerce': 2.8,
      'SaaS': 3.2,
      'Professional Services': 2.5,
      'Healthcare': 2.0,
      'Real Estate': 2.3,
      'Other': 2.4
    };
    
    const multiplier = industryMultipliers[insertCalculation.industry] || 2.4;
    const projectedRevenue = monthlyRevenue * multiplier;
    const additionalRevenue = projectedRevenue - monthlyRevenue;
    const additionalProfit = additionalRevenue * 0.7; // Assuming 70% profit margin
    const roiImprovement = ((projectedRevenue - monthlyRevenue) / monthlyRevenue) * 100;

    const calculation: ROICalculation = {
      ...insertCalculation,
      email: insertCalculation.email || null,
      id,
      projectedRevenue: projectedRevenue.toFixed(2),
      additionalProfit: additionalProfit.toFixed(2),
      roiImprovement: roiImprovement.toFixed(2),
      createdAt: new Date()
    };
    
    this.roiCalculations.set(id, calculation);
    return calculation;
  }

  async getROICalculationsByEmail(email: string): Promise<ROICalculation[]> {
    return Array.from(this.roiCalculations.values()).filter(
      (calc) => calc.email === email
    );
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    // MemStorage implementation - not used in production
    const lead: Lead = {
      id: Date.now(),
      email: insertLead.email,
      name: insertLead.name,
      leadMagnet: insertLead.leadMagnet,
      trigger: insertLead.trigger,
      status: insertLead.status || "new",
      createdAt: new Date()
    };
    return lead;
  }

  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // MemStorage implementation - not used in production
    const subscription: NewsletterSubscription = {
      id: Date.now(),
      email: insertSubscription.email,
      status: insertSubscription.status || "active",
      source: insertSubscription.source || "website",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return subscription;
  }

  async getLeadsByEmail(email: string): Promise<Lead[]> {
    return [];
  }

  async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
    return undefined;
  }

  async createROIAudit(insertAudit: InsertROIAudit): Promise<ROIAudit> {
    const audit: ROIAudit = {
      id: this.currentAuditId++,
      ...insertAudit,
      website: insertAudit.website || null,
      previousAgencies: insertAudit.previousAgencies || null,
      additionalInfo: insertAudit.additionalInfo || null,
      status: "pending",
      completedAt: null,
      createdAt: new Date(),
    };
    this.roiAudits.set(audit.id, audit);
    return audit;
  }

  async getROIAuditsByEmail(email: string): Promise<ROIAudit[]> {
    return Array.from(this.roiAudits.values()).filter(audit => audit.email === email);
  }

  async updateROIAuditStatus(id: number, status: string): Promise<ROIAudit> {
    const audit = this.roiAudits.get(id);
    if (!audit) {
      throw new Error(`ROI audit with id ${id} not found`);
    }
    audit.status = status;
    if (status === "completed") {
      audit.completedAt = new Date();
    }
    this.roiAudits.set(id, audit);
    return audit;
  }

  async getAllRequests(): Promise<{
    roiAudits: ROIAudit[];
    caseStudyRequests: CaseStudyRequest[];
    weeklyMarketingRequests: WeeklyMarketingRequest[];
    leads: Lead[];
  }> {
    // Note: MemStorage doesn't store case study or weekly marketing requests
    return {
      roiAudits: Array.from(this.roiAudits.values()),
      caseStudyRequests: [],
      weeklyMarketingRequests: [],
      leads: Array.from(this.leads.values()),
    };
  }

  async createCaseStudyRequest(request: InsertCaseStudyRequest): Promise<CaseStudyRequest> {
    throw new Error("Case study requests not supported in MemStorage");
  }

  async updateCaseStudyRequestStatus(id: number, status: string): Promise<CaseStudyRequest> {
    throw new Error("Case study requests not supported in MemStorage");
  }

  async createWeeklyMarketingRequest(request: InsertWeeklyMarketingRequest): Promise<WeeklyMarketingRequest> {
    throw new Error("Weekly marketing requests not supported in MemStorage");
  }

  async updateWeeklyMarketingRequestStatus(id: number, status: string): Promise<WeeklyMarketingRequest> {
    throw new Error("Weekly marketing requests not supported in MemStorage");
  }
}

// DatabaseStorage implementation using PostgreSQL
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        email: insertUser.email || null
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: number, customerId: string, subscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId || null
      })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async createROICalculation(insertCalculation: InsertROICalculation): Promise<ROICalculation> {
    // Calculate projections based on industry and current performance
    const monthlySpend = parseFloat(insertCalculation.monthlySpend);
    const monthlyRevenue = parseFloat(insertCalculation.monthlyRevenue);
    
    // Industry multipliers for ROI improvement
    const industryMultipliers: Record<string, number> = {
      'E-commerce': 2.8,
      'SaaS': 3.2,
      'Professional Services': 2.5,
      'Healthcare': 2.0,
      'Real Estate': 2.3,
      'Other': 2.4
    };
    
    const multiplier = industryMultipliers[insertCalculation.industry] || 2.4;
    const projectedRevenue = monthlyRevenue * multiplier;
    const additionalRevenue = projectedRevenue - monthlyRevenue;
    const additionalProfit = additionalRevenue * 0.7; // Assuming 70% profit margin
    const roiImprovement = ((projectedRevenue - monthlyRevenue) / monthlyRevenue) * 100;

    const [calculation] = await db
      .insert(roiCalculations)
      .values({
        ...insertCalculation,
        email: insertCalculation.email || null,
        projectedRevenue: projectedRevenue.toFixed(2),
        additionalProfit: additionalProfit.toFixed(2),
        roiImprovement: roiImprovement.toFixed(2),
      })
      .returning();

    return calculation;
  }

  async getROICalculationsByEmail(email: string): Promise<ROICalculation[]> {
    return await db
      .select()
      .from(roiCalculations)
      .where(eq(roiCalculations.email, email));
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const [subscription] = await db
      .insert(newsletterSubscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  async getLeadsByEmail(email: string): Promise<Lead[]> {
    return await db
      .select()
      .from(leads)
      .where(eq(leads.email, email));
  }

  async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email));
    return subscription || undefined;
  }

  async createROIAudit(insertAudit: InsertROIAudit): Promise<ROIAudit> {
    const [audit] = await db
      .insert(roiAudits)
      .values(insertAudit)
      .returning();
    return audit;
  }

  async getROIAuditsByEmail(email: string): Promise<ROIAudit[]> {
    return await db
      .select()
      .from(roiAudits)
      .where(eq(roiAudits.email, email));
  }

  async updateROIAuditStatus(id: number, status: string): Promise<ROIAudit> {
    const updateData: any = { status };
    if (status === "completed") {
      updateData.completedAt = new Date();
    }
    
    const [audit] = await db
      .update(roiAudits)
      .set(updateData)
      .where(eq(roiAudits.id, id))
      .returning();
    
    if (!audit) {
      throw new Error(`ROI audit with id ${id} not found`);
    }
    
    return audit;
  }

  async getAllRequests(): Promise<{
    roiAudits: ROIAudit[];
    caseStudyRequests: CaseStudyRequest[];
    weeklyMarketingRequests: WeeklyMarketingRequest[];
    leads: Lead[];
  }> {
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
      leads: leadsList,
    };
  }

  async createCaseStudyRequest(insertRequest: InsertCaseStudyRequest): Promise<CaseStudyRequest> {
    const [request] = await db
      .insert(caseStudyRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updateCaseStudyRequestStatus(id: number, status: string): Promise<CaseStudyRequest> {
    const updateData: any = { status };
    if (status === "completed") {
      updateData.completedAt = new Date();
    }
    
    const [request] = await db
      .update(caseStudyRequests)
      .set(updateData)
      .where(eq(caseStudyRequests.id, id))
      .returning();
    
    if (!request) {
      throw new Error(`Case study request with id ${id} not found`);
    }
    
    return request;
  }

  async createWeeklyMarketingRequest(insertRequest: InsertWeeklyMarketingRequest): Promise<WeeklyMarketingRequest> {
    const [request] = await db
      .insert(weeklyMarketingRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updateWeeklyMarketingRequestStatus(id: number, status: string): Promise<WeeklyMarketingRequest> {
    const updateData: any = { status };
    if (status === "completed") {
      updateData.completedAt = new Date();
    }
    
    const [request] = await db
      .update(weeklyMarketingRequests)
      .set(updateData)
      .where(eq(weeklyMarketingRequests.id, id))
      .returning();
    
    if (!request) {
      throw new Error(`Weekly marketing request with id ${id} not found`);
    }
    
    return request;
  }
}

export const storage = new DatabaseStorage();
