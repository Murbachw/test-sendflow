import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../lib/firebase'

type AuthSession = {
  loading: boolean
  user: User | null
}

export const useAuthSession = (): AuthSession => {
  const [state, setState] = useState<AuthSession>({
    loading: Boolean(auth),
    user: null,
  })

  useEffect(() => {
    if (!auth) {
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({
        loading: false,
        user,
      })
    })

    return unsubscribe
  }, [])

  return state
}
