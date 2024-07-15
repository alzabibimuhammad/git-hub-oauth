import PatService from "@/services/pat";

const handler = async (req, res) => {
  const { username, pat } = req.body;

  try {
    const patService = new PatService(pat, username);
    const result = await patService.store();

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
