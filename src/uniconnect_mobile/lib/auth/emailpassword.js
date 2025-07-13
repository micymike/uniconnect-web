import { Databases,Client,Account,ID,Query } from "react-native-appwrite";
import { Appwriteconfig } from "../appwriteenv";
import AsyncStorage from "@react-native-async-storage/async-storage";

const client = new Client();
const account = new Account(client);
const databases = new Databases(client);


client
    .setEndpoint(Appwriteconfig.endpoint) 
    .setProject(Appwriteconfig.projectId) 
    .setPlatform(Appwriteconfig.platform) 
;

export async  function signupwithemail(email,password,username,googlePhotoUrl,referredByCode = null,emailpasswordBoolean,pushToken){
    try{
        if(!email || !username || !password){
            return;
        }

        let AccountExist
        try{
            AccountExist = await databases.listDocuments(
                Appwriteconfig.databaseId,
                Appwriteconfig.usercollectionId,
                [Query.equal("email", [email])] 
            )

            if(AccountExist.documents.length > 0){
                return { success: false, message: "Email is already taken" };
            }else{
                let newAccount;
                try{
                   newAccount = await account.create(
                   ID.unique(),
                   email,
                   password,
                   username
                )
               }catch(createError){
                     console.log("Failed to create an account",createError)
                    throw new Error(`Failed to create an account: ${createError.message}`);
                }

                let referralCode;
                let isUnique = false;

                while (!isUnique) {
                referralCode = `${username.toLowerCase().replace(/\s/g, "")}${Math.floor(1000 + Math.random() * 9000)}`;
                
                const codeCheck = await databases.listDocuments(
                    Appwriteconfig.databaseId,
                    Appwriteconfig.usercollectionId,
                    [Query.equal("referralCode", referralCode)]
                );

                if (codeCheck.documents.length === 0) {
                    isUnique = true;
                }
                }

                let referredBy = null;

                if (referredByCode) {
                try {
                  const referrer = await databases.listDocuments(
                     Appwriteconfig.databaseId,
                    Appwriteconfig.usercollectionId,
                    [Query.equal("referralCode", referredByCode)]
                  );

                if (referrer.documents.length > 0) {
                    referredBy = referredByCode; 
                } else {
                    console.log("Invalid referral code provided");
                }
                } catch (err) {
                    console.log("Error looking up referral code", err);
                }
                }

                let newUser;
                try{
                  newUser =await databases.createDocument(
                      Appwriteconfig.databaseId,
                      Appwriteconfig.usercollectionId,
                      ID.unique(),
                      {
                          userId: newAccount.$id,
                          username: username,
                          email: email,
                          accountType: "offer",
                          acceptedTerms: true,
                          googlePhotoUrl: googlePhotoUrl,
                          referralCode: referralCode,
                          referredBy: referredBy,
                          emailpassword: emailpasswordBoolean,
                          pushToken: pushToken
                      }
                  )
               }catch(newUser){
                  console.log("failed to add new user", newUser)
               }
               return { success: true, user: newAccount,message: "Account created successfully" };
            }

        }catch(error){
            console.log("failed to check if the email is taken")
        }
    }catch(error){
      return { success: false,message: error.message || "Failed to create account, try again or check your connection"}
        console.log(error)
    }
}

export async function  signIn(email,password,emailpasswordBoolean) {
    try {
       if (!email || !password) return;
       
       const existingUser = await databases.listDocuments(
           Appwriteconfig.databaseId,
           Appwriteconfig.usercollectionId,
           [Query.equal("email", [email])]
       );
       
       if (existingUser.documents.length === 0) {
           return { success: false, message: "No account found with this email." };
       }

       const userDoc = existingUser.documents[0];
       console.log(userDoc)

      if (emailpasswordBoolean !== userDoc.emailpassword) {
        return {
          success: false,
          message: userDoc.emailpassword
              ? "This account was created using email and password. Please sign in with your credentials."
              : "This account was created using Google. Please sign in with Google.",
          };

      }
   
       try {
           await account.deleteSession("current");
       } catch (signOutError) {
           console.log("No existing session to delete:", signOutError.message);
       }
   
       try {
           const session = await account.createEmailPasswordSession(email, password);
            const user = await account.get();
           return { success: true, message: "Signed in successfully",session,user,};
       } catch (sessionError) {

   
            console.log("Failed to create session:", sessionError);

            const appwriteMessage = sessionError?.message || "Something went wrong";

            if (appwriteMessage.toLowerCase().includes("invalid credentials")) {
              return { success: false, message: "Invalid credentials. Please check the email and password." };
            }

            return {
              success: false,
              message: appwriteMessage,
        };
       }
   } catch (error) {
    return { success: false, message: error.message || "Failed to signin try again " };
    throw error;       
   }
   }

export const getAuthData = async () => {
  try {
    const userData = await AsyncStorage.getItem("user");
    const sessionData = await AsyncStorage.getItem("session");

    const user = userData ? JSON.parse(userData) : null;
    const session = sessionData ? JSON.parse(sessionData) : null;

    return { user, session };
  } catch (error) {
    return { user: null, session: null };
    throw error
    console.error("Failed to retrieve auth data:", error);
  }
};

export async function signOut() {
    try {
      await account.deleteSession("current");
      return { success: true, message: "Signed out successfully" };
    } catch (error) {
      console.log("er",error)
      return { success: false, message: error.message };
      throw error;
    }
}

export async function updateGoogleImg({ googleemail, googlePhotoUrl }) {
  try {
    const response = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.usercollectionId,
      [Query.equal("email", googleemail)]
    );

    if (response.total === 0) {
      throw new Error("User document not found.");
    }

    const documentId = response.documents[0].$id;

    await databases.updateDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.usercollectionId,
      documentId,
      {
        googlePhotoUrl: googlePhotoUrl,
      }
    );

    return {
      success: true,
      message: "Google photo URL updated successfully.",
    };
  } catch (error) {
    console.log("Error updating Google photo URL:", error);
    return {
      success: false,
      message: error.message || "Failed to update Google photo URL",
    };
    throw error
  }
}
export async function validateReferralCode (referral_code) {
  try {
    const response = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.usercollectionId,
      [Query.equal("referralCode", referral_code)]
    );

    if (response.total === 0) {
      throw new Error("User document not found.");
    }

    return response.documents.length > 0;
  } catch (error) {
    return false;
    throw error
  }
};

export async function getCurrentUser() {
    try {
      const user = await account.get();
      return { success: true, user: user };
    } catch (error) {
      console.log("GetCurrentUser Error:", error);
      return { success: false, message: "No active session found" };
    }
}

export async function updateUserAccountType( accountType) {
  try {
    const user = await getCurrentUser()
    const userId = user.user.$id;

    const userDocs = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.usercollectionId,
      [Query.equal("userId", userId)]
    );

    if (userDocs.total === 0) {
      return { success: false, message: "User document not found" };
    }

    const documentId = userDocs.documents[0].$id;

    const updatedDoc = await databases.updateDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.usercollectionId,
      documentId,
      {
        accountType: accountType,
      }
    );
    return { success: true, updatedDoc: updatedDoc };
  } catch (error) {
    console.error("Failed to update account type:", error);
    return { success: false, message: "Failed to update account type" };
  }
}

export async function recoverPassword(email) {
    try {
      if (!email) {
        return { success: false, message: "Email is required" };
      }

      const existingUser = await databases.listDocuments(
        Appwriteconfig.databaseId,
        Appwriteconfig.usercollectionId,
        [Query.equal("email", [email])]
      );
  
      if (existingUser.documents.length === 0) {
        return {
          success: false,
          message: "No account is associated with this email.",
        };
      }  
  
      await account.createRecovery(
        email,
        'https://appwrite.uniconnect.store/forgotpassword'
      );
  
      return {
        success: true,
        message: "Recovery email sent. Please check your inbox.",
      };
    } catch (error) {
      console.log("RecoverPassword Error:", error);
      return {
        success: false,
        message: error.message || "Failed to send recovery email.",
      };
    }
}

export async function getCurrentUserProfile() {
    try {
      const sessionUser = await account.get();
  
      const userProfileDocs = await databases.listDocuments(
        Appwriteconfig.databaseId,
        Appwriteconfig.usercollectionId,
        [Query.equal("userId", [sessionUser.$id])]
      );
  
      if (userProfileDocs.documents.length === 0) {
        return { success: false, message: "User profile not found." };
      }
  
      const userProfile = userProfileDocs.documents[0];
      return { success: true, profile: userProfile };
  
    } catch (error) {
      return { success: false, message: "Failed to fetch user profile." };
      throw error
      console.log("getCurrentUserProfile Error:", error);
    }
}

export async function getUsersReferredByCode(referralCode) {
  try {
    const response = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.usercollectionId,
      [Query.equal("referredBy", referralCode)]
    );

    return { success: true, users: response.documents };
  } catch (error) {
    return { success: false, message: "Failed to fetch referred users." };
    throw error
    console.error("Error fetching referred users:", error);
  }
}

export async function syncPushTokenToUser(expoPushToken) {
  try {
      const userData = await getCurrentUserProfile();
      console.log(userData.profile.userId)

      const userid = userData.profile.userId;
      if (!userid || !expoPushToken){
        console.log("Missing user ID or push token");
        return
      };

      const currentPushToken = userData.profile.pushToken;

      if (currentPushToken !== expoPushToken) {
        const result = await databases.listDocuments(
            Appwriteconfig.databaseId,
            Appwriteconfig.usercollectionId,
            [Query.equal("userId", userid)]
        );

        if (result.total === 0) {
          console.warn("No user document found for this userId");
          return;
        }

        const docId = result.documents[0].$id;

        const res = await databases.updateDocument(
          Appwriteconfig.databaseId,
          Appwriteconfig.usercollectionId,
          docId,
          {
            pushToken: expoPushToken,
          }
        );

        console.log("Push token synced to user:", expoPushToken);
        return { success: true, message: "Push token synced to user" , res };
      } else {
        return { success: true, message: "Push token is already up to date" };
      }

  }catch(error){
    return {success: false}
    throw error
    console.log("error",error);
  }
}

export async function updateUserSettings(updates = {}) {
  try {
    const user = await account.get();
    const userId = user.$id

    const userDoc = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.usercollectionId,
      [Query.equal("userId", userId)]
    );

    console.log("use",userDoc)

    if (!userDoc.documents.length) {
      throw new Error("User document not found");
    }

    const docId = userDoc.documents[0].$id;

    const updated = await databases.updateDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.usercollectionId,
      docId,
      updates
    );

    return { success: true, data: updated };

  }catch(error){
    console.log(error)
    throw error;
  }
}
