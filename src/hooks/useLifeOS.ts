import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  display_name: string;
  north_star_vision: string;
  avatar_url: string | null;
}

interface Pillar {
  id: string;
  pillar_name: string;
  current_score: number;
  target_score: number;
}

interface FocusTask {
  id: string;
  title: string;
  category: string;
  is_current: boolean;
  is_completed: boolean;
  target_minutes: number | null;
}

interface GardenSlot {
  id: string;
  slot_name: string;
  growth_level: number;
  is_active: boolean;
}

const DEFAULT_PILLARS = ["Vitality", "Sovereignty", "Connection", "Wisdom"];
const DEFAULT_GARDEN_SLOTS = ["Mind", "Body", "Soul", "Impact"];

export const useLifeOS = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [focusTasks, setFocusTasks] = useState<FocusTask[]>([]);
  const [gardenSlots, setGardenSlots] = useState<GardenSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize user data
  const initializeUserData = useCallback(async (userId: string) => {
    // Create profile if doesn't exist
    const { data: existingProfile } = await supabase
      .from("life_os_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!existingProfile) {
      const { data: newProfile, error } = await supabase
        .from("life_os_profiles")
        .insert({
          user_id: userId,
          display_name: user?.email?.split("@")[0] || "Sovereign",
          north_star_vision: "Define your guiding vision for life...",
        })
        .select()
        .single();

      if (!error && newProfile) {
        setProfile(newProfile);
      }
    } else {
      setProfile(existingProfile);
    }

    // Create pillars if don't exist
    const { data: existingPillars } = await supabase
      .from("life_os_pillars")
      .select("*")
      .eq("user_id", userId);

    if (!existingPillars || existingPillars.length === 0) {
      const pillarsToInsert = DEFAULT_PILLARS.map((name) => ({
        user_id: userId,
        pillar_name: name,
        current_score: 50,
        target_score: 100,
      }));

      const { data: newPillars } = await supabase
        .from("life_os_pillars")
        .insert(pillarsToInsert)
        .select();

      if (newPillars) {
        setPillars(newPillars);
      }
    } else {
      setPillars(existingPillars);
    }

    // Create garden slots if don't exist
    const { data: existingGarden } = await supabase
      .from("life_os_garden_slots")
      .select("*")
      .eq("user_id", userId);

    if (!existingGarden || existingGarden.length === 0) {
      const slotsToInsert = DEFAULT_GARDEN_SLOTS.map((name) => ({
        user_id: userId,
        slot_name: name,
        growth_level: 0,
        is_active: true,
      }));

      const { data: newSlots } = await supabase
        .from("life_os_garden_slots")
        .insert(slotsToInsert)
        .select();

      if (newSlots) {
        setGardenSlots(newSlots);
      }
    } else {
      setGardenSlots(existingGarden);
    }

    // Get today's focus tasks
    const today = new Date().toISOString().split("T")[0];
    const { data: tasks } = await supabase
      .from("life_os_focus_tasks")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today);

    if (tasks) {
      setFocusTasks(tasks);
    }
  }, [user]);

  useEffect(() => {
    if (user && isAuthenticated) {
      setLoading(true);
      initializeUserData(user.id).finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, isAuthenticated, authLoading, initializeUserData]);

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    const { error } = await supabase
      .from("life_os_profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update profile");
      return;
    }

    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    toast.success("Profile updated");
  };

  // Update pillar score
  const updatePillarScore = async (pillarName: string, score: number) => {
    if (!user) return;

    const { error } = await supabase
      .from("life_os_pillars")
      .update({ current_score: score })
      .eq("user_id", user.id)
      .eq("pillar_name", pillarName);

    if (error) {
      toast.error("Failed to update pillar");
      return;
    }

    setPillars((prev) =>
      prev.map((p) =>
        p.pillar_name === pillarName ? { ...p, current_score: score } : p
      )
    );
  };

  // Add focus task
  const addFocusTask = async (title: string, category: string = "Focus") => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("life_os_focus_tasks")
      .insert({
        user_id: user.id,
        title,
        category,
        date: today,
        is_current: focusTasks.length === 0,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add task");
      return;
    }

    if (data) {
      setFocusTasks((prev) => [...prev, data]);
      toast.success("Task added");
    }
  };

  // Set current focus task
  const setCurrentTask = async (taskId: string) => {
    if (!user) return;

    // First, unset all current tasks
    await supabase
      .from("life_os_focus_tasks")
      .update({ is_current: false })
      .eq("user_id", user.id);

    // Set the new current task
    const { error } = await supabase
      .from("life_os_focus_tasks")
      .update({ is_current: true })
      .eq("id", taskId);

    if (error) {
      toast.error("Failed to set focus");
      return;
    }

    setFocusTasks((prev) =>
      prev.map((t) => ({ ...t, is_current: t.id === taskId }))
    );
  };

  // Complete focus task
  const completeTask = async (taskId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("life_os_focus_tasks")
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (error) {
      toast.error("Failed to complete task");
      return;
    }

    setFocusTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_completed: true } : t))
    );
    toast.success("Intent completed! 🎯");
  };

  // Get current focus task
  const currentTask = focusTasks.find((t) => t.is_current && !t.is_completed);

  return {
    profile,
    pillars,
    focusTasks,
    gardenSlots,
    currentTask,
    loading: loading || authLoading,
    isAuthenticated,
    updateProfile,
    updatePillarScore,
    addFocusTask,
    setCurrentTask,
    completeTask,
  };
};
