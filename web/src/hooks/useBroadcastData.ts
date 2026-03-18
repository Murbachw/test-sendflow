import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'

import { observeConnections, observeContacts, observeMessages } from '../lib/firestore'
import type { Connection, Contact, Message, MessageStatus } from '../types/firestore'

type UseBroadcastDataResult = {
  connections: Connection[]
  contacts: Contact[]
  messages: Message[]
  selectedConnection: Connection | null
  activeConnectionId: string
  selectedConnectionId: string
  setSelectedConnectionId: (value: string) => void
}

export const useBroadcastData = (
  user: User | null,
  messageFilter: MessageStatus | 'all',
  onError: (message: string) => void,
): UseBroadcastDataResult => {
  const [connections, setConnections] = useState<Connection[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConnectionId, setSelectedConnectionId] = useState('')

  useEffect(() => {
    if (!user) {
      return
    }

    const unsubscribe = observeConnections(user.uid, setConnections, (currentError) => onError(currentError.message))
    return unsubscribe
  }, [onError, user])

  const selectedConnection = useMemo(
    () => connections.find((item) => item.id === selectedConnectionId) ?? connections[0] ?? null,
    [connections, selectedConnectionId],
  )
  const activeConnectionId = selectedConnection?.id ?? ''

  useEffect(() => {
    if (!user || !activeConnectionId) {
      return
    }

    const unsubscribe = observeContacts(user.uid, activeConnectionId, setContacts, (currentError) => onError(currentError.message))
    return unsubscribe
  }, [activeConnectionId, onError, user])

  useEffect(() => {
    if (!user || !activeConnectionId) {
      return
    }

    const unsubscribe = observeMessages(
      user.uid,
      activeConnectionId,
      messageFilter,
      setMessages,
      (currentError) => onError(currentError.message),
    )
    return unsubscribe
  }, [activeConnectionId, messageFilter, onError, user])

  return {
    connections,
    contacts,
    messages,
    selectedConnection,
    activeConnectionId,
    selectedConnectionId,
    setSelectedConnectionId,
  }
}
