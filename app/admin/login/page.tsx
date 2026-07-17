import { LoginForm } from './LoginForm'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Admin Login' }

export default function AdminLoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles['logo-mark']}>65°</span>
          <span className={styles['logo-text']}>Admin</span>
        </div>
        <h1 className={styles.title}>Sign in</h1>
        <LoginForm />
      </div>
    </div>
  )
}
