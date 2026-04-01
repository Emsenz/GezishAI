import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const register = (email, password, name) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(result => updateProfile(result.user, { displayName: name }))
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => signOut(auth)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setUser(user)
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}