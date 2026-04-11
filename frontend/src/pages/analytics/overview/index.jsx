import MetricTiles from "./MetricTiles"
import ActivityChart from "./ActivityChart"
import WeeklyChart from "./WeeklyChart"
import ContentTable from "./ContentTable"

// Overview tab — composes all overview sub-components
export default function OverviewTab({ ov, ytVideos, ytStats, ytAnalytics, accent }) {
  return (
    <div>
      <MetricTiles ov={ov} ytVideos={ytVideos} ytStats={ytStats} ytAnalytics={ytAnalytics} accent={accent} />
      <ActivityChart monthlyActivity={ov.monthlyActivity} accent={accent} todayPosted={ov.todayPosted} useRealData={ov.useRealData} />
      <WeeklyChart weeks={ov.weeks} upcoming={ov.upcoming} accent={accent} consistency={ov.consistency} />
      <ContentTable contentItems={ov.contentItems} contentTotal={ov.contentTotal} accent={accent} />
    </div>
  )
}
