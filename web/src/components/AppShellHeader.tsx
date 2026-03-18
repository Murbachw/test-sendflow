import { AppBar, Avatar, Container, IconButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { signOut, type User } from 'firebase/auth'

import type { Connection } from '../types/firestore'
import { requireAuth } from '../lib/firebase'

type AppShellHeaderProps = {
  connections: Connection[]
  selectedConnectionId: string
  user: User
  onConnectionChange: (value: string) => void
}

export const AppShellHeader = ({
  connections,
  onConnectionChange,
  selectedConnectionId,
  user,
}: AppShellHeaderProps) => (
  <AppBar
    className="border-b border-white/10 bg-[linear-gradient(135deg,#0f172a_0%,#162033_45%,#155e75_100%)] backdrop-blur"
    elevation={0}
    position="sticky"
  >
    <Container maxWidth="xl">
      <div className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-lg font-semibold text-white shadow-inner shadow-white/5">
            B
          </div>
          <div>
            <Typography className="tracking-[0.25em] uppercase text-cyan-300" variant="caption">
              Broadcast
            </Typography>
            <Typography className="text-white" variant="h5">
              Painel do cliente
            </Typography>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {connections.length > 0 ? (
            <Select
              className="min-w-64 rounded-full bg-white/92"
              displayEmpty
              onChange={(event) => onConnectionChange(event.target.value)}
              size="small"
              value={selectedConnectionId}
            >
              {connections.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          ) : null}
          <Stack
            alignItems="center"
            className="rounded-full border border-white/10 bg-white/8 px-2 py-1.5 backdrop-blur"
            direction="row"
            spacing={1.5}
          >
            <Avatar className="bg-white/85 text-slate-900">{user.email?.slice(0, 1).toUpperCase()}</Avatar>
            <div>
              <Typography className="text-white" variant="body2">
                {user.email}
              </Typography>
            </div>
            <IconButton color="inherit" onClick={() => signOut(requireAuth())}>
              <LogoutIcon />
            </IconButton>
          </Stack>
        </div>
      </div>
    </Container>
  </AppBar>
)
