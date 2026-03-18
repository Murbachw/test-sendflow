import { Alert, Box, Paper, Stack, Typography } from '@mui/material'

type ConfigErrorScreenProps = {
  error: string
}

export const ConfigErrorScreen = ({ error }: ConfigErrorScreenProps) => (
  <Box className="flex min-h-screen items-center justify-center px-4 py-10">
    <Paper className="w-full max-w-3xl rounded-[32px] p-8 shadow-xl" elevation={0}>
      <Stack spacing={3}>
        <div>
          <Typography variant="h4">Firebase nao configurado</Typography>
          <Typography className="mt-2 text-slate-500" variant="body1">
            A aplicacao abriu, mas faltam as variaveis de ambiente do projeto Firebase no frontend.
          </Typography>
        </div>

        <Alert severity="error">{error}</Alert>

        <div>
          <Typography variant="subtitle1">Crie o arquivo `web/.env.local` com:</Typography>
          <pre className="mt-3 overflow-auto rounded-3xl bg-slate-950 p-5 text-sm text-slate-100">
{`VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=`}
          </pre>
        </div>

        <Typography className="text-slate-500" variant="body2">
          Esses valores saem do console do Firebase em Project settings {'>'} General {'>'} Your apps {'>'} SDK setup and configuration.
        </Typography>
      </Stack>
    </Paper>
  </Box>
)
