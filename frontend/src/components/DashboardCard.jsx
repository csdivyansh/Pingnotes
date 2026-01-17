import React from "react";

const colorClasses = {
  blue: "bg-gradient-to-br from-blue-400 to-blue-700",
  green: "bg-gradient-to-br from-green-400 to-green-700",
  yellow: "bg-gradient-to-br from-yellow-300 to-orange-500 text-slate-800",
  purple: "bg-gradient-to-br from-purple-400 to-purple-700",
  pink: "bg-gradient-to-br from-pink-400 to-pink-700",
  red: "bg-gradient-to-br from-red-400 to-red-700",
};

const DashboardCard = ({ title, count, iconClass, color }) => {
  return (
    <div
      className={`p-7 rounded-2xl text-white flex justify-between items-center shadow-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl ${colorClasses[color] || colorClasses.blue}`}
    >
      <div className="flex-1 mr-5">
        <p className="text-lg font-semibold mb-2 opacity-90">{title}</p>
        <h2 className="text-4xl font-extrabold m-0">{count}</h2>
      </div>
      <i className={`fas ${iconClass} text-3xl drop-shadow-md`}></i>
    </div>
  );
};

export default DashboardCard;
