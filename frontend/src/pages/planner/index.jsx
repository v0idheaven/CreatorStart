import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import { STORAGE_KEYS } from "../../constants/storageKeys"
import { API_ENDPOINTS } from "../../constants/api"
import { apiFetch } from "../../utils/api"
import usePlannerData from "./usePlannerData"
import useAiBrief from "./useAiBrief"
import GeneratingScreen from "./GeneratingScreen"
import PlannerHeader from "./PlannerHeader"
import PlannerFilterBar from "./PlannerFilterBar"
import SetupScreen from "./SetupScreen"
import PlannerCalendar from "./PlannerCalendar"
import PlannerDetail from "./PlannerDetail"
import { EditModal, ConfirmNewModal, AddDayModal } from "./PlannerModals"
import "./Planner.css"

export default function Planner() {
  const platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || "both"

  const { screen, setScreen, generating, entries, planInfo, handleGenerate, toggleDone, saveEdit, deleteEntry, addToDay, removeExtraPost, clearPlan } = usePlannerData(platform)
  const { aiDetail, aiLoading, aiError, generateBrief, clearBrief } = useAiBrief()

  const [activeDay, setActiveDay] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)
  const [filter, setFilter] = useState("all")
  const [confirmNew, setConfirmNew] = useState(false)
  const [addDayModal, setAddDayModal] = useState(null)
  const [activeExtraIdx, setActiveExtraIdx] = useState(null)

  const activeEntry = entries.find(e => e.day === activeDay)
  const activeEntries = entries.filter(e => e.active)
  const completed = entries.filter(e => e.isCompleted).length

  function handleDayClick(day) {
    if (activeDay === day) { setActiveDay(null); clearBrief(); setActiveExtraIdx(null); return }
    setActiveDay(day); setActiveExtraIdx(null)
    const entry = entries.find(e => e.day === day)
    if (entry?.content) generateBrief(entry)
  }

  function handleDeleteEntry(entry) {
    deleteEntry(entry)
    setActiveDay(null); clearBrief()
  }

  function handleAddDay(entry, content) {
    addToDay(entry, content)
    setAddDayModal(null)
  }

  function handleRemoveExtra(entryId, idx) {
    removeExtraPost(entryId, idx)
    if (activeExtraIdx === idx) setActiveExtraIdx(null)
  }

  if (generating) return <GeneratingScreen />

  return (
    <div className="planner-root">
      <Sidebar />
      <div className="planner-content-wrapper">
        <main className="planner-main">
          <PlannerHeader planInfo={planInfo} screen={screen} onNewPlan={() => setConfirmNew(true)} />

          {screen === "setup" && <SetupScreen onGenerate={handleGenerate} />}

          {screen === "plan" && (
            <>
              <PlannerFilterBar filter={filter} onFilter={setFilter} completed={completed} total={activeEntries.length} />

              <div className="planner-weekdays">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                  <div key={d} className="planner-weekday">{d}</div>
                ))}
              </div>

              <div className="planner-calendar">
                <PlannerCalendar entries={entries} filter={filter} activeDay={activeDay} onDayClick={handleDayClick} onAddDay={setAddDayModal} planInfo={planInfo} />
              </div>
            </>
          )}
        </main>

        {activeEntry && (
          <PlannerDetail
            activeEntry={activeEntry}
            aiDetail={aiDetail} aiLoading={aiLoading} aiError={aiError}
            activeExtraIdx={activeExtraIdx} setActiveExtraIdx={setActiveExtraIdx}
            onClose={() => { setActiveDay(null); clearBrief() }}
            onEdit={setEditingEntry}
            onToggleDone={toggleDone}
            onDelete={handleDeleteEntry}
            onAddDay={setAddDayModal}
            onGenerateBrief={generateBrief}
            onGenerateExtraBrief={generateBrief}
            onRemoveExtraPost={handleRemoveExtra}
          />
        )}

        {editingEntry && (
          <EditModal entry={editingEntry} onClose={() => setEditingEntry(null)} onSave={(u) => { saveEdit(editingEntry.id, u); setEditingEntry(null) }} />
        )}

        {confirmNew && (
          <ConfirmNewModal onClose={() => setConfirmNew(false)} onConfirm={async () => { await clearPlan(); setConfirmNew(false); setActiveDay(null) }} />
        )}

        {addDayModal && (
          <AddDayModal entry={addDayModal} onClose={() => setAddDayModal(null)} onAdd={handleAddDay} />
        )}
      </div>
    </div>
  )
}
