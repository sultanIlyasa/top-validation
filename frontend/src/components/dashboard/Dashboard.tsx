import React from "react";
import { useEffect, useState } from "react";
import {dashboardService} from "@/services/api";
import AnalystDashboard from "./AnalystDashboard";
import CompanyDashboard from "./CompanyDashboard";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle } from "lucide-react";

interface DashboardData {
  id: string;
  analystId?: string;
  companyId?: string;
  currentDate: Date;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let response;
        switch (user?.role) {
          case "ANALYST":
            response = await dashboardService.analyst.getDashboardData();
            break;
          case "COMPANY":
            response = await dashboardService.company.getDashboardData();
            break;
          default:
            throw new Error("Invalid user role");
        }
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <AlertCircle className="mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  switch (user?.role) {
    case "ANALYST":
      return <AnalystDashboard data={data} />;
    case "COMPANY":
      return <CompanyDashboard data={data} />;
    default:
      return null;
  }
}


