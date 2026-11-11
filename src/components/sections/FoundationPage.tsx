import styles from "./FoundationPage.module.css";

type FoundationPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function FoundationPage({
  eyebrow,
  title,
  description,
}: FoundationPageProps) {
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </main>
  );
}
