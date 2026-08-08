import { Navigate, Route, Routes } from 'react-router-dom'
import TopTabs from './components/TopTabs'
import SubjectPage from './pages/SubjectPage'
import { subjects } from './data/sections'

const home = `/${subjects[0].id}/${subjects[0].topics[0].id}`

function App() {
  return (
    <div
      className="h-screen flex flex-col p-4 gap-4"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <header className="flex flex-col gap-3">
        <h1 className="text-center text-white text-2xl md:text-3xl font-bold drop-shadow">
          Maths &amp; Physics Notebooks
        </h1>
        <TopTabs />
      </header>

      <Routes>
        <Route path="/" element={<Navigate to={home} replace />} />
        <Route path="/:subjectId" element={<Navigate to="units" replace />} />
        <Route path="/:subjectId/:topicId/:notebookId?" element={<SubjectPage />} />
        <Route path="*" element={<Navigate to={home} replace />} />
      </Routes>
    </div>
  )
}

export default App
