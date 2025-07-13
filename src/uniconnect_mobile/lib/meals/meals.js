import { Databases,Client,Account,ID,Query } from "react-native-appwrite";
import { Appwriteconfig } from "../appwriteenv";

const client = new Client();
const account = new Account(client);
const databases = new Databases(client);


client
    .setEndpoint(Appwriteconfig.endpoint) 
    .setProject(Appwriteconfig.projectId) 
    .setPlatform(Appwriteconfig.platform) 
;

export async function fetchMeals() {
  try {
    const res = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.mealPostsCollectionId
    );

    const mealsRaw = res.documents.filter(doc => doc.isAvailable);

    // Fetch business info for each meal
    const meals = await Promise.all(
      mealsRaw.map(async (doc) => {
        const businessRes = await fetchBusinessById(doc.businessId);
        const business = businessRes.success ? businessRes.data : { name: "Unknown", rating: 0 };

        return {
          id: doc.$id,
          title: doc.title,
          description: doc.description,
          price: `Ksh ${doc.price}`,
          image: JSON.parse(doc.images || '[]')[0],
          location: doc.location,
          isPoolable: doc.isPoolable,
          availableAt: doc.availableAt,
          by: business.name,
          rate: business.rating,
        };
      })
    );

    // Prioritize pooled meals
    const sortedMeals = [
      ...meals.filter((meal) => meal.isPoolable),
      ...meals.filter((meal) => !meal.isPoolable),
    ];

    return {
      success: true,
      message: "Meals fetched successfully",
      data: sortedMeals,
    };
  } catch (error) {
    console.log("Error fetching meals items:", error);
    return {
      success: false,
      message: "Failed to fetch meals items",
      error,
    };
  }
}


export async function fetchBusinessById(businessId) {
  try {
    const res = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.businesscollectionId,
      businessId
    );

    return {
      success: true,
      data: {
        id: res.$id,
        name: res.name || "Unknown",
        rating: res.rating || 0,      
      },
    };
  } catch (error) {
    console.log("Error fetching business:", error);
    return {
      success: false,
      message: "Failed to fetch business",
      error,
    };
  }
}