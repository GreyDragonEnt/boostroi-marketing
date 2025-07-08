import { MailService } from '@sendgrid/mail';
import sgClient from '@sendgrid/client';

interface SendGridConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  versions: Array<{
    id: string;
    subject: string;
    html_content: string;
    plain_content: string;
    active: number;
    updated_at: string;
  }>;
  updated_at: string;
}

interface ContactList {
  id: string;
  name: string;
  contact_count: number;
  created_at: string;
  updated_at: string;
}

interface NewsletterCampaign {
  id: number;
  title: string;
  subject: string;
  sender_id: number;
  list_ids: string[];
  html_content: string;
  plain_content: string;
  status: string;
  send_at?: string;
  created_at: string;
  updated_at: string;
}

class SendGridService {
  private mailService: MailService;
  private client: typeof sgClient;
  private config?: SendGridConfig;
  private initialized = false;

  constructor() {
    this.mailService = new MailService();
    this.client = sgClient;
  }

  initialize(config: SendGridConfig): boolean {
    try {
      this.config = config;
      this.mailService.setApiKey(config.apiKey);
      this.client.setApiKey(config.apiKey);
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize SendGrid service:', error);
      return false;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // Email Templates Management
  async getTemplates(): Promise<EmailTemplate[]> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const [response] = await this.client.request({
        url: '/v3/templates',
        method: 'GET',
      });
      
      return (response.body as any)?.templates || [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  }

  async getTemplate(templateId: string): Promise<EmailTemplate | null> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const [response] = await this.client.request({
        url: `/v3/templates/${templateId}`,
        method: 'GET',
      });
      
      return (response.body as any) || null;
    } catch (error) {
      console.error('Error fetching template:', error);
      return null;
    }
  }

  async createTemplate(name: string, type: string = 'legacy'): Promise<EmailTemplate | null> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const [response] = await this.client.request({
        url: '/v3/templates',
        method: 'POST',
        body: {
          name,
          generation: type
        }
      });
      
      return (response.body as any) || null;
    } catch (error) {
      console.error('Error creating template:', error);
      return null;
    }
  }

  // Contact Lists Management
  async getContactLists(): Promise<ContactList[]> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const [response] = await this.client.request({
        url: '/v3/marketing/lists',
        method: 'GET',
      });
      
      return (response.body as any)?.result || [];
    } catch (error) {
      console.error('Error fetching contact lists:', error);
      return [];
    }
  }

  async createContactList(name: string): Promise<ContactList | null> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const [response] = await this.client.request({
        url: '/v3/marketing/lists',
        method: 'POST',
        body: { name }
      });
      
      return (response.body as any) || null;
    } catch (error) {
      console.error('Error creating contact list:', error);
      return null;
    }
  }

  async addContactToList(listId: string, email: string, firstName?: string, lastName?: string): Promise<boolean> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const contact: any = {
        email,
        list_ids: [listId]
      };
      
      if (firstName) contact.first_name = firstName;
      if (lastName) contact.last_name = lastName;

      await this.client.request({
        url: '/v3/marketing/contacts',
        method: 'PUT',
        body: { contacts: [contact] }
      });
      
      return true;
    } catch (error) {
      console.error('Error adding contact to list:', error);
      return false;
    }
  }

  // Newsletter Campaigns
  async getCampaigns(): Promise<NewsletterCampaign[]> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const [response] = await this.client.request({
        url: '/v3/campaigns',
        method: 'GET',
      });
      
      return (response.body as any)?.result || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  async createCampaign(campaign: {
    title: string;
    subject: string;
    sender_id: number;
    list_ids: string[];
    html_content: string;
    plain_content: string;
  }): Promise<NewsletterCampaign | null> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const [response] = await this.client.request({
        url: '/v3/campaigns',
        method: 'POST',
        body: campaign
      });
      
      return (response.body as any) || null;
    } catch (error) {
      console.error('Error creating campaign:', error);
      return null;
    }
  }

  async sendCampaign(campaignId: number, sendAt?: string): Promise<boolean> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const body: any = {};
      if (sendAt) body.send_at = sendAt;

      await this.client.request({
        url: `/v3/campaigns/${campaignId}/schedules`,
        method: 'POST',
        body
      });
      
      return true;
    } catch (error) {
      console.error('Error sending campaign:', error);
      return false;
    }
  }

  // Send individual emails
  async sendEmail(params: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    templateId?: string;
    templateData?: Record<string, any>;
  }): Promise<boolean> {
    if (!this.initialized || !this.config) throw new Error('SendGrid service not initialized');
    
    try {
      const emailData: any = {
        to: params.to,
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName
        },
        subject: params.subject,
      };

      if (params.templateId) {
        emailData.templateId = params.templateId;
        if (params.templateData) {
          emailData.dynamicTemplateData = params.templateData;
        }
      } else {
        if (params.html) emailData.html = params.html;
        if (params.text) emailData.text = params.text;
      }

      await this.mailService.send(emailData);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Email Statistics
  async getEmailStats(startDate: string, endDate: string): Promise<any> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const [response] = await this.client.request({
        url: `/v3/stats?start_date=${startDate}&end_date=${endDate}`,
        method: 'GET',
      });
      
      return (response.body as any) || null;
    } catch (error) {
      console.error('Error fetching email stats:', error);
      return null;
    }
  }

  // Sender Identities
  async getSenders(): Promise<any[]> {
    if (!this.initialized) throw new Error('SendGrid service not initialized');
    
    try {
      const [response] = await this.client.request({
        url: '/v3/senders',
        method: 'GET',
      });
      
      return (response.body as any[]) || [];
    } catch (error) {
      console.error('Error fetching senders:', error);
      return [];
    }
  }
}

export const sendGridService = new SendGridService();
export { SendGridService, EmailTemplate, ContactList, NewsletterCampaign };
