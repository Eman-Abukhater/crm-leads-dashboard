import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.heading}>Welcome to Lead Management CRM</h1>
        <p className={styles.description}>
          A streamlined solution for managing and converting leads efficiently. 
          Visualize, organize, and boost your teams performance.
        </p>

        <Link href="/login" className={styles.loginBtn}>
          Login to Continue →
        </Link>
      </main>
    </div>
  );
}
