export async function fetchUserRepos(username, accessToken) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.message || "An error occurred fetching user data."
    );
  }

  return response.json();
}
