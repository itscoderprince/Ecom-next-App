import { connectDB } from "@/lib/db";
import { response, catchError } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { User } from "@/models/userModel";

export async function PUT(request) {
    try {
        await connectDB();

        const payload = await request.json();

        const validation = zSchema.pick({
            email: true,
            password: true,
        }).safeParse(payload);

        if (!validation.success)
            return response(false, 400, "Invalid or missing input fields!");

        const { email, password } = validation.data;

        const user = await User.findOne({ email, deletedAt: null }).select("+password");
        if (!user)
            return response(false, 404, "User not found!");

        user.password = password;
        await user.save();

        return response(true, 200, "Password updated successfully!");

    } catch (error) {
        return catchError(error);
    }
}
