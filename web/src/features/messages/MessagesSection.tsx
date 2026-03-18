import { Button, IconButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'

import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import { StatusChip } from '../../components/StatusChip'
import { formatDate } from '../../app/utils'
import type { Connection, Contact, Message, MessageStatus } from '../../types/firestore'

type MessagesSectionProps = {
  contacts: Contact[]
  messageFilter: MessageStatus | 'all'
  messages: Message[]
  selectedConnection: Connection | null
  onCreate: () => void
  onEdit: (item: Message) => void
  onFilterChange: (value: MessageStatus | 'all') => void
  onRemove: (item: Message) => Promise<void>
}

export const MessagesSection = ({
  contacts,
  messageFilter,
  messages,
  onCreate,
  onEdit,
  onFilterChange,
  onRemove,
  selectedConnection,
}: MessagesSectionProps) => (
  <SectionCard
    action={
      <Stack direction="row" spacing={2}>
        <Select
          onChange={(event) => onFilterChange(event.target.value as MessageStatus | 'all')}
          size="small"
          value={messageFilter}
        >
          <MenuItem value="all">Todas</MenuItem>
          <MenuItem value="sent">Enviadas</MenuItem>
          <MenuItem value="scheduled">Agendadas</MenuItem>
        </Select>
        <Button
          disabled={!selectedConnection || contacts.length === 0}
          onClick={onCreate}
          startIcon={<SendOutlinedIcon />}
          variant="contained"
        >
          Nova mensagem
        </Button>
      </Stack>
    }
    description={
      selectedConnection
        ? `Mensagens da conexao ${selectedConnection.name} em tempo real.`
        : 'Selecione uma conexao para visualizar mensagens.'
    }
    title="Mensagens"
  >
    {!selectedConnection ? (
      <EmptyState
        description="As mensagens tambem sao segmentadas por conexao."
        title="Selecione uma conexao"
      />
    ) : contacts.length === 0 ? (
      <EmptyState
        description="Cadastre contatos antes de montar mensagens para esta conexao."
        title="Faltam contatos"
      />
    ) : messages.length === 0 ? (
      <EmptyState
        actionLabel="Criar mensagem"
        description="Monte uma mensagem fake, escolha os contatos e defina se o disparo sera imediato ou agendado."
        onAction={onCreate}
        title="Nenhuma mensagem encontrada"
      />
    ) : (
      <div className="grid gap-4 xl:grid-cols-2">
        {messages.map((item) => {
          const recipients = contacts.filter((contact) => item.contactIds.includes(contact.id))

          return (
            <div key={item.id} className="rounded-[26px] border border-slate-200/80 bg-white/96 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <Typography className="whitespace-pre-wrap" variant="body1">
                  {item.body}
                </Typography>
                <StatusChip status={item.status} />
              </div>
              <Typography className="mt-4 text-slate-500" variant="body2">
                Destinatarios: {recipients.map((contact) => contact.name).join(', ')}
              </Typography>
              {item.scheduledAt ? (
                <Typography className="mt-2 text-slate-500" variant="body2">
                  Agendada para: {formatDate(item.scheduledAt.toDate())}
                </Typography>
              ) : null}
              <Typography className="mt-1 text-slate-500" variant="body2">
                Enviada em: {formatDate(item.sentAt?.toDate() ?? null)}
              </Typography>
              <div className="mt-5 flex gap-2">
                <IconButton onClick={() => onEdit(item)}>
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton color="error" onClick={() => void onRemove(item)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </div>
            </div>
          )
        })}
      </div>
    )}
  </SectionCard>
)
