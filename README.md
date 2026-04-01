# Gezish AI ✈️

**AI destekli ücretsiz seyahat planlayıcı.** Şehri, bütçeyi ve ilgi alanlarını gir — saniyeler içinde saatlik detaylı bir gezi planı al.

🌐 **[gezish-ai.vercel.app](https://gezish-ai.vercel.app)** · Türkçe & İngilizce

---

## Özellikler

- **AI Plan Oluşturma** — Groq (llama-3.3-70b) ile saatlik aktiviteler, gerçek mekan isimleri, adresler ve yerel para birimiyle fiyat tahminleri.
- **Çoklu Şehir** — Tek planda birden fazla şehir rotası oluştur.
- **Plan Kaydet & Paylaş** — Planları hesabına kaydet veya tek linkle herkesle paylaş.
- **Topluluk Feed** — Diğer gezginlerin paylaştığı planları keşfet.
- **Döviz Hesaplayıcı** — 45+ para birimi desteği, canlı kur (open.er-api.com)
- **Vize Bilgileri** — Türk pasaportu için 20+ ülke vize durumu + bilinmeyen ülkeler için AI sorgusu.
- **Hava Durumu & İklim** — Destinasyona ve süreye göre iklim ipuçları.
- **Valiz Kontrol Listesi** — İnteraktif checklist ve ilerleme takibi.
- **Dark Mode** — Tam karanlık tema desteği.
- **PDF İndir** — Planı PDF olarak kaydet (giriş gerektirir)
- **Google Maps** — Her aktivite için harita linki.

## Teknoloji

| Katman            | Teknoloji                                   |
| ----------------- | ------------------------------------------- |
| Frontend          | React 19 + Vite                             |
| Stil              | Tailwind CSS                                |
| Auth & Veritabanı | Firebase (Authentication + Firestore)       |
| AI                | Groq API — llama-3.3-70b-versatile          |
| Routing           | React Router v6                             |
| Döviz             | open.er-api.com (ücretsiz, key gerektirmez) |
| Deploy            | Vercel                                      |

## Kurulum

```bash
git clone https://github.com/Emsenz/GezishAI.git
cd GezishAI
npm install
```

Proje kökünde `.env.local` dosyası oluştur:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GROQ_API_KEY=...
```

```bash
npm run dev
```

## Firebase Firestore Güvenlik Kuralları

Firebase Console → Firestore → Rules bölümüne uygula:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/plans/{planId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /publicPlans/{planId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
  }
}
```

## Vercel Deploy

```bash
npm run build
vercel
```

**Vercel Dashboard → Settings → Environment Variables** bölümüne `.env.local` içindeki tüm değişkenleri ekle.

**Firebase Console → Authentication → Authorized Domains** bölümüne deploy edilen domaini ekle (ör. `gezish.vercel.app`).

## Lisans

MIT
