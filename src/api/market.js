import { Client, Databases, Query } from "appwrite";
import { Appwriteconfig } from "../appwriteenv.js";

// Use Appwriteconfig for all IDs and endpoint
const client = new Client();
client
  .setEndpoint(Appwriteconfig.endpoint)
  .setProject(Appwriteconfig.projectId);

const databases = new Databases(client);

// Fetch all marketplace products
export async function fetchAllProducts() {
  try {
    const res = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      [Query.limit(100)]
    );
    return { success: true, data: res.documents };
  } catch (err) {
    console.error("fetchAllProducts error:", err);
    return { success: false, message: err.message };
  }
}
