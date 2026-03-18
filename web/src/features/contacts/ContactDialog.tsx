import { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 2) {
    return digits
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

type ContactDialogProps = {
  initialValue?: {
    name: string
    phone: string
  }
  open: boolean
  title: string
  onClose: () => void
  onSubmit: (input: { name: string; phone: string }) => Promise<void>
}

export const ContactDialog = ({ initialValue, onClose, onSubmit, open, title }: ContactDialogProps) => {
  const [name, setName] = useState(initialValue?.name ?? '')
  const [phone, setPhone] = useState(formatPhone(initialValue?.phone ?? ''))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(initialValue?.name ?? '')
      setPhone(formatPhone(initialValue?.phone ?? ''))
    }
  }, [initialValue, open])

  const submit = async () => {
    setSaving(true)
    try {
      await onSubmit({
        name,
        phone,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ overflow: 'visible', pt: 2 }}>
        <Stack spacing={2}>
          <TextField
            autoFocus
            fullWidth
            label="Nome do contato"
            margin="normal"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
          <TextField
            fullWidth
            label="Telefone"
            margin="normal"
            onChange={(event) => setPhone(formatPhone(event.target.value))}
            placeholder="(11) 99999-9999"
            value={phone}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button disabled={saving || !name.trim() || !phone.trim()} onClick={submit} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
