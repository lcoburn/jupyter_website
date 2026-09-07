import { useLocation, useNavigate } from 'react-router-dom'
import { subjects } from '../data/sections'

function TopTabs() {
  const navigate = useNavigate()
  // TopTabs is rendered outside <Routes>, so useParams() has no route match
  // and would always return {}. Derive the active subject from the URL instead.
  const { pathname } = useLocation()
  const current = pathname.split('/')[1]
  const active = subjects.some((s) => s.id === current) ? current : subjects[0].id

  const go = (id) => {
    const subject = subjects.find((s) => s.id === id)
    navigate(`/${subject.id}/${subject.topics[0].id}`)
  }

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-2">
      {/* Mobile Dropdown */}
      <div className="md:hidden">
        <select
          value={active}
          onChange={(e) => go(e.target.value)}
          className="w-full px-4 py-3 rounded-lg font-semibold text-base bg-white shadow-lg"
          style={{ color: '#304CB4' }}
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex flex-wrap gap-2 justify-center">
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className={`
              px-4 py-3 rounded-lg font-semibold text-sm md:text-base
              transition-all duration-300 ease-in-out
              ${
                active === s.id
                  ? 'bg-white shadow-lg scale-105'
                  : 'bg-white/30 text-gray-800 hover:bg-white/50 hover:scale-102'
              }
            `}
            style={active === s.id ? { color: '#304CB4' } : {}}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TopTabs
