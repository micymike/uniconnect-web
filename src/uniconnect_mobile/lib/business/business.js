import { Databases,Client,Account,ID,Query } from "react-native-appwrite";
import { Appwriteconfig } from "../appwriteenv";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../auth/emailpassword";

const client = new Client();
const account = new Account(client);
const databases = new Databases(client);


client
    .setEndpoint(Appwriteconfig.endpoint) 
    .setProject(Appwriteconfig.projectId) 
    .setPlatform(Appwriteconfig.platform) 
;

export async function createBusiness({businessname,}) {
    try {
        const user = await getCurrentUser()
        const userId = user.user.$id;

         const existingBusinesses = await databases.listDocuments(
            Appwriteconfig.databaseId,
            Appwriteconfig.businesscollectionId,
            [Query.equal("userId", userId)]
        );

        if (existingBusinesses.total > 0) {
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
        });
        return { success: true, response: response,message: "Your Business has been created" };
    } catch (error) {
      return { success: false, message: "Failed to create business try again!" };
      throw error
      console.log("create business Error:", error);
    }
}

export async function getBusinessByID(businessId) {
    try {
        const result = await databases.getDocument(
            Appwriteconfig.databaseId,
            Appwriteconfig.businesscollectionId,
            businessId 
        );

        return { success: true, result:result };

    } catch (error) {
        return { success: false, message: "Failed to get business by details, check your connection" };
        throw error;
    }
}

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
        throw error
        console.log("Error getting business by userId:", error);

    }
}

export async function updateBusiness(businessId, updates) {
    try {
        const response = await databases.updateDocument(
            Appwriteconfig.databaseId,
            Appwriteconfig.businesscollectionId,
            businessId,
            updates
        );
        return { success: true, response, message: "Business updated successfully" };
    } catch (error) {
        console.log("UpdateBusiness Error:", error);
        return { success: false, message: "Failed to update business. Try again!" };
    }
}

export async function storeUsersBusiness() {
    try{
        const user = await account.get();
        const userId = user.$id; 

        const response = await databases.listDocuments(
            Appwriteconfig.databaseId,
            Appwriteconfig.businesscollectionId,
            [Query.equal('userId', userId)]
        );
        if (response.total > 0) {
            const business = response.documents[0];
            await AsyncStorage.setItem('business', JSON.stringify(business));
            return business;
        } else {
            await AsyncStorage.removeItem('business');
            return null;
        }
    }catch(error){
      return {success: false}
      console.log(error)
      throw error;
    }
}
