const { Client, Databases, ID } = require("appwrite");
const { Appwriteconfig } = require("./appwriteenv.cjs");

// Helper to add a test rental property
async function addTestRental() {
  const client = new Client();
  client
    .setEndpoint(Appwriteconfig.endpoint)
    .setProject(Appwriteconfig.projectId);
  const databases = new Databases(client);

  // Dummy data for test property
  const testTitle = "Test House " + Date.now();
  const testData = {
    title: testTitle,
    description: "A test property for verification.",
    location: "Test Location",
    frontImage: "",
    backImage: "",
    userId: "test-user-id",
    businessId: "test-business-id",
    managedBy: "test-user-id",
    contactPhone: "",
    agreed: true,
    latitude: "",
    longitude: "",
    images: JSON.stringify([]),
  };

  // Add property
  const property = await databases.createDocument(
    Appwriteconfig.databaseId,
    Appwriteconfig.rentalPropertiesCollectionId,
    ID.unique(),
    testData
  );
  return property;
}

// Helper to fetch all properties and check for the test property
async function fetchAndCheckTestRental(testTitle) {
  const client = new Client();
  client
    .setEndpoint(Appwriteconfig.endpoint)
    .setProject(Appwriteconfig.projectId);
  const databases = new Databases(client);

  const res = await databases.listDocuments(
    Appwriteconfig.databaseId,
    Appwriteconfig.rentalPropertiesCollectionId
  );
  const found = res.documents.find(doc => doc.title === testTitle);
  if (found) {
    console.log("Test property found:", found);
  } else {
    console.log("Test property NOT found.");
  }
  return found;
}

// Main test function
(async () => {
  try {
    const property = await addTestRental();
    console.log("Added test property:", property);
    const found = await fetchAndCheckTestRental(property.title);
    if (found) {
      console.log("SUCCESS: Newly added house is fetchable.");
    } else {
      console.log("FAIL: Newly added house is NOT fetchable.");
    }
  } catch (err) {
    console.error("Test failed:", err);
  }
})();
