import type { PropsWithChildren, ReactNode } from 'react'
import { Paper, Stack, Typography } from '@mui/material'

type SectionCardProps = PropsWithChildren<{
  title: string
  description?: string
  action?: ReactNode
}>

export const SectionCard = ({ action, children, description, title }: SectionCardProps) => (
  <Paper className="rounded-[30px] border border-white/80 bg-white/88 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur" elevation={0}>
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
      <div>
        <Typography className="text-slate-900" variant="h5">{title}</Typography>
        {description ? (
          <Typography className="mt-1 text-slate-500" variant="body2">
            {description}
          </Typography>
        ) : null}
      </div>
      {action}
    </Stack>
    <div className="mt-6">{children}</div>
  </Paper>
)
