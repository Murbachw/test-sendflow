import { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

type ConnectionDialogProps = {
  initialValue?: string
  open: boolean
  title: string
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
}

export const ConnectionDialog = ({ initialValue = '', onClose, onSubmit, open, title }: ConnectionDialogProps) => {
  const [name, setName] = useState(initialValue ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(initialValue ?? '')
    }
  }, [initialValue, open])

  const submit = async () => {
    if (name.trim().length === 0) {
      return
    }

    setSaving(true)
    try {
      await onSubmit(name)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ overflow: 'visible', pt: 2 }}>
        <TextField
          autoFocus
          fullWidth
          label="Nome da conexao"
          margin="normal"
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button disabled={saving || name.trim().length === 0} onClick={submit} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
