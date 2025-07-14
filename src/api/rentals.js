import { Client, Databases, Query } from "appwrite";

// Appwrite configuration (from mobile config)
const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67fc0576000b05b9e495",
  databaseId: "67fc08930035410438a5",
  rentalPropertiesCollectionId: "6813961c00369dd87643",
  rentalUnitsCollectionId: "6813965c0018e59b3f32",
};

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);



const databases = new Databases(client);

// Fetch all rental properties
export async function fetchRentals() {
  try {
    const res = await databases.listDocuments(
      config.databaseId,
      config.rentalPropertiesCollectionId,
      [Query.limit(100)]
    );
    console.log("fetchRentals response:", res);
    return { success: true, data: res.documents };
  } catch (err) {
    console.error("fetchRentals error:", err);
    return { success: false, message: err.message };
  }
}

// Fetch all rental units
export async function fetchAllUnits() {
  try {
    const res = await databases.listDocuments(
      config.databaseId,
      config.rentalUnitsCollectionId,
      [Query.limit(100)]
    );
    console.log("fetchAllUnits response:", res);
    return { success: true, data: res.documents };
  } catch (err) {
    console.error("fetchAllUnits error:", err);
    return { success: false, message: err.message };
  }
}
