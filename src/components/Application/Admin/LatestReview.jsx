"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoStar } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock Data for Reviews
const reviewsData = [
  {
    id: 1,
    name: "Prince Kumar",
    rating: 5,
    comment: "Amazing product, highly recommended!",
    date: "2 mins ago",
    image: "https://github.com/shadcn.png",
  },
  {
    id: 2,
    name: "Anjali Sharma",
    rating: 4,
    comment: "Great quality, but delivery was a bit slow.",
    date: "1 hour ago",
    image: "",
  },
  {
    id: 3,
    name: "Rahul Verma",
    rating: 5,
    comment: "Exactly what I was looking for. Perfect fit.",
    date: "Yesterday",
    image: "",
  },
  {
    id: 4,
    name: "Sneha Kapur",
    rating: 3,
    comment: "It's okay, expected better material.",
    date: "2 days ago",
    image: "",
  },
  {
    id: 5,
    name: "Amit Singh",
    rating: 5,
    comment: "Best purchase of the year!",
    date: "3 days ago",
    image: "",
  },
  {
    id: 6,
    name: "Vikram Rathore",
    rating: 4,
    comment: "Very good service and support.",
    date: "Dec 24, 2025",
    image: "",
  },
  {
    id: 7,
    name: "Priya Das",
    rating: 5,
    comment: "Love the packaging and the product quality.",
    date: "Dec 23, 2025",
    image: "",
  },
  {
    id: 8,
    name: "Rohan Mehra",
    rating: 2,
    comment: "Not satisfied with the size.",
    date: "Dec 22, 2025",
    image: "",
  },
];

export function LatestReview() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination Logic
  const totalPages = Math.ceil(reviewsData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviewsData.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full space-y-4">
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[200px] text-muted-foreground font-semibold uppercase text-xs tracking-wider">
                User
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold uppercase text-xs tracking-wider">
                Review
              </TableHead>
              <TableHead className="text-muted-foreground font-semibold uppercase text-xs tracking-wider">
                Rating
              </TableHead>
              <TableHead className="text-right text-muted-foreground font-semibold uppercase text-xs tracking-wider">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentReviews.map((review) => (
              <TableRow
                key={review.id}
                className="border-b transition-colors hover:bg-muted/40"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={review.image} alt={review.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground whitespace-nowrap text-sm">
                      {review.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground line-clamp-1 italic">
                    "{review.comment}"
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <IoStar
                        key={index}
                        className={`text-sm ${index < review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted/30"
                          }`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-xs tabular-nums">
                  {review.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="text-white">{indexOfFirstItem + 1}</span> to{" "}
          <span className="text-white">
            {Math.min(indexOfLastItem, reviewsData.length)}
          </span>{" "}
          of {reviewsData.length} reviews
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 border-white/10 hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </Button>
          <div className="text-sm font-medium text-white px-2">
            {currentPage} / {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 border-white/10 hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
