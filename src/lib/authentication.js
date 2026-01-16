import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const isAuthenticated = async (role) => {
    try {
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not configured.");
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return { isAuth: false, error: "TOKEN_NOT_FOUND" };
        }

        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.SECRET_KEY)
        );

        if (role && payload.role !== role) {
            return { isAuth: false, error: "ROLE_NOT_ALLOWED" };
        }

        return {
            isAuth: true,
            userId: payload._id,
            role: payload.role,
        };
    } catch (error) {
        console.error("isAuthenticated error:", error);
        return { isAuth: false, error };
    }
};