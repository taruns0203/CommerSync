import app from "./app.js";
import { log } from "./utils/logger.js";
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
    log(`🚀 Product service is running at http://localhost:${PORT}`);
});
