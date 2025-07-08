import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface AdminRequest {
  id: number;
  businessName?: string;
  contactName?: string;
  email: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}

interface AdminData {
  roiAudits: AdminRequest[];
  caseStudyRequests: AdminRequest[];
  weeklyMarketingRequests: AdminRequest[];
  leads: AdminRequest[];
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("roi-audits");

  const { data: adminData, isLoading } = useQuery<AdminData>({
    queryKey: ["/api/admin/requests"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ type, id, status }: { type: string; id: number; status: string }) => {
      await apiRequest("PATCH", `/api/admin/${type}/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/requests"] });
      toast({
        title: "Status Updated",
        description: "Request status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update request status.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = (type: string, id: number, status: string) => {
    updateStatusMutation.mutate({ type, id, status });
  };

  const RequestCard = ({ 
    request, 
    type, 
    showBusinessName = true 
  }: { 
    request: AdminRequest; 
    type: string; 
    showBusinessName?: boolean; 
  }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {showBusinessName && request.businessName ? request.businessName : request.contactName || request.email}
            </CardTitle>
            <CardDescription>
              {request.email} • Created: {format(new Date(request.createdAt), "MMM d, yyyy")}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(request.status)}>
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Select
            value={request.status}
            onValueChange={(status) => handleStatusUpdate(type, request.id, status)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {request.completedAt && (
            <span className="text-sm text-gray-500 self-center">
              Completed: {format(new Date(request.completedAt), "MMM d, yyyy")}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Failed to load admin data</div>
        </div>
      </div>
    );
  }

  const totalRequests = 
    adminData.roiAudits.length + 
    adminData.caseStudyRequests.length + 
    adminData.weeklyMarketingRequests.length + 
    adminData.leads.length;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage client requests and inquiries</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">ROI Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.roiAudits.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Case Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.caseStudyRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Marketing Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.weeklyMarketingRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Request Management Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roi-audits">ROI Audits ({adminData.roiAudits.length})</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies ({adminData.caseStudyRequests.length})</TabsTrigger>
          <TabsTrigger value="marketing">Marketing ({adminData.weeklyMarketingRequests.length})</TabsTrigger>
          <TabsTrigger value="leads">Leads ({adminData.leads.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="roi-audits" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">ROI Audit Requests</h2>
            {adminData.roiAudits.length === 0 ? (
              <p className="text-gray-500">No ROI audit requests yet.</p>
            ) : (
              adminData.roiAudits.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  type="roi-audit"
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="case-studies" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Case Study Requests</h2>
            {adminData.caseStudyRequests.length === 0 ? (
              <p className="text-gray-500">No case study requests yet.</p>
            ) : (
              adminData.caseStudyRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  type="case-study"
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Weekly Marketing Requests</h2>
            {adminData.weeklyMarketingRequests.length === 0 ? (
              <p className="text-gray-500">No weekly marketing requests yet.</p>
            ) : (
              adminData.weeklyMarketingRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  type="weekly-marketing"
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Lead Captures</h2>
            {adminData.leads.length === 0 ? (
              <p className="text-gray-500">No leads captured yet.</p>
            ) : (
              adminData.leads.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  type="lead"
                  showBusinessName={false}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}