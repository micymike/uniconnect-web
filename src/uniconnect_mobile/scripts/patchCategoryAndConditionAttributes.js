const { ensureCategoryAttribute, ensureConditionAttribute } = require("../lib/rentals/rental");

async function main() {
  await ensureCategoryAttribute();
  await ensureConditionAttribute();
}

main();
