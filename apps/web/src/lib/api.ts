import { demoCreateMessage, demoGetMessages, demoUpdateMessageStatus } from '../demo/store'

export type ContactPayload = {
  name: string
  email: string
  phone?: string
  company?: string
  enquiryType: string
  message: string
  website?: string
}

export type ContactMessage = ContactPayload & {
  id: string
  status: 'NEW' | 'READ' | 'ARCHIVED'
  createdAt: string
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error ?? 'Something went wrong. Please try again.')
  }

  return data as T
}

export function sendContact(payload: ContactPayload) {
  if (DEMO_MODE) return demoCreateMessage(payload)
  return request<{ message: string; id: string }>('/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function getMessages() {
  if (DEMO_MODE) return demoGetMessages()
  return request<{ messages: ContactMessage[] }>('/admin/messages', {
    credentials: 'include',
  })
}

export function updateMessageStatus(
  id: string,
  status: ContactMessage['status'],
) {
  if (DEMO_MODE) return demoUpdateMessageStatus(id, status)
  return request<{ message: ContactMessage }>(`/admin/messages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  })
}

export function loginAdmin(password: string) {
  if (DEMO_MODE) return Promise.resolve({ authenticated: true })
  return request<{ authenticated: true }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  })
}

export function getAdminSession() {
  if (DEMO_MODE) return Promise.resolve({ authenticated: true })
  return request<{ authenticated: true }>('/auth/session', { credentials: 'include' })
}

export function logoutAdmin() {
  if (DEMO_MODE) return Promise.resolve({ authenticated: false })
  return request<{ authenticated: false }>('/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
}
