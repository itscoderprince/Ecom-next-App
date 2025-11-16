import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    cookieStore.delete("access_token");

    return response(true, 200, "Logout successfully.");
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
}
