import { Button, IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

import { EmptyState } from '../../components/EmptyState'
import { SectionCard } from '../../components/SectionCard'
import type { Connection, Contact } from '../../types/firestore'

type ContactsSectionProps = {
  contacts: Contact[]
  selectedConnection: Connection | null
  onCreate: () => void
  onEdit: (item: Contact) => void
  onRemove: (item: Contact) => Promise<void>
}

export const ContactsSection = ({
  contacts,
  onCreate,
  onEdit,
  onRemove,
  selectedConnection,
}: ContactsSectionProps) => (
  <SectionCard
    action={
      <Button
        disabled={!selectedConnection}
        onClick={onCreate}
        startIcon={<AddIcon />}
        variant="contained"
      >
        Novo contato
      </Button>
    }
    description={
      selectedConnection
        ? `Contatos vinculados a ${selectedConnection.name}.`
        : 'Selecione uma conexao para visualizar os contatos.'
    }
    title="Contatos"
  >
    {!selectedConnection ? (
      <EmptyState
        description="As operacoes de contato dependem de uma conexao selecionada."
        title="Selecione uma conexao"
      />
    ) : contacts.length === 0 ? (
      <EmptyState
        actionLabel="Criar contato"
        description="Cadastre os contatos que receberao as mensagens fake."
        onAction={onCreate}
        title="Nenhum contato nesta conexao"
      />
    ) : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contacts.map((item) => (
          <div key={item.id} className="rounded-[26px] border border-slate-200/80 bg-white/96 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
            <Typography variant="h6">{item.name}</Typography>
            <Typography className="mt-1 text-slate-500" variant="body2">
              {item.phone}
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
        ))}
      </div>
    )}
  </SectionCard>
)
