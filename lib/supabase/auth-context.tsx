"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "./client";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "hydrologist" | "operator" | "citizen";
  jurisdiction_sector?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: "admin" | "hydrologist" | "operator" | "citizen" | "guest";
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; role?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: "citizen" | "admin" | "operator" | "hydrologist"
  ) => Promise<{ error: Error | null; user?: User | null }>;
  signInDemo: (targetRole: "admin" | "citizen") => Promise<{ error: Error | null; role: string }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null; url?: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch or create profile for authenticated user
  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) {
        console.warn("Could not load user profile:", error.message);
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Fallback or upsert if trigger did not execute
        const defaultRole =
          (currentUser.user_metadata?.role as UserProfile["role"]) ||
          (currentUser.email?.includes("admin") || currentUser.email?.includes("operator")
            ? "admin"
            : "citizen");

        const fallbackProfile: UserProfile = {
          id: currentUser.id,
          email: currentUser.email || null,
          full_name:
            currentUser.user_metadata?.full_name ||
            currentUser.email?.split("@")[0] ||
            "Authorized User",
          role: defaultRole,
          jurisdiction_sector: defaultRole === "admin" ? "Ganga Basin Command" : "Patna Reach",
        };

        const { data: upserted } = await supabase
          .from("profiles")
          .upsert(fallbackProfile)
          .select()
          .single();

        setProfile((upserted as UserProfile) || fallbackProfile);
      }
    } catch (err) {
      console.warn("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchProfile(currentUser).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return { error };
    }

    if (data.user) {
      await fetchProfile(data.user);
      const userRole = (data.user.user_metadata?.role as string) || "citizen";
      setIsLoading(false);
      return { error: null, role: userRole };
    }

    setIsLoading(false);
    return { error: null };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    targetRole: "citizen" | "admin" | "operator" | "hydrologist" = "citizen"
  ) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: targetRole,
        },
      },
    });

    if (error) {
      setIsLoading(false);
      return { error };
    }

    if (data.user) {
      await fetchProfile(data.user);
    }

    setIsLoading(false);
    return { error: null, user: data.user };
  };

  // Demo Sign In: allows immediate one-click testing for duty hydrologist / admin or verified citizen
  const signInDemo = async (targetRole: "admin" | "citizen") => {
    setIsLoading(true);
    const demoEmail =
      targetRole === "admin" ? "duty.commander@suraksha.in" : "citizen.patna@suraksha.in";
    const demoPassword = "SurakshaSecure2026!";
    const demoName = targetRole === "admin" ? "Duty Commander (Dr. A. Verma)" : "Patna Citizen Resident";

    let authUser: User | null = null;

    // Try signing in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    if (!signInError && signInData?.user) {
      authUser = signInData.user;
    } else {
      // If account doesn't exist yet, auto sign up
      const signUpRes = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            full_name: demoName,
            role: targetRole,
          },
        },
      });

      if (!signUpRes.error && signUpRes.data?.user) {
        authUser = signUpRes.data.user;
      }
    }

    if (!authUser) {
      // If Supabase requires email verification or rate limits, simulate active profile fallback
      const mockProfile: UserProfile = {
        id: `demo-${targetRole}-id`,
        email: demoEmail,
        full_name: demoName,
        role: targetRole,
        jurisdiction_sector: targetRole === "admin" ? "Ganga Basin Command" : "Patna Reach",
      };
      setProfile(mockProfile);
      setIsLoading(false);
      return { error: null, role: targetRole };
    }

    await fetchProfile(authUser);
    setIsLoading(false);
    return { error: null, role: targetRole };
  };

  const signInWithGoogle = async (redirectTo?: string) => {
    setIsLoading(true);
    const destination =
      redirectTo ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "https://suraksha-nine-wheat.vercel.app/auth/callback");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: destination,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setIsLoading(false);
      return { error, url: null };
    }

    return { error: null, url: data?.url || null };
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("suraksha_auth");
    }
    setIsLoading(false);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const computedRole = profile?.role || (user ? "citizen" : "guest");

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role: computedRole,
        isLoading,
        signIn,
        signUp,
        signInDemo,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

