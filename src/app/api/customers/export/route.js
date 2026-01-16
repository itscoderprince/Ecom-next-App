import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { User } from "@/models/userModel";

export async function GET(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) response(false, 403, "Unauthorize!");
    await connectDB();

    const filter = { deletedAt: null };

    const getCustomers = await User.find(filter).sort({ createdAt: -1 }).lean();
    if (!getCustomers) return response(false, 404, "Customers not found!");

    return response(true, 200, "Customers found!", getCustomers);
  } catch (error) {
    return catchError(error);
  }
}
