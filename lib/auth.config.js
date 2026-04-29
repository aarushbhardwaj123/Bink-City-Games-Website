/**
 * Edge-safe Auth.js config (no Prisma, no Node-only providers).
 * Used by middleware. Full auth with Credentials lives in auth.js.
 */
export default {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
};
