import { Chip } from '@mui/material'

import type { MessageStatus } from '../types/firestore'

const statusMap: Record<MessageStatus, { color: 'success' | 'warning'; label: string }> = {
  scheduled: {
    color: 'warning',
    label: 'Agendada',
  },
  sent: {
    color: 'success',
    label: 'Enviada',
  },
}

export const StatusChip = ({ status }: { status: MessageStatus }) => (
  <Chip
    color={statusMap[status].color}
    label={statusMap[status].label}
    size="small"
    sx={{ borderRadius: '999px', fontWeight: 700 }}
  />
)
