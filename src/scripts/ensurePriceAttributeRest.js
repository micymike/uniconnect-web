import { Appwriteconfig } from "../appwriteenv.js";

// Usage: Set APPWRITE_API_KEY in your environment before running this script

const API_KEY = process.env.APPWRITE_API_KEY;
if (!API_KEY) {
  console.error("Please set the APPWRITE_API_KEY environment variable.");
  process.exit(1);
}

const endpoint = Appwriteconfig.endpoint.replace(/\/+$/, "");
const projectId = Appwriteconfig.projectId;
const databaseId = Appwriteconfig.databaseId;
const collectionId = Appwriteconfig.rentalPropertiesCollectionId;

async function ensurePriceAttribute() {
  // List attributes
  const listUrl = `${endpoint}/databases/${databaseId}/collections/${collectionId}/attributes`;
  const headers = {
    "X-Appwrite-Project": projectId,
    "X-Appwrite-Key": API_KEY,
    "Content-Type": "application/json",
  };

  const listRes = await fetch(listUrl, { headers });
  if (!listRes.ok) {
    console.error("Failed to list attributes:", await listRes.text());
    process.exit(1);
  }
  const listData = await listRes.json();
  const hasPrice = listData.attributes.some(attr => attr.key === "Price");
  if (hasPrice) {
    console.log('"Price" attribute already exists.');
    return;
  }

  // Create "Price" attribute
  const createUrl = `${endpoint}/databases/${databaseId}/collections/${collectionId}/attributes/string`;
  const createRes = await fetch(createUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      key: "Price",
      size: 255,
      required: false,
    }),
  });
  if (!createRes.ok) {
    console.error("Failed to create Price attribute:", await createRes.text());
    process.exit(1);
  }
  console.log('Added "Price" attribute to rental properties collection.');
}

ensurePriceAttribute();
