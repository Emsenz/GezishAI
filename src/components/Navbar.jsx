import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useTheme } from '../context/ThemeContext'
import AuthModal from './AuthModal'
import { getUserPlans, deletePlan } from '../services/planService'

export default function Navbar({ t, onLoadPlan }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState(false)
  const [plansOpen, setPlansOpen] = useState(false)
  const [savedPlans, setSavedPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(false)
  const { user, logout } = useAuth()
  const { dark, toggle: toggleDark } = useTheme()

  const openPlans = async () => {
    setPlansOpen(true)
    setLoadingPlans(true)
    try {
      const plans = await getUserPlans(user.uid)
      setSavedPlans(plans)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPlans(false)
    }
  }

  const handleDelete = async (planId) => {
    try {
      await deletePlan(user.uid, planId)
      setSavedPlans(prev => prev.filter(p => p.id !== planId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleLoad = (plan) => {
    setPlansOpen(false)
    onLoadPlan?.(plan)
    setTimeout(() => {
      document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-serif text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Gezish <span className="text-blue-600">AI</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: t.navFeatures, href: '#features' },
              { label: t.navDest, href: '#destinations' },
              { label: t.navCommunity, href: '#community' },
              { label: t.navTools, href: '#tools' },
            ].map(link => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-all">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title={dark ? 'Açık mod' : 'Koyu mod'}
            >
              {dark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <>
                <span className="hidden md:block text-sm text-gray-600 font-medium">
                  👋 {user.displayName || user.email}
                </span>
                <button
                  onClick={openPlans}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  🗺 Planlarım
                </button>
                <button onClick={logout} className="text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthModal(true)} className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
                  {t.login}
                </button>
              </>
            )}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="w-5 h-0.5 bg-gray-700 mb-1" />
              <div className="w-5 h-0.5 bg-gray-700 mb-1" />
              <div className="w-5 h-0.5 bg-gray-700" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 flex flex-col gap-2">
            {[
              { label: t.navFeatures, id: 'features' },
              { label: t.navDest, id: 'destinations' },
              { label: t.navCommunity, id: 'community' },
              { label: t.navTools, id: 'tools' },
            ].map(link => (
              <button
                key={link.id}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 py-2 hover:text-gray-900 dark:hover:text-white text-left"
                onClick={() => {
                  setMenuOpen(false)
                  setTimeout(() => {
                    document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
                  }, 50)
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {authModal && <AuthModal onClose={() => setAuthModal(false)} />}

      {/* Planlarım Modal */}
      {plansOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPlansOpen(false)} />
          <div className="relative bg-white h-full w-full max-w-md shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-serif text-xl font-semibold text-gray-900">Kayıtlı Planlarım</h2>
              <button onClick={() => setPlansOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loadingPlans ? (
                <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Yükleniyor…</div>
              ) : savedPlans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <span className="text-4xl">🗺</span>
                  <p className="text-gray-500 text-sm">Henüz kayıtlı planın yok.<br />Plan oluşturduktan sonra "Kaydet" butonuna bas.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {savedPlans.map(plan => (
                    <div key={plan.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-all">
                      <div className="font-semibold text-gray-900 text-sm mb-0.5">{plan.title}</div>
                      <div className="text-xs text-gray-400 mb-3">{plan.meta}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoad(plan)}
                          className="flex-1 text-sm font-medium text-white bg-blue-600 py-1.5 rounded-lg hover:bg-blue-700 transition-all"
                        >
                          Görüntüle
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="text-sm font-medium text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
