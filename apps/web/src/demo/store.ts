import type { ContactMessage, ContactPayload } from '../lib/api'

const STORAGE_KEY = 'inboxglow-demo-messages'

function sampleMessages(): ContactMessage[] {
  return [
    {
      id: 'demo-1',
      name: 'Maya Chen',
      email: 'maya@example.com',
      company: 'North & Pine',
      enquiryType: 'New project',
      message: 'We are planning a new product website and would love to discuss the timeline and next steps.',
      status: 'NEW',
      createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-2',
      name: 'Liam Taylor',
      email: 'liam@example.com',
      enquiryType: 'Website refresh',
      message: 'Our current site needs a cleaner mobile experience and updated visual style.',
      status: 'READ',
      createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-3',
      name: 'Aroha Williams',
      email: 'aroha@example.com',
      company: 'Koru Works',
      enquiryType: 'Partnership',
      message: 'I would like to explore a design and development partnership for upcoming client projects.',
      status: 'ARCHIVED',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

function readMessages(): ContactMessage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      const samples = sampleMessages()
      writeMessages(samples)
      return samples
    }
    return JSON.parse(stored) as ContactMessage[]
  } catch {
    return []
  }
}

function writeMessages(messages: ContactMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 450))
}

export async function demoCreateMessage(payload: ContactPayload) {
  await wait()
  const message: ContactMessage = {
    ...payload,
    id: crypto.randomUUID(),
    status: 'NEW',
    createdAt: new Date().toISOString(),
  }
  writeMessages([message, ...readMessages()])
  return { id: message.id, message: 'Your message has been received.' }
}

export async function demoGetMessages() {
  await wait()
  return { messages: readMessages() }
}

export async function demoUpdateMessageStatus(id: string, status: ContactMessage['status']) {
  await wait()
  const messages = readMessages()
  const message = messages.find((item) => item.id === id)
  if (!message) throw new Error('Message not found')
  const updated = { ...message, status }
  writeMessages(messages.map((item) => item.id === id ? updated : item))
  return { message: updated }
}
