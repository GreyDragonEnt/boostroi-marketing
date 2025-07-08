import { MailService } from '@sendgrid/mail';

let mailService: MailService | null = null;

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

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!initializeMailService()) {
    console.warn(`Email not sent to ${params.to} - SendGrid not configured`);
    return false;
  }

  try {
    const emailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
    };

    if (params.html) {
      emailData.html = params.html;
    }
    if (params.text) {
      emailData.text = params.text;
    }

    await mailService!.send(emailData as any);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Email templates
export const emailTemplates = {
  roiAuditConfirmation: (businessName: string, contactName: string) => ({
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

  caseStudyConfirmation: (businessName: string, contactName: string) => ({
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

  weeklyMarketingConfirmation: (businessName: string, contactName: string) => ({
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

  leadCaptureConfirmation: (email: string) => ({
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

  newsletterConfirmation: (email: string) => ({
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