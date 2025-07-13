import { Databases,Client,Account,ID,Query,Storage } from "react-native-appwrite";
import { Appwriteconfig } from "../appwriteenv";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';

const client = new Client();
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);



client
    .setEndpoint(Appwriteconfig.endpoint) 
    .setProject(Appwriteconfig.projectId) 
    .setPlatform(Appwriteconfig.platform) 
;

export async function fetchMarketProducts() {
  try {
    const res = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId
    );

    

    // const items = res.documents.map((doc) => ({
    //   id: doc.$id,
    //   title: doc.title,
    //   price: `Ksh ${doc.price}`,
    //   image: JSON.parse(doc.images || '[]')[0], // Parse image URI
    //   category: doc.category || 'Others',
    // }));

      const items = res.documents.map((doc) => {
        const frontImage = doc.frontImage || null;
        const backImage = doc.backImage || null;

        const image = frontImage || backImage || null;

        return {
          id: doc.$id,
          title: doc.title,
          price: `Ksh ${doc.price}`,
          image,
          category: doc.category || 'Others',
          subcategory: doc.subcategory
        };
      });



    // ✅ Group products by category
    const grouped = items.reduce((acc, item) => {
      const cat = item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    // ✅ Format into array for FlatList
    const groupedArray = Object.entries(grouped).map(([category, products]) => ({
      category,
      products,
    }));

    return {
      success: true,
      message: "Marketplace products fetched successfully",
      data: groupedArray,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch marketplace items",
      error,
    };
    throw error
    console.log("Error fetching marketplace items:", error);
  }
}

export async function fetchAllProducts() {
  try {
    const result = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
    );

    return {
      success: true,
      data: result.documents
    };
  } catch (error) {
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

export async function createupload({frontImage: frontFile,
  backImage: backFile,title,description,location,price,category,subcategory,condition,contactPhone}){
  try{
    const [frontImageUrl, backImageUrl] = await Promise.all([
     uploadFile(frontFile, "image"),
      uploadFile(backFile, "image"),
    ])

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
      console.log("Marketplace business not found for user.");
      return null;
    }

    const businessId = businessQuery.documents[0].$id;

    const result = await databases.createDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      ID.unique(),
      {
        userId: userId,
        businessId: businessId,
        frontImage: frontImageUrl,
        backImage: backImageUrl,
        title : title,
        description: description,
        location: location,
        price: price,
        category: category,
        subcategory: subcategory,
        condition: condition,
        contactPhone: contactPhone
      }
          
    )
    return {
        success: true,
        message: "Product listing created sucessfully.",
        result: result
      };

  }catch(error){
    return {success: false,};
    throw error;
  }
}

export async function getProductById(id){
  try{
    const result = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      id
    )

    return {
        success: true,
        message: "Product is viewable.",
        result: result
    };

    
  }catch(error){
    return {success: false,message: "Unable to get product check your connection or try again."};
    throw error;
  }

}

export async function getMarketplaceItemsByCategory(category, excludeId = null) {
  try {
    const queries = [
      Query.equal('category', category),
      Query.limit(10),
    ];

    if (excludeId) queries.push(Query.notEqual('$id', excludeId));

    const result = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      queries
    );

    const shuffled = result.documents.sort(() => 0.5 - Math.random());

    return { success: true, result: shuffled };
  } catch (error) {
    return { success: false, message: 'Fallback: No category items found.' };
    throw error;
  }
}

export async function getRandomMarketplaceItems(excludeId = null) {
  try {
    const result = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      [
        Query.limit(10),
      ]
    );

    const filtered = result.documents.filter(doc => doc.$id !== excludeId);
    const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);

    return { success: true, result: shuffled };
  } catch (error) {
    return { success: false, message: 'Failed to load random items.' };
    throw error
  }
}

export async function searchMarketplaceItems(searchQuery, filters = {}, limit = 20, offset = 0) {
  try {
    console.log(searchQuery)
    const queries = [];

    if (searchQuery.trim()) {
      queries.push(Query.equal("title", searchQuery)); 
    }

    if (filters.category) {
      queries.push(Query.equal("category", filters.category));
    }

    if (filters.subcategory) {
      queries.push(Query.equal("subcategory", filters.subcategory));
    }

    if (filters.priceMin !== undefined) {
      queries.push(Query.greaterThanEqual("price", filters.priceMin));
    }

    if (filters.priceMax !== undefined) {
      queries.push(Query.lessThanEqual("price", filters.priceMax));
    }

    if (filters.location) {
      queries.push(Query.equal("location", filters.location));
    }

    // if (filters.deliveryOptions !== undefined) {
    //   queries.push(Query.equal("deliveryOptions", filters.deliveryOptions));
    // }

    queries.push(Query.limit(limit));
    queries.push(Query.offset(offset));

    const result = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      queries
    );

    console.log("search rws", result)
    return { success: true, items: result.documents };

  } catch (error) {
    console.error("Marketplace Search Error:", error);
    return { success: false, message: error.message };
  }
}

export async function getProductForBusiness(){
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
        Appwriteconfig.marketplaceCollectionId,
        [
          Query.equal('businessId', businessId),
        ]
      );

    return {
      success: true,
      message: "Product fetched succesfully.",
      result: result.documents
    };


  }catch(error){
    return {success: false};
    throw error;
  }

}


export async function uploadRentalImageFile(fileUri, fileName = "product_image.jpg", mimeType = "image/jpeg") {
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
export async function uploadRentalImageFileBase64(fileUri, fileName = "product_image.jpg", mimeType = "image/jpeg") {
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

export async function updateproduct(productId, form) {
  try {
    console.log("form data", form)
    const existingProperty = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      productId
    );

    let finalFrontImage = existingProperty.frontImage;
    let finalBackImage = existingProperty.backImage;
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

    if (form.frontImage && form.frontImage !== existingProperty.frontImage) {
      console.log("🔄 Updating front image:", form.frontImage);
      
      let uploadResult = await uploadRentalImageFile(
        form.frontImage, 
        "front_image.jpg"
      );
      
      if (!uploadResult) {
        console.log("⚠️ Primary upload failed for front image, trying base64 method...");
        uploadResult = await uploadRentalImageFileBase64(
          form.frontImage, 
          "front_image.jpg"
        );
      }
      
      if (uploadResult) {
        finalFrontImage = uploadResult;
        console.log("✅ Front image updated:", finalFrontImage);
        
        const oldFrontImageId = extractFileId(existingProperty.frontImage);
        if (oldFrontImageId) {
          oldImageIds.push(oldFrontImageId);
        }
      } else {
        console.log("❌ Failed to upload front image");
        throw new Error("Failed to upload front image");
      }
    }

    if (form.backImage && form.backImage !== existingProperty.backImage) {
      console.log("🔄 Updating back image:", form.backImage);
      
      let uploadResult = await uploadRentalImageFile(
        form.backImage, 
        "back_image.jpg"
      );
      
      if (!uploadResult) {
        console.log("⚠️ Primary upload failed for back image, trying base64 method...");
        uploadResult = await uploadRentalImageFileBase64(
          form.backImage, 
          "back_image.jpg"
        );
      }
      
      if (uploadResult) {
        finalBackImage = uploadResult;
        console.log("✅ Back image updated:", finalBackImage);
        
        // Mark old back image for deletion
        const oldBackImageId = extractFileId(existingProperty.backImage);
        if (oldBackImageId) {
          oldImageIds.push(oldBackImageId);
        }
      } else {
        console.log("❌ Failed to upload back image");
        throw new Error("Failed to upload back image");
      }
    }

    console.log("📋 Final image URIs:", { front: finalFrontImage, back: finalBackImage });
    console.log("🗑️ Images to delete:", oldImageIds);

    // Ensure both images are present
    if (!finalFrontImage || !finalBackImage) {
      console.log("❌ Missing required images", { front: finalFrontImage, back: finalBackImage });
      throw new Error("Both front and back images are required");
    }

    // Create the update data with all form fields and final image URLs
    const updatedData = {
      title: form.title,
      description: form.description,
      price: form.price,
      category: form.category,
      location: form.location,
      subcategory: form.subcategory,
      condition: form.condition,
      deliveryOptions: form.deliveryOptions,
      isAvailable: form.isAvailable,
      contactPhone: form.contactPhone,
      frontImage: finalFrontImage,
      backImage: finalBackImage,
    };

    console.log("💾 Updating database with:", updatedData);

    const updatedProperty = await databases.updateDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      productId,
      updatedData
    );

    console.log("✅ Database updated successfully");

    // Delete old images after successful update
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
    return {updatedProperty, success: false,};

  } catch (error) {
    return {success: false,};
    throw error; 
  }
}



export async function deleteproduct(productId){
  try{
    const existingListing = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      productId
    );


    await databases.deleteDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      productId
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

    return {success: true}

  }catch(error){
    return {success: false,};
    throw error; 
  }
}