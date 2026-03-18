import { useEffect, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import type { Contact } from '../../types/firestore'

type MessageDialogProps = {
  contacts: Contact[]
  initialValue?: {
    body: string
    contactIds: string[]
    scheduledAt: string
  }
  open: boolean
  title: string
  onClose: () => void
  onSubmit: (input: { body: string; contactIds: string[]; scheduledAt: string }) => Promise<void>
}

export const MessageDialog = ({ contacts, initialValue, onClose, onSubmit, open, title }: MessageDialogProps) => {
  const [body, setBody] = useState(initialValue?.body ?? '')
  const [contactIds, setContactIds] = useState<string[]>(initialValue?.contactIds ?? [])
  const [isScheduled, setIsScheduled] = useState(Boolean(initialValue?.scheduledAt))
  const [scheduledAt, setScheduledAt] = useState(initialValue?.scheduledAt ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setBody(initialValue?.body ?? '')
      setContactIds(initialValue?.contactIds ?? [])
      setScheduledAt(initialValue?.scheduledAt ?? '')
      setIsScheduled(Boolean(initialValue?.scheduledAt))
    }
  }, [initialValue, open])

  const toggleContact = (contactId: string) => {
    setContactIds((current) =>
      current.includes(contactId)
        ? current.filter((item) => item !== contactId)
        : [...current, contactId],
    )
  }

  const submit = async () => {
    setSaving(true)
    try {
      await onSubmit({
        body,
        contactIds,
        scheduledAt: isScheduled ? scheduledAt : '',
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ overflow: 'visible', pt: 2 }}>
        <Stack spacing={3}>
          <TextField
            autoFocus
            fullWidth
            label="Mensagem"
            margin="normal"
            minRows={4}
            multiline
            onChange={(event) => setBody(event.target.value)}
            value={body}
          />

          <div>
            <Typography className="mb-2 font-semibold" variant="subtitle2">
              Contatos selecionados
            </Typography>
            <div className="grid max-h-72 gap-3 overflow-auto rounded-3xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-2">
              {contacts.map((contact) => {
                const selected = contactIds.includes(contact.id)

                return (
                  <button
                    key={contact.id}
                    onClick={() => toggleContact(contact.id)}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-[20px] border px-4 py-4 text-left transition ${
                      selected
                        ? 'border-cyan-300 bg-white shadow-[0_10px_30px_rgba(8,145,178,0.10)]'
                        : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <Checkbox checked={selected} tabIndex={-1} />
                    <Avatar className={`${selected ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {contact.name.slice(0, 1).toUpperCase()}
                    </Avatar>
                    <div className="min-w-0">
                      <Typography className="truncate font-semibold text-slate-900" variant="body1">
                        {contact.name}
                      </Typography>
                      <Typography className="mt-0.5 text-slate-500" variant="body2">
                        {contact.phone}
                      </Typography>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <FormControlLabel
              control={
                <Checkbox checked={isScheduled} onChange={(event) => setIsScheduled(event.target.checked)} />
              }
              label="Agendar mensagem"
            />
            {isScheduled ? (
              <Box className="mt-2">
                <TextField
                  fullWidth
                  label="Data e hora do disparo"
                  margin="normal"
                  onChange={(event) => setScheduledAt(event.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  type="datetime-local"
                  value={scheduledAt}
                />
              </Box>
            ) : null}
          </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          disabled={saving || !body.trim() || contactIds.length === 0 || (isScheduled && !scheduledAt)}
          onClick={submit}
          variant="contained"
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
