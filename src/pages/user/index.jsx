import { prisma } from "@/hooks/prisma";
import { getSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserPage = ({ initialRepo, error }) => {
  const [repo, setRepo] = useState(initialRepo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/repo/update_repo");
        const data = await response.json();
        setLoading(false);
        if (response.ok) {
          setRepo(data.repo);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Error fetching updated data:", err);
      }
    };

    if (!repo?.length) fetchData();
    else setLoading(false);

    const intervalId = setInterval(fetchData, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>User Repositories</h1>

      {loading && <p>Loading......</p>}

      <ul>
        {repo?.map((repo) => (
          <li key={repo.id}>
            <Link href={`/pull_requests/${repo.name}`} passHref>
              {repo.name}
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => signOut()}>Singout</button>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  console.log("Access token:", session?.accessToken);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const repo = await prisma.repository.findMany({
      where: {
        userName: session.user.username,
      },
    });

    const serializableRepo = repo.map((r) => ({
      ...r,
      createdAtRepo: r.createdAtRepo.toISOString(),
      createdAtDB: r.createdAtDB.toISOString(),
    }));

    return {
      props: {
        initialRepo: serializableRepo,
      },
    };
  } catch (error) {
    console.log("Error in getServerSideProps:", error);
    return {
      props: {
        error: error.message,
      },
    };
  }
};

export default UserPage;
