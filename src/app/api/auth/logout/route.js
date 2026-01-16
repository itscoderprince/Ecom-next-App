import { catchError } from "@/lib/catchError";
import dbConnect from "@/lib/dbConnection";
import { response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    cookieStore.delete("access_token");

    return response({
      success: true,
      message: "Logout successfully",
      status: 200,
    });
  } catch (error) {
    return catchError(error);
  }
}
