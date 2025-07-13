/**
 * Patch all chat rooms to ensure participantsID contains only valid user $id values.
 * Usage: node scripts/patchChatroomParticipants.js
 */

const { Client, Databases, Query } = require("node-appwrite");

// TODO: Fill in your Appwrite config here
const Appwriteconfig = {
  endpoint: "https://cloud.appwrite.io/v1",
    platform : "com.uniconnect.x",
    projectId: "67fc0576000b05b9e495",
    databaseId: "67fc08930035410438a5",
    api: "standard_5f7cc6073bb05307b3c0a27c80cd9ed3a8c204b1b25789a2feab31d0fa688af8ed4e017f249c7e46c5b870db543117fa3ecfa92224f6209170776841159d9282e46ec7000ec305af6a4c67e25f59578076e25b232643ce4c1221f6660cffc0a9910eb5b8603f1ec4e7ca3051475ad067081d4feaa3591a7afa555be1801f76db",
    usercollectionId: "users",
    businesscollectionId: "businesses",
    rentalPropertiesCollectionId: "6813961c00369dd87643",
    rentalUnitsCollectionId: "6813965c0018e59b3f32",
    marketplaceCollectionId: "681743700002a53f71d3",
    mealPostsCollectionId: "681887b9000bae23ae6a",
    mealorderCollectionId: "6818b4950024845b5ea8",
    verificationUrl: "https://egertonrentals.online",
    messagesColletionId: "68282d7500169c311073",
    chatroomCollectionId: "68282d8d001d8b708a6c",
    imagesBacketId: "6838c6cc002160032c53",
    // TODO: Replace with your actual notifications collection ID from Appwrite console
    notificationsCollectionId: "YOUR_NOTIFICATIONS_COLLECTION_ID_HERE",
// <-- Fill in your Appwrite API key here (must have write access to chatrooms and read access to users)
};

const client = new Client();
client
  .setEndpoint(Appwriteconfig.endpoint)
  .setProject(Appwriteconfig.projectId)
  .setKey(Appwriteconfig.apiKey);

const databases = new Databases(client);

async function main() {
  // 1. Get all users and build a map of valid user IDs
  const usersRes = await databases.listDocuments(
    Appwriteconfig.databaseId,
    Appwriteconfig.usercollectionId,
    [Query.limit(1000)]
  );
  const validUserIds = new Set(usersRes.documents.map(u => u.$id));

  // 2. Get all chat rooms
  const chatroomsRes = await databases.listDocuments(
    Appwriteconfig.databaseId,
    Appwriteconfig.chatroomCollectionId,
    [Query.limit(1000)]
  );

  for (const chatroom of chatroomsRes.documents) {
    let participants = [];
    if (Array.isArray(chatroom.participantsID)) {
      participants = chatroom.participantsID;
    } else if (typeof chatroom.participantsID === "string") {
      try {
        participants = JSON.parse(chatroom.participantsID);
      } catch (e) {
        console.log(`Skipping chatroom ${chatroom.$id} due to malformed participantsID`);
        continue;
      }
    }
    // Filter to only valid user IDs
    const filtered = participants.filter(id => validUserIds.has(id));
    if (filtered.length !== participants.length) {
      // Patch the chatroom
      await databases.updateDocument(
        Appwriteconfig.databaseId,
        Appwriteconfig.chatroomCollectionId,
        chatroom.$id,
        { participantsID: filtered }
      );
      console.log(`Patched chatroom ${chatroom.$id}:`, filtered);
    }
  }
  console.log("Done patching chatrooms.");
}

main().catch(console.error);
