import { useState, useEffect } from "react";
import supabase from "../supabase";
import { PlatformContext } from "./PlatformContextValue";

export function PlatformProvider({ children }) {
  const [platform, setPlatform] = useState(null);
  const [activePlat, setActivePlat] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("platform")
          .eq("id", user.id)
          .single();

        if (data?.platform) {
          setPlatform(data.platform);
          setActivePlat(data.platform === "both" ? "overall" : data.platform);
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <PlatformContext.Provider value={{ platform, activePlat, setActivePlat }}>
      {children}
    </PlatformContext.Provider>
  );
}
