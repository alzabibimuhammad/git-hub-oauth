import PatService from "../../../services/pat.mjs";

const handler = async (req, res) => {
  const { id, username, pat } = req.body;

  try {
    const patService = new PatService(id, pat, username);
    const result = await patService.update();

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
