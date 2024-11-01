import React from "react";

interface AnalystDashboardProps {
  data: any;
}
export default function AnalystDashboard({ data }: AnalystDashboardProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analyst Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Analyst-specific components */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-2">Analyst Stats</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est unde
            molestias nihil, dolorem atque iste quia et quam, sunt labore odit
            voluptas adipisci magnam iusto expedita veniam quibusdam provident
            eos.
          </p>
        </div>
        {/* Add more Analyst components */}
      </div>
    </div>
  );
}
