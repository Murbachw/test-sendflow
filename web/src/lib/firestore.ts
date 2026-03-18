import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from './firebase'
import type { Connection, Contact, Message, MessageStatus } from '../types/firestore'

type Unsubscribe = ReturnType<typeof onSnapshot>

type ConnectionInput = {
  name: string
}

type ContactInput = {
  connectionId: string
  name: string
  phone: string
}

type MessageInput = {
  connectionId: string
  body: string
  contactIds: string[]
  scheduledAt: Date | null
}

const requireDb = () => {
  if (!db) {
    throw new Error('Firestore nao configurado. Preencha as variaveis VITE_FIREBASE_* no web/.env.local.')
  }

  return db
}

const withId = <T extends { id?: string }>(id: string, data: Omit<T, 'id'>): T => ({
  ...data,
  id,
} as T)

const nowOrNull = (value: Date | null) => (value ? Timestamp.fromDate(value) : null)

const sortByUpdatedAtDesc = <
  T extends {
    updatedAt: Timestamp | null
  },
>(
  items: T[],
) =>
  [...items].sort((left, right) => {
    const leftValue = left.updatedAt?.toMillis() ?? 0
    const rightValue = right.updatedAt?.toMillis() ?? 0
    return rightValue - leftValue
  })

export const observeConnections = (
  tenantId: string,
  onData: (items: Connection[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const q = query(
    collection(requireDb(), 'connections'),
    where('tenantId', '==', tenantId),
  )

  return onSnapshot(
    q,
    (snapshot) => {
      onData(
        sortByUpdatedAtDesc(
          snapshot.docs.map((item) => withId<Connection>(item.id, item.data() as Omit<Connection, 'id'>)),
        ),
      )
    },
    onError,
  )
}

export const createConnection = async (tenantId: string, input: ConnectionInput) =>
  addDoc(collection(requireDb(), 'connections'), {
    tenantId,
    name: input.name.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

export const updateConnection = async (id: string, input: ConnectionInput) =>
  updateDoc(doc(requireDb(), 'connections', id), {
    name: input.name.trim(),
    updatedAt: serverTimestamp(),
  })

export const removeConnection = async (id: string) => deleteDoc(doc(requireDb(), 'connections', id))

export const observeContacts = (
  tenantId: string,
  connectionId: string,
  onData: (items: Contact[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const q = query(
    collection(requireDb(), 'contacts'),
    where('tenantId', '==', tenantId),
    where('connectionId', '==', connectionId),
  )

  return onSnapshot(
    q,
    (snapshot) => {
      onData(
        sortByUpdatedAtDesc(
          snapshot.docs.map((item) => withId<Contact>(item.id, item.data() as Omit<Contact, 'id'>)),
        ),
      )
    },
    onError,
  )
}

export const createContact = async (tenantId: string, input: ContactInput) =>
  addDoc(collection(requireDb(), 'contacts'), {
    tenantId,
    connectionId: input.connectionId,
    name: input.name.trim(),
    phone: input.phone.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

export const updateContact = async (id: string, input: ContactInput) =>
  updateDoc(doc(requireDb(), 'contacts', id), {
    connectionId: input.connectionId,
    name: input.name.trim(),
    phone: input.phone.trim(),
    updatedAt: serverTimestamp(),
  })

export const removeContact = async (id: string) => deleteDoc(doc(requireDb(), 'contacts', id))

export const observeMessages = (
  tenantId: string,
  connectionId: string,
  status: MessageStatus | 'all',
  onData: (items: Message[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  const clauses = [
    where('tenantId', '==', tenantId),
    where('connectionId', '==', connectionId),
  ]

  if (status !== 'all') {
    clauses.push(where('status', '==', status))
  }

  const q = query(collection(requireDb(), 'messages'), ...clauses)

  return onSnapshot(
    q,
    (snapshot) => {
      onData(
        sortByUpdatedAtDesc(
          snapshot.docs.map((item) => withId<Message>(item.id, item.data() as Omit<Message, 'id'>)),
        ),
      )
    },
    onError,
  )
}

export const createMessage = async (tenantId: string, input: MessageInput) => {
  const now = new Date()
  const isScheduled = input.scheduledAt !== null && input.scheduledAt.getTime() > now.getTime()

  return addDoc(collection(requireDb(), 'messages'), {
    tenantId,
    connectionId: input.connectionId,
    body: input.body.trim(),
    contactIds: input.contactIds,
    status: isScheduled ? 'scheduled' : 'sent',
    scheduledAt: nowOrNull(input.scheduledAt),
    sentAt: isScheduled ? null : Timestamp.fromDate(now),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const updateMessage = async (id: string, input: MessageInput) => {
  const now = new Date()
  const isScheduled = input.scheduledAt !== null && input.scheduledAt.getTime() > now.getTime()

  return updateDoc(doc(requireDb(), 'messages', id), {
    connectionId: input.connectionId,
    body: input.body.trim(),
    contactIds: input.contactIds,
    status: isScheduled ? 'scheduled' : 'sent',
    scheduledAt: nowOrNull(input.scheduledAt),
    sentAt: isScheduled ? null : Timestamp.fromDate(now),
    updatedAt: serverTimestamp(),
  })
}

export const removeMessage = async (id: string) => deleteDoc(doc(requireDb(), 'messages', id))
