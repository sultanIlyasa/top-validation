import React from "react";
interface CompanyDashboardProps {
  data: any;
}

export default function CompanyDashboard({ data }: CompanyDashboardProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Company Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Company-specific components */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-2">Company Stats</h3>
          <p className="text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus,
            vel eius commodi consectetur tempora, molestiae maiores, quasi quia
            laborum ipsa rem dolores? Sequi ducimus temporibus in itaque
            accusamus rem a.
          </p>
        </div>
        {/* Add more company components */}
      </div>
    </div>
  );
}
