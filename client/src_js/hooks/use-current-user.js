import { useState, useEffect } from "react";

const DEFAULT_USER = {
    id: "",
    name: "Student",
    email: "",
    avatarInitials: "ST",
    streakDays: 0,
    focusScore: 0,
    sleepScore: 0,
    plan: "Free",
};

/** Read & parse nw_user from localStorage. Returns null if missing/invalid. */
function readStoredUser() {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem("nw_user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Returns the current logged-in user object.
 * Reactively syncs when localStorage changes (e.g. after login/register).
 */
export function useCurrentUser() {
    const [user, setUser] = useState(() => readStoredUser() || DEFAULT_USER);

    useEffect(() => {
        // Re-read on mount in case login happened before this component mounted
        const stored = readStoredUser();
        if (stored) setUser(stored);

        // Listen for storage changes (e.g. login from another tab or programmatic writes)
        const onStorage = (e) => {
            if (e.key === "nw_user") {
                const updated = readStoredUser();
                setUser(updated || DEFAULT_USER);
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    return user;
}

/** Returns a greeting string based on the current hour: Good morning / afternoon / evening */
export function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

/** Returns formatted date string like "Sunday, July 13" */
export function getTodayLabel() {
    return new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}
