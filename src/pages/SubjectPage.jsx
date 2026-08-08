import { Navigate, useParams } from 'react-router-dom'
import { findNotebook, findSubject, findTopic, subjects } from '../data/sections'
import SubTabs from '../components/SubTabs'
import NotebookPills from '../components/NotebookPills'
import NotebookFrame from '../components/NotebookFrame'

function SubjectPage() {
  const { subjectId, topicId, notebookId } = useParams()
  const subject = findSubject(subjectId)

  if (!subject) {
    return <Navigate to={`/${subjects[0].id}/${subjects[0].topics[0].id}`} replace />
  }
  const topic = findTopic(subject, topicId)
  if (!topic) {
    return <Navigate to={`/${subject.id}/${subject.topics[0].id}`} replace />
  }
  const notebook = findNotebook(topic, notebookId) ?? topic.notebooks[0]
  if (!notebook) {
    return <Navigate to={`/${subject.id}/${subject.topics[0].id}`} replace />
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <SubTabs subject={subject} />
      <NotebookPills subject={subject} topic={topic} />
      <div className="flex-1 min-h-0">
        <NotebookFrame notebook={notebook} />
      </div>
    </div>
  )
}

export default SubjectPage
