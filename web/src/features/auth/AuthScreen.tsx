import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

import { requireAuth } from '../../lib/firebase'

type AuthMode = 'signin' | 'signup'

export const AuthScreen = () => {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    setError('')

    try {
      const firebaseAuth = requireAuth()

      if (mode === 'signup') {
        await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password)
      } else {
        await signInWithEmailAndPassword(firebaseAuth, email.trim(), password)
      }
    } catch (currentError) {
      const message = currentError instanceof Error ? currentError.message : 'Falha de autenticacao'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="flex min-h-screen items-center justify-center px-4 py-10">
      <Paper
        className="w-full max-w-4xl overflow-hidden rounded-[36px] border border-white/70 bg-white/88 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur"
        elevation={0}
      >
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden bg-slate-950 px-7 py-8 text-white md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.28),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.20),transparent_32%)]" />
            <div className="relative">
              <Typography className="tracking-[0.22em] uppercase text-teal-300" variant="caption">
                Broadcast
              </Typography>
              <Typography className="mt-4 max-w-xs" variant="h4">
                Sua operacao em um painel unico.
              </Typography>

              <div className="mt-10 space-y-3">
                {[
                  'Acesso isolado por cliente',
                  'CRUD por conexao',
                  'Mensagens imediatas e agendadas',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 backdrop-blur-sm">
                    <Typography variant="body2">{item}</Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-8 md:px-8 md:py-10">
            <Stack spacing={3}>
              <div>
                <Typography className="tracking-[0.2em] uppercase text-teal-700" variant="caption">
                  Acesso
                </Typography>
                <Typography className="mt-2" variant="h4">
                  {mode === 'signup' ? 'Criar conta' : 'Entrar'}
                </Typography>
              </div>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <TextField
                autoComplete="email"
                label="Email"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
              <TextField
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                label="Senha"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />

              <Button disabled={loading || !email || password.length < 6} onClick={submit} size="large" variant="contained">
                {loading ? <CircularProgress color="inherit" size={22} /> : mode === 'signup' ? 'Cadastrar' : 'Entrar'}
              </Button>

              <Typography className="text-slate-500" variant="body2">
                {mode === 'signup' ? 'Ja possui conta?' : 'Ainda nao possui conta?'}{' '}
                <Link
                  component="button"
                  onClick={() => setMode((current) => (current === 'signup' ? 'signin' : 'signup'))}
                  type="button"
                  underline="hover"
                >
                  {mode === 'signup' ? 'Entrar' : 'Criar conta'}
                </Link>
              </Typography>
            </Stack>
          </div>
        </div>
      </Paper>
    </Box>
  )
}
