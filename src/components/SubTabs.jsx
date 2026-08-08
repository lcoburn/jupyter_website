import { useNavigate, useParams } from 'react-router-dom'

function SubTabs({ subject }) {
  const navigate = useNavigate()
  const { topicId } = useParams()
  const active = topicId || subject.topics[0].id

  const go = (id) => navigate(`/${subject.id}/${id}`)

  return (
    <div>
      {/* Mobile Dropdown */}
      <div className="md:hidden">
        <select
          value={active}
          onChange={(e) => go(e.target.value)}
          className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white shadow-lg"
          style={{ backgroundColor: '#53A690' }}
        >
          {subject.topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex flex-wrap gap-2">
        {subject.topics.map((t) => (
          <button
            key={t.id}
            onClick={() => go(t.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-300 ease-in-out
              ${
                active === t.id
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white/60 text-gray-700 hover:bg-white/80 hover:scale-102'
              }
            `}
            style={active === t.id ? { backgroundColor: '#53A690' } : {}}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SubTabs
