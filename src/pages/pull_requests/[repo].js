import { prisma } from "@/hooks/prisma";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { format, startOfWeek } from "date-fns";
import DevTimeChart from "@/components/chart";

const PullRequestsPage = ({ initialPullRequests, error }) => {
  const router = useRouter();
  const { repo } = router.query;
  const [pullRequests, setPullRequests] = useState(initialPullRequests);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/repo/pulls/${repo}`);
        const data = await response.json();
        setLoading(false);

        if (response.ok) {
          setPullRequests(data.pullRequests);
          processWeeklyData(data.pullRequests);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Error fetching updated data:", err);
      }
    };
    if (!pullRequests?.length) fetchData();
    else setLoading(false);

    const intervalId = setInterval(fetchData, 3600000);

    return () => clearInterval(intervalId);
  }, [repo]);

  const processWeeklyData = (pullRequests) => {
    const Data = {};

    pullRequests.forEach((pr) => {
      const mergedDate = new Date(pr.merged_at);
      const weekStart = startOfWeek(mergedDate);
      const weekStartStr = format(weekStart, "yyyy-MM-dd");

      if (!Data[weekStartStr]) {
        Data[weekStartStr] = {
          totalDevTime: 0,
          count: 0,
        };
      }

      Data[weekStartStr].totalDevTime += pr.developmentTimeSeconds;
      Data[weekStartStr].count += 1;
    });

    const formattedData = Object.keys(Data).map((week) => ({
      week,
      averageDevTime: Data[week].totalDevTime / Data[week].count,
    }));

    setWeeklyData(formattedData);
  };

  useEffect(() => {
    if (pullRequests.length > 0) {
      processWeeklyData(pullRequests);
    }
  }, [pullRequests]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Pull Requests for {repo}</h1>
      {loading && <p>Loading......</p>}

      <ul>
        {pullRequests?.map((pr) => (
          <li key={pr.id}>
            <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
              {pr.title}
            </a>
            {pr.developmentTimeSeconds && (
              <span> - Development Time: {pr.developmentTimeSeconds}</span>
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => signOut()}>Singout</button>

      <div style={{ width: "1000px", height: "1000px" }}>
        <DevTimeChart weeklyData={weeklyData} />
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { repo } = context.params;
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const pullRequests = await prisma.pulls.findMany({
      where: {
        repo_name: repo,
      },
      include: {
        commits: true,
      },
    });

    const serializablePullRequests = pullRequests.map((pr) => {
      return {
        ...pr,
        merged_at: pr.merged_at ? pr.merged_at.toISOString() : null,
        createdAtDB: pr.createdAtDB.toISOString(),
        commits: pr.commits.map((commit) => ({
          ...commit,
          date: commit.date.toISOString(),
          createdAtDB: commit.createdAtDB.toISOString(),
        })),
      };
    });

    return {
      props: {
        initialPullRequests: serializablePullRequests,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
};

export default PullRequestsPage;
