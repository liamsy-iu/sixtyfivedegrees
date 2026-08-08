import { Nav } from '@/components/layout/Nav/Nav'
import styles from './loading.module.css'

export default function Loading() {
  return (
    <>
      <Nav />
      <main>
        <div className={styles.container}>
          <div className={styles['hero-inner']}>
            <div className={styles.visual} />
            <div className={styles.info}>
              <div className={`${styles.bar} ${styles.meta}`} />
              <div className={`${styles.bar} ${styles.title}`} />
              <div className={`${styles.bar} ${styles.titleShort}`} />
              <div className={`${styles.bar} ${styles.notes}`} />
              <div className={`${styles.bar} ${styles.price}`} />
              <div className={`${styles.bar} ${styles.button}`} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
