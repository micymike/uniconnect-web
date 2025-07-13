import { Databases,Client,Account,ID,Query } from "react-native-appwrite";
import { Appwriteconfig } from "../appwriteenv";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendPushNotification } from "../notifications/notifications";


const client = new Client();
const account = new Account(client);
const databases = new Databases(client);

client
    .setEndpoint(Appwriteconfig.endpoint) 
    .setProject(Appwriteconfig.projectId) 
    .setPlatform(Appwriteconfig.platform) 
;


export async function getOrCreateChatRoom(userAId, userBId,currentUsername,businessName) {
  const participants = [userAId, userBId].sort();
  const participantsJSON = JSON.stringify(participants);

  try {
    const res = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.chatroomCollectionId,
      [Query.search("participantsID", userAId), Query.limit(100)]
    );

    for (const doc of res.documents) {
      try {
        const parsed = JSON.parse(doc.participantsID);
        const sorted = parsed.sort();
        if (JSON.stringify(sorted) === participantsJSON) {
          return { success: true, chatroom: doc };
        }
      } catch {}
    }

    const newChatroom = await databases.createDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.chatroomCollectionId,
      ID.unique(),
      {
        usertitle: currentUsername,
        businesstitle: businessName,
        participantsID: participantsJSON,
        lastMessage: "",
        lastMessageAt: new Date().toISOString(),
        lastMessageSenderId: "",
        unreadCounts: JSON.stringify({
          [userAId]: 0,
          [userBId]: 0,
        }),
        group: false,
        createdBy: userBId,
      }
    );

    return { success: true, chatroom: newChatroom };
  } catch (error) {
    return { success: false, error };
    throw error;
  }
}

export async function fetchChatRooms() {
  try {

    const user = await account.get()
    const userId = user.$id
    const result = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.chatroomCollectionId,
      [
        Query.search("participantsID", userId), 
        Query.orderDesc("lastMessageAt")
      ]
    );
    return { success: true,  chatRooms: result.documents };
  } catch (error) {
    return { success: false, error };
    throw error;
  }
}

export async function getOtherParticipant(chatroomId, currentUserId) {
  try {
    const res = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.chatroomCollectionId,
      chatroomId
    );

    const participants = JSON.parse(res.participantsID || "[]");
    const otherUserId = participants.find((id) => id !== currentUserId);

    if (!otherUserId) {
      return { success: false, message: "No other participant found" };
    }

    return {
      success: true,
      receiverId: otherUserId,
      chatroom: res,
    };
  } catch (error) {
    return { success: false, error };
    throw error;
  }
}

export async function deleteAllEmptyChatrooms() {
  try {
    const result = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.chatroomCollectionId,
      [
        Query.equal("lastMessage", ""),
      ]
    );

    const deletions = await Promise.allSettled(
      result.documents.map(doc =>
        databases.deleteDocument(
          Appwriteconfig.databaseId,
          Appwriteconfig.chatroomCollectionId,
          doc.$id
        )
      )
    );

    return {
      success: true,
      deletedCount: deletions.filter(res => res.status === "fulfilled").length,
      failed: deletions.filter(res => res.status === "rejected")
    };
  } catch (error) {
    return { success: false, error };
    throw error;
  }
}

export async function createMessage({ content, senderId, senderName, chatroomId }) {
  try {
    const response = await databases.createDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.messagesColletionId,
      ID.unique(),
      {
        content,
        senderId,
        senderName,
        chatroomId,
        readBy: JSON.stringify([senderId]),
      }
    );

    return { success: true, message: response };
  } catch (error) {
    return { success: false, error };
    throw error;
  }
}

export async function sendMessage({ content, senderId, senderName, receiverId }) {
  try {
    const { success, chatroom, error } = await getOrCreateChatRoom(senderId, receiverId);
    if (!success) return { success: false, error };

    const chatroomId = chatroom.$id;

    const msg = await createMessage({ content, senderId, senderName, chatroomId });
    if (!msg.success) return msg;

    const unread = JSON.parse(chatroom.unreadCounts || "{}");
    unread[receiverId] = (unread[receiverId] || 0) + 1;

    await databases.updateDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.chatroomCollectionId,
      chatroomId,
      {
        lastMessage: content,
        lastMessageAt: new Date().toISOString(),
        lastMessageSenderId: senderId,
        unreadCounts: JSON.stringify(unread),
      }
    );

    const existingUser = await databases.listDocuments(
        Appwriteconfig.databaseId,
        Appwriteconfig.usercollectionId,
        [Query.equal("userId", receiverId)]
      );
  
      if (existingUser.documents.length === 0) {
        console.log("Receiver not found in user collection");
        return; 
      }

      const userDoc = existingUser.documents[0];
      console.log("userDoc",userDoc)

    const expoPushToken = userDoc.pushToken; 

    if (expoPushToken) {
      
      await sendPushNotification({
        to: expoPushToken,
        title: senderName || "New Message",
        body:content.length > 80 ? content.slice(0, 80) + "..." : content,
        data: {
          type: "chat",
          chatroomId: chatroomId
        }
      });
    }

    return { success: true, chatroomId, message: msg.message,expoPushToken: expoPushToken };
  } catch (error) {
    return { success: false, error };
    throw error;
  }
}

export async function getMessages(chatroomId) {
  try {
    const result = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.messagesColletionId,
      [
        Query.equal("chatroomId", chatroomId),
        Query.orderAsc("$createdAt"),
        Query.limit(100),
      ]
    );
    return { success: true, result: result };
  } catch (error) {
    return { success: false, error };
    throw error;
  }
}

export async function markMessagesAsRead(chatroomId, userId) {
  try {
    if (!chatroomId || !userId) {
      console.log("Missing chatroomId or userId for markMessagesAsRead");
      return { success: false, error: "Missing required parameters" };
    }

    console.log("Marking messages as read for:", { chatroomId, userId });

    const messages = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.messagesColletionId,
      [Query.equal("chatroomId", chatroomId), Query.limit(100)]
    );

    let updatedCount = 0;
    
    for (const msg of messages.documents) {
      try {
        const read = JSON.parse(msg.readBy || "[]");
        if (!read.includes(userId)) {
          const updated = [...read, userId];
          await databases.updateDocument(
            Appwriteconfig.databaseId,
            Appwriteconfig.messagesColletionId,
            msg.$id,
            { readBy: JSON.stringify(updated) }
          );
          updatedCount++;
        }
      } catch (msgError) {
        console.log("Error updating message:", msg.$id, msgError);
      }
    }

    console.log(`Updated ${updatedCount} messages as read`);

    try {
      const chatroom = await databases.getDocument(
        Appwriteconfig.databaseId,
        Appwriteconfig.chatroomCollectionId,
        chatroomId
      );
      
      const unread = JSON.parse(chatroom.unreadCounts || "{}");
      unread[userId] = 0;

      await databases.updateDocument(
        Appwriteconfig.databaseId,
        Appwriteconfig.chatroomCollectionId,
        chatroomId,
        { unreadCounts: JSON.stringify(unread) }
      );
      
      console.log("Updated chatroom unread counts");
    } catch (chatroomError) {
      console.log("Error updating chatroom unread counts:", chatroomError);
    }

    return { success: true, updatedCount };
  } catch (error) {
    return { success: false, error };
    throw error;
  }
}

export async function updateMessage(messageId, newContent, isDeleted = false) {
  try {
    if (!messageId) {
      return {
        success: false,
        message: "Message ID is required.",
      };
    }

    if (!isDeleted && (!newContent || !newContent.trim())) {
      return {
        success: false,
        message: "New content is required for message updates.",
      };
    }

    const originalMessage = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.messagesColletionId,
      messageId
    );

    const chatroomId = originalMessage.chatroomId;

    const updateData = isDeleted 
      ? {
          content: "",
          isDeleted: true,
          deletedAt: new Date().toISOString(),
        }
      : {
          content: newContent.trim(),
          isEdited: true,
        };

    const updatedMessage = await databases.updateDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.messagesColletionId,
      messageId,
      updateData
    );

    const recentMessages = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.messagesColletionId,
      [
        Query.equal("chatroomId", chatroomId),
        Query.orderDesc("$createdAt"),
        Query.limit(1),
      ]
    );

    if (
      recentMessages.documents.length > 0 &&
      recentMessages.documents[0].$id === messageId
    ) {
      const lastMessageContent = isDeleted 
        ? "This message was deleted" 
        : newContent.trim();

      await databases.updateDocument(
        Appwriteconfig.databaseId,
        Appwriteconfig.chatroomCollectionId,
        chatroomId,
        {
          lastMessage: lastMessageContent,
          lastMessageAt: new Date().toISOString(),
          lastMessageSenderId: originalMessage.senderId,
        }
      );

      console.log(
        isDeleted 
          ? "Chatroom updated - last message was deleted." 
          : "Chatroom updated with edited last message."
      );
    } else {
      console.log(
        isDeleted 
          ? "Deleted message is not the last one. Chatroom unchanged." 
          : "Edited message is not the last one. Chatroom unchanged."
      );
    }

    return {
      success: true,
      message: isDeleted 
        ? "Message deleted successfully." 
        : "Message updated successfully.",
      result: updatedMessage,
    };
  } catch (error) {
    return { success: false, error };
    throw error;
  }
}

export async function deleteMessage(messageId) {
  try {
    if (!messageId) {
      return {
        success: false,
        message: "Message ID is required.",
      };
    }

    const message = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.messagesColletionId,
      messageId
    );

    const chatroomId = message.chatroomId;
    const senderId = message.senderId;
    const readBy = JSON.parse(message.readBy || "[]");

    const chatroom = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.chatroomCollectionId,
      chatroomId
    );

    const unreadCounts = JSON.parse(chatroom.unreadCounts || "{}");

    for (const userId in unreadCounts) {
      if (userId !== senderId && !readBy.includes(userId)) {
        unreadCounts[userId] = Math.max(0, (unreadCounts[userId] || 0) - 1);
      }
    }

    await databases.deleteDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.messagesColletionId,
      messageId
    );

    const remainingMessages = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.messagesColletionId,
      [
        Query.equal("chatroomId", chatroomId),
        Query.orderDesc("$createdAt"),
        Query.limit(1),
      ]
    );

    if (remainingMessages.documents.length > 0) {
      const latest = remainingMessages.documents[0];

      await databases.updateDocument(
        Appwriteconfig.databaseId,
        Appwriteconfig.chatroomCollectionId,
        chatroomId,
        {
          lastMessage: latest.content,
          lastMessageAt: latest.$createdAt,
          lastMessageSenderId: latest.senderId,
          unreadCounts: JSON.stringify(unreadCounts),
        }
      );
    } else {
      await databases.updateDocument(
        Appwriteconfig.databaseId,
        Appwriteconfig.chatroomCollectionId,
        chatroomId,
        {
          lastMessage: "",
          lastMessageAt: null,
          lastMessageSenderId: null,
          unreadCounts: JSON.stringify(unreadCounts),
        }
      );
    }

    return {
      success: true,
      message: "Message deleted and chatroom updated.",
    };
  } catch (error) {
    return { success: false, error };
    throw error;
  }
}

export async function cleanupOldDeletedMessages() {
  try {
    const now = new Date();
    // const cutoff = new Date(now.getTime() - 60 * 1000); // 1 minute ago for testing
    // const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const cutoff = new Date(now.getTime() - 10 * 1000);

    const oldDeletedMessages = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.messagesColletionId,
      [
        Query.equal("isDeleted", true),
        Query.equal("content", ""),
        Query.lessThan("deletedAt", cutoff.toISOString()),
        Query.limit(100)
      ]
    );

    if (oldDeletedMessages.documents.length === 0) {
      console.log("No old deleted messages found.");
      return { success: true, deletedMessages: 0, deletedChatrooms: 0 };
    }

    let deletedMessageCount = 0;
    let deletedChatroomCount = 0;

    for (const msg of oldDeletedMessages.documents) {
      const chatroomId = msg.chatroomId;

      try {
        await databases.deleteDocument(
          Appwriteconfig.databaseId,
          Appwriteconfig.messagesColletionId,
          msg.$id
        );
        deletedMessageCount++;

        const remainingMessages = await databases.listDocuments(
          Appwriteconfig.databaseId,
          Appwriteconfig.messagesColletionId,
          [
            Query.equal("chatroomId", chatroomId),
            Query.orderDesc("$createdAt"),
            Query.limit(1)
          ]
        );

        if (remainingMessages.documents.length === 0) {
          await databases.deleteDocument(
            Appwriteconfig.databaseId,
            Appwriteconfig.chatroomCollectionId,
            chatroomId
          );
          console.log(`Deleted empty chatroom: ${chatroomId}`);
          deletedChatroomCount++;
        } else {
          const latest = remainingMessages.documents[0];

          await databases.updateDocument(
            Appwriteconfig.databaseId,
            Appwriteconfig.chatroomCollectionId,
            chatroomId,
            {
              lastMessage: latest.isDeleted ? "This message was deleted" : latest.content,
              lastMessageAt: latest.$createdAt,
              lastMessageSenderId: latest.senderId
            }
          );
        }
      } catch (innerError) {
        if (innerError.code !== 404) {
          console.error(`Error processing message ${msg.$id}:`, innerError);
        }
      }
    }

    console.log(`Cleanup complete. Deleted ${deletedMessageCount} messages and ${deletedChatroomCount} empty chatrooms.`);
    return {
      success: true,
      deletedMessages: deletedMessageCount,
      deletedChatrooms: deletedChatroomCount
    };

  } catch (error) {
    console.log(error)
    return { success: false, error };
    throw error;
  }
}
