import { useContext } from "react";
import { PlatformContext } from "../context/PlatformContextValue";

export function usePlatform() {
  return useContext(PlatformContext);
}