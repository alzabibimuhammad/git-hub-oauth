import styles from "@/styles/login.module.css";
import { FaGithub } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogin = () => {
    window.location.href = "/api/auth/github";
  };
  if (session)
    return (
      <>
        welcome <br />
        <button onClick={() => signOut()}>Singout</button>
        <button onClick={() => router.push("/user")}>User</button>
      </>
    );
  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <div style={{ width: "100%" }}>
          <p className={styles.header}>Login with GitHub</p>
        </div>
        <div className={styles.git_icon} onClick={handleLogin}>
          <FaGithub onClick={() => signIn()} size={32} />
          <div className={styles.arrow}></div>
        </div>
      </div>
    </div>
  );
}
