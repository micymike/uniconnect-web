// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useRef,
//   ReactNode,
// } from "react";
// import * as Notifications from "expo-notifications";
// import { Subscription } from "expo-modules-core";
// import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
// import { router } from "expo-router";
// import { Databases, Client } from 'react-native-appwrite';
// import { Appwriteconfig } from "@/lib/appwriteenv";
// import { sendPushNotification } from '../lib/notifications/notifications';

// interface NotificationContextType {
//   expoPushToken: string | null;
//   notification: Notifications.Notification | null;
//   error: Error | null;
// }

// const NotificationContext = createContext<NotificationContextType | undefined>(
//   undefined
// );

// export const useNotification = () => {
//   const context = useContext(NotificationContext);
//   if (context === undefined) {
//     throw new Error(
//       "useNotification must be used within a NotificationProvider"
//     );
//   }
//   return context;
// };

// interface NotificationProviderProps {
//   children: ReactNode;
// }

// export const NotificationProvider: React.FC<NotificationProviderProps> = ({
//   children,
// }) => {
//   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
//   const [notification, setNotification] =
//     useState<Notifications.Notification | null>(null);
//   const [error, setError] = useState<Error | null>(null);

//   const notificationListener = useRef<Subscription>();
//   const responseListener = useRef<Subscription>();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(
//       (token) => setExpoPushToken(token),
//       (error) => setError(error)
//     );

//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         console.log("🔔 Notification Received: ", notification);
//         setNotification(notification);
//       });

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         // console.log(
//         //   "🔔 Notification Response: ",
//         //   JSON.stringify(response, null, 2),
//         //   JSON.stringify(response.notification.request.content.data, null, 2)
//         // );
//          const data = response.notification.request.content.data;
//           console.log("📲 Notification tapped, data:", data);
//           switch (data?.type) {
//             case "product":
//               if (data.productId) {
//                  router.push({
//                     pathname: '/singleproductdetails',
//                     params: { id: data.productId  },
//                   })
              
//               }
//               break;

//             case "rental":
//               if (data.rentalId) {
//                  router.push({
//                   pathname: '/rentalunitdetail',
//                   params: { unitId: data.rentalId  }
//                 });
//               }
//               break;

//             case "chat":
//               if (data.chatRoomId) {
//                 router.push({
//                   pathname: '/chatroom',
//                   params: { chatroomId: data.chatroomId  }
//                 });
//               }
//               break;

//             default:
//               console.warn("Unknown notification type:", data?.type);
//               break;
//           }
//       });

//     const client = new Client();
//     const databases = new Databases(client);

//     client
//         .setEndpoint(Appwriteconfig.endpoint) 
//         .setProject(Appwriteconfig.projectId) 
//         .setPlatform(Appwriteconfig.platform);

    
//     const channel = `databases.${Appwriteconfig.databaseId}.collections.${Appwriteconfig.rentalUnitsCollectionId}.documents`;

//     const unsubscribe = client.subscribe(channel, async (response) => {
//       const event = response.events?.[0];
//       const payload = response.payload;

//       if (event?.includes(".update") && payload?.vacancyStatus === true) {
//         console.log("🏡 Vacancy update detected:", payload.$id);

//         try {

//           console.log("📦 DB ID:", Appwriteconfig.databaseId);
//           console.log("📦 Collection ID:", Appwriteconfig.usercollectionId);
//           const result = await databases.listDocuments(
//             Appwriteconfig.databaseId,
//             Appwriteconfig.usercollectionId
//           );

//           const tokens = result.documents
//             .map((user) => user.pushToken)
//             .filter((token) => token?.startsWith("ExponentPushToken"));
            

//           for (const token of tokens) {
//             await sendPushNotification({
//               to: token,
//               title: "🏡 New Rental Available",
//               body: `${payload.type || "A rental unit"} is now vacant.`,
//               data: {
//                 type: "rental",
//                 rentalId: payload.$id,
//               },
//             });
//           }
//         } catch (err) {
//           console.error("❌ Failed to send notifications:", err);
//         }
//       }
//     });

//     return () => {
//       if (notificationListener.current) {
//         Notifications.removeNotificationSubscription(
//           notificationListener.current
//         );
//       }
//       if (responseListener.current) {
//         Notifications.removeNotificationSubscription(responseListener.current);
//       }
//       unsubscribe();
//     };
//   }, []);

//   return (
//     <NotificationContext.Provider
//       value={{ expoPushToken, notification, error }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { router } from "expo-router";
import { Databases, Client } from "react-native-appwrite";
import { Appwriteconfig } from "@/lib/appwriteenv";
import { sendPushNotification } from "../lib/notifications/notifications";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const notifyAllUsers = async ({
    title,
    body,
    data,
  }: {
    title: string;
    body: string;
    data: Record<string, any>;
  }) => {
    const result = await databases.listDocuments(
      Appwriteconfig.databaseId,
      Appwriteconfig.usercollectionId
    );

    const tokens = Array.from(
      new Set(
        result.documents
          .map((user) => user.pushToken)
          .filter((token) => token?.startsWith("ExponentPushToken"))
      )
    );

    for (const token of tokens) {
      await sendPushNotification({
        to: token,
        title,
        body,
        data,
      });
    }
  };

  const client = new Client();
  const databases = new Databases(client);

  client
    .setEndpoint(Appwriteconfig.endpoint)
    .setProject(Appwriteconfig.projectId)
    .setPlatform(Appwriteconfig.platform);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("📲 Notification tapped, data:", data);
        switch (data?.type) {
          case "product":
            if (data.productId) {
              router.push({
                pathname: "/singleproductdetails",
                params: { id: data.productId },
              });
            }
            break;

          case "rental":
            if (data.rentalId) {
              router.push({
                pathname: "/rentalunitdetail",
                params: { unitId: data.rentalId },
              });
            }
            break;

          case "chat":
            if (data.chatRoomId) {
              router.push({
                pathname: "/chatroom",
                params: { chatroomId: data.chatRoomId },
              });
            }
            break;

          default:
            console.warn("Unknown notification type:", data?.type);
        }
      });

    const unsubscribeRental = client.subscribe(
      `databases.${Appwriteconfig.databaseId}.collections.${Appwriteconfig.rentalUnitsCollectionId}.documents`,
      async (response) => {
        const event = response.events?.[0];
        const payload = response.payload;

        if (event?.includes(".update") && payload?.vacancyStatus === true) {
          console.log("🏡 Vacancy update detected:", payload.$id);

          try {
            await notifyAllUsers({
              title: "🏡 New Rental Available",
              body: `${payload.type || "A rental unit"} is now vacant.`,
              data: {
                type: "rental",
                rentalId: payload.$id,
              },
            });
          } catch (err) {
            console.error("❌ Failed to notify users about rental:", err);
          }
        }
      }
    );

    const unsubscribeProduct = client.subscribe(
      `databases.${Appwriteconfig.databaseId}.collections.${Appwriteconfig.marketplaceCollectionId}.documents`,
      async (response) => {
        const event = response.events?.[0];
        const payload = response.payload;

        if (event?.includes(".create")) {
          console.log("🛒 New product created:", payload?.title);

          try {
            await notifyAllUsers({
              title: "🛒 New Product Available",
              body: `${payload.title || "A new product"} was just listed.`,
              data: {
                type: "product",
                productId: payload.$id,
              },
            });
          } catch (err) {
            console.error("❌ Failed to notify users about product:", err);
          }
        }

        if (event?.includes(".update") && payload?.isAvailable === true) {
          console.log("✅ Product is now available:", payload?.title);

          try {
            await notifyAllUsers({
              title: "🛒 Product Back in Stock",
              body: `${payload.title || "A product"} is now available.`,
              data: {
                type: "product",
                productId: payload.$id,
              },
            });
          } catch (err) {
            console.error("❌ Failed to notify users about updated product:", err);
          }
        }
      }
    );


    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      unsubscribeRental();
      unsubscribeProduct();
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
