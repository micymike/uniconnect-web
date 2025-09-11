import { Client, Databases, Query, ID, Storage } from "appwrite";
import { Appwriteconfig } from "../appwriteenv.js";

const client = new Client();
client
  .setEndpoint(Appwriteconfig.endpoint)
  .setProject(Appwriteconfig.projectId);

const databases = new Databases(client);
const storage = new Storage(client);

// Fetch all marketplace products
export async function fetchAllProducts() {
  try {
    const res = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      [Query.limit(100)]
    );
    return { success: true, data: res.documents };
  } catch (err) {
    console.error("fetchAllProducts error:", err);
    return { success: false, message: err.message };
  }
}

// Fetch marketplace products grouped by category
export async function fetchMarketProducts() {
  try {
    const res = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      [Query.limit(100)]
    );
    
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
        subcategory: doc.subcategory,
        ...doc
      };
    });

    const grouped = items.reduce((acc, item) => {
      const cat = item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    const groupedArray = Object.entries(grouped).map(([category, products]) => ({
      category,
      products,
    }));

    return {
      success: true,
      message: "Marketplace products fetched successfully",
      data: groupedArray,
    };
  } catch (err) {
    console.error("fetchMarketProducts error:", err);
    return { success: false, message: err.message };
  }
}

// Get product by ID
export async function getProductById(id) {
  try {
    const result = await databases.getDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      id
    );
    return {
      success: true,
      message: "Product is viewable.",
      result: result
    };
  } catch (error) {
    console.error("getProductById error:", error);
    return { success: false, message: "Unable to get product check your connection or try again." };
  }
}

// Create marketplace product
export async function createProduct({
  title,
  description,
  location,
  price,
  category,
  subcategory,
  condition,
  contactPhone,
  frontImage,
  backImage,
  userId,
  businessId
}) {
  try {
    const result = await databases.createDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      ID.unique(),
      {
        userId,
        businessId,
        frontImage,
        backImage,
        title,
        description,
        location,
        price,
        category,
        subcategory,
        condition,
        contactPhone,
        isAvailable: true
      }
    );
    return {
      success: true,
      message: "Product listing created successfully.",
      result: result
    };
  } catch (error) {
    console.error("createProduct error:", error);
    return { success: false, message: error.message };
  }
}

// Update product
export async function updateProduct(productId, updates) {
  try {
    const updatedProperty = await databases.updateDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      productId,
      updates
    );
    return { success: true, updatedProperty };
  } catch (error) {
    console.error("updateProduct error:", error);
    return { success: false, message: error.message };
  }
}

// Delete product
export async function deleteProduct(productId) {
  try {
    await databases.deleteDocument(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      productId
    );
    return { success: true };
  } catch (error) {
    console.error("deleteProduct error:", error);
    return { success: false, message: error.message };
  }
}

// Search marketplace items
export async function searchMarketplaceItems(searchQuery, filters = {}, limit = 20) {
  try {
    const queries = [];

    if (searchQuery.trim()) {
      queries.push(Query.search("title", searchQuery));
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

    queries.push(Query.limit(limit));

    const result = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.marketplaceCollectionId,
      queries
    );

    return { success: true, items: result.documents };
  } catch (error) {
    console.error("searchMarketplaceItems error:", error);
    return { success: false, message: error.message };
  }
}

// Get products by category
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
    console.error("getMarketplaceItemsByCategory error:", error);
    return { success: false, message: 'Fallback: No category items found.' };
  }
}

// Categories for marketplace (from mobile)
export const categories = [
  {
    name: "Home & Living",
    subcategories: [
      "Furniture",
      "Home Decor",
      "Lighting",
      "Kitchenware",
      "Storage & Organization",
      "Bedding",
    ],
  },
  {
    name: "Electronics",
    subcategories: [
      "Mobile Phones",
      "Tablets",
      "Laptops & Computers",
      "TVs & Accessories",
      "Audio Devices",
      "Cameras & Photography",
      "Smart Devices",
    ],
  },
  {
    name: "Fashion",
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Kids' Clothing",
      "Shoes",
      "Bags & Wallets",
      "Watches & Accessories",
    ],
  },
  {
    name: "Kitchen & Appliances",
    subcategories: [
      "Small Kitchen Appliances",
      "Cookware & Bakeware",
      "Refrigerators",
      "Microwaves",
    ],
  },
  {
    name: "Baby, Kids & Toys",
    subcategories: [
      "Baby Gear",
      "Toys",
      "Diapers",
      "Baby Clothing",
    ],
  },
  {
    name: "Tools & Home Improvement",
    subcategories: [
      "Power Tools",
      "Hand Tools",
      "Safety Equipment",
      "Plumbing",
    ],
  },
  {
    name: "Automotive",
    subcategories: [
      "Car Accessories",
      "Motorbike Accessories",
      "Oils & Fluids",
      "Tyres & Batteries",
    ],
  },
  {
    name: "Health & Beauty",
    subcategories: [
      "Personal Care",
      "Skin Care",
      "Hair Care",
      "Perfumes",
      "Makeup",
      "Supplements",
    ],
  },
  {
    name: "Books & Stationery",
    subcategories: [
      "Textbooks",
      "Novels",
      "Office Supplies",
      "Art Supplies",
    ],
  },
  {
    name: "Travel & Luggage",
    subcategories: [
      "Suitcases",
      "Travel Accessories",
      "Backpacks",
    ],
  },
  {
    name: "Pet Supplies",
    subcategories: [
      "Dog Food & Accessories",
      "Cat Food & Accessories",
      "Pet Toys",
    ],
  },
  {
    name: "Sports & Fitness",
    subcategories: [
      "Gym Equipment",
      "Sportswear",
      "Outdoor Gear",
    ],
  },
  {
    name: "Food & Beverages",
    subcategories: [
      "Snacks",
      "Cooking Essentials",
      "Beverages",
    ],
  },
];

export const MARKETPLACE_CATEGORIES = categories.map(cat => cat.name);

export const ITEM_CONDITIONS = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Poor"
];

export const LOCATIONS = [
  "Egerton",
  "JKUAT"
];
