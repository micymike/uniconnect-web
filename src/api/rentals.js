import { Client, Databases, Query, ID, Storage } from "appwrite";

// Appwrite configuration (from mobile config)
const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67fc0576000b05b9e495",
  databaseId: "67fc08930035410438a5",
  rentalPropertiesCollectionId: "6813961c00369dd87643",
  rentalUnitsCollectionId: "6813965c0018e59b3f32",
  businessCollectionId: "67fc0a1b0037b8b8b8b8",
  imagesBacketId: "67fc0b2c003c7c7c7c7c"
};

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

const databases = new Databases(client);
const storage = new Storage(client);

// Fetch all rental properties
export async function fetchRentals() {
  try {
    const res = await databases.listDocuments(
      config.databaseId,
      config.rentalPropertiesCollectionId,
      [Query.limit(100)]
    );
    return { success: true, data: res.documents };
  } catch (err) {
    console.error("Error ensuring condition attribute:", err);
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
      config.databaseId,
      config.rentalUnitsCollectionId,
      [Query.limit(100)]
    );
    return { success: true, data: res.documents };
  } catch (err) {
    console.error("fetchAllUnits error:", err);
    return { success: false, message: err.message };
  }
}

// Get rental unit by ID with property details
export async function getRentalUnitById(unitId) {
  try {
    const unit = await databases.getDocument(
      config.databaseId,
      config.rentalUnitsCollectionId,
      unitId
    );

    const property = await databases.getDocument(
      config.databaseId,
      config.rentalPropertiesCollectionId,
      unit.propertyId
    );

    return {
      success: true,
      data: { ...unit, property }
    };
  } catch (error) {
    console.error("Error fetching rental unit:", error);
    return { success: false, message: "Failed to fetch rental unit", error };
  }
}

// Create rental property
export async function createRental({
  title,
  price,
  description,
  location,
  frontImage,
  backImage,
  userId,
  businessId,
  latitude,
  longitude,
  managedBy,
  contactPhone
}) {
  try {
    const data = {
      title,
      Price: price ? String(price) : "",
      description,
      location,
      userId,
      businessId,
      managedBy,
      contactPhone,
      images: JSON.stringify([frontImage, backImage].filter(Boolean)),
      latitude: latitude ? String(latitude) : "",
      longitude: longitude ? String(longitude) : "",
      isPromoted: false,
      isVerified: false
    };

    const newRental = await databases.createDocument(
      config.databaseId,
      config.rentalPropertiesCollectionId,
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

// Create rental unit
export async function createUnit({
  propertyId,
  unitType,
  noOfBedrooms,
  noOfBathrooms,
  rent,
  deposit,
  isVacant,
  isFurnished,
  amenities
}) {
  try {
    const result = await databases.createDocument(
      config.databaseId,
      config.rentalUnitsCollectionId,
      ID.unique(),
      {
        propertyId,
        type: unitType,
        price: rent,
        deposit,
        noOfBedrooms,
        noOfBathrooms,
        vacancyStatus: isVacant,
        isFurnished,
        amenities
      }
    );

    return {
      success: true,
      message: "Rental unit created successfully",
      result
    };
  } catch (error) {
    console.error("Error creating rental unit:", error);
    return { success: false, message: error?.message || "Failed to create rental unit" };
  }
}

// Update rental unit
export async function updateUnit(unitId, data) {
  try {
    const result = await databases.updateDocument(
      config.databaseId,
      config.rentalUnitsCollectionId,
      unitId,
      data
    );
    return { success: true, result };
  } catch (error) {
    console.error("Error updating rental unit:", error);
    return { success: false, message: error?.message || "Failed to update rental unit" };
  }
}

// Delete rental unit
/* export async function deleteUnit(unitId) {
  try {
    await databases.deleteDocument(
      config.databaseId,
      config.rentalUnitsCollectionId,
      unitId
    );
    return { success: true };
  } catch (error) {
    console.error("Error deleting rental unit:", error);
    return { success: false, message: error?.message || "Failed to delete rental unit" };
  }
} */

// Get units for a property
export async function getUnitsForProperty(propertyId) {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.rentalUnitsCollectionId,
      [Query.equal('propertyId', propertyId)]
    );

    return {
      success: true,
      message: "Property units fetched successfully",
      result: result.documents
    };
  } catch (error) {
    console.error("Error fetching property units:", error);
    return { success: false, message: error?.message || "Failed to fetch property units" };
  }
}

// Update rental property
export async function updateRental(propertyId, updates) {
  try {
    const updated = await databases.updateDocument(
      config.databaseId,
      config.rentalPropertiesCollectionId,
      propertyId,
      updates
    );
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating rental property:", error);
    return { success: false, message: error?.message || "Failed to update rental property" };
  }
}

// Delete rental property and its units
export async function deleteProperty(propertyId) {
  try {
    // First get all units for this property
    const units = await databases.listDocuments(
      config.databaseId,
      config.rentalUnitsCollectionId,
      [Query.equal("propertyId", propertyId)]
    );

    // Delete all units
    for (const unit of units.documents) {
      await databases.deleteDocument(
        config.databaseId,
        config.rentalUnitsCollectionId,
        unit.$id
      );
    }

    // Delete the property
    await databases.deleteDocument(
      config.databaseId,
      config.rentalPropertiesCollectionId,
      propertyId
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting rental property:", error);
    return { success: false, message: error?.message || "Failed to delete rental property" };
  }
}
