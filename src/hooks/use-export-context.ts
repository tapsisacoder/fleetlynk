/**
 * Shared export helper hook — provides company context for exports
 */
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export function useExportContext() {
  const { profile } = useAuth();
  const [companyName, setCompanyName] = useState("");

  const loadCompanyName = async () => {
    if (companyName) return companyName;
    if (!profile?.company_id) return "LynkFleet Client";
    const { data } = await supabase.from("companies").select("company_name").eq("id", profile.company_id).single();
    const name = data?.company_name || "LynkFleet Client";
    setCompanyName(name);
    return name;
  };

  return {
    generatedBy: { name: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "User", role: profile?.role?.replace(/_/g, " ") || "User" },
    loadCompanyName,
    companyId: profile?.company_id,
  };
}
