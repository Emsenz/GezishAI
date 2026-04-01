import { db } from '../firebase'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  limit as limitQuery,
} from 'firebase/firestore'

// ─── User private plans ───────────────────────────────────────────────────────

export const savePlan = async (userId, plan) => {
  const ref = collection(db, 'users', userId, 'plans')
  const docRef = await addDoc(ref, { ...plan, createdAt: serverTimestamp() })
  return docRef.id
}

export const getUserPlans = async (userId) => {
  const ref = collection(db, 'users', userId, 'plans')
  const q = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ ...d.data(), id: d.id }))
}

export const deletePlan = async (userId, planId) => {
  await deleteDoc(doc(db, 'users', userId, 'plans', planId))
}

// ─── Public shared plans ──────────────────────────────────────────────────────

export const savePublicPlan = async (userId, userName, plan, destination = '', communityVisible = false) => {
  const ref = collection(db, 'publicPlans')
  const validDayCount = Array.isArray(plan.days)
    ? plan.days.filter(d => d.activities && d.activities.length > 0).length
    : null
  const { id: _stripId, ...planData } = plan
  const docRef = await addDoc(ref, {
    ...planData,
    dayCount: validDayCount,
    destination,
    communityVisible,
    authorId: userId,
    authorName: userName || 'Anonim',
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export const makePublicPlanCommunityVisible = async (planId) => {
  await updateDoc(doc(db, 'publicPlans', planId), { communityVisible: true })
}

export const deletePublicPlan = async (planId) => {
  await deleteDoc(doc(db, 'publicPlans', planId))
}

export const getPublicPlan = async (planId) => {
  const ref = doc(db, 'publicPlans', planId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { ...snap.data(), id: snap.id }
}

export const getPublicPlans = async (count = 6) => {
  const ref = collection(db, 'publicPlans')
  // Fetch more than needed to account for non-community plans, filter client-side
  const q = query(ref, orderBy('createdAt', 'desc'), limitQuery(count * 4))
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ ...d.data(), id: d.id }))
    .filter(p => p.communityVisible !== false)
    .slice(0, count)
}
