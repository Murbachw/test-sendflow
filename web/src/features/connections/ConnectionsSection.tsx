import { Button, IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import type { Connection } from '../../types/firestore'

type ConnectionsSectionProps = {
  connections: Connection[]
  activeConnectionId: string
  onCreate: () => void
  onEdit: (item: Connection) => void
  onRemove: (item: Connection) => Promise<void>
  onSelect: (connectionId: string) => void
}

export const ConnectionsSection = ({
  activeConnectionId,
  connections,
  onCreate,
  onEdit,
  onRemove,
  onSelect,
}: ConnectionsSectionProps) => (
  <SectionCard
    action={
      <Button onClick={onCreate} startIcon={<AddIcon />} variant="contained">
        Nova conexao
      </Button>
    }
    description="Cada conexao organiza seus contatos e mensagens."
    title="Conexoes"
  >
    {connections.length === 0 ? (
      <EmptyState
        actionLabel="Criar conexao"
        description="Crie a primeira conexao para destravar o cadastro de contatos e mensagens."
        onAction={onCreate}
        title="Nenhuma conexao cadastrada"
      />
    ) : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {connections.map((item) => (
          <div
            key={item.id}
            className={`rounded-[26px] border p-5 transition ${item.id === activeConnectionId ? 'border-cyan-300 bg-[linear-gradient(180deg,#f8fdff,#eef8ff)] shadow-[0_16px_40px_rgba(8,145,178,0.12)]' : 'border-slate-200/80 bg-white/96'}`}
          >
            <Typography variant="h6">{item.name}</Typography>
            <div className="mt-5 flex gap-2">
              <Button onClick={() => onSelect(item.id)} variant="outlined">
                Selecionar
              </Button>
              <IconButton onClick={() => onEdit(item)}>
                <EditOutlinedIcon />
              </IconButton>
              <IconButton color="error" onClick={() => void onRemove(item)}>
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    )}
  </SectionCard>
)
