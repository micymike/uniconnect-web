const { Client, Databases, ID } = require("node-appwrite");

// Hardcoded config from Appwriteconfig
const endpoint = "https://cloud.appwrite.io/v1";
const projectId = "67fc0576000b05b9e495";
const databaseId = "67fc08930035410438a5";
const collectionId = "6813961c00369dd87643";
const apiKey = "standard_5f7cc6073bb05307b3c0a27c80cd9ed3a8c204b1b25789a2feab31d0fa688af8ed4e017f249c7e46c5b870db543117fa3ecfa92224f6209170776841159d9282e46ec7000ec305af6a4c67e25f59578076e25b232643ce4c1221f6660cffc0a9910eb5b8603f1ec4e7ca3051475ad067081d4feaa3591a7afa555be1801f76db";

const client = new Client();
client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function ensurePriceAttribute() {
  try {
    // List attributes to check if "Price" exists
    const attributes = await databases.listAttributes(databaseId, collectionId);
    const hasPrice = attributes.attributes.some(attr => attr.key === "Price");
    if (!hasPrice) {
      await databases.createStringAttribute(
        databaseId,
        collectionId,
        "Price",
        255,
        false // not required
      );
      console.log('Added "Price" attribute to rental properties collection.');
    } else {
      console.log('"Price" attribute already exists.');
    }
  } catch (err) {
    console.error("Error ensuring Price attribute:", err.message || err);
  }
}

ensurePriceAttribute();
