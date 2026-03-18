import { initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { onDocumentDeleted } from 'firebase-functions/firestore'
import { onSchedule } from 'firebase-functions/scheduler'

initializeApp()

const firestore = getFirestore()

const deleteByQuery = async (
  collectionName: 'contacts' | 'messages',
  connectionId: string,
) => {
  const snapshot = await firestore
    .collection(collectionName)
    .where('connectionId', '==', connectionId)
    .limit(500)
    .get()

  if (snapshot.empty) {
    return
  }

  const batch = firestore.batch()

  snapshot.docs.forEach((item) => {
    batch.delete(item.ref)
  })

  await batch.commit()

  if (snapshot.size === 500) {
    await deleteByQuery(collectionName, connectionId)
  }
}

const updateScheduledMessages = async () => {
  const now = Timestamp.now()
  const snapshot = await firestore
    .collection('messages')
    .where('status', '==', 'scheduled')
    .where('scheduledAt', '<=', now)
    .limit(100)
    .get()

  if (snapshot.empty) {
    logger.info('Nenhuma mensagem agendada pronta para envio')
    return
  }

  const batch = firestore.batch()

  snapshot.docs.forEach((message) => {
    batch.update(message.ref, {
      status: 'sent',
      sentAt: now,
      updatedAt: now,
    })
  })

  await batch.commit()
  logger.info('Mensagens marcadas como enviadas', { count: snapshot.size })
}

export const dispatchScheduledMessages = onSchedule(
  {
    schedule: 'every 1 minutes',
    timeZone: 'America/Sao_Paulo',
    region: 'southamerica-east1',
  },
  async () => {
    await updateScheduledMessages()
  },
)

export const cleanupConnectionData = onDocumentDeleted(
  {
    document: 'connections/{connectionId}',
    region: 'southamerica-east1',
  },
  async (event) => {
    const connectionId = event.params.connectionId

    await Promise.all([
      deleteByQuery('contacts', connectionId),
      deleteByQuery('messages', connectionId),
    ])

    logger.info('Dados relacionados a conexao removidos', { connectionId })
  },
)
