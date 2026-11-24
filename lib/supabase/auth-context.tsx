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
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; user?: User | null }>;
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

  // Roles come only from the protected profiles row; user-editable auth metadata is display-only.
  const fetchProfile = async (currentUser: User): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,full_name,role,jurisdiction_sector")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) {
        console.warn("Could not load user profile:", error.message);
        setProfile(null);
        return null;
      }

      if (data) {
        const allowedRoles = ["admin", "hydrologist", "operator", "citizen"];
        if (!allowedRoles.includes(data.role)) {
          console.warn("The account profile has an unsupported role.");
          setProfile(null);
          return null;
        }

        const trustedProfile = data as UserProfile;
        setProfile(trustedProfile);
        return trustedProfile;
      }
    } catch (err) {
      console.warn("Profile fetch error:", err);
    }

    setProfile(null);
    return null;
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
      const userProfile = await fetchProfile(data.user);
      setIsLoading(false);
      if (!userProfile) {
        return {
          error: new Error("Your account was authenticated, but its SURAKSHA profile could not be verified. Please contact an administrator."),
        };
      }
      return { error: null, role: userProfile.role };
    }

    setIsLoading(false);
    return { error: new Error("Authentication did not return an account that SURAKSHA could verify.") };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
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

  const signInWithGoogle = async (redirectTo?: string) => {
    setIsLoading(true);
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL || "https://suraksha-nine-wheat.vercel.app");

    const destination = redirectTo || `${origin}/auth/callback?next=/citizen`;

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

  const computedRole = profile?.role || "guest";

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

