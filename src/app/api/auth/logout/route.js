// import { connectDB } from "@/lib/db";
// import { catchError, response } from "@/lib/helperFunction";
// import { cookies } from "next/headers";

// export async function POST() {
//   try {
//     await connectDB();
//     const cookieStore = await cookies();
//     cookieStore.delete("access_token");

//     return response(true, 200, "Logout successfully.");
//   } catch (error) {
//     console.log(error);
//     return catchError(error);
//   }
// }

import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST() {
  try {
    await connectDB();

    const cookieStore = cookies();

    // Clear access token securely
    cookieStore.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", 
      expires: new Date(0),
    });

    return response(true, 200, "LOGOUT_SUCCESSFUL");
  } catch (error) {
    return catchError(error);
  }
}
