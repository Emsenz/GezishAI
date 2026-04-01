import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getPublicPlans, deletePublicPlan } from '../services/planService'
import { useAuth } from '../AuthContext'

// Features
export function Features({ t }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const features = [
    { icon: '🗺️', bg: 'bg-blue-50 dark:bg-blue-900/30', title: 'Gün gün detaylı plan', desc: 'Saatlik aktiviteler, öğün önerileri ve ulaşım bilgisiyle eksiksiz program.', target: 'hero-form' },
    { icon: '🌍', bg: 'bg-green-50 dark:bg-green-900/30', title: 'Çoklu dil desteği', desc: 'Türkçe ve İngilizce — planını istediğin dilde oluştur.', badge: 'Sadece bizde', badgeColor: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800', target: 'hero-form' },
    { icon: '🧳', bg: 'bg-purple-50 dark:bg-purple-900/30', title: 'Otomatik valiz listesi', desc: 'Destinasyon ve süreye göre kişiselleştirilmiş packing list.', badge: 'Sadece bizde', badgeColor: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800', target: 'hero-form' },
    { icon: '💱', bg: 'bg-orange-50 dark:bg-orange-900/30', title: 'Canlı kur hesaplama', desc: 'Gideceğin ülkenin para birimini TL veya dövize anında çevir.', badge: 'Sadece bizde', badgeColor: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800', target: 'tools' },
    { icon: '🛂', bg: 'bg-red-50 dark:bg-red-900/30', title: 'Vize bilgileri', desc: 'Türk pasaportuyla hangi ülkeye vizesiz girebilirsin.', badge: '🇹🇷 TR odaklı', badgeColor: 'text-red-600 bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800', target: 'tools' },
    { icon: '🏘️', bg: 'bg-green-50 dark:bg-green-900/30', title: 'Yerel ipuçları', desc: 'Tourist trap uyarıları, yerel restoran önerileri ve saklı köşeler.', badge: 'Sadece bizde', badgeColor: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800', target: 'hero-form' },
    { icon: '👥', bg: 'bg-blue-50 dark:bg-blue-900/30', title: 'Topluluk planları', desc: 'Diğer gezginlerin planlarını keşfet, beğen ve kopyala.', target: 'community' },
    { icon: '🔗', bg: 'bg-purple-50 dark:bg-purple-900/30', title: 'Paylaş & kaydet', desc: "Planını tek link ile paylaş, PDF'e dönüştür ya da kaydet.", target: 'hero-form' },
    { icon: '📱', bg: 'bg-gray-50 dark:bg-gray-800', title: 'Offline erişim', desc: 'Planını telefonuna kaydet — internet olmadan da eriş.', badge: 'Yakında', badgeColor: 'text-gray-600 bg-gray-100 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400', target: null },
  ]

  return (
    <section id="features" className="bg-gray-50 dark:bg-gray-800/50 border-t border-b border-gray-200 dark:border-gray-700 py-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Neden Gezish AI?</div>
        <h2 className="font-serif text-3xl font-semibold text-gray-900 dark:text-white mb-10">Rakiplerimizden farkımız</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              onClick={() => f.target && scrollTo(f.target)}
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all ${f.target ? 'cursor-pointer' : ''}`}
            >
              <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{f.icon}</div>
              <div className="font-semibold text-gray-900 dark:text-white mb-1">{f.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</div>
              {f.badge && (
                <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${f.badgeColor}`}>{f.badge}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Destinations
export function Destinations() {
  const dests = [
    {
      name: 'Tokyo', country: '🇯🇵 Japonya', dest: 'Tokyo, Japonya',
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Paris', country: '🇫🇷 Fransa', dest: 'Paris, Fransa',
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kapadokya', country: '🇹🇷 Türkiye', dest: 'Kapadokya, Türkiye',
      img: '/kapadokya.jpg',
    },
    {
      name: 'Bali', country: '🇮🇩 Endonezya', dest: 'Bali, Endonezya',
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    },
  ]

  return (
    <section id="destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Popüler Destinasyonlar</div>
      <h2 className="font-serif text-3xl font-semibold text-gray-900 dark:text-white mb-8">Nereye gitmek istiyorsun?</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dests.map(d => (
          <div
            key={d.name}
            className="relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('selectDestination', { detail: d.dest }))
              setTimeout(() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
            }}
          >
            <img
              src={d.img}
              alt={d.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="text-white font-semibold text-base">{d.name}</div>
              <div className="text-white/75 text-xs mt-0.5">{d.country}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Destination keyword → Unsplash photo ID mapping
const DEST_IMAGES = {
  // Türkiye
  istanbul:       'photo-1524231757912-21f4fe3a7200',
  ankara:         'photo-1524231757912-21f4fe3a7200',
  izmir:          'photo-1589394815804-964ed0be2eb5',
  antalya:        'photo-1609342122563-a43ac8917a3a',
  bodrum:         'photo-1570077188670-e3a8d69ac5ff',
  alanya:         'photo-1570077188670-e3a8d69ac5ff',
  fethiye:        'photo-1507501336603-6760020b8b3f',
  marmaris:       'photo-1507501336603-6760020b8b3f',
  trabzon:        'photo-1601918774516-5f8b0dc1c5c2',
  bursa:          'photo-1524231757912-21f4fe3a7200',
  eskisehir:      'photo-1524231757912-21f4fe3a7200',
  gaziantep:      'photo-1524231757912-21f4fe3a7200',
  safranbolu:     'photo-1524231757912-21f4fe3a7200',
  kapadokya:      null,
  cappadocia:     null,
  // KKTC
  girne:          'photo-1544551763-46a013bb70d5',
  kyrenia:        'photo-1544551763-46a013bb70d5',
  gazimağusa:     'photo-1557456170-0cf4f4d0d362',
  famagusta:      'photo-1557456170-0cf4f4d0d362',
  lefkoşa:        'photo-1559592413-7cec4d0cae2b',
  nicosia:        'photo-1559592413-7cec4d0cae2b',
  kktc:           'photo-1544551763-46a013bb70d5',
  'kuzey kıbrıs': 'photo-1544551763-46a013bb70d5',
  // Kıbrıs (Güney)
  kıbrıs:         'photo-1559592413-7cec4d0cae2b',
  kibris:         'photo-1559592413-7cec4d0cae2b',
  cyprus:         'photo-1559592413-7cec4d0cae2b',
  limasol:        'photo-1559592413-7cec4d0cae2b',
  limassol:       'photo-1559592413-7cec4d0cae2b',
  larnaka:        'photo-1559592413-7cec4d0cae2b',
  larnaca:        'photo-1559592413-7cec4d0cae2b',
  paphos:         'photo-1559592413-7cec4d0cae2b',
  baf:            'photo-1559592413-7cec4d0cae2b',
  'ayia napa':    'photo-1507501336603-6760020b8b3f',
  // Avrupa
  paris:          'photo-1502602898657-3e91760cbb34',
  roma:           'photo-1552832230-c0197dd311b5',
  rome:           'photo-1552832230-c0197dd311b5',
  barcelona:      'photo-1539037116277-4db20889f2d4',
  madrid:         'photo-1543785734-4b6e564642f8',
  amsterdam:      'photo-1512470876302-972faa2aa9a4',
  londra:         'photo-1513635269975-59663e0ac1ad',
  london:         'photo-1513635269975-59663e0ac1ad',
  prag:           'photo-1519677100203-a0e668c92439',
  prague:         'photo-1519677100203-a0e668c92439',
  berlin:         'photo-1560969184-10fe8719e047',
  viyana:         'photo-1516550893923-42d28e5677af',
  vienna:         'photo-1516550893923-42d28e5677af',
  budapeşte:      'photo-1549893072-4bc678117f45',
  budapest:       'photo-1549893072-4bc678117f45',
  atina:          'photo-1555993539-1732b0258235',
  athens:         'photo-1555993539-1732b0258235',
  santorini:      'photo-1507501336603-6760020b8b3f',
  mallorca:       'photo-1570077188670-e3a8d69ac5ff',
  venedik:        'photo-1514890547357-a9ee288728e0',
  venice:         'photo-1514890547357-a9ee288728e0',
  floransa:       'photo-1541370976299-4d24ebbc9077',
  florence:       'photo-1541370976299-4d24ebbc9077',
  milano:         'photo-1485738422979-f5ef30f37eab',
  milan:          'photo-1485738422979-f5ef30f37eab',
  lizbon:         'photo-1558618666-fcd25c85cd64',
  lisbon:         'photo-1558618666-fcd25c85cd64',
  porto:          'photo-1558618666-fcd25c85cd64',
  stockholm:      'photo-1509356843151-3e7d96241e11',
  kopenhag:       'photo-1513622470522-26c3c8a854bc',
  copenhagen:     'photo-1513622470522-26c3c8a854bc',
  münih:          'photo-1467269204594-9661b134dd2b',
  munich:         'photo-1467269204594-9661b134dd2b',
  sofya:          'photo-1560969184-10fe8719e047',
  sofia:          'photo-1560969184-10fe8719e047',
  belgrad:        'photo-1560969184-10fe8719e047',
  belgrade:       'photo-1560969184-10fe8719e047',
  // Asya
  tokyo:          'photo-1540959733332-eab4deabeeaf',
  kyoto:          'photo-1493976040374-85c8e12f0c0e',
  bali:           'photo-1537996194471-e657df975ab4',
  singapur:       'photo-1525625293386-3f8f99389edd',
  singapore:      'photo-1525625293386-3f8f99389edd',
  bangkok:        'photo-1508009603885-50cf7c579365',
  seoul:          'photo-1517154421773-0529f29ea451',
  'hong kong':    'photo-1536152470836-b943b246224c',
  // Orta Doğu & Afrika
  dubai:          'photo-1518684079-3c830dcef090',
  kahire:         'photo-1568322445389-f64ac2515020',
  cairo:          'photo-1568322445389-f64ac2515020',
  marakeş:        'photo-1539020140153-e479b8c22e70',
  marrakesh:      'photo-1539020140153-e479b8c22e70',
  // Amerika
  maldivler:      'photo-1514282401047-d79a71a590e8',
  maldives:       'photo-1514282401047-d79a71a590e8',
  'new york':     'photo-1522083165195-3424ed129620',
  newyork:        'photo-1522083165195-3424ed129620',
}

function normalizeSrc(str) {
  // Fix Turkish İ → lowercase adds combining dot (U+0307), remove it so 'İstanbul' → 'istanbul'
  return str.toLowerCase().replace(/\u0307/g, '')
}

function getCoverImage(trip) {
  // Local kapadokya image
  const src = normalizeSrc(trip.destination || trip.title || trip.meta || '')
  if (src.includes('kapadokya') || src.includes('cappadocia')) return '/kapadokya.jpg'

  // Search keyword map (longer keywords first to avoid partial matches)
  const sorted = Object.entries(DEST_IMAGES).sort((a, b) => b[0].length - a[0].length)
  for (const [keyword, photoId] of sorted) {
    if (photoId && src.includes(keyword)) {
      return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&q=80`
    }
  }
  return null // fall back to emoji+gradient
}

// Community — loads real public plans from Firestore, falls back to static
const STATIC_TRIPS = [
  { days: 7, title: "Tokyo'da 7 Gün: Anime, Ramen & Tapınaklar", desc: "Modern ve geleneksel Tokyo'yu dengeleyen kapsamlı rehber.", chips: ['Gastronomi', 'Kültür', 'Bütçe dostu'], emoji: '🗼', bg: 'from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40', authorName: 'AY', authorBg: '#3b82f6' },
  { days: 4, title: "Kapadokya: Balon, At ve Yöresel Lezzetler", desc: "Türkiye'nin en büyülü destinasyonunda romantik kaçamak.", chips: ['Çift', 'Doğa', 'Türkiye'], emoji: '🎈', bg: 'from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40', authorName: 'ZD', authorBg: '#8b5cf6' },
  { days: 10, title: "Ege Kıyıları: İzmir'den Bodrum'a Yol Turu", desc: "Antik kentler, zeytinlikler ve turkuaz koylar.", chips: ['Yol turu', 'Tarih', 'Türkiye'], emoji: '🌊', bg: 'from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40', authorName: 'MK', authorBg: '#10b981' },
]

const EMOJIS = ['🗼','🎈','🌊','🌴','🗺️','🏔️']
const BGSLIST = ['from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40','from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40','from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-800/40','from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40']

export function Community() {
  const [trips, setTrips] = useState(STATIC_TRIPS)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    getPublicPlans(6)
      .then(plans => { if (plans.length > 0) setTrips(plans) })
      .catch(err => { console.error('[Community] getPublicPlans error:', err?.code, err?.message) })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (e, planId) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Bu planı topluluktan kaldırmak istediğine emin misin?')) return
    setDeletingId(planId)
    setDeleteError('')
    try {
      await deletePublicPlan(planId)
      setTrips(prev => prev.filter(t => t.id !== planId))
    } catch (err) {
      console.error(err)
      setDeleteError('Silinemedi: ' + (err.message || 'Firestore izin hatası. Firebase Console → Firestore → Rules güncellenmeli.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section id="community" className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 py-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Topluluk</div>
            <h2 className="font-serif text-3xl font-semibold text-gray-900 dark:text-white">Gezginlerin Planları</h2>
          </div>
        </div>
        {deleteError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
            ⚠ {deleteError}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip, i) => {
            const coverImg = getCoverImage(trip)
            const bg = trip.bg || BGSLIST[i % BGSLIST.length]
            const emoji = trip.emoji || EMOJIS[i % EMOJIS.length]
            const dayCount = trip.dayCount != null
              ? trip.dayCount
              : Array.isArray(trip.days)
                ? trip.days.filter(d => d.activities && d.activities.length > 0).length
                : (typeof trip.days === 'number' ? trip.days : null)
            const authorInitial = trip.authorName ? trip.authorName[0].toUpperCase() : '?'
            const tags = trip.chips || []

            const card = (
              <div className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col">
                {coverImg ? (
                  <div className="h-40 flex-shrink-0 relative overflow-hidden">
                    <img src={coverImg} alt={trip.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ) : (
                  <div className={`h-40 flex-shrink-0 bg-gradient-to-br ${bg} flex items-center justify-center text-5xl`}>{emoji}</div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    {dayCount && <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full">{dayCount} Gün</span>}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 ml-auto">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: trip.authorBg || '#6b7280' }}>{authorInitial}</div>
                      {trip.authorName}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">{trip.title}</div>
                  {(trip.desc || trip.meta) && <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">{trip.desc || trip.meta}</div>}
                  <div className="flex items-end justify-between gap-2 mt-auto">
                    <div className="flex gap-1.5 flex-wrap">
                      {tags.map(tag => (
                        <span key={tag} className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    {user && trip.id && trip.authorId === user.uid && (
                      <button
                        onClick={e => handleDelete(e, trip.id)}
                        disabled={deletingId === trip.id}
                        className="flex-shrink-0 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-all disabled:opacity-50"
                        title="Planı sil"
                      >
                        {deletingId === trip.id ? '⏳' : '🗑'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )

            return trip.id
              ? <Link key={i} to={`/plan/${trip.id}`} className="block h-full">{card}</Link>
              : <div key={i} className="h-full">{card}</div>
          })}
        </div>
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  )
}

// Tools — real currency rates from open.er-api.com
const FALLBACK = { TRY: 1, USD: 36.5, EUR: 39.5, GBP: 46.2, JPY: 0.24, AED: 9.94, AUD: 23.1, CAD: 26.8, CHF: 41.2, CNY: 5.05, DKK: 5.3, HKD: 4.68, IDR: 0.0022, INR: 0.43, KRW: 0.026, MXN: 1.82, MYR: 8.2, NOK: 3.35, PLN: 9.1, SAR: 9.7, SEK: 3.5, SGD: 27.2, THB: 1.06, ZAR: 1.98, BAM: 20.1, RSD: 0.34, MKD: 0.64, ALL: 0.38, BGN: 20.2, RON: 7.95, HUF: 0.1, CZK: 1.6, UAH: 0.88, GEL: 13.5, AZN: 21.5, QAR: 10.0, KWD: 118.5, BHD: 96.8, JOD: 51.5, EGP: 0.74, MAD: 3.65, TND: 11.8, HRK: 5.25 }

// Popular currencies with display names for search
const CURRENCY_LIST = [
  { code: 'TRY', name: 'Türk Lirası' },
  { code: 'USD', name: 'Amerikan Doları' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'İngiliz Sterlini' },
  { code: 'JPY', name: 'Japon Yeni' },
  // Balkanlar & Doğu Avrupa (Türklerin sık gittiği)
  { code: 'BAM', name: 'Bosna Hersek Markı' },
  { code: 'RSD', name: 'Sırp Dinarı' },
  { code: 'MKD', name: 'Kuzey Makedonya Dinarı' },
  { code: 'ALL', name: 'Arnavutluk Leki' },
  { code: 'HRK', name: 'Hırvatistan Kunası' },
  { code: 'BGN', name: 'Bulgar Levası' },
  { code: 'RON', name: 'Rumen Leyi' },
  { code: 'HUF', name: 'Macar Forinti' },
  { code: 'CZK', name: 'Çek Korunası' },
  { code: 'PLN', name: 'Polonya Zlotisi' },
  { code: 'UAH', name: 'Ukrayna Grivnası' },
  { code: 'GEL', name: 'Gürcistan Larisi' },
  { code: 'AZN', name: 'Azerbaycan Manatı' },
  // Orta Doğu & Körfez
  { code: 'AED', name: 'BAE Dirhemi' },
  { code: 'SAR', name: 'Suudi Arabistan Riyali' },
  { code: 'QAR', name: 'Katar Riyali' },
  { code: 'KWD', name: 'Kuveyt Dinarı' },
  { code: 'BHD', name: 'Bahreyn Dinarı' },
  { code: 'JOD', name: 'Ürdün Dinarı' },
  { code: 'EGP', name: 'Mısır Poundu' },
  { code: 'MAD', name: 'Fas Dirhemi' },
  { code: 'TND', name: 'Tunus Dinarı' },
  // Asya
  { code: 'THB', name: 'Tayland Bahtı' },
  { code: 'IDR', name: 'Endonezya Rupisi' },
  { code: 'MYR', name: 'Malezya Ringgiti' },
  { code: 'SGD', name: 'Singapur Doları' },
  { code: 'INR', name: 'Hindistan Rupisi' },
  { code: 'CNY', name: 'Çin Yuanı' },
  { code: 'KRW', name: 'Güney Kore Wonu' },
  { code: 'HKD', name: 'Hong Kong Doları' },
  // Diğer
  { code: 'AUD', name: 'Avustralya Doları' },
  { code: 'CAD', name: 'Kanada Doları' },
  { code: 'CHF', name: 'İsviçre Frangı' },
  { code: 'NOK', name: 'Norveç Kronu' },
  { code: 'SEK', name: 'İsveç Kronu' },
  { code: 'DKK', name: 'Danimarka Kronu' },
  { code: 'MXN', name: 'Meksika Pesosu' },
  { code: 'ZAR', name: 'Güney Afrika Randı' },
]

function CurrencySearch({ value, onChange, rates }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = CURRENCY_LIST.find(c => c.code === value)
  const filtered = CURRENCY_LIST.filter(c =>
    rates[c.code] &&
    (c.code.toLowerCase().includes(query.toLowerCase()) ||
     c.name.toLowerCase().includes(query.toLowerCase()))
  )

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => { setOpen(v => !v); setQuery('') }}
        className="text-sm font-semibold bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 outline-none flex items-center gap-1 hover:border-blue-400 transition-all"
      >
        {selected?.code || value} <span className="text-gray-400 text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Döviz ara… (USD, Euro…)"
              className="w-full text-xs bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-xs text-gray-400 px-3 py-2">Bulunamadı</div>
            ) : filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => { onChange(c.code); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-between gap-2 ${c.code === value ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <span className="font-mono font-bold text-xs w-10 flex-shrink-0">{c.code}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const ALL_VISAS = [
  { country: '🇯🇵 Japonya', status: 'Vizesiz', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { country: '🇩🇪 Almanya', status: 'Schengen Vize', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { country: '🇺🇸 Amerika', status: 'Vize', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { country: '🇦🇿 Azerbaycan', status: 'Vizesiz', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { country: '🇹🇭 Tayland', status: 'e-Vize', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { country: '🇬🇧 İngiltere', status: 'Vize', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { country: '🇫🇷 Fransa', status: 'Schengen Vize', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { country: '🇮🇹 İtalya', status: 'Schengen Vize', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { country: '🇦🇪 BAE', status: 'Vizesiz', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { country: '🇬🇷 Yunanistan', status: 'Schengen Vize', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { country: '🇷🇺 Rusya', status: 'e-Vize', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { country: '🇲🇾 Malezya', status: 'Vizesiz', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { country: '🇮🇩 Endonezya', status: 'e-Vize', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { country: '🇨🇦 Kanada', status: 'Vize', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { country: '🇰🇷 Güney Kore', status: 'Vizesiz', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { country: '🇸🇬 Singapur', status: 'Vizesiz', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { country: '🇨🇳 Çin', status: 'Vize', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { country: '🇮🇳 Hindistan', status: 'e-Vize', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { country: '🇧🇷 Brezilya', status: 'Vizesiz', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { country: '🇲🇦 Fas', status: 'Vizesiz', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
]

const DEFAULT_PACKING = [
  { label: 'Pasaport & kopyaları', checked: false },
  { label: 'Uçak bileti / e-bilet', checked: false },
  { label: 'Seyahat sigortası', checked: false },
  { label: 'Otel rezervasyonu', checked: false },
  { label: 'Şarj cihazları & adaptör', checked: false },
  { label: 'Telefon & powerbank', checked: false },
  { label: 'Temel ilaçlar & ağrı kesici', checked: false },
  { label: 'Güneş kremi', checked: false },
]

export function Tools() {
  const [amount, setAmount] = useState('')
  const [from, setFrom] = useState('TRY')
  const [to, setTo] = useState('EUR')
  const [rates, setRates] = useState(FALLBACK)
  const [ratesDate, setRatesDate] = useState('')
  const [ratesLive, setRatesLive] = useState(false)
  const [visaSearch, setVisaSearch] = useState('')
  const [visaAiResult, setVisaAiResult] = useState(null)
  const [visaAiLoading, setVisaAiLoading] = useState(false)
  const [packing, setPacking] = useState(DEFAULT_PACKING)

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/TRY')
      .then(r => r.json())
      .then(data => {
        if (data.result === 'success') {
          const r = data.rates
          const all = { TRY: 1 }
          CURRENCY_LIST.forEach(({ code }) => {
            if (code !== 'TRY' && r[code]) all[code] = 1 / r[code]
          })
          setRates(all)
          setRatesDate(data.time_last_update_utc?.split(' ').slice(0, 4).join(' ') || '')
          setRatesLive(true)
        }
      })
      .catch(() => {})
  }, [])

  const numAmount = parseFloat(amount) || 0
  const result = (rates[from] && rates[to] && numAmount > 0) ? ((numAmount * rates[from]) / rates[to]).toFixed(2) : '—'
  const filteredVisas = ALL_VISAS.filter(v => v.country.toLowerCase().includes(visaSearch.toLowerCase()))
  const checkedCount = packing.filter(p => p.checked).length

  const askVisaAI = async () => {
    if (!visaSearch.trim()) return
    setVisaAiLoading(true)
    setVisaAiResult(null)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: `Türk pasaportu ile ${visaSearch} ülkesine giriş için vize durumu nedir? Kısa ve net Türkçe cevap ver. Şu bilgileri ver: vize gerekli mi, e-vize mümkün mü, vizesiz giriş mümkünse kaç gün kalınabilir, tahmini vize ücreti (varsa). 3-4 cümle yeterli.` }],
          temperature: 0.3,
          max_tokens: 300,
        }),
      })
      const data = await res.json()
      setVisaAiResult(data.choices?.[0]?.message?.content?.trim() || 'Bilgi alınamadı.')
    } catch {
      setVisaAiResult('Sorgu sırasında hata oluştu, lütfen tekrar dene.')
    } finally {
      setVisaAiLoading(false)
    }
  }

  return (
    <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Seyahat Araçları</div>
      <h2 className="font-serif text-3xl font-semibold text-gray-900 dark:text-white mb-8">Planlamayı kolaylaştır</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Currency */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-md transition-all">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-lg">💱</div>
            <span className="font-semibold text-gray-900 dark:text-white">Döviz Hesaplayıcı</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Seyahat etmeden önce bütçeni hesapla.</p>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" min="0" className="w-24 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            <CurrencySearch value={from} onChange={setFrom} rates={rates} />
            <span className="text-gray-400">→</span>
            <CurrencySearch value={to} onChange={setTo} rates={rates} />
          </div>
          <div className="text-2xl font-bold text-blue-600">≈ {result} {to}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {ratesLive ? `🟢 Canlı kur · ${ratesDate}` : '⚪ Tahmini kur · Gerçek zamanlı değil'}
          </div>
        </div>

        {/* Visa */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-lg">🛂</div>
            <span className="font-semibold text-gray-900 dark:text-white">Vize Durumu (TR)</span>
          </div>
          <input
            type="text"
            placeholder="Ülke ara…"
            value={visaSearch}
            onChange={e => setVisaSearch(e.target.value)}
            className="w-full text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-blue-500 mb-3"
          />
          <div className="flex flex-col gap-1 overflow-y-auto max-h-52 flex-1">
            {filteredVisas.length === 0 && visaSearch.trim() ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <p className="text-sm text-gray-400 text-center">"{visaSearch}" listemizde yok.</p>
                {visaAiResult ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed w-full">
                    {visaAiResult}
                    <p className="text-xs text-gray-400 mt-2">⚠ AI tahminidir, resmi kaynaklarla doğrulayın.</p>
                  </div>
                ) : (
                  <button
                    onClick={askVisaAI}
                    disabled={visaAiLoading}
                    className="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {visaAiLoading ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sorgulanıyor…</> : '🤖 AI\'dan Sor'}
                  </button>
                )}
              </div>
            ) : null}
            {filteredVisas.map(v => (
              <div key={v.country} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-gray-700 dark:text-gray-300">{v.country}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v.color}`}>{v.status}</span>
                  {false && (
                    <a href={v.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">↗</a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Türk pasaportundan referanstır · Güncel bilgi için büyükelçilik sitesini kontrol et</p>
        </div>

        {/* Packing Checklist */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-lg">🧳</div>
            <span className="font-semibold text-gray-900 dark:text-white">Valiz Kontrol Listesi</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{checkedCount}/{packing.length} hazır</p>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-4">
            <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${packing.length ? (checkedCount / packing.length) * 100 : 0}%` }} />
          </div>
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-44">
            {packing.map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => setPacking(prev => prev.map((p, j) => j === i ? { ...p, checked: !p.checked } : p))}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                />
                <span className={`text-sm transition-all ${item.checked ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>{item.label}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setPacking(DEFAULT_PACKING.map(p => ({ ...p, checked: false })))}
              className="flex-1 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Sıfırla
            </button>
            <button
              onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="flex-1 text-sm font-semibold text-white bg-blue-600 py-2 rounded-xl hover:bg-blue-700 transition-all"
            >
              Plan oluştur →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer modals content
const FOOTER_PAGES = {
  hakkinda: {
    title: 'Hakkında',
    content: `Gezish AI, yapay zeka teknolojisini kullanan ücretsiz bir seyahat planlama platformudur. Groq altyapısıyla desteklenen llama-3.3-70b modeli sayesinde, gideceğin destinasyon ve ilgi alanlarına göre saatlik detaylı gezi planları oluşturur.

Amacımız seyahat planlamasını herkes için kolay, hızlı ve kişisel hale getirmektir. Ücretli rehber kitapları ya da saatler süren araştırma yerine, saniyeler içinde hazır ve uygulanabilir bir plan.

Gezish AI sürekli geliştirilmektedir. Topluluk planları, vize bilgileri, canlı döviz kurları ve valiz listesi gibi özellikler bu deneyimi tamamlamak için tasarlanmıştır.`
  },
  gizlilik: {
    title: 'Gizlilik Politikası',
    content: `Gezish AI olarak kullanıcı gizliliğine önem veriyoruz.

Topladığımız veriler: Hesap oluşturduğunda e-posta adresin ve ismin Firebase Authentication üzerinde güvenli şekilde saklanır. Oluşturduğun ve kaydettiğin planlar yalnızca senin hesabınla ilişkilendirilmiş şekilde Firestore'da tutulur.

Paylaşmadığımız veriler: Kişisel bilgilerin hiçbir üçüncü tarafla pazarlama amaçlı paylaşılmaz.

API kullanımı: Plan oluşturma sırasında girdiğin destinasyon ve tercihler Groq API'ya gönderilir; bu veriler Groq'un gizlilik politikasına tabidir.

Çerezler: Oturum yönetimi için Firebase'in standart authentication çerezleri kullanılır.`
  },
  iletisim: {
    title: 'İletişim',
    content: `Gezish AI hakkında görüş, öneri veya sorunlarınız için bizimle iletişime geçebilirsiniz.

E-mail: emir.sezgin.1907@gmail.com
Geliştirici: Emir Sezgin


Geri bildirimleriniz uygulamanın geliştirilmesine doğrudan katkı sağlar. Bir hata bulduğunuzda veya yeni bir özellik öneriniz olduğunda duymaktan memnuniyet duyarız.

Gezish AI açık kaynak geliştirme sürecinde olup topluluk geri bildirimleriyle şekillenmektedir.`
  },
}

function FooterModal({ page, onClose }) {
  const data = FOOTER_PAGES[page]
  if (!data) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">✕</button>
        <h2 className="font-serif text-2xl font-semibold text-gray-900 dark:text-white mb-5">{data.title}</h2>
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{data.content}</div>
      </div>
    </div>
  )
}

// Footer
export function Footer() {
  const [modal, setModal] = useState(null)

  return (
    <>
      {modal && <FooterModal page={modal} onClose={() => setModal(null)} />}
      <footer className="bg-gray-900 text-white pt-12 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          <div>
            <div className="font-serif text-2xl font-semibold mb-3">Gezish <span className="text-blue-400">AI</span></div>
            <p className="text-sm text-white/50 leading-relaxed">Yapay zeka destekli seyahat planlayıcı.</p>
          </div>
          {/* Ürün */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Ürün</div>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Özellikler', href: '#features' },
                { label: 'Araçlar', href: '#tools' },
                { label: 'Topluluk Planları', href: '#community' },
                { label: 'Destinasyonlar', href: '#destinations' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform bilgisi */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Platform</div>
            <ul className="flex flex-col gap-2.5">
              {[
                { icon: '✦', text: '12.000+ plan oluşturuldu' },
                { icon: '🌍', text: 'Dünya geneli tüm destinasyonlar' },
                { icon: '🆓', text: 'Tamamen ücretsiz' },
                { icon: '🇹🇷', text: 'Türkçe & İngilizce' },
              ].map(item => (
                <li key={item.text} className="flex items-center gap-2 text-sm text-white/50">
                  <span className="text-xs">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Şirket */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Şirket</div>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'Hakkında', modal: 'hakkinda' },
                { label: 'Gizlilik', modal: 'gizlilik' },
                { label: 'İletişim', modal: 'iletisim' },
              ].map(l => (
                <li key={l.label}>
                  <button
                    onClick={() => setModal(l.modal)}
                    className="text-sm text-white/60 hover:text-white transition-colors text-left"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-6 gap-3">
          <span className="text-xs text-white/30">© 2026 Gezish AI. Tüm hakları saklıdır.</span>
          <span className="text-xs text-white/30">Groq AI · llama-3.3-70b ile güçlendirilmiştir</span>
        </div>
      </footer>
    </>
  )
}
