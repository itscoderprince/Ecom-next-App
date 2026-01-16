"use client";

import { quickAddStats } from "@/constant/quickAddStats";
import Link from "next/link";
import React from "react";

const QuickAdd = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {quickAddStats.map((item, index) => (
        <Link href={item.link} key={index} className="block group">
          <div
            className={`relative overflow-hidden flex items-center justify-between p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300
            bg-gradient-to-r ${item.colors.gradient} text-white h-full`}
          >
            {/* Background Pattern/Overlay if needed, using simple opacity for now */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Left */}
            <h4 className="font-semibold text-lg z-10 text-white">
              {item.title}
            </h4>

            {/* Right Icon */}
            <div
              className={`w-12 h-12 flex justify-center items-center rounded-full bg-white/20 backdrop-blur-md shadow-sm group-hover:scale-110 transition-transform duration-300`}
            >
              <item.icon size={24} className="text-white" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickAdd;
