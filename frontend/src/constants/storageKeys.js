const _platform = localStorage.getItem("platform") || "both"

export const STORAGE_KEYS = {
  PLATFORM: "platform",
  PLANNER_DATA: `planner_data_${_platform}`,
}
