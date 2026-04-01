import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PlanResult from './components/PlanResult'
import { Features, Destinations, Community, Tools, Footer } from './components/Others'
import SharedPlan from './pages/SharedPlan'

const t = {
  heroTag: 'AI destekli · tamamen ücretsiz',
  heroLine1: 'Hayalindeki seyahati',
  heroLine2: 'saniyeler içinde',
  heroLine3: 'planla',
  heroDesc: 'Şehri, bütçeyi ve ilgi alanlarını gir — yapay zeka sana özel, saatlik detaylı bir seyahat planı oluştursun.',
  heroCta: 'Planlamaya Başla',
  heroProof: '12.000+ gezgin bu ay plan oluşturdu',
  stat1: 'Plan oluşturuldu', stat2: 'Destinasyon', stat3: 'Memnuniyet',
  formTitle: 'Planını oluştur', formFree: 'Ücretsiz',
  lblDest: 'Şehir / Ülke', lblDays: 'Kaç Gün?', lblBudget: 'Bütçe',
  lblGroup: 'Kimlerle?', lblLang: 'Plan Dili', lblInterests: 'İlgi Alanları',
  lblNotes: 'Özel Notlar', btnGenerate: 'Plan Oluştur',
  navFeatures: 'Özellikler', navDest: 'Destinasyonlar',
  navCommunity: 'Topluluk', navTools: 'Araçlar',
  login: 'Giriş Yap', register: 'Kayıt Ol',
}

function Home() {
  const [plan, setPlan] = useState(null)
  const [planLang, setPlanLang] = useState('tr')

  const handlePlanGenerated = (newPlan, language, destination = '') => {
    setPlanLang(language === 'İngilizce' ? 'en' : 'tr')
    setPlan({ ...newPlan, lang: language === 'İngilizce' ? 'en' : 'tr', destination })
    setTimeout(() => {
      document.getElementById('plan-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans transition-colors">
      <Navbar t={t} onLoadPlan={handlePlanGenerated} />
      <Hero t={t} onPlanGenerated={handlePlanGenerated} />
      <Features t={t} />
      <Destinations t={t} />
      <Community t={t} />
      <Tools t={t} />
      {plan && (
        <div id="plan-section">
          <PlanResult plan={plan} onNewPlan={() => setPlan(null)} t={t} lang={planLang} />
        </div>
      )}
      <Footer t={t} />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plan/:id" element={<SharedPlan />} />
    </Routes>
  )
}
