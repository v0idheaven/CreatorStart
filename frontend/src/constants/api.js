const API_BASE_URL = import.meta.env.VITE_API_URL || ""

export const API_ENDPOINTS = {
  plannerAiPlan: `${API_BASE_URL}/api/v1/planner/ai/plan`,
  plannerAiDetail: `${API_BASE_URL}/api/v1/planner/ai/detail`,
  contentGenerator: `${API_BASE_URL}/api/v1/planner/ai/content`,
}
