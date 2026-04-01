import { useState } from 'react'
import { useAuth } from '../AuthContext'

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.email, form.password, form.name)
      }
      onClose()
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.',
        'auth/wrong-password': 'Şifre hatalı.',
        'auth/email-already-in-use': 'Bu e-posta zaten kayıtlı.',
        'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
        'auth/invalid-email': 'Geçersiz e-posta adresi.',
        'auth/invalid-credential': 'E-posta veya şifre hatalı.',
      }
      setError(messages[err.code] || 'Bir hata oluştu: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="font-serif text-lg font-semibold text-gray-900">
            Gezish <span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-1">
          {mode === 'login' ? 'Hoş geldin' : 'Hesap oluştur'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {mode === 'login' ? 'Planlarına erişmek için giriş yap.' : 'Ücretsiz hesabını oluştur, planlarını kaydet.'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Ad Soyad</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Örnek: Yılmaz Sezgin"
                required
                className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">E-posta</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="ornek@email.com"
              required
              className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Şifre</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="En az 6 karakter"
              required
              className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-base font-semibold text-white bg-gray-900 py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all mt-1"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'
            )}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-sm text-center text-gray-500 mt-4">
          {mode === 'login' ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}
          {' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-blue-600 font-medium hover:underline"
          >
            {mode === 'login' ? 'Kayıt ol' : 'Giriş yap'}
          </button>
        </p>
      </div>
    </div>
  )
}