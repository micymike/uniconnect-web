import { Client, Account, Databases, ID, Query } from "appwrite";

// Appwrite configuration (from mobile config)
const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67fc0576000b05b9e495",
  databaseId: "67fc08930035410438a5",
  usercollectionId: "users",
};

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const account = new Account(client);
const databases = new Databases(client);

/**
 * Google OAuth2 login for web.
 * This will redirect to Google, then back to the app.
 * After redirect, use processGoogleOAuthCallback() to handle the result.
 */
export function signInWithGoogle() {
  const successUrl = window.location.origin + "/signin";
  const failureUrl = window.location.origin + "/signin?error=google";
  account.createOAuth2Session("google", successUrl, failureUrl);
}

/**
 * Process Google OAuth callback after redirect.
 * Returns { success, needsReferral, userData } or { success: false, message }
 */
export async function processGoogleOAuthCallback() {
  try {
    // Check if we have a session from Google OAuth
    const user = await account.get();
    if (!user || !user.email) {
      return { success: false, message: "No Google session found" };
    }

    const googleusername = user.name;
    const googleemail = user.email;
    const googlepassword = `${googleemail}_GPass#123`;
    const googlePhotoUrl = user.prefs?.avatar || null;
    const emailpasswordBoolean = false;

    // Check if user exists in our database
    const userExists = await checkIfUserExists(googleemail);

    if (userExists) {
      // User exists - sign them in
      const sessionResult = await signIn(googleemail, googlepassword, emailpasswordBoolean);
      if (sessionResult.success) {
        return { 
          success: true, 
          needsReferral: false, 
          user: sessionResult.user,
          session: sessionResult.session
        };
      } else {
        return { success: false, message: sessionResult.message };
      }
    } else {
      // User doesn't exist - needs signup with referral
      return {
        success: true,
        needsReferral: true,
        userData: {
          googleemail,
          googleusername,
          googlePhotoUrl,
          googlepassword,
          emailpasswordBoolean
        }
      };
    }
  } catch (error) {
    return { success: false, message: error.message || "Failed to process Google OAuth" };
  }
}

/**
 * Complete Google signup with referral code.
 * Call this after processGoogleOAuthCallback returns needsReferral: true
 */
export async function completeGoogleSignup(userData, referralCode = "") {
  try {
    // Validate referral code if provided
    if (referralCode && referralCode.trim()) {
      const isValid = await validateReferralCode(referralCode.trim());
      if (!isValid) {
        return { success: false, message: "Invalid referral code" };
      }
    }

    // Create account
    const signupResult = await signupwithemail(
      userData.googleemail,
      userData.googlepassword,
      userData.googleusername,
      userData.googlePhotoUrl,
      referralCode.trim() || "",
      userData.emailpasswordBoolean,
      ""
    );

    if (!signupResult.success) {
      return { success: false, message: signupResult.message };
    }

    // Auto sign in after signup
    const sessionResult = await signIn(
      userData.googleemail,
      userData.googlepassword,
      userData.emailpasswordBoolean
    );

    if (sessionResult.success) {
      return {
        success: true,
        user: sessionResult.user,
        session: sessionResult.session
      };
    } else {
      return { success: false, message: "Account created but sign-in failed" };
    }
  } catch (error) {
    return { success: false, message: error.message || "Failed to complete Google signup" };
  }
}

/**
 * Check if a user exists by email.
 * Returns true if user exists, false otherwise.
 */
export async function checkIfUserExists(email) {
  try {
    const existing = await databases.listDocuments(
      config.databaseId,
      config.usercollectionId,
      [Query.equal("email", [email])]
    );
    return existing.documents.length > 0;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
}

/**
 * Validate a referral code.
 * Returns true if valid, false otherwise.
 */
export async function validateReferralCode(referralCode) {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.usercollectionId,
      [Query.equal("referralCode", referralCode)]
    );
    return response.documents.length > 0;
  } catch {
    return false;
  }
}

/**
 * Signup with email, password, username, and optional referral code.
 * Returns { success, user, message }
 */
export async function signupwithemail(
  email,
  password,
  username,
  googlePhotoUrl = "",
  referredByCode = null,
  emailpasswordBoolean = true,
  pushToken = ""
) {
  if (!email || !username || !password) {
    return { success: false, message: "Email, username, and password are required." };
  }

  // Check if email already exists
  let existing;
  try {
    existing = await databases.listDocuments(
      config.databaseId,
      config.usercollectionId,
      [Query.equal("email", [email])]
    );
    if (existing.documents.length > 0) {
      return { success: false, message: "Email is already taken" };
    }
  } catch (err) {
    // Continue with account creation if we can't check
  }

  // Create account
  let newAccount;
  try {
    newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
  } catch (err) {
    return { success: false, message: "Failed to create an account: " + err.message };
  }

  // Generate unique referral code
  let referralCode;
  let isUnique = false;
  while (!isUnique) {
    referralCode = `${username.toLowerCase().replace(/\s/g, "")}${Math.floor(1000 + Math.random() * 9000)}`;
    const codeCheck = await databases.listDocuments(
      config.databaseId,
      config.usercollectionId,
      [Query.equal("referralCode", referralCode)]
    );
    if (codeCheck.documents.length === 0) {
      isUnique = true;
    }
  }

  // Validate referredByCode if provided
  let referredBy = null;
  if (referredByCode) {
    try {
      const referrer = await databases.listDocuments(
        config.databaseId,
        config.usercollectionId,
        [Query.equal("referralCode", referredByCode)]
      );
      if (referrer.documents.length > 0) {
        referredBy = referredByCode;
      }
    } catch {}
  }

  // Create user document
  try {
    await databases.createDocument(
      config.databaseId,
      config.usercollectionId,
      ID.unique(),
      {
        userId: newAccount.$id,
        username,
        email,
        accountType: "offer",
        acceptedTerms: true,
        googlePhotoUrl,
        referralCode,
        referredBy,
        emailpassword: emailpasswordBoolean,
        pushToken,
      }
    );
  } catch (err) {
    return { success: false, message: "Failed to create user document: " + err.message };
  }

  return { success: true, user: newAccount, message: "Account created successfully" };
}

// Sign up with email and password
export async function signUp({ email, password, username, googlePhotoUrl, referredByCode = null, emailpasswordBoolean = true, pushToken = "" }) {
  if (!email || !username || !password) {
    return { success: false, message: "Email, username, and password are required." };
  }

  // Check if email already exists - this requires authentication
  let existing;
  try {
    existing = await databases.listDocuments(
      config.databaseId,
      config.usercollectionId,
      [Query.equal("email", [email])]
    );
  } catch (err) {
    // If we can't check existing users due to permissions, continue with account creation
    existing = { documents: [] };
  }
  if (existing.documents.length > 0) {
    return { success: false, message: "Email is already taken" };
  }

  // Create account
  let newAccount;
  try {
    newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
  } catch (err) {
    return { success: false, message: "Failed to create an account: " + err.message };
  }

  // Generate unique referral code
  const referralCode = `${username.toLowerCase().replace(/\s/g, "")}${Math.floor(1000 + Math.random() * 9000)}`;

  // Validate referredByCode if provided
  let referredBy = referredByCode; // Accept the referral code as-is for now

  // Create user document
  try {
    await databases.createDocument(
      config.databaseId,
      config.usercollectionId,
      ID.unique(),
      {
        userId: newAccount.$id,
        username,
        email,
        accountType: "offer",
        acceptedTerms: true,
        googlePhotoUrl,
        referralCode,
        referredBy,
        emailpassword: emailpasswordBoolean,
        pushToken,
      }
    );
  } catch (err) {
    return { success: false, message: "Failed to create user document: " + err.message };
  }

  return { success: true, user: newAccount, message: "Account created successfully" };
}

// Sign in with email and password
export async function signIn(email, password, emailpasswordBoolean = true) {
  if (!email || !password) return { success: false, message: "Email and password are required." };

  // Try to check if user exists - skip validation if we can't access user documents
  let userDoc = null;
  try {
    const existingUser = await databases.listDocuments(
      config.databaseId,
      config.usercollectionId,
      [Query.equal("email", [email])]
    );
    if (existingUser.documents.length > 0) {
      userDoc = existingUser.documents[0];
      if (emailpasswordBoolean !== userDoc.emailpassword) {
        return {
          success: false,
          message: userDoc.emailpassword
            ? "This account was created using email and password. Please sign in with your credentials."
            : "This account was created using Google. Please sign in with Google.",
        };
      }
    }
  } catch (err) {
    // Continue with authentication even if we can't check user documents
  }

  // End any existing session
  try {
    await account.deleteSession("current");
  } catch {}

  // Create session
  try {
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    // Persist session and user in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("session", JSON.stringify(session));
    return { success: true, message: "Signed in successfully", session, user };
  } catch (err) {
    const appwriteMessage = err?.message || "Something went wrong";
    if (appwriteMessage.toLowerCase().includes("invalid credentials")) {
      return { success: false, message: "Invalid credentials. Please check the email and password." };
    }
    return { success: false, message: appwriteMessage };
  }
}

// Get current auth data from localStorage
export function getAuthData() {
  try {
    const userData = localStorage.getItem("user");
    const sessionData = localStorage.getItem("session");
    const user = userData ? JSON.parse(userData) : null;
    const session = sessionData ? JSON.parse(sessionData) : null;
    return { user, session };
  } catch {
    return { user: null, session: null };
  }
}

// Sign out
export async function signOut() {
  try {
    await account.deleteSession("current");
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    return { success: true, message: "Signed out successfully" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}



// Get current user profile
export async function getCurrentUserProfile() {
  try {
    const user = await account.get();
    const userProfileDocs = await databases.listDocuments(
      config.databaseId,
      config.usercollectionId,
      [Query.equal("userId", [user.$id])]
    );
    if (userProfileDocs.documents.length === 0) {
      return { success: false, message: "User profile not found." };
    }
    return { success: true, profile: userProfileDocs.documents[0] };
  } catch {
    return { success: false, message: "Failed to fetch user profile." };
  }
}
