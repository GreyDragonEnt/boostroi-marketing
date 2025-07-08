import type { Express } from "express";
import { storage } from "./storage";
import { sendEmail, emailTemplates } from "./email";
import { insertROICalculationSchema, insertLeadSchema, insertNewsletterSubscriptionSchema, insertROIAuditSchema, insertCaseStudyRequestSchema, insertWeeklyMarketingRequestSchema } from "@shared/schema";
import { testStorage } from "./test-storage";
import { format, parseISO } from "date-fns";
import path from "path";
import fs from "fs";

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
      console.log("ROI Calculator request body:", req.body);
      const validatedData = insertROICalculationSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      
      try {
        const calculation = await storage.createROICalculation(validatedData);
        console.log("Calculation result:", calculation);
        res.json(calculation);
      } catch (dbError) {
        console.log("Database error, falling back to in-memory calculation:", dbError instanceof Error ? dbError.message : String(dbError));
        
        // Fallback calculation without database
        const monthlySpend = parseFloat(validatedData.monthlySpend);
        const monthlyRevenue = parseFloat(validatedData.monthlyRevenue);
        
        // Industry multipliers for ROI improvement
        const industryMultipliers: Record<string, number> = {
          'E-commerce': 2.8,
          'SaaS': 3.2,
          'Professional Services': 2.5,
          'Healthcare': 2.0,
          'Real Estate': 2.3,
          'Other': 2.4
        };
        
        const multiplier = industryMultipliers[validatedData.industry] || 2.4;
        const projectedRevenue = monthlyRevenue * multiplier;
        const additionalRevenue = projectedRevenue - monthlyRevenue;
        const additionalProfit = additionalRevenue * 0.7; // Assuming 70% profit margin
        const roiImprovement = ((projectedRevenue - monthlyRevenue) / monthlyRevenue) * 100;

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
          createdAt: new Date()
        };
        
        // Store email if provided
        if (validatedData.email) {
          testStorage.addEmail(validatedData.email, 'roi-calculation', {
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
      
      try {
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
      } catch (dbError) {
        console.log("Database error, using test storage for lead:", dbError instanceof Error ? dbError.message : String(dbError));
        
        // Fallback to test storage
        const entry = testStorage.addEmail(validatedData.email, 'lead', validatedData);
        
        // Send confirmation email (if configured)
        try {
          const template = emailTemplates.leadCaptureConfirmation(validatedData.email);
          await sendEmail({
            to: validatedData.email,
            from: 'hello@boostroi.agency',
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
          status: 'new',
          createdAt: entry.timestamp
        });
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(400).json({ error: "Invalid lead data" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter-signup", async (req, res) => {
    try {
      const { email, name } = req.body;
      
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email is required" });
      }

      // Store in local file system (existing functionality)
      const emailEntry = {
        id: Date.now(),
        email,
        name: name || "",
        type: "newsletter",
        source: "website",
        timestamp: new Date().toISOString(),
      };

      const { testStorage } = await import('./test-storage.js');
      testStorage.addEmail(email, 'newsletter', { name, source: 'website' });

      // Sync with SendGrid if available
      if (sendGridService.isInitialized()) {
        try {
          // Add to a default newsletter list (you'd need to create this list first)
          const defaultListId = process.env.SENDGRID_NEWSLETTER_LIST_ID;
          if (defaultListId) {
            const firstName = name ? name.split(' ')[0] : '';
            const lastName = name ? name.split(' ').slice(1).join(' ') : '';
            await sendGridService.addContactToList(defaultListId, email, firstName, lastName);
            console.log(`Added ${email} to SendGrid newsletter list`);
          }
        } catch (sgError) {
          console.error('SendGrid sync failed:', sgError);
          // Continue with success even if SendGrid fails
        }
      }

      res.json({ 
        success: true, 
        message: "Successfully subscribed to newsletter",
        synced: sendGridService.isInitialized()
      });
    } catch (error) {
      console.error("Newsletter signup error:", error);
      res.status(500).json({ error: "Failed to process subscription" });
    }
  });

  // Case study request endpoint
  app.post("/api/case-study", async (req, res) => {
    try {
      const validatedData = insertCaseStudyRequestSchema.parse(req.body);
      const request = await storage.createCaseStudyRequest(validatedData);
      
      // Sync with SendGrid if available
      if (sendGridService.isInitialized()) {
        try {
          const caseStudyListId = process.env.SENDGRID_CASE_STUDY_LIST;
          if (caseStudyListId) {
            const firstName = validatedData.contactName ? validatedData.contactName.split(' ')[0] : '';
            const lastName = validatedData.contactName ? validatedData.contactName.split(' ').slice(1).join(' ') : '';
            await sendGridService.addContactToList(caseStudyListId, validatedData.email, firstName, lastName);
            console.log(`Added ${validatedData.email} to SendGrid case study list`);
          }
        } catch (sgError) {
          console.error('SendGrid case study sync failed:', sgError);
        }
      }
      
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

  // Simple test page route
  app.get("/test", (req, res) => {
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
              <h1>🎉 BoostROI Server is Working!</h1>
              <div class="status">
                  <strong>✅ Server Status: Active</strong><br>
                  <strong>📡 Port:</strong> 9000<br>
                  <strong>⏰ Time:</strong> ${new Date().toLocaleString()}<br>
                  <strong>🌐 URL:</strong> http://localhost:9000/test
              </div>
              
              <div class="logo-test">
                  <h3>Logo Test:</h3>
                  <img src="/boostroi-logo.svg" alt="BoostROI Logo" style="height: 60px; border: 1px solid #ddd;">
                  <p>If you see the logo above, the file is loading correctly.</p>
              </div>
              
              <p>This page is served directly by the Express server.</p>
              <p><a href="/" style="color: #007cba;">← Back to React App</a></p>
              <button onclick="window.open('/', '_blank')" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                  Open React App in New Tab
              </button>
          </div>
          <script>
              console.log('✅ Server test page loaded');
              console.log('Current time:', new Date());
          </script>
      </body>
      </html>
    `;
    res.send(testHTML);
  });

  // Debug ROI endpoint - simpler version
  app.post("/api/calc-debug", async (req, res) => {
    console.log("=== ROI CALC DEBUG START ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", req.headers);
    
    // Simple validation without schema
    const { monthlySpend, monthlyRevenue, industry, channels, email } = req.body;
    
    if (!monthlySpend || !monthlyRevenue || !industry || !channels) {
      console.log("Missing required fields");
      return res.status(400).json({ 
        error: "Missing required fields",
        received: { monthlySpend, monthlyRevenue, industry, channels, email }
      });
    }
    
    // Simple calculation without database
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
      createdAt: new Date()
    };
    
    console.log("Calculation result:", result);
    console.log("=== ROI CALC DEBUG END ===");
    
    res.json(result);
  });

  // Test endpoint to view collected emails (for development only)
  app.get("/api/test-emails", (req, res) => {
    try {
      const emails = testStorage.getAllEmails();
      res.json({
        total: emails.length,
        byType: {
          newsletter: testStorage.getEmailsByType('newsletter').length,
          lead: testStorage.getEmailsByType('lead').length,
          'roi-calculation': testStorage.getEmailsByType('roi-calculation').length,
          audit: testStorage.getEmailsByType('audit').length,
          'case-study': testStorage.getEmailsByType('case-study').length
        },
        emails: emails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      });
    } catch (error) {
      console.error("Error retrieving test emails:", error);
      res.status(500).json({ error: "Failed to retrieve emails" });
    }
  });

  // Serve email collection test page
  app.get("/email-test", (req, res) => {
    const testPagePath = path.join(process.cwd(), "email-collection-test.html");
    res.sendFile(testPagePath);
  });

  // Admin authentication middleware
  const authenticateAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.substring(7);
    // In production, validate JWT token properly
    if (token === 'demo-admin-token') {
      req.user = { id: 1, username: 'admin' };
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Demo credentials - in production, hash passwords and check database
      if (username === 'admin' && password === 'boost123') {
        const user = { id: 1, username: 'admin', email: 'admin@boostroi.agency' };
        const token = 'demo-admin-token'; // In production, generate JWT
        
        res.json({
          success: true,
          token,
          user
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Admin site data endpoint
  app.get("/api/admin/site-data", authenticateAdmin, async (req, res) => {
    try {
      const emails = testStorage.getAllEmails();
      const recentActivity = emails.slice(-5).map(email => ({
        type: `${email.type} collection`,
        description: `Email collected: ${email.email}`,
        timestamp: format(parseISO(email.timestamp), 'PPP p')
      }));

      res.json({
        totalLeads: testStorage.getEmailsByType('lead').length,
        newsletterSubscribers: testStorage.getEmailsByType('newsletter').length,
        roiCalculations: testStorage.getEmailsByType('roi-calculation').length,
        activeClients: 0, // Will be populated when client management is implemented
        recentActivity
      });
    } catch (error) {
      console.error("Error fetching site data:", error);
      res.status(500).json({ error: "Failed to fetch site data" });
    }
  });

  // Admin clients endpoints
  app.get("/api/admin/clients", authenticateAdmin, async (req, res) => {
    try {
      // Demo clients data - in production, fetch from database
      const demoClients = [
        {
          id: 1,
          businessName: "TechStart Solutions",
          contactName: "Sarah Johnson",
          email: "sarah@techstart.com",
          phone: "+1 (555) 123-4567",
          industry: "SaaS",
          status: "active",
          monthlyRevenue: 150000,
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
          monthlyRevenue: 85000,
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

  app.post("/api/admin/clients", authenticateAdmin, async (req, res) => {
    try {
      const clientData = req.body;
      // In production, save to database
      const newClient = {
        id: Date.now(),
        ...clientData,
        createdAt: new Date().toISOString()
      };
      console.log("New client added:", newClient);
      res.json(newClient);
    } catch (error) {
      console.error("Error adding client:", error);
      res.status(500).json({ error: "Failed to add client" });
    }
  });

  app.put("/api/admin/clients/:id", authenticateAdmin, async (req, res) => {
    try {
      const clientId = req.params.id;
      const clientData = req.body;
      // In production, update in database
      console.log(`Client ${clientId} updated:`, clientData);
      res.json({ id: clientId, ...clientData });
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  // Admin meetings endpoints
  app.get("/api/admin/meetings", authenticateAdmin, async (req, res) => {
    try {
      // Demo meetings data - in production, fetch from database
      const demoMeetings = [
        {
          id: 1,
          clientId: 1,
          clientName: "TechStart Solutions",
          title: "Q3 Strategy Review",
          type: "video",
          platform: "google-meet",
          meetingLink: "https://meet.google.com/abc-defg-hij",
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
          platform: "phone",
          meetingLink: "+61-2-9876-5432",
          date: "2025-07-08T13:00:00Z",
          duration: 30,
          status: "completed",
          notes: "Discussed current marketing challenges. Client interested in social media expansion.",
          createdAt: "2025-07-03T14:30:00Z"
        },
        {
          id: 3,
          clientId: 3,
          clientName: "Fitness First Melbourne",
          title: "Marketing Audit Review",
          type: "video",
          platform: "calendly",
          calendlyEventUrl: "https://calendly.com/boostroi/marketing-audit",
          date: "2025-07-12T10:00:00Z",
          duration: 45,
          status: "scheduled",
          notes: "Client to book via Calendly for convenient scheduling.",
          createdAt: "2025-07-06T09:15:00Z"
        }
      ];
      res.json(demoMeetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ error: "Failed to fetch meetings" });
    }
  });

  app.post("/api/admin/meetings", authenticateAdmin, async (req, res) => {
    try {
      const meetingData = req.body;
      // In production, save to database
      const newMeeting = {
        id: Date.now(),
        ...meetingData,
        status: "scheduled",
        createdAt: new Date().toISOString()
      };
      console.log("New meeting scheduled:", newMeeting);
      res.json(newMeeting);
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      res.status(500).json({ error: "Failed to schedule meeting" });
    }
  });

  // Admin content management endpoints
  app.get("/api/admin/content", authenticateAdmin, async (req, res) => {
    try {
      // Demo content sections - in production, fetch from database
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

  app.put("/api/admin/content/:id", authenticateAdmin, async (req, res) => {
    try {
      const contentId = req.params.id;
      const contentData = req.body;
      // In production, update in database
      const updatedContent = {
        id: contentId,
        ...contentData,
        lastUpdated: new Date().toISOString()
      };
      console.log(`Content ${contentId} updated:`, updatedContent);
      res.json(updatedContent);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  // Import SendGrid service
  const { sendGridService } = await import('./sendgrid-service.js');
  
  // Initialize SendGrid if API key is available
  if (process.env.SENDGRID_API_KEY) {
    const config = {
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.FROM_EMAIL || 'hello@boostroi.agency',
      fromName: process.env.FROM_NAME || 'BoostROI Agency'
    };
    sendGridService.initialize(config);
  }

  // Email Management Endpoints
  app.get("/api/admin/email/templates", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(200).json([]);
      }
      const templates = await sendGridService.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      res.status(500).json({ error: "Failed to fetch email templates" });
    }
  });

  app.post("/api/admin/email/templates", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(503).json({ error: "SendGrid not configured" });
      }
      const { name, type } = req.body;
      const template = await sendGridService.createTemplate(name, type);
      res.json(template);
    } catch (error) {
      console.error("Error creating email template:", error);
      res.status(500).json({ error: "Failed to create email template" });
    }
  });

  app.get("/api/admin/email/lists", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(200).json([]);
      }
      const lists = await sendGridService.getContactLists();
      res.json(lists);
    } catch (error) {
      console.error("Error fetching contact lists:", error);
      res.status(500).json({ error: "Failed to fetch contact lists" });
    }
  });

  app.post("/api/admin/email/lists", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(503).json({ error: "SendGrid not configured" });
      }
      const { name } = req.body;
      const list = await sendGridService.createContactList(name);
      res.json(list);
    } catch (error) {
      console.error("Error creating contact list:", error);
      res.status(500).json({ error: "Failed to create contact list" });
    }
  });

  app.post("/api/admin/email/lists/:listId/contacts", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(503).json({ error: "SendGrid not configured" });
      }
      const { listId } = req.params;
      const { email, firstName, lastName } = req.body;
      const success = await sendGridService.addContactToList(listId, email, firstName, lastName);
      res.json({ success });
    } catch (error) {
      console.error("Error adding contact to list:", error);
      res.status(500).json({ error: "Failed to add contact to list" });
    }
  });

  app.get("/api/admin/email/campaigns", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(200).json([]);
      }
      const campaigns = await sendGridService.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/admin/email/campaigns", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(503).json({ error: "SendGrid not configured" });
      }
      const campaignData = req.body;
      const campaign = await sendGridService.createCampaign(campaignData);
      res.json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  app.post("/api/admin/email/campaigns/:campaignId/send", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(503).json({ error: "SendGrid not configured" });
      }
      const { campaignId } = req.params;
      const { sendAt } = req.body;
      const success = await sendGridService.sendCampaign(parseInt(campaignId), sendAt);
      res.json({ success });
    } catch (error) {
      console.error("Error sending campaign:", error);
      res.status(500).json({ error: "Failed to send campaign" });
    }
  });

  app.post("/api/admin/email/send", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(503).json({ error: "SendGrid not configured" });
      }
      const emailParams = req.body;
      const success = await sendGridService.sendEmail(emailParams);
      res.json({ success });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.get("/api/admin/email/stats", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(200).json(null);
      }
      const { startDate, endDate } = req.query;
      const stats = await sendGridService.getEmailStats(startDate as string, endDate as string);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching email stats:", error);
      res.status(500).json({ error: "Failed to fetch email stats" });
    }
  });

  app.get("/api/admin/email/senders", authenticateAdmin, async (req, res) => {
    try {
      if (!sendGridService.isInitialized()) {
        return res.status(200).json([]);
      }
      const senders = await sendGridService.getSenders();
      res.json(senders);
    } catch (error) {
      console.error("Error fetching senders:", error);
      res.status(500).json({ error: "Failed to fetch senders" });
    }
  });

  // Routes registered successfully
}
