import { Client, Databases } from "appwrite";
import { Appwriteconfig } from "../appwriteenv.js";

// Ensures the "Price" attribute exists in the rental properties collection
export async function ensurePriceAttribute() {
  try {
    const client = new Client();
    client
      .setEndpoint(Appwriteconfig.endpoint)
      .setProject(Appwriteconfig.projectId);

    const databases = new Databases(client);

    // List attributes to check if "Price" exists
    const attributes = await databases.listAttributes(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId
    );
    const hasPrice = attributes.attributes.some(attr => attr.key === "Price");
    if (!hasPrice) {
      await databases.createStringAttribute(
        Appwriteconfig.databaseId,
        Appwriteconfig.rentalPropertiesCollectionId,
        "Price",
        255,
        false // not required
      );
      console.log('Added "Price" attribute to rental properties collection.');
    } else {
      console.log('"Price" attribute already exists.');
    }
  } catch (err) {
    console.error("Error ensuring Price attribute:", err);
  }
}

// To run this function, import and call ensurePriceAttribute() from an admin script or dev tool.
