import DashboardYT from "./DashboardYT"
import DashboardIG from "./DashboardIG"
import DashboardBoth from "./DashboardBoth"

export default function Dashboard() {
  const platform = localStorage.getItem("platform") || "both"
  if (platform === "youtube") return <DashboardYT />
  if (platform === "instagram") return <DashboardIG />
  return <DashboardBoth />
}
