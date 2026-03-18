import { useEffect, useState } from 'react'
import { Alert, Box, CircularProgress, Container } from '@mui/material'

import { AppShellHeader } from '../components/AppShellHeader'
import { ConfigErrorScreen } from '../components/ConfigErrorScreen'
import { AuthScreen } from '../features/auth/AuthScreen'
import { ConnectionDialog } from '../features/connections/ConnectionDialog'
import { ConnectionsSection } from '../features/connections/ConnectionsSection'
import { ContactDialog } from '../features/contacts/ContactDialog'
import { ContactsSection } from '../features/contacts/ContactsSection'
import { MessageDialog } from '../features/messages/MessageDialog'
import { MessagesSection } from '../features/messages/MessagesSection'
import { useAuthSession } from '../hooks/useAuthSession'
import { useBroadcastData } from '../hooks/useBroadcastData'
import { firebaseSetupError } from '../lib/firebase'
import {
  createConnection,
  createContact,
  createMessage,
  removeConnection,
  removeContact,
  removeMessage,
  updateConnection,
  updateContact,
  updateMessage,
} from '../lib/firestore'
import type { Connection, Contact, Message, MessageStatus } from '../types/firestore'
import type { TabValue } from './types'
import { toDate, toLocalDatetime } from './utils'
import { WorkspaceTabs } from '../components/WorkspaceTabs'

export const App = () => {
  const { loading, user } = useAuthSession()
  const [tab, setTab] = useState<TabValue>('connections')
  const [messageFilter, setMessageFilter] = useState<MessageStatus | 'all'>('all')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [connectionDialog, setConnectionDialog] = useState<{ open: boolean; item?: Connection }>({ open: false })
  const [contactDialog, setContactDialog] = useState<{ open: boolean; item?: Contact }>({ open: false })
  const [messageDialog, setMessageDialog] = useState<{ open: boolean; item?: Message }>({ open: false })

  const {
    activeConnectionId,
    connections,
    contacts,
    messages,
    selectedConnection,
    selectedConnectionId,
    setSelectedConnectionId,
  } = useBroadcastData(user, messageFilter, setError)

  const showSuccess = (message: string) => {
    setFeedback(message)
    setError('')
  }

  useEffect(() => {
    if (!feedback) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback('')
    }, 3500)

    return () => window.clearTimeout(timeoutId)
  }, [feedback])

  useEffect(() => {
    if (!error) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setError('')
    }, 5000)

    return () => window.clearTimeout(timeoutId)
  }, [error])

  const closeConnectionDialog = () => {
    setConnectionDialog({
      open: false,
      item: undefined,
    })
  }

  const openCreateConnectionDialog = () => {
    setConnectionDialog({
      open: true,
      item: undefined,
    })
  }

  const openEditConnectionDialog = (item: Connection) => {
    setConnectionDialog({
      open: true,
      item,
    })
  }

  if (firebaseSetupError) {
    return <ConfigErrorScreen error={firebaseSetupError} />
  }

  if (loading) {
    return (
      <Box className="flex min-h-screen items-center justify-center">
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  const submitConnection = async (name: string) => {
    if (connectionDialog.item) {
      closeConnectionDialog()
      await updateConnection(connectionDialog.item.id, { name })
      showSuccess('Conexao atualizada')
      return
    }

    closeConnectionDialog()
    await createConnection(user.uid, { name })
    showSuccess('Conexao criada')
  }

  const requireConnection = () => {
    if (!selectedConnection) {
      throw new Error('Selecione uma conexao')
    }
  }

  return (
    <Box className="min-h-screen pb-10">
      <AppShellHeader
        connections={connections}
        onConnectionChange={setSelectedConnectionId}
        selectedConnectionId={selectedConnection?.id ?? selectedConnectionId}
        user={user}
      />

      <Container className="pt-8" maxWidth="xl">
        <WorkspaceTabs onTabChange={setTab} selectedConnection={selectedConnection} tab={tab} />

        {feedback ? <Alert className="mb-4" onClose={() => setFeedback('')} severity="success">{feedback}</Alert> : null}
        {error ? <Alert className="mb-4" onClose={() => setError('')} severity="error">{error}</Alert> : null}

        {tab === 'connections' ? (
          <ConnectionsSection
            activeConnectionId={activeConnectionId}
            connections={connections}
            onCreate={openCreateConnectionDialog}
            onEdit={openEditConnectionDialog}
            onRemove={async (item) => {
              await removeConnection(item.id)
              showSuccess('Conexao removida')
            }}
            onSelect={setSelectedConnectionId}
          />
        ) : null}

        {tab === 'contacts' ? (
          <ContactsSection
            contacts={contacts}
            onCreate={() => setContactDialog({ open: true })}
            onEdit={(item) => setContactDialog({ open: true, item })}
            onRemove={async (item) => {
              await removeContact(item.id)
              showSuccess('Contato removido')
            }}
            selectedConnection={selectedConnection}
          />
        ) : null}

        {tab === 'messages' ? (
          <MessagesSection
            contacts={contacts}
            messageFilter={messageFilter}
            messages={messages}
            onCreate={() => setMessageDialog({ open: true })}
            onEdit={(item) => setMessageDialog({ open: true, item })}
            onFilterChange={setMessageFilter}
            onRemove={async (item) => {
              await removeMessage(item.id)
              showSuccess('Mensagem removida')
            }}
            selectedConnection={selectedConnection}
          />
        ) : null}
      </Container>

      <ConnectionDialog
        initialValue={connectionDialog.item?.name}
        onClose={closeConnectionDialog}
        onSubmit={submitConnection}
        open={connectionDialog.open}
        title={connectionDialog.item ? 'Editar conexao' : 'Nova conexao'}
      />

      <ContactDialog
        initialValue={
          contactDialog.item
            ? {
                name: contactDialog.item.name,
                phone: contactDialog.item.phone,
              }
            : undefined
        }
        onClose={() => setContactDialog({ open: false })}
        onSubmit={async ({ name, phone }) => {
          requireConnection()

          if (contactDialog.item) {
            await updateContact(contactDialog.item.id, {
              connectionId: activeConnectionId,
              name,
              phone,
            })
            showSuccess('Contato atualizado')
            return
          }

          await createContact(user.uid, {
            connectionId: activeConnectionId,
            name,
            phone,
          })
          showSuccess('Contato criado')
        }}
        open={contactDialog.open}
        title={contactDialog.item ? 'Editar contato' : 'Novo contato'}
      />

      <MessageDialog
        contacts={contacts}
        initialValue={
          messageDialog.item
            ? {
                body: messageDialog.item.body,
                contactIds: messageDialog.item.contactIds,
                scheduledAt: toLocalDatetime(messageDialog.item.scheduledAt?.toDate() ?? null),
              }
            : undefined
        }
        onClose={() => setMessageDialog({ open: false })}
        onSubmit={async ({ body, contactIds, scheduledAt }) => {
          requireConnection()

          const payload = {
            connectionId: activeConnectionId,
            body,
            contactIds,
            scheduledAt: toDate(scheduledAt),
          }

          if (messageDialog.item) {
            await updateMessage(messageDialog.item.id, payload)
            showSuccess('Mensagem atualizada')
            return
          }

          await createMessage(user.uid, payload)
          showSuccess('Mensagem criada')
        }}
        open={messageDialog.open}
        title={messageDialog.item ? 'Editar mensagem' : 'Nova mensagem'}
      />
    </Box>
  )
}
