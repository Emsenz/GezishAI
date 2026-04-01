import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { savePlan, savePublicPlan, makePublicPlanCommunityVisible } from '../services/planService'

const TAG_LABELS = {
  tr: { food: 'Yemek', culture: 'Kültür', nature: 'Doğa', hotel: 'Konaklama', transport: 'Ulaşım' },
  en: { food: 'Food', culture: 'Culture', nature: 'Nature', hotel: 'Hotel', transport: 'Transport' }
}
const TAG_COLORS = {
  food: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  culture: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  nature: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  hotel: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  transport: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
}

export default function PlanResult({ plan, onNewPlan, lang = 'tr', readOnly = false }) {
  const [activeDay, setActiveDay] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [shareId, setShareId] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const [communityShared, setCommunityShared] = useState(false)
  const [addingToCommunity, setAddingToCommunity] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setSaved(false)
    setActiveDay(0)
    setShareId('')
    setShareUrl('')
    setCommunityShared(false)
  }, [plan])

  const handleSave = async () => {
    if (!user || saved || saving) return
    setSaving(true)
    try {
      await savePlan(user.uid, plan)
      setSaved(true)
    } catch (err) {
      console.error('Plan kaydedilemedi:', err)
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = async () => {
    const element = document.getElementById('plan-result')
    if (!element) return
    const html2pdf = (await import('html2pdf.js')).default
    html2pdf().set({
      margin: [12, 12, 12, 12],
      filename: `${(plan.title || 'gezi-plani').replace(/[^a-z0-9ğüşıöçĞÜŞİÖÇ\s-]/gi, '')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1280,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    }).from(element).save()
  }

  const handleGetLink = async () => {
    if (!user || sharing) return
    // Already shared — just copy the existing URL again
    if (shareId) {
      await navigator.clipboard.writeText(shareUrl)
      return
    }
    setSharing(true)
    try {
      const id = await savePublicPlan(user.uid, user.displayName, plan, plan.destination || '', false)
      const url = `${window.location.origin}/plan/${id}`
      await navigator.clipboard.writeText(url)
      setShareId(id)
      setShareUrl(url)
    } catch (err) {
      console.error('Link alma hatası:', err)
    } finally {
      setSharing(false)
    }
  }

  const handleAddToCommunity = async () => {
    if (!user || addingToCommunity || communityShared) return
    setAddingToCommunity(true)
    try {
      if (shareId) {
        // Already have a link — just make it community visible
        await makePublicPlanCommunityVisible(shareId)
      } else {
        // Not shared yet — save as community visible
        const id = await savePublicPlan(user.uid, user.displayName, plan, plan.destination || '', true)
        const url = `${window.location.origin}/plan/${id}`
        setShareId(id)
        setShareUrl(url)
      }
      setCommunityShared(true)
    } catch (err) {
      console.error('Topluluk paylaşım hatası:', err)
    } finally {
      setAddingToCommunity(false)
    }
  }

  if (!plan) return null

  const validDays = (plan.days || []).filter(d => d.activities && d.activities.length > 0)
  const safeActiveDay = Math.min(activeDay, validDays.length - 1)
  const day = validDays[safeActiveDay]
  const isEn = lang === 'en'
  const labels = TAG_LABELS[lang] || TAG_LABELS.tr

  if (!day) return null

  return (
    <section id="plan-result" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-gray-900 dark:text-white mb-1">{plan.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{plan.meta}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {(plan.chips || []).map(c => (
              <span key={c} className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{c}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap flex-shrink-0" data-html2canvas-ignore="true">
          {user ? (
            <button
              onClick={handlePrint}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              ⬇ PDF
            </button>
          ) : (
            <div className="relative group">
              <button
                disabled
                className="text-sm font-medium text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg cursor-not-allowed opacity-60"
              >
                🔒 PDF
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                PDF için giriş yapmalısın
              </div>
            </div>
          )}
          {!readOnly && user && (
            <>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all ${
                  saved
                    ? 'border-green-300 bg-green-50 text-green-700 cursor-default dark:border-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {saved ? '✓ Kaydedildi' : saving ? 'Kaydediliyor…' : '🔖 Kaydet'}
              </button>
              <button
                onClick={handleGetLink}
                disabled={sharing}
                className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all ${
                  shareUrl
                    ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {sharing ? 'Hazırlanıyor…' : shareUrl ? '🔗 Link Kopyala' : '🔗 Link Al'}
              </button>
              <button
                onClick={handleAddToCommunity}
                disabled={addingToCommunity || communityShared}
                className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all ${
                  communityShared
                    ? 'border-green-300 bg-green-50 text-green-700 cursor-default dark:border-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {communityShared ? '✓ Toplulukta' : addingToCommunity ? 'Ekleniyor…' : '🌐 Topluluğa Ekle'}
              </button>
            </>
          )}
          <button onClick={onNewPlan} className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">✦ {isEn ? 'New Plan' : 'Yeni Plan'}</button>
        </div>
      </div>

      {shareUrl && (
        <div data-html2canvas-ignore="true" className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2 flex-wrap">
          🔗 <span className="font-medium break-all">{shareUrl}</span>
          {communityShared && <span className="ml-auto text-xs text-green-600 dark:text-green-400 font-medium">✓ Toplulukta görünüyor</span>}
        </div>
      )}

      {/* Budget Summary */}
      {plan.budget_summary && (
        <div className="mb-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl p-5">
          <div className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            💰 {isEn ? 'Budget Summary' : 'Bütçe Özeti'}
            <span className="ml-auto text-emerald-700 dark:text-emerald-400 font-bold">{plan.budget_summary.total}</span>
          </div>
          {plan.budget_summary.breakdown && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {Object.entries(plan.budget_summary.breakdown).filter(([, val]) => typeof val === 'string').map(([key, val]) => (
                <div key={key} className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-800">
                  <div className="text-xs text-gray-400 dark:text-gray-500 capitalize mb-1">
                    {{ accommodation: isEn ? 'Accommodation' : 'Konaklama', food: isEn ? 'Food' : 'Yemek', activities: isEn ? 'Activities' : 'Aktiviteler', transport: isEn ? 'Transport' : 'Ulaşım' }[key] || key}
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{val}</div>
                </div>
              ))}
            </div>
          )}
          {plan.budget_summary.per_day && (
            <div className="flex gap-2 flex-wrap">
              {plan.budget_summary.per_day.filter(d => typeof d.estimate === 'string').map((d, i) => (
                <span key={i} className="text-xs bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full">
                  {isEn ? `Day ${d.day}` : `Gün ${d.day}`}: {d.estimate}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {validDays.map((d, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`flex-shrink-0 text-sm font-medium px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap ${
              safeActiveDay === i
                ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {isEn ? `Day ${d.number}` : `Gün ${d.number}`}: {d.theme}
          </button>
        ))}
      </div>

      {/* Day panel */}
      <div>
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-6">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center font-serif text-2xl font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">
            {day.number}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-lg">{day.theme}</div>
            {day.subtitle && <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{day.subtitle}</div>}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {(day.activities || []).map((act, i) => (
            <div key={i} className="grid grid-cols-[64px_1px_1fr] gap-x-4 relative">
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 pt-5 text-right tabular-nums">{act.time}</div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-900 mt-5 relative z-10 flex-shrink-0" />
                {i < day.activities.length - 1 && <div className="flex-1 w-px bg-gray-200 dark:bg-gray-700" />}
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 my-2 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-sm transition-all">
                <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{act.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{act.description}</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                  {act.address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.name + ' ' + act.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 hover:underline"
                    >
                      📍 {act.address}
                    </a>
                  )}
                  {act.duration && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">⏱ {act.duration}</span>
                  )}
                  {act.price && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">💰 {act.price}</span>
                  )}
                </div>
                {act.tips && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg px-3 py-2 mb-2">
                    <span className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">💡 {act.tips}</span>
                  </div>
                )}
                {act.tag && (
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[act.tag] || 'bg-gray-100 text-gray-600'}`}>
                    {labels[act.tag] || act.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      {plan.tips && plan.tips.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
            <span>✦</span> {isEn ? 'Local Tips' : 'Yerel İpuçları'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                <span className="text-lg flex-shrink-0">💡</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {plan.warnings && plan.warnings.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
            <span>⚠</span> {isEn ? 'Important Warnings' : 'Önemli Uyarılar'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.warnings.map((w, i) => (
              <div key={i} className="flex gap-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
                <span className="text-lg flex-shrink-0">🚨</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather */}
      {plan.weather && (plan.weather.summary || (plan.weather.tips && plan.weather.tips.length > 0)) && (
        <div className="mt-8 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-6">
          <div className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            🌤 {isEn ? 'Weather & Climate' : 'Hava Durumu & İklim'}
          </div>
          {plan.weather.summary && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{plan.weather.summary}</p>
          )}
          {plan.weather.tips && plan.weather.tips.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.weather.tips.map((tip, i) => (
                <div key={i} className="flex gap-3 bg-white dark:bg-gray-800 border border-sky-100 dark:border-sky-800 rounded-xl p-3">
                  <span className="text-lg flex-shrink-0">🌡</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
