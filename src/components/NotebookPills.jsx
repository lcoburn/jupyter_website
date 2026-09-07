import { useNavigate, useParams } from 'react-router-dom'

// Third level of navigation: the notebooks inside one topic.
// Always rendered, even for a single notebook, so the notebook's name is visible.
function NotebookPills({ subject, topic }) {
  const navigate = useNavigate()
  const { notebookId } = useParams()
  const active = notebookId || topic.notebooks[0]?.id

  if (topic.notebooks.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {topic.notebooks.map((n) => (
        <button
          key={n.id}
          onClick={() => navigate(`/${subject.id}/${topic.id}/${n.id}`)}
          className={`
            px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium
            transition-all duration-300 ease-in-out
            ${
              active === n.id
                ? 'bg-white text-gray-800 shadow-lg'
                : 'bg-white/25 text-white hover:bg-white/40'
            }
          `}
        >
          {n.title}
        </button>
      ))}
    </div>
  )
}

export default NotebookPills
