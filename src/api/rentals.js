import { Account, Client, Databases, ID, Query, Storage } from "appwrite";
import { Appwriteconfig } from "../appwriteenv";
import { getBusinessByUserId } from "./business";
// FileSystem is not available on web; remove expo-file-system import

const client = new Client();
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Only setEndpoint and setProject are valid for web Appwrite SDK
client
    .setEndpoint(Appwriteconfig.endpoint)
    .setProject(Appwriteconfig.projectId);
// Add attribute creation for Appwrite
export async function ensurePriceAttribute() {
  // This function adds the "Price" attribute to the rental properties collection if it doesn't exist.
  try {
    const client = new Client();
    const databases = new Databases(client);
    client
      .setEndpoint(Appwriteconfig.endpoint)
      .setProject(Appwriteconfig.projectId)
      .setPlatform(Appwriteconfig.platform);

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

export async function ensureCategoryAttribute() {
  // Adds the "category" attribute if it doesn't exist.
  try {
    const client = new Client();
    const databases = new Databases(client);
    client
      .setEndpoint(Appwriteconfig.endpoint)
      .setProject(Appwriteconfig.projectId)
      .setPlatform(Appwriteconfig.platform);

    const attributes = await databases.listAttributes(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId
    );
    const hasCategory = attributes.attributes.some(attr => attr.key === "category");
    if (!hasCategory) {
      await databases.createStringAttribute(
        Appwriteconfig.databaseId,
        Appwriteconfig.rentalPropertiesCollectionId,
        "category",
        100,
        false
      );
      console.log('Added "category" attribute to rental properties collection.');
    } else {
      console.log('"category" attribute already exists.');
    }
  } catch (err) {
    console.error("Error ensuring category attribute:", err);
  }
}

export async function ensureConditionAttribute() {
  // Adds the "condition" attribute if it doesn't exist.
  try {
    const client = new Client();
    const databases = new Databases(client);
    client
      .setEndpoint(Appwriteconfig.endpoint)
      .setProject(Appwriteconfig.projectId)
      .setPlatform(Appwriteconfig.platform);

    const attributes = await databases.listAttributes(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId
    );
    const hasCondition = attributes.attributes.some(attr => attr.key === "condition");
    if (!hasCondition) {
      await databases.createStringAttribute(
        Appwriteconfig.databaseId,
        Appwriteconfig.rentalPropertiesCollectionId,
        "condition",
        100,
        false
      );
      console.log('Added "condition" attribute to rental properties collection.');
    } else {
      console.log('"condition" attribute already exists.');
    }
  } catch (err) {
    console.error("Error ensuring condition attribute:", err);
  }
}


export async function fetchRentals() {
  try {
    const response = await fetch('/api/rentals');
    if (response.status === 401) {
      window.location.href = '/signin';
      return { success: false, message: "Unauthorized. Redirecting to login.", data: [] };
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Ensure data.data is always an array
    if (data.success && !data.data) {
      data.data = [];
    }
    
    return data;
  } catch (error) {
    if (error?.message?.toLowerCase().includes("401") || error?.message?.toLowerCase().includes("unauthoriz")) {
      window.location.href = '/signin';
      return { success: false, message: "Unauthorized. Redirecting to login.", data: [] };
    }
    console.error('Error fetching rentals:', error);
    return { success: false, message: error.message, data: [] };
  }
}

export async function fetchAllUnits() {
  try {
    const response = await fetch('/api/rental-units');
    if (response.status === 401) {
      window.location.href = '/signin';
      return { success: false, message: "Unauthorized. Redirecting to login.", data: [] };
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Ensure data.data is always an array
    if (data.success && !data.data) {
      data.data = [];
    }
    
    return data;
  } catch (error) {
    if (error?.message?.toLowerCase().includes("401") || error?.message?.toLowerCase().includes("unauthoriz")) {
      window.location.href = '/signin';
      return { success: false, message: "Unauthorized. Redirecting to login.", data: [] };
    }
    console.error('Error fetching units:', error);
    return { success: false, message: error.message, data: [] };
  }
}

export const getUnitWithProperty = async (unitId) => {
  try {
    const unit = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalUnitsCollectionId,
      unitId
    );

    if (!unit || !unit.propertyId) {
      return { success: false, message: "Unit or propertyId not found" };
    }

    const property = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId,
      unit.propertyId
    );

    return {
      success: true,
      unit,
      property,
    };

  } catch (error) {
    return {success: false,};
    throw error;
  }
};

export async function getRentalUnitById(unitId) {
    try {
        
    const unitRes = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalUnitsCollectionId,
      unitId
    );

    const rentalUnit = unitRes;

    const propertyRes = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId,
      rentalUnit.propertyId
    );

    return {
      success: true,
      data: {
        ...rentalUnit,
        property: propertyRes
      }
    };

  } catch (error) {
    console.error("Error fetching rental unit:", error);
    return {
      success: false,
      message: "Failed to fetch rental unit",
      error
    };
  }
}
export async function readOneUnit(id){
    try{
        const result = await databases.getDocument(
            Appwriteconfig.databaseId,
            Appwriteconfig.rentalUnitsCollectionId,
            id
        )

        return {success: true,result: result}

    }catch(error){
        return {success: false,};
        throw error;
    }
}

export async function updateOneUnit(id, data) {
  try {
    const result = await databases.updateDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalUnitsCollectionId,
      id,
      data
    );
    return {success: true,result};
  } catch (error) {
    return {success: false,};
    throw error;
  }
}

export async function deletePropertyUnit(propertyId) {
  try {
    const existingListing = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId,
      propertyId
    );

    const units = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalUnitsCollectionId,
      [Query.equal("propertyId", propertyId)]
    );

    for (const unit of units.documents) {
      await databases.deleteDocument(
        Appwriteconfig.databaseId,
        Appwriteconfig.rentalUnitsCollectionId,
        unit.$id
      );
    }

    await databases.deleteDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId,
      propertyId
    );

    const extractFileId = (fileUrl) => {
      if (!fileUrl) return null;
      const match = fileUrl.match(/\/files\/([^/]+)\//);
      return match ? match[1] : null;
    };

    const fileIds = [
      extractFileId(existingListing.frontImage),
      extractFileId(existingListing.backImage),
    ].filter(Boolean);

    await Promise.all(
      fileIds.map(async (fileId) => {
        try {
          await storage.deleteFile(Appwriteconfig.imagesBacketId, fileId);
          console.log(`Deleted image: ${fileId}`);
        } catch (deleteError) {
          console.error(`Error deleting image ${fileId}:`, deleteError);
        }
      })
    );

    return {success: true};

  } catch (error) {
    return {success: false};
    throw error; 
  }
}


export async function deleteUnit(unitId) {
  try {
    await databases.deleteDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalUnitsCollectionId,
      unitId
    );
    console.log("Unit deleted successfully.");
    return {success: true};
  } catch (error) {
    return {success: false,};
    throw error;
  }
}

export async function fetchRentalById(id) {
  try {
    const doc = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId,
      id
    );
    return { success: true, data: doc };
  } catch (error) {
    return {success: false,};
    throw error;
  }
}

export async function getPropertyTypes() {
  try {
    const res = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId
    );
    const categories = res.documents.map(doc => doc.category).filter(Boolean);
    // Return unique categories
    return Array.from(new Set(categories));
  } catch (error) {
    console.error("Error fetching property types:", error);
    return [];
  }
}

export async function updateRental(id, updates) {
  try {
    // Ensure price is stored in Price attribute if provided
    if (updates.price !== undefined) {
      updates.Price = String(updates.price);
    }
    
    const updated = await databases.updateDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId,
      id,
      updates
    );
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating rental property:", error);
    return { success: false, message: error?.message || "Failed to update rental property", error };
  }
}

export async function createRental({
  title,
  price,
  category,
  condition,
  description,
  location,
  frontImage,
  backImage,
  userId,
  businessId,
  latitude,
  longitude
}) {
  console.log("createRental called with userId:", userId, "businessId:", businessId);
  try {
    // If businessId is not provided, try to fetch it using userId
    let finalBusinessId = businessId;
    if (!finalBusinessId && userId) {
      console.log("BusinessId not provided, attempting to fetch from userId:", userId);
      const businessResult = await getBusinessByUserId(userId);
      if (businessResult.success && businessResult.business) {
        finalBusinessId = businessResult.business.$id;
        console.log("Retrieved businessId:", finalBusinessId);
      } else {
        console.error("Could not retrieve business for user:", userId);
        return {
          success: false,
          message: "Business ID is required but could not be retrieved for this user",
        };
      }
    }

    if (!finalBusinessId) {
      console.error("BusinessId is required but not available");
      return {
        success: false,
        message: "Business ID is required to create a rental property",
      };
    }

    // Fetch business document to get contactPhone
    let contactPhone = "";
    try {
      const businessDoc = await databases.getDocument(
        Appwriteconfig.databaseId,
        Appwriteconfig.businesscollectionId,
        finalBusinessId
      );
      contactPhone = businessDoc.phone || "";
    } catch (err) {
      console.error("Failed to fetch business for contactPhone", err);
    }

    // Prepare the document data
    const data = {
      title,
      Price: price !== undefined && price !== null ? String(price) : "",
      // category, // removed due to unknown attribute error
      // condition, // removed due to unknown attribute error
      description,
      location,
      // frontImage, // removed due to unknown attribute error
      // backImage, // removed due to unknown attribute error
      userId,
      businessId: finalBusinessId,
      managedBy: userId,
      contactPhone,
      images: JSON.stringify([frontImage, backImage].filter(Boolean)),
      latitude: latitude !== undefined && latitude !== null ? String(latitude) : "",
      longitude: longitude !== undefined && longitude !== null ? String(longitude) : ""
    };
    console.log("createRental data:", data);

    // Create a new rental property document
    const newRental = await databases.createDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId,
      ID.unique(),
      data
    );

    return {
      success: true,
      message: "Rental property created successfully",
      data: newRental
    };
  } catch (error) {
    console.error("Error creating rental property:", error);
    return {
      success: false,
      message: error?.message || "Failed to create rental property",
      error
    };
  }
}

export async function createUnit({id,unitType, noOfBedrooms,noOfBathrooms,rent,deposit,isVacant,isFurnished,ammenities}) {
  try{

    const result =await databases.createDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalUnitsCollectionId,
      ID.unique(),
      {
        propertyId: id,
        type: unitType,
        price: rent,
        deposit: deposit,
        noOfBedrooms: noOfBedrooms,
        noOfBathrooms: noOfBathrooms,
        vacancyStatus: isVacant,
        isFurnished: isFurnished,
        amenities: ammenities

      }
    )

    return {
      success: true,
      message: "Rental unit created successfully",
      result: result
    };

  }catch(error){
    return {success: false,};
    throw error;
  }

}


export async function getFilePreview(fileId, type){
    let fileuri;

    try{
        if(type === "image"){
            fileuri = storage.getFilePreview(Appwriteconfig.imagesBacketId, fileId,
                2000,2000,'top',100
            )
        }else{
            throw new Error('invalid file type')
        }

        if(!fileuri) throw new Error;

        return fileuri

    }catch(error){
      console.log("an error oc ",error)
        return null;
        console.log("an error occurred while getting the file preview ")
        throw new Error(error)
    }

}

export async function uploadFile(file, type) {
    if (!file) {
    console.log("No file provided");
    return null;
  }

 if (typeof file === 'string' && (file.startsWith("http://") || file.startsWith("https://"))) {
   const isValidImage = /\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i.test(file);
    if (!isValidImage) {
      console.log("Provided URL is not a valid image type.");
      return null;
    }
    return file;
  }

    const {mimeType , ...rest} = file;
    const asset = {type: mimeType, ...rest}
    try{
        const uploadedFile = await storage.createFile(
            Appwriteconfig.imagesBacketId,
            ID.unique(),
            asset
        );

        if (!uploadedFile || !uploadedFile.$id) {
      console.log("Failed to upload file.");
      return null;
    }
        // const fileUri = await getFilePreview(uploadedFile.$id, type)

        // return fileUri;
        const fileUri = `https://cloud.appwrite.io/v1/storage/buckets/${Appwriteconfig.imagesBacketId}/files/${uploadedFile.$id}/download?project=${Appwriteconfig.projectId}`;
        return fileUri;
        
    }catch(error){
      console.log("uploadFile",error)
      return null;
      console.log("uploadFile")
        throw new Error(error)
    }
}

export async function createupload({frontImage: frontFile,backImage: backFile,title,description,location,latitude,longitude,agreed,managedBy,contactPhone}){
  try{
    // Upload files to Appwrite storage
    const uploadPromises = [];
    
    if (frontFile) {
      uploadPromises.push(storage.createFile(Appwriteconfig.imagesBacketId, ID.unique(), frontFile));
    }
    if (backFile) {
      uploadPromises.push(storage.createFile(Appwriteconfig.imagesBacketId, ID.unique(), backFile));
    }
    
    const uploadResults = await Promise.all(uploadPromises);
    
    // Generate URLs for uploaded files
    const frontImageUrl = uploadResults[0] ? 
      `https://cloud.appwrite.io/v1/storage/buckets/${Appwriteconfig.imagesBacketId}/files/${uploadResults[0].$id}/download?project=${Appwriteconfig.projectId}` : null;
    const backImageUrl = uploadResults[1] ? 
      `https://cloud.appwrite.io/v1/storage/buckets/${Appwriteconfig.imagesBacketId}/files/${uploadResults[1].$id}/download?project=${Appwriteconfig.projectId}` : null;

    const user = await account.get();
    const userId = user.$id; 

     const businessQuery = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.businesscollectionId,
      [
        Query.equal("userId", userId),
      ]
    );

    if (businessQuery.total === 0) {
      console.log("business not found for user.");
      return {success: false, message: "Business not found for user"};
    }

    const businessId = businessQuery.documents[0].$id;

    const result = await databases.createDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId,
      ID.unique(),
      {
        userId: userId,
        businessId: businessId,
        frontImage: frontImageUrl,
        backImage: backImageUrl,
        title : title,
        description: description,
        location: location,
        latitude: latitude || "",
        longitude: longitude || "",
        managedBy: managedBy,
        contactPhone: contactPhone || "",
        agree: agreed,
        isPromoted: false,
        isVerified: false,
        Price: "" // Initialize Price attribute
      }
          
    )
    return {
        success: true,
        message: "Property listing created successfully.",
        result: result,
        $id: result.$id  // Add the $id directly to the top level for easier access
      };

  }catch(error){
      console.error("Error in createupload:", error);
      return {success: false, message: error.message || "Failed to create property listing"};
  }
}

export async function getRentalForBusiness(){
  try{

    const user = await account.get();
    const userId = user.$id; 

     const businessQuery = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.businesscollectionId,
      [
        Query.equal("userId", userId),
      ]
    );

    if (businessQuery.total === 0) {
      console.log("business not found for user.");
      return null;
    }

    const businessId = businessQuery.documents[0].$id;

     const result = await databases.listDocuments(
        Appwriteconfig.databaseId,
        Appwriteconfig.rentalPropertiesCollectionId,
        [
          Query.equal('businessId', businessId),
        ]
      );

    return {
      success: true,
      message: "Property fetched succesfully.",
      result: result.documents
    };


  }catch(error){
    return {success: false};
    throw error; 
  }

}

export async function getUnitFotProperty({id}){
  try{


     const result = await databases.listDocuments(
        Appwriteconfig.databaseId,
        Appwriteconfig.rentalUnitsCollectionId,
        [
          Query.equal('propertyId', id),
        ]
      );

    return {
      success: true,
      message: "Property unit fetched succesfully.",
      result: result.documents
    };


  }catch(error){
    return {success: false,};
    throw error;
  }
}



export async function uploadRentalImageFile(fileUri, fileName = "rental_image.jpg", mimeType = "image/jpeg") {
  if (!fileUri) {
    console.log("❌ No file URI provided");
    return null;
  }

  try {
    // Enhanced file validation
    console.log("📁 Original file URI:", fileUri);
    
    let processedUri = fileUri;
    
    // Handle different URI formats
    if (fileUri.startsWith('file://')) {
      // For Android cache files, sometimes we need to copy to a more accessible location
      if (fileUri.includes('/cache/') || fileUri.includes('DocumentPicker')) {
        console.log("📋 Detected cache/DocumentPicker file, attempting to process...");
        
        // Try to copy file to a more accessible location first
        const fileName_temp = `temp_${Date.now()}.jpg`;
        const tempUri = `${FileSystem.documentDirectory}${fileName_temp}`;
        
        try {
          await FileSystem.copyAsync({
            from: fileUri,
            to: tempUri
          });
          processedUri = tempUri;
          console.log("✅ File copied to accessible location:", processedUri);
        } catch (copyError) {
          console.log("⚠️ Failed to copy file:", copyError.message);
          // Continue with original URI
        }
      }
    }

    // Validate file exists and get detailed info
    const fileStat = await FileSystem.getInfoAsync(processedUri);
    console.log("📊 File stat:", fileStat);
    
    if (!fileStat.exists) {
      console.log("❌ File does not exist at processed URI:", processedUri);
      return null;
    }

    if (fileStat.size === 0) {
      console.log("❌ File is empty");
      return null;
    }

    // Create file object with additional properties for better compatibility
    const file = {
      name: fileName,
      type: mimeType,
      uri: processedUri,
      size: fileStat.size, // Add size for debugging
    };

    console.log("📤 Uploading file:", file);

    // Upload with better error handling
    const uploadedFile = await storage.createFile(
      Appwriteconfig.imagesBacketId,
      ID.unique(),
      file
    );

    console.log("📥 Upload response:", uploadedFile);

    if (!uploadedFile?.$id) {
      console.log("❌ Failed to upload file. No ID returned.");
      console.log("Upload response structure:", Object.keys(uploadedFile || {}));
      return null;
    }

    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${Appwriteconfig.imagesBacketId}/files/${uploadedFile.$id}/download?project=${Appwriteconfig.projectId}`;
    
    console.log("✅ File uploaded successfully:", fileUrl);
    
    // Clean up temp file if we created one
    if (processedUri !== fileUri && processedUri.includes('temp_')) {
      try {
        await FileSystem.deleteAsync(processedUri);
        console.log("🧹 Cleaned up temp file");
      } catch (cleanupError) {
        console.log("⚠️ Failed to cleanup temp file:", cleanupError.message);
      }
    }
    
    return fileUrl;
    
  } catch (error) {
    console.log("❌ uploadRentalImageFile error:", error);
    console.log("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n')[0] // First line of stack trace
    });
    return null;
  }
}

// Alternative approach: Use expo-file-system to read file as base64
export async function uploadRentalImageFileBase64(fileUri, fileName = "rental_image.jpg", mimeType = "image/jpeg") {
  if (!fileUri) {
    console.log("❌ No file URI provided");
    return null;
  }

  try {
    console.log("📁 Reading file as base64:", fileUri);
    
    // Read file as base64
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (!fileContent) {
      console.log("❌ Failed to read file content");
      return null;
    }

    // Create a Blob-like object for Appwrite
    const file = {
      name: fileName,
      type: mimeType,
      size: Math.ceil(fileContent.length * 0.75), // Approximate size from base64
      // Convert base64 to blob for upload
      arrayBuffer: () => {
        const binaryString = atob(fileContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      }
    };

    console.log("📤 Uploading base64 file:", { name: fileName, type: mimeType, size: file.size });

    const uploadedFile = await storage.createFile(
      Appwriteconfig.imagesBacketId,
      ID.unique(),
      file
    );

    if (!uploadedFile?.$id) {
      console.log("❌ Failed to upload base64 file. No ID returned.");
      return null;
    }

    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${Appwriteconfig.imagesBacketId}/files/${uploadedFile.$id}/download?project=${Appwriteconfig.projectId}`;
    console.log("✅ Base64 file uploaded successfully:", fileUrl);
    
    return fileUrl;
    
  } catch (error) {
    console.log("❌ uploadRentalImageFileBase64 error:", error);
    return null;
  }
}

// Updated main function with fallback strategy
export async function updateRentalProperty(propertyId, form) {
  try {
    console.log("form data",form)
    const existingProperty = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId,
      propertyId
    );

    const newImageUris = [existingProperty.frontImage, existingProperty.backImage];
    const oldImageIds = [];

    const extractFileId = (url) => {
      if (!url) return null;

      const patterns = [
        /files\/([^/]+)\//,
        /files\/([^/?]+)/,
        /\/([a-zA-Z0-9_-]+)\/download/,
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
      }

      return null;
    };

    const frontImageExtractedId = extractFileId(existingProperty.frontImage);
    const backImageExtractedId = extractFileId(existingProperty.backImage);

    const handleImageUpdate = async (newFile, existingImage, index, fileId) => {
      if (newFile && newFile !== existingImage) {
        console.log(`🔄 Updating image at index ${index}:`, newFile);
        
        let uploadResult = await uploadRentalImageFile(
          newFile, 
          index === 0 ? "front_image.jpg" : "back_image.jpg"
        );
        
        if (!uploadResult) {
          console.log(`⚠️ Primary upload failed for index ${index}, trying base64 method...`);
          uploadResult = await uploadRentalImageFileBase64(
            newFile, 
            index === 0 ? "front_image.jpg" : "back_image.jpg"
          );
        }
        
        newImageUris[index] = uploadResult;
        console.log(`✅ Image updated at index ${index}:`, newImageUris[index]);
        
        if (uploadResult && fileId) {
          oldImageIds.push(fileId);
        }
      }
    };

    await handleImageUpdate(form.frontImage, existingProperty.frontImage, 0, frontImageExtractedId);
    await handleImageUpdate(form.backImage, existingProperty.backImage, 1, backImageExtractedId);

    console.log("📋 Final image URIs:", newImageUris);
    console.log("🗑️ Images to delete:", oldImageIds);

    const hasValidImages = newImageUris.some(uri => uri !== null);
    if (!hasValidImages) {
      console.log("❌ No valid images to update");
      throw new Error("Failed to upload any images");
    }

    const updatedData = {
      ...form,
      frontImage: newImageUris[0],
      backImage: newImageUris[1],
    };
    
    // Ensure price is stored in Price attribute if provided
    if (updatedData.price !== undefined) {
      updatedData.Price = String(updatedData.price);
    }

    console.log("💾 Updating database with:", updatedData);

    const updatedProperty = await databases.updateDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.rentalPropertiesCollectionId,
      propertyId,
      updatedData
    );

    console.log("✅ Database updated successfully");

     if (oldImageIds.length > 0) {
      console.log("🗑️ Deleting old images:", oldImageIds);
      
      const deletePromises = oldImageIds.map(async (imageId) => {
        try {
          await storage.deleteFile(Appwriteconfig.imagesBacketId, imageId);
          console.log(`✅ Deleted old image: ${imageId}`);
          return { success: true, imageId };
        } catch (deleteError) {
          console.log(`⚠️ Failed to delete image ${imageId}:`, deleteError.message);
          return { success: false, imageId, error: deleteError.message };
        }
      });

      const deleteResults = await Promise.allSettled(deletePromises);
      
      const successfulDeletes = deleteResults
        .filter(result => result.status === 'fulfilled' && result.value.success)
        .map(result => result.value.imageId);
        
      const failedDeletes = deleteResults
        .filter(result => result.status === 'rejected' || !result.value.success)
        .map(result => result.status === 'fulfilled' ? result.value.imageId : 'unknown');

      console.log("🧹 Cleanup summary:", {
        successful: successfulDeletes,
        failed: failedDeletes
      });
    }

    console.log("🎉 Property update completed successfully");
    return {
      success: true,
      updatedProperty: updatedProperty
    };

  } catch (error) {
    return {success: false,};
    throw error;
  }
}
