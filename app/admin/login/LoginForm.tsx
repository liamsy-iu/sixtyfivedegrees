'use client'

import { useActionState } from 'react'
import { loginAction } from '@/lib/actions/admin'
import styles from './page.module.css'

const initial = { error: undefined as string | undefined }

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, initial)

  return (
    <form action={action} className={styles.form}>
      {state.error && <p className={styles.error}>{state.error}</p>}
      <input
        className={styles.input}
        name="password"
        type="password"
        placeholder="Password"
        autoFocus
        required
      />
      <button className={styles.btn} type="submit" disabled={isPending}>
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
