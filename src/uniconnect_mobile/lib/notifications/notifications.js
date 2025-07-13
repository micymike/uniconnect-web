import { Databases, Client, Query } from "react-native-appwrite";
import { Appwriteconfig } from "../appwriteenv";
import { getCurrentUser } from "../auth/emailpassword";

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(Appwriteconfig.endpoint)
  .setProject(Appwriteconfig.projectId)
  .setPlatform(Appwriteconfig.platform);

export async function fetchNotifications() {
  try {
    const userRes = await getCurrentUser();
    if (!userRes.success || !userRes.user?.$id) {
      return { success: false, message: "No user session found" };
    }
    const userId = userRes.user.$id;

    const res = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.notificationsCollectionId,
      [Query.equal("userId", userId)],
    );

    return { success: true, data: res.documents };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, message: "Failed to fetch notifications", error };
  }
}


export async function sendPushNotification({to,title,body,data = {}}) {
  try {
    const message = {
      to,
      sound: "default",
      title,
      body,
      data,
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const json = await response.json();
    console.log("📤 Notification sent:", json);
    return json;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    throw error;
  }
}
