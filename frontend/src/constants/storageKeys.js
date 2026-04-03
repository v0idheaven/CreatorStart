export const STORAGE_KEYS = {
  PLATFORM: "platform",
  getPlannerData: () => `planner_data_${localStorage.getItem("platform") || "both"}`,
}
