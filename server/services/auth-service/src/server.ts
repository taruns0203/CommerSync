import app from "./app";
import { log } from "./utils/logger";

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  log(`🚀 Product service is running at http://localhost:${PORT}`);
});
