import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

interface AuthResponse {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  token: string;
  message?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" }
      },
      // app/api/auth/[...nextauth]/route.ts
async authorize(credentials) {
  try {
    const response = await fetch("https://akil-backend.onrender.com/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email: credentials?.email,
        password: credentials?.password
      })
    });

    // Debugging: Log raw response
    console.log("Raw response:", {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text().then(t => {
        try { return JSON.parse(t) } 
        catch { return t }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.token) {
      throw new Error("API response missing authentication token");
    }

    return {
      id: data.id,
      name: data.name || credentials?.email?.split('@')[0],
      email: credentials?.email,
      token: data.token,
      role: data.role || "user"
    };
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Authentication failed"
    );
  }
}
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Handle Google provider
        if (account.provider === "google") {
          try {
            // Link or create user in your database
            const response = await fetch("https://akil-backend.onrender.com/google-auth", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                providerId: user.id
              })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
              throw new Error(data.message || "Google authentication failed");
            }

            token.accessToken = account.access_token;
            token.id = data.id || user.id;
            token.role = data.role || "user";
          } catch (error) {
            console.error("Google auth error:", error);
            throw error;
          }
        }
        
        // Handle credentials provider
        if (account.provider === "credentials" && 'token' in user) {
          token.accessToken = user.token;
          token.role = user.role;
          token.id = user.id;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          // Additional Google sign-in validation if needed
          return true;
        }
        return true; // For credentials provider
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/signup"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 6 * 60 * 60, // 6 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    }
  },
  events: {
    async signIn(message) {
      console.log("User signed in", message.user?.email);
    },
    async signOut(message) {
      console.log("User signed out", message.session?.user?.email);
    },
    async createUser(message) {
      console.log("User created", message.user.email);
    },
    async linkAccount(message) {
      console.log("Account linked", message.user.email);
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };