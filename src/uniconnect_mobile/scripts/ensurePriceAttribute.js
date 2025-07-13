const { ensurePriceAttribute } = require('../lib/rentals/rental.js');

(async () => {
  await ensurePriceAttribute();
  process.exit(0);
})();
