import { NextResponse } from "next/server";

export const response = (success, status = 200, message = "", data = {}) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status } 
  );
};
