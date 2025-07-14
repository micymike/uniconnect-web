import { Client , Account , ID, Databases , Query} from 'react-native-appwrite';
import { Appwriteconfig } from '../appwriteenv';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';


const client = new Client();
const account = new Account(client);
const databases = new Databases(client);


client
    .setEndpoint(Appwriteconfig.endpoint) 
    .setProject(Appwriteconfig.projectId) 
    .setPlatform(Appwriteconfig.platform) 
;

GoogleSignin.configure(
    {
        webClientId: '454498792848-2074vpj35co3pokl9maaso6nc5chsrl9.apps.googleusercontent.com',
        scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
        offlineAccess: true,
    }
);

export async function googleOAuth() {
    try{
        await GoogleSignin.hasPlayServices();

        await GoogleSignin.signOut();

        const response = await GoogleSignin.signIn();

        return response;
    }catch(error){
      throw error;
    }
}

export async function checkIfUserExists(email) {
    try {
      const response = await databases.listDocuments(
        Appwriteconfig.databaseId, 
        Appwriteconfig.usercollectionId, 
        [Query.equal("email", [email])] 
      );
  
      return response.documents.length > 0;
    } catch (error) {
      return false;
      throw error
       console.error("Error checking if user exists:", error);

       if (error.code === 404 && error.type === "document_not_found") {
         return false; 
       }

       
    }
}

export async  function currentuserInfo(id){
    try{
         const result = await databases.listDocuments(
               Appwriteconfig.databaseId,
               Appwriteconfig.usercollectionId,
               [Query.equal("userId", id)]
         )
         return result
                 
    }catch(error){
        throw error;
    }
}