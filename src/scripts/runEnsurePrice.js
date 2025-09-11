import { ensurePriceAttribute } from "../api/ensurePriceAttribute.js";

(async () => {
  await ensurePriceAttribute();
  process.exit(0);
})();
