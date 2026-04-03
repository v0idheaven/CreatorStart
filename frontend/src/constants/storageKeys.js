export const STORAGE_KEYS = {
  PLATFORM: "platform",
  getPlannerData: () => `planner_data_${localStorage.getItem("platform") || "both"}`,
  getStreakData: () => `streak_data_${localStorage.getItem("platform") || "both"}`,
}
