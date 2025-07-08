import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'test-data');
const EMAILS_FILE = path.join(DATA_DIR, 'emails.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface EmailEntry {
  id: number;
  email: string;
  type: 'newsletter' | 'lead' | 'roi-calculation' | 'audit' | 'case-study';
  data?: any;
  timestamp: string;
}

export class TestStorage {
  private getEmails(): EmailEntry[] {
    try {
      if (fs.existsSync(EMAILS_FILE)) {
        const content = fs.readFileSync(EMAILS_FILE, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error reading emails file:', error);
    }
    return [];
  }

  private saveEmails(emails: EmailEntry[]): void {
    try {
      fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
    } catch (error) {
      console.error('Error saving emails file:', error);
    }
  }

  addEmail(email: string, type: EmailEntry['type'], data?: any): EmailEntry {
    const emails = this.getEmails();
    const entry: EmailEntry = {
      id: Date.now(),
      email,
      type,
      data,
      timestamp: new Date().toISOString()
    };
    
    emails.push(entry);
    this.saveEmails(emails);
    console.log(`✅ Email stored: ${email} (${type})`);
    return entry;
  }

  getAllEmails(): EmailEntry[] {
    return this.getEmails();
  }

  getEmailsByType(type: EmailEntry['type']): EmailEntry[] {
    return this.getEmails().filter(entry => entry.type === type);
  }

  getEmailsByAddress(email: string): EmailEntry[] {
    return this.getEmails().filter(entry => entry.email === email);
  }
}

export const testStorage = new TestStorage();
