import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Users, Mail, BarChart3, Settings, LogOut, Plus, Edit3, Calendar as CalendarIcon, Phone, Video, ExternalLink, Link, MessageSquare } from "lucide-react";
import { format, parseISO } from "date-fns";
import AdminLogin from "@/components/admin-login";
import CalendlyModal from "@/components/calendly-modal";

interface User {
  id: number;
  username: string;
  email?: string;
}

interface Client {
  id: number;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry?: string;
  status: "prospect" | "active" | "inactive";
  monthlyRevenue?: number;
  lastContact?: string;
  notes?: string;
  createdAt: string;
}

interface Meeting {
  id: number;
  clientId: number;
  clientName: string;
  title: string;
  type: "call" | "video" | "in-person";
  platform?: "google-meet" | "zoom" | "teams" | "skype" | "discord" | "phone" | "calendly";
  meetingLink?: string;
  calendlyEventUrl?: string;
  date: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

interface SiteData {
  totalLeads: number;
  newsletterSubscribers: number;
  roiCalculations: number;
  activeClients: number;
  recentActivity: any[];
}

interface EmailData {
  total: number;
  byType: {
    newsletter: number;
    lead: number;
    'roi-calculation': number;
    audit: number;
    'case-study': number;
  };
  emails: any[];
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

interface EmailCampaign {
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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for existing authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const user = localStorage.getItem("admin_user");
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setAuthToken(token);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }
  }, []);

  const handleLogin = (token: string, user: User) => {
    setAuthToken(token);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // API calls with authentication
  const authenticatedRequest = async (method: string, endpoint: string, data?: any) => {
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        throw new Error("Session expired");
      }
      throw new Error(await response.text());
    }
    
    return response.json();
  };

  // Queries
  const { data: siteData } = useQuery({
    queryKey: ["/api/admin/site-data"],
    queryFn: () => authenticatedRequest("GET", "/api/admin/site-data"),
    enabled: isAuthenticated,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/admin/clients"],
    queryFn: () => authenticatedRequest("GET", "/api/admin/clients"),
    enabled: isAuthenticated,
  });

  const { data: meetings = [] } = useQuery({
    queryKey: ["/api/admin/meetings"],
    queryFn: () => authenticatedRequest("GET", "/api/admin/meetings"),
    enabled: isAuthenticated,
  });

  // Email Management Queries
  const { data: emailTemplates = [] } = useQuery({
    queryKey: ["/api/admin/email/templates"],
    queryFn: () => authenticatedRequest("GET", "/api/admin/email/templates"),
    enabled: isAuthenticated,
  });

  const { data: contactLists = [] } = useQuery({
    queryKey: ["/api/admin/email/lists"],
    queryFn: () => authenticatedRequest("GET", "/api/admin/email/lists"),
    enabled: isAuthenticated,
  });

  const { data: emailCampaigns = [] } = useQuery({
    queryKey: ["/api/admin/email/campaigns"],
    queryFn: () => authenticatedRequest("GET", "/api/admin/email/campaigns"),
    enabled: isAuthenticated,
  });

  const { data: emailStats } = useQuery({
    queryKey: ["/api/admin/email/stats"],
    queryFn: () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return authenticatedRequest("GET", `/api/admin/email/stats?startDate=${startDate}&endDate=${endDate}`);
    },
    enabled: isAuthenticated,
  });

  // Mutations
  const addClientMutation = useMutation({
    mutationFn: (client: Partial<Client>) => authenticatedRequest("POST", "/api/admin/clients", client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-data"] });
      setIsAddClientOpen(false);
      toast({ title: "Success", description: "Client added successfully" });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, ...client }: Partial<Client> & { id: number }) => 
      authenticatedRequest("PUT", `/api/admin/clients/${id}`, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      setEditingClient(null);
      toast({ title: "Success", description: "Client updated successfully" });
    },
  });

  const addMeetingMutation = useMutation({
    mutationFn: (meeting: Partial<Meeting>) => authenticatedRequest("POST", "/api/admin/meetings", meeting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/meetings"] });
      setIsAddMeetingOpen(false);
      toast({ title: "Success", description: "Meeting scheduled successfully" });
    },
  });

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BoostROI Admin</h1>
            <p className="text-sm text-gray-600">Welcome back, {currentUser?.username}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="meetings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Meetings
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Data
            </TabsTrigger>
            <TabsTrigger value="email-management" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Email Management
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{siteData?.totalLeads || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{siteData?.newsletterSubscribers || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ROI Calculations</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{siteData?.roiCalculations || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clients.filter((c: Client) => c.status === 'active').length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {siteData?.recentActivity?.length > 0 ? (
                    siteData.recentActivity.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm">
                          <p className="font-medium">{activity.type}</p>
                          <p className="text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Client Management</h2>
              <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>Enter the client details below.</DialogDescription>
                  </DialogHeader>
                  <ClientForm onSubmit={(data) => addClientMutation.mutate(data)} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {clients.map((client: Client) => (
                <Card key={client.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{client.businessName}</CardTitle>
                        <CardDescription>
                          {client.contactName} • {client.email}
                          {client.phone && ` • ${client.phone}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingClient(client)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Industry:</span> {client.industry || 'Not specified'}
                      </div>
                      <div>
                        <span className="font-medium">Monthly Revenue:</span> {client.monthlyRevenue ? `$${client.monthlyRevenue.toLocaleString()}` : 'Not specified'}
                      </div>
                      <div>
                        <span className="font-medium">Last Contact:</span> {client.lastContact ? format(parseISO(client.lastContact), 'MMM d, yyyy') : 'Never'}
                      </div>
                      <div>
                        <span className="font-medium">Client Since:</span> {format(parseISO(client.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                    {client.notes && (
                      <div className="mt-4">
                        <span className="font-medium text-sm">Notes:</span>
                        <p className="text-sm text-gray-600 mt-1">{client.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Client Dialog */}
            <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Client</DialogTitle>
                  <DialogDescription>Update the client details below.</DialogDescription>
                </DialogHeader>
                {editingClient && (
                  <ClientForm 
                    initialData={editingClient}
                    onSubmit={(data) => updateClientMutation.mutate({ ...data, id: editingClient.id })} 
                  />
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Meeting Management</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCalendlyOpen(true)}
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Quick Calendly
                </Button>
                <Dialog open={isAddMeetingOpen} onOpenChange={setIsAddMeetingOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Schedule New Meeting</DialogTitle>
                      <DialogDescription>Schedule a meeting with a client using various platforms or Calendly.</DialogDescription>
                    </DialogHeader>
                    <MeetingForm 
                      clients={clients}
                      onSubmit={(data) => addMeetingMutation.mutate(data)} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-4">
              {meetings.map((meeting: Meeting) => (
                <Card key={meeting.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {meeting.type === 'call' && <Phone className="h-4 w-4" />}
                          {meeting.type === 'video' && <Video className="h-4 w-4" />}
                          {meeting.type === 'in-person' && <CalendarIcon className="h-4 w-4" />}
                          {meeting.title}
                        </CardTitle>
                        <CardDescription>
                          {meeting.clientName} • {format(parseISO(meeting.date), 'PPP p')} • {meeting.duration} min
                          {meeting.platform && (
                            <span className={`ml-2 inline-flex items-center gap-1 ${getPlatformDisplay(meeting.platform).color}`}>
                              • {getPlatformDisplay(meeting.platform).emoji} {getPlatformDisplay(meeting.platform).name}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={meeting.status === 'completed' ? 'default' : meeting.status === 'scheduled' ? 'secondary' : 'destructive'}>
                          {meeting.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Meeting Links */}
                      {meeting.calendlyEventUrl && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <CalendarIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Calendly Event:</span>
                          <a 
                            href={meeting.calendlyEventUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                          >
                            Open Calendly <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      
                      {meeting.meetingLink && !meeting.calendlyEventUrl && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <Link className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Meeting Link:</span>
                          <a 
                            href={meeting.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline text-sm flex items-center gap-1"
                          >
                            Join Meeting <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      {/* Notes */}
                      {meeting.notes && (
                        <div>
                          <span className="font-medium text-sm">Notes:</span>
                          <p className="text-sm text-gray-600 mt-1">{meeting.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Email Data Tab */}
          <TabsContent value="emails" className="space-y-6">
            <EmailDataSection />
          </TabsContent>

          {/* Email Management Tab */}
          <TabsContent value="email-management" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">SendGrid Email Management</h2>
              <Badge variant="outline" className="text-xs">
                SendGrid Integration
              </Badge>
            </div>

            {/* Email Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Templates</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{emailTemplates.length}</div>
                  <p className="text-xs text-muted-foreground">Active email templates</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contact Lists</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contactLists.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {contactLists.reduce((sum: number, list: ContactList) => sum + list.contact_count, 0)} total contacts
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{emailCampaigns.length}</div>
                  <p className="text-xs text-muted-foreground">Newsletter campaigns</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {emailStats ? `${Math.round((emailStats.delivered / emailStats.requests) * 100)}%` : '—'}
                  </div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Email Management Sections */}
            <Tabs defaultValue="templates" className="space-y-4">
              <TabsList>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="lists">Contact Lists</TabsTrigger>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="composer">Send Email</TabsTrigger>
              </TabsList>

              {/* Email Templates */}
              <TabsContent value="templates" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Email Templates</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
                <div className="grid gap-4">
                  {emailTemplates.map((template: EmailTemplate) => (
                    <Card key={template.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription>
                              {template.versions?.length || 0} versions • Updated {format(parseISO(template.updated_at), 'MMM d, yyyy')}
                            </CardDescription>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-600">
                          Subject: {template.subject || 'No subject set'}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {emailTemplates.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No email templates found</p>
                        <p className="text-sm text-gray-400">Create your first template to get started</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Contact Lists */}
              <TabsContent value="lists" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Contact Lists</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New List
                  </Button>
                </div>
                <div className="grid gap-4">
                  {contactLists.map((list: ContactList) => (
                    <Card key={list.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{list.name}</CardTitle>
                            <CardDescription>
                              {list.contact_count} contacts • Created {format(parseISO(list.created_at), 'MMM d, yyyy')}
                            </CardDescription>
                          </div>
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                  {contactLists.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No contact lists found</p>
                        <p className="text-sm text-gray-400">Create your first list to organize your contacts</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Email Campaigns */}
              <TabsContent value="campaigns" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Newsletter Campaigns</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Campaign
                  </Button>
                </div>
                <div className="grid gap-4">
                  {emailCampaigns.map((campaign: EmailCampaign) => (
                    <Card key={campaign.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{campaign.title}</CardTitle>
                            <CardDescription>
                              Subject: {campaign.subject} • Status: {campaign.status}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={campaign.status === 'sent' ? 'default' : 'secondary'}>
                              {campaign.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-600">
                          Lists: {campaign.list_ids?.length || 0} • Created {format(parseISO(campaign.created_at), 'MMM d, yyyy')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {emailCampaigns.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-8">
                        <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No campaigns found</p>
                        <p className="text-sm text-gray-400">Create your first newsletter campaign</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Email Composer */}
              <TabsContent value="composer" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Send Email</h3>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Compose Email</CardTitle>
                    <CardDescription>Send individual emails to clients or prospects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmailComposerForm />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

        </Tabs>
      </div>

      {/* Calendly Modal */}
      <CalendlyModal 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />
    </div>
  );
}

// Client Form Component
function ClientForm({ initialData, onSubmit }: { initialData?: Client; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    businessName: initialData?.businessName || "",
    contactName: initialData?.contactName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    industry: initialData?.industry || "",
    status: initialData?.status || "prospect",
    monthlyRevenue: initialData?.monthlyRevenue || "",
    notes: initialData?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      monthlyRevenue: formData.monthlyRevenue ? parseInt(formData.monthlyRevenue.toString()) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="contactName">Contact Name</Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>        <Select value={formData.status} onValueChange={(value: "prospect" | "active" | "inactive") => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
            <SelectContent>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
        <Input
          id="monthlyRevenue"
          type="number"
          value={formData.monthlyRevenue}
          onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>
      
      <Button type="submit" className="w-full">
        {initialData ? "Update Client" : "Add Client"}
      </Button>
    </form>
  );
}

// Meeting Form Component
function MeetingForm({ clients, onSubmit }: { clients: Client[]; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    clientId: "",
    title: "",
    type: "video",
    platform: "google-meet",
    meetingLink: "",
    useCalendly: false,
    calendlyEventUrl: "",
    date: "",
    duration: "30",
    notes: "",
  });

  const platformOptions = [
    { value: "google-meet", label: "Google Meet", icon: "🎥" },
    { value: "zoom", label: "Zoom", icon: "💻" },
    { value: "teams", label: "Microsoft Teams", icon: "👥" },
    { value: "skype", label: "Skype", icon: "📞" },
    { value: "discord", label: "Discord", icon: "🎮" },
    { value: "phone", label: "Phone Call", icon: "📱" },
  ];

  const generateMeetingLink = (platform: string) => {
    const baseUrls = {
      "google-meet": "https://meet.google.com/new",
      "zoom": "https://zoom.us/j/",
      "teams": "https://teams.microsoft.com/l/meetup-join/",
      "skype": "https://join.skype.com/",
      "discord": "https://discord.gg/",
    };
    return baseUrls[platform as keyof typeof baseUrls] || "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      clientId: parseInt(formData.clientId),
      duration: parseInt(formData.duration),
    };

    // Auto-generate meeting link if not provided and not using Calendly
    if (!formData.useCalendly && !formData.meetingLink && formData.type === "video") {
      submitData.meetingLink = generateMeetingLink(formData.platform);
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="clientId">Client</Label>
        <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client: Client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.businessName} - {client.contactName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="title">Meeting Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Meeting Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Phone Call</SelectItem>
              <SelectItem value="video">Video Call</SelectItem>
              <SelectItem value="in-person">In Person</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Calendly Integration Option */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="useCalendly"
          checked={formData.useCalendly}
          onChange={(e) => setFormData({ ...formData, useCalendly: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="useCalendly" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Use Calendly for scheduling
        </Label>
      </div>

      {formData.useCalendly ? (
        <div>
          <Label htmlFor="calendlyEventUrl">Calendly Event URL</Label>
          <Input
            id="calendlyEventUrl"
            value={formData.calendlyEventUrl}
            onChange={(e) => setFormData({ ...formData, calendlyEventUrl: e.target.value })}
            placeholder="https://calendly.com/your-username/meeting-type"
          />
          <p className="text-sm text-gray-500 mt-1">
            The client will be directed to this Calendly link to book the meeting
          </p>
        </div>
      ) : (
        <>
          {formData.type === "video" && (
            <div>
              <Label htmlFor="platform">Communication Platform</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(formData.type === "video" || formData.type === "call") && (
            <div>
              <Label htmlFor="meetingLink">Meeting Link (optional)</Label>
              <Input
                id="meetingLink"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder={formData.type === "video" ? "Auto-generated if left empty" : "Phone number or dial-in details"}
              />
            </div>
          )}

          <div>
            <Label htmlFor="date">Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
        </>
      )}
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>
      
      <Button type="submit" className="w-full">
        {formData.useCalendly ? "Create Calendly Meeting" : "Schedule Meeting"}
      </Button>
    </form>
  );
}

// Content Form Component
// Email Data Section Component
function EmailDataSection() {
  const { data: emailData } = useQuery<EmailData>({
    queryKey: ["/api/test-emails"],
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Email Collection Data</h2>
      
      {emailData && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailData.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Newsletter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailData.byType.newsletter}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailData.byType.lead}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">ROI Calcs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailData.byType['roi-calculation']}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Audits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailData.byType.audit}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emailData.emails?.slice(0, 10).map((email: any) => (
                  <div key={email.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{email.email}</p>
                      <p className="text-sm text-gray-600">Type: {email.type}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(email.timestamp), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// Helper function to get platform display info
const getPlatformDisplay = (platform?: string) => {
  const platforms = {
    'google-meet': { emoji: '🎥', name: 'Google Meet', color: 'text-blue-600' },
    'zoom': { emoji: '💻', name: 'Zoom', color: 'text-blue-500' },
    'teams': { emoji: '👥', name: 'Microsoft Teams', color: 'text-purple-600' },
    'skype': { emoji: '📞', name: 'Skype', color: 'text-cyan-600' },
    'discord': { emoji: '🎮', name: 'Discord', color: 'text-indigo-600' },
    'phone': { emoji: '📱', name: 'Phone Call', color: 'text-green-600' },
    'calendly': { emoji: '📅', name: 'Calendly', color: 'text-orange-600' }
  };
  return platforms[platform as keyof typeof platforms] || { emoji: '📋', name: platform || 'Unknown', color: 'text-gray-600' };
};

// Email Composer Form Component
function EmailComposerForm() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    html: "",
    text: "",
    templateId: "",
  });

  const { toast } = useToast();

  const sendEmailMutation = useMutation({
    mutationFn: (emailData: any) => {
      return fetch("/api/admin/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(emailData),
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Email sent successfully" });
      setFormData({ to: "", subject: "", html: "", text: "", templateId: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send email", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmailMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="to">To Email</Label>
        <Input
          id="to"
          type="email"
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          placeholder="client@example.com"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Email subject"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="html">HTML Content</Label>
        <Textarea
          id="html"
          value={formData.html}
          onChange={(e) => setFormData({ ...formData, html: e.target.value })}
          placeholder="Email HTML content"
          rows={8}
          className="font-mono text-sm"
        />
      </div>
      
      <div>
        <Label htmlFor="text">Plain Text Content</Label>
        <Textarea
          id="text"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          placeholder="Email plain text content"
          rows={4}
        />
      </div>
      
      <Button type="submit" disabled={sendEmailMutation.isPending} className="w-full">
        {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
      </Button>
    </form>
  );
}
