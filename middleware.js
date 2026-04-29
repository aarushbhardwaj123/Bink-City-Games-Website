import NextAuth from "next-auth";
import authConfig from "./lib/auth.config.js";

const { auth } = NextAuth(authConfig);

export { auth as middleware };

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/order/:path*",
    "/admin/:path*",
    "/verify/:path*",
  ],
};
