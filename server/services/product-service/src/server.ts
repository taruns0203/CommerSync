import app from "./app.js";
import { log } from "./utils/logger.js";

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  log(`🚀 Auth service is running at http://localhost:${PORT}`);
});
