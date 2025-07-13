const sdk = require("node-appwrite");

// Hardcoded config from Appwriteconfig
const endpoint = "https://cloud.appwrite.io/v1";
const projectId = "67fc0576000b05b9e495";
const databaseId = "67fc08930035410438a5";
const collectionId = "6813961c00369dd87643";
const apiKey = "standard_5f7cc6073bb05307b3c0a27c80cd9ed3a8c204b1b25789a2feab31d0fa688af8ed4e017f249c7e46c5b870db543117fa3ecfa92224f6209170776841159d9282e46ec7000ec305af6a4c67e25f59578076e25b232643ce4c1221f6660cffc0a9910eb5b8603f1ec4e7ca3051475ad067081d4feaa3591a7afa555be1801f76db";

const client = new sdk.Client();
client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new sdk.Databases(client);

async function ensureAttribute(attr, size = 100) {
  try {
    const attributes = await databases.listAttributes(databaseId, collectionId);
    const exists = attributes.attributes.some(a => a.key === attr);
    if (!exists) {
      await databases.createStringAttribute(
        databaseId,
        collectionId,
        attr,
        size,
        false // not required
      );
      console.log(`Added "${attr}" attribute to rental properties collection.`);
    } else {
      console.log(`"${attr}" attribute already exists.`);
    }
  } catch (err) {
    console.error(`Error ensuring ${attr} attribute:`, err.message || err);
  }
}

async function main() {
  await ensureAttribute("category");
  await ensureAttribute("condition");
}

main();
