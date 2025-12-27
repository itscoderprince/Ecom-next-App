"use client";

import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { stats } from "@/constant/adminConstant";

const CountOverview = () => {
  const { data, loading } = useFetch("/api/dashboard/admin/count");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <Link href={item.link || "#"} key={index} className="block group">
          <div
            className={`relative overflow-hidden flex items-center justify-between p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300
            bg-white dark:bg-card dark:border-gray-800 h-full`}
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${item.colors.bg}`}
            />

            {/* Left */}
            <div className="flex flex-col gap-1 z-10">
              <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 uppercase tracking-wider">{item.title}</h4>

              <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {loading ? (
                  <Spinner className="h-6 w-6 text-primary" />
                ) : (
                  (data?.data?.[item.key] ?? 0)
                )}
              </span>
            </div>

            {/* Right Icon */}
            <div
              className={`w-12 h-12 text-white flex justify-center items-center rounded-full shadow-sm ${item.colors.bg} group-hover:scale-110 transition-transform duration-300`}
            >
              <item.icon size={24} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CountOverview;
