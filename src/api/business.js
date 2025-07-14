import { Client, Account, Databases, Query, ID } from "appwrite";
import { Appwriteconfig } from "../appwriteenv";

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(Appwriteconfig.endpoint)
  .setProject(Appwriteconfig.projectId);

const account = new Account(client);
const databases = new Databases(client);

export async function getBusinessByUserId(userId) {
  try {
    const res = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.businesscollectionId,
      [Query.equal("userId", userId)]
    );
    if (res.documents && res.documents.length > 0) {
      return { success: true, business: res.documents[0] };
    } else {
      return { success: false, message: "No business found for this user" };
    }
  } catch (error) {
    return { success: false, message: "Failed to get business by userId" };
  }
}

export async function createBusiness({ businessname, userId }) {
  try {
    // Check if user already has a business
    const existing = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.businesscollectionId,
      [Query.equal("userId", userId)]
    );
    if (existing.total > 0) {
      return {
        success: false,
        message: "You already own a business profile. You can't create another.",
      };
    }
    const response = await databases.createDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.businesscollectionId,
      ID.unique(),
      {
        userId: userId,
        name: businessname,
      }
    );
    return { success: true, response, message: "Your Business has been created" };
  } catch (error) {
    // Match mobile error message
    return { success: false, message: "Failed to create business try again!" };
  }
}
