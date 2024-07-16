export const getUserName = async (pat) => {
  try {
    return await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${pat}`,
        "Content-Type": "application/json",
      },
    });
  } catch {}
};
