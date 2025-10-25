import app from "./index"; // ✅ correct for ESM

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
