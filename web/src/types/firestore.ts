import type { Timestamp } from 'firebase/firestore'

export type Connection = {
  id: string
  tenantId: string
  name: string
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

export type Contact = {
  id: string
  tenantId: string
  connectionId: string
  name: string
  phone: string
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

export type MessageStatus = 'scheduled' | 'sent'

export type Message = {
  id: string
  tenantId: string
  connectionId: string
  body: string
  contactIds: string[]
  status: MessageStatus
  scheduledAt: Timestamp | null
  sentAt: Timestamp | null
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}
