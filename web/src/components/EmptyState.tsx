import { Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState = ({ actionLabel, description, onAction, title }: EmptyStateProps) => (
  <Stack
    alignItems="center"
    className="rounded-[26px] border border-dashed border-sky-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(240,249,255,0.95))] px-6 py-14 text-center"
    spacing={2}
  >
    <div className="mb-2 h-14 w-14 rounded-2xl bg-slate-950/95" />
    <Typography variant="h6">{title}</Typography>
    <Typography className="max-w-xl text-slate-500" variant="body2">
      {description}
    </Typography>
    {actionLabel && onAction ? (
      <Button onClick={onAction} startIcon={<AddIcon />} variant="contained">
        {actionLabel}
      </Button>
    ) : null}
  </Stack>
)
