import { useEffect, useState } from 'react'

const destinations = ['Tokyo', 'Paris', 'Kapadokya', 'Bali', 'Roma', 'Barcelona']

const INTERESTS = [
  { label: '🏛 Tarih', value: 'tarih ve kültür' },
  { label: '🍜 Gastronomi', value: 'gastronomi ve yemek' },
  { label: '🌿 Doğa', value: 'doğa ve yürüyüş' },
  { label: '🎨 Sanat', value: 'sanat ve müzeler' },
  { label: '🌙 Gece', value: 'gece hayatı' },
  { label: '🛍 Alışveriş', value: 'alışveriş' },
  { label: '🧗 Macera', value: 'macera ve spor' },
  { label: '💆 Wellness', value: 'spa ve wellness' },
]

function parseOrRepair(raw) {
  // 1. Direct parse
  try { return JSON.parse(raw) } catch {}

  // 2. Find last complete day object and rebuild minimal valid JSON
  try {
    const titleMatch = raw.match(/"title"\s*:\s*"([^"]*)"/)
    const metaMatch  = raw.match(/"meta"\s*:\s*"([^"]*)"/)
    const chipsMatch = raw.match(/"chips"\s*:\s*(\[[^\]]*\])/)

    // Walk chars to collect complete top-level day objects
    const daysStart = raw.search(/"days"\s*:\s*\[/)
    if (daysStart === -1) return null

    const arrStart = raw.indexOf('[', daysStart)
    let depth = 0, inStr = false, esc = false
    let completeDays = []
    let objStart = -1

    for (let i = arrStart + 1; i < raw.length; i++) {
      const c = raw[i]
      if (esc) { esc = false; continue }
      if (c === '\\' && inStr) { esc = true; continue }
      if (c === '"') { inStr = !inStr; continue }
      if (inStr) continue
      if (c === '{') { if (depth === 0) objStart = i; depth++ }
      else if (c === '}') {
        depth--
        if (depth === 0 && objStart !== -1) {
          try {
            completeDays.push(JSON.parse(raw.slice(objStart, i + 1)))
          } catch {}
          objStart = -1
        }
      }
    }

    if (completeDays.length === 0) return null

    return {
      title: titleMatch?.[1] || 'Seyahat Planı',
      meta: metaMatch?.[1] || '',
      chips: chipsMatch ? JSON.parse(chipsMatch[1]) : [],
      days: completeDays,
      tips: [],
      warnings: [],
      weather: null,
      budget_summary: null,
    }
  } catch {}

  return null
}

export default function Hero({ t, onPlanGenerated }) {
  const [destIndex, setDestIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [form, setForm] = useState({ days: '5', budget: 'orta', group: 'çift', language: 'Türkçe', notes: '' })
  const [interests, setInterests] = useState(['tarih ve kültür', 'gastronomi ve yemek'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Multi-city
  const [multiCity, setMultiCity] = useState(false)
  const [cities, setCities] = useState(['', '', ''])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setDestIndex(i => (i + 1) % destinations.length); setVisible(true) }, 300)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Destinasyon kartından auto-fill
  useEffect(() => {
    const handler = (e) => {
      setMultiCity(false)
      setForm(f => ({ ...f, destination: e.detail }))
    }
    window.addEventListener('selectDestination', handler)
    return () => window.removeEventListener('selectDestination', handler)
  }, [])

  const toggleInterest = (val) => setInterests(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val])

  const destinationStr = multiCity
    ? cities.filter(c => c.trim()).join(' → ')
    : form.destination || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!destinationStr.trim()) return
    setError('')
    setLoading(true)

    const days = form.days
    const destLabel = multiCity ? `Multi-city trip: ${destinationStr}` : destinationStr

    const activitiesPerDay = multiCity ? 4 : 6
    const outputLang = form.language === 'İngilizce' ? 'English' : 'Turkish'
    const prompt = `You are an expert local travel guide. Create a detailed, practical travel itinerary.

Destination: ${destLabel}
Duration: EXACTLY ${days} days (number 1 to ${days}, no more, no less)
Budget: ${form.budget} | Group: ${form.group}
Interests: ${interests.join(', ') || 'general sightseeing'}
${form.notes ? `Notes: ${form.notes}` : ''}

Return ONLY valid JSON, nothing else. No markdown, no text outside JSON.

JSON structure:
{"title":"string","meta":"string","chips":["string"],"days":[{"number":1,"theme":"string","subtitle":"string","activities":[{"time":"09:00","name":"string","description":"string","tag":"culture","address":"string","duration":"string","price":"string","tips":"string"}]}],"tips":["string"],"warnings":["string"],"weather":{"summary":"string","tips":["string","string","string","string"]}}

RULES:
1. tag: exactly one of food|culture|nature|hotel|transport
2. EXACTLY ${activitiesPerDay} activities per day, times 09:00–22:00
3. name: use the REAL name of a specific place, restaurant, or venue (e.g. "Kybele Restaurant", "Hamdi Et Lokantası", "Shake Shack Madison Square") — never generic names like "Local Restaurant" or "Seafood Place"
4. description: 2 sentences — mention the specific venue by name, what it's known for, and what to order or see
5. address: real street, neighborhood or landmark (e.g. "Tarihi Yarımada, Sultanahmet" or "Rue de Rivoli, 1er Arrondissement")
6. duration: e.g. "1-2 hours"
7. price: realistic cost in the LOCAL currency of the exact destination — be precise about regional differences (e.g. Northern Cyprus/KKTC uses ₺ Turkish Lira, Southern Cyprus uses €; Kosovo uses €; Montenegro uses €; Bosnia uses KM; Serbia uses RSD دینار; Georgia uses ₾ GEL; Azerbaijan uses ₼ AZN; UAE uses AED د.إ; Thailand uses ฿; Japan uses ¥; USA uses $; UK uses £) — always use the correct currency symbol and realistic local prices, never default to EUR unless the destination actually uses Euro
8. tips (per activity): 1 insider tip mentioning a specific dish, exhibit, viewpoint, or trick — max 20 words
9. tips array: 2 local practical tips with specific place names or street names where relevant
10. warnings: 2 important warnings
11. weather.summary: 1-2 sentences describing typical weather for this destination during a ${days}-day trip
13. Generate EXACTLY ${days} days — do NOT add day ${parseInt(days)+1}
14. ${multiCity ? 'Distribute days logically across cities' : 'Different neighborhood each day'}
15. JSON keys must stay exactly as specified — only translate the string values
16. Write ALL text values in ${outputLang}`

    const callGroq = async () => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey || apiKey === 'undefined') throw new Error('API anahtarı bulunamadı. Vercel → Settings → Environment Variables bölümünde VITE_GEMINI_API_KEY eklendiğinden emin ol.')
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 8192 } })
      })
      if (!res.ok) {
        let detail = ''
        try { const errBody = await res.json(); detail = errBody?.error?.message || '' } catch {}
        throw new Error(`API hatası: ${res.status}${detail ? ' — ' + detail : ''}`)
      }
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (!text) throw new Error('Geçersiz yanıt formatı')
      const raw = text.match(/\{[\s\S]*/)?.[0]
      if (!raw) throw new Error('Geçersiz yanıt formatı')
      const parsed = parseOrRepair(raw)
      if (!parsed) throw new Error('Plan oluşturulamadı, lütfen tekrar dene')
      const validDays = (parsed.days || []).filter(d => d.activities && d.activities.length > 0)
      if (validDays.length === 0) throw new Error('EMPTY_DAYS')
      return parsed
    }

    try {
      let parsed
      try {
        parsed = await callGroq()
      } catch (err) {
        if (err.message === 'EMPTY_DAYS') parsed = await callGroq() // otomatik 1 retry
        else throw err
      }
      onPlanGenerated(parsed, form.language, destinationStr)
    } catch (err) {
      setError('⚠ ' + (err.message === 'EMPTY_DAYS' ? 'Plan oluşturulamadı, lütfen tekrar dene' : err.message))
    } finally { setLoading(false) }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* LEFT */}
      <div className="pt-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />{t.heroTag}
        </div>
        <h1 className="font-serif text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white leading-tight tracking-tight mb-5">
          {t.heroLine1}<br /><span className="text-blue-600 italic">{t.heroLine2}</span><br />{t.heroLine3}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mb-8">{t.heroDesc}</p>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex">
            {['AY','MK','ZD','BŞ'].map((init,i) => (
              <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-white dark:border-gray-900 -ml-2 first:ml-0" style={{background:['#3b82f6','#8b5cf6','#10b981','#f59e0b'][i]}}>{init}</div>
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{t.heroProof}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          {[{val:'12K+',lbl:t.stat1},{val:'Sınırsız ',lbl:t.stat2},{val:'4.9★',lbl:t.stat3}].map(s => (
            <div key={s.lbl}><div className="font-serif text-2xl font-semibold text-gray-900 dark:text-white">{s.val}</div><div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.lbl}</div></div>
          ))}
        </div>
      </div>

      {/* RIGHT — Form */}
      <div id="hero-form" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <span className="text-base font-semibold text-gray-900 dark:text-white">{t.formTitle}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 px-2.5 py-1 rounded-full">{t.formFree}</span>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* Destination */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{t.lblDest}</label>
              <button
                type="button"
                onClick={() => setMultiCity(v => !v)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  multiCity
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                🌐 Çoklu Şehir
              </button>
            </div>
            {!multiCity ? (
              <input
                type="text"
                value={form.destination || ''}
                onChange={e => setForm({...form, destination: e.target.value})}
                placeholder="Şehir ve Ülke Giriniz (örn. Tokyo, Japonya)"
                required
                className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all placeholder:text-gray-400"
              />
            ) : (
              <div className="flex flex-col gap-2">
                {cities.map((city, i) => (
                  <input
                    key={i}
                    type="text"
                    value={city}
                    onChange={e => {
                      const next = [...cities]
                      next[i] = e.target.value
                      setCities(next)
                    }}
                    placeholder={`${i + 1}. şehir (örn. Paris, Fransa)`}
                    className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all placeholder:text-gray-400"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">{t.lblDays}</label>
              <input type="number" min="1" max="30" value={form.days} onChange={e => setForm({...form, days: e.target.value})} placeholder="5" className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">{t.lblBudget}</label>
              <select value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 transition-all">
                <option value="ekonomik">Ekonomik</option><option value="orta">Orta</option><option value="konforlu">Konforlu</option><option value="lüks">Lüks</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">{t.lblGroup}</label>
              <select value={form.group} onChange={e => setForm({...form, group: e.target.value})} className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 transition-all">
                <option value="yalnız">Yalnız</option><option value="çift">Çift</option><option value="arkadaş grubu">Arkadaş Grubu</option><option value="aile (çocuklu)">Aile</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">{t.lblLang}</label>
              <select value={form.language} onChange={e => setForm({...form, language: e.target.value})} className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 transition-all">
                <option value="Türkçe">🇹🇷 Türkçe</option>
                <option value="İngilizce">🇬🇧 English</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">{t.lblInterests}</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(i => (
                <button key={i.value} type="button" onClick={() => toggleInterest(i.value)} className={`text-sm font-medium px-3 py-1.5 rounded-full border-2 transition-all ${interests.includes(i.value) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600'}`}>{i.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">{t.lblNotes}</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Vegan yemek, sabah geç aktiviteler…" rows={2} className="w-full text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 resize-none transition-all placeholder:text-gray-400" />
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 text-base font-semibold text-white bg-gray-900 dark:bg-blue-600 py-3.5 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Plan oluşturuluyor…</span></>) : (<>✦ {t.btnGenerate}</>)}
          </button>
          {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">{error}</div>}
        </form>
      </div>
    </section>
  )
}
