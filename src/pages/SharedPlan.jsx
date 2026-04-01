import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPublicPlan } from '../services/planService'
import PlanResult from '../components/PlanResult'
import Navbar from '../components/Navbar'

const t = {
  navFeatures: 'Özellikler', navDest: 'Destinasyonlar',
  navCommunity: 'Topluluk', navTools: 'Araçlar',
  login: 'Giriş Yap',
}

export default function SharedPlan() {
  const { id } = useParams()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPublicPlan(id)
      .then(p => {
        if (!p) setError('Plan bulunamadı. (ID: ' + id + ')')
        else setPlan(p)
      })
      .catch(err => {
        console.error('SharedPlan fetch error:', err)
        setError('Plan yüklenirken hata oluştu: ' + (err?.code || err?.message || 'Bilinmeyen hata'))
      })
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans transition-colors">
      <Navbar t={t} />
      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <span className="text-4xl">🗺</span>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">ID: {id}</p>
          <Link to="/" className="text-sm font-medium text-blue-600 hover:underline">← Ana sayfaya dön</Link>
          <a href="/" className="text-sm font-medium text-gray-400 hover:text-gray-600">Yeni plan oluşturmak için tıkla</a>
        </div>
      )}
      {plan && (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              ← Gezish AI
            </Link>
            {plan.authorName && (
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-medium text-gray-600 dark:text-gray-300">{plan.authorName}</span> tarafından paylaşıldı
              </p>
            )}
          </div>
          <div id="plan-result">
            <PlanResult plan={plan} onNewPlan={() => window.location.href = '/'} lang={plan.lang || 'tr'} readOnly />
          </div>
        </>
      )}
    </div>
  )
}
