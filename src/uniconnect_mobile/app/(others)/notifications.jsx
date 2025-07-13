import { StyleSheet, Text, View,TouchableOpacity,TextInput,Dimensions,FlatList,ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Gray, Primary, secondary, silver, white } from '../../utils/colors';
import { Ionicons } from '@expo/vector-icons'; 
import { useAuthGuard } from '../../utils/useAuthGuard';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Notifications = () => {
    const unreadCount = 0;
    const [searchQuery, setSearchQuery] = useState("");
          const { isAuthenticated, checking } = useAuthGuard('/');
    
    const [fetching, setFetching] = useState(false)
    const [notifications, setNotifications] = useState([
      {
          $id: "1",
          type: "payment",
          title: "Rent Payment Received",
          message: "John Doe has paid rent for Unit A1 - KSh 8,000",
          timestamp: "2 hours ago",
          isRead: false,
          priority: "medium",
      },
      {
        $id: "2",
        type: "maintenance",
        title: "Maintenance Request",
        message: "Unit B1 - Plumbing issue reported by tenant",
        timestamp: "4 hours ago",
        isRead: false,
        priority: "high",
      },
      {
        $id: "3",
        type: "tenant",
        title: "New Tenant Application",
        message: "Sarah Wilson applied for Unit A2",
        timestamp: "1 day ago",
        isRead: true,
        priority: "medium",
      },
      {
        $id: "4",
        type: "reminder",
        title: "Rent Due Reminder",
        message: "Unit C1 rent is due in 3 days",
        timestamp: "1 day ago",
        isRead: false,
        priority: "medium",
      },
      {
        $id: "5",
        type: "system",
        title: "System Update",
        message: "Your rental dashboard has been updated with new features",
        timestamp: "2 days ago",
        isRead: true,
        priority: "low",
      },
      {
        $id: "6",
        type: "payment",
        title: "Payment Overdue",
        message: "Unit D1 rent payment is 5 days overdue",
        timestamp: "3 days ago",
        isRead: false,
        priority: "high",
      },
      {
        $id: "7",
        type: "maintenance",
        title: "Maintenance Completed",
        message: "Unit A1 - Air conditioning repair completed",
        timestamp: "1 week ago",
        isRead: true,
        priority: "low",
      },

    ])

    const markAllAsRead = () => {

    }

    const handleSearch = () => {

    }

    const handleClear = () => {
        setSearchQuery('');
    };

    const getNotificationIcon = (type) => {
      switch (type) {
        case "payment":
          return "💰"
        case "maintenance":
          return "🔧"
        case "tenant":
          return "👤"
        case "reminder":
          return "⏰"
        case "system":
          return "⚙️"
        default:
          return "📢"
      }
    }
    const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#dc2626"
      case "medium":
        return "#ea580c"
      case "low":
        return "#16a34a"
      default:
        return "#6b7280"
    }
  }

    const Emptyreturn = () => {
    if(fetching === true && notifications.length === 0){
        return(
          <View style={{flexDirection: "column",alignItems: "center",flex: 1,justifyContent: "center",paddingVertical: 40}}>
            <ActivityIndicator size={26} color={Primary}/>
          </View>
        )
    } else if(fetching == false  && notifications.length === 0){
      return(
        <View style={{flexDirection: "column",alignItems: "center",flex: 1,justifyContent: "center"}}>
          <Ionicons name="chatbubbles-outline" size={70} color={Primary}/>
          <Text style={{textAlign: "center", color: white,fontSize: 16,marginVertical: 4,fontWeight: 600}}>You have no notifications yet.</Text>
          <Text style={{ color:silver, marginHorizontal: 3,fontSize: 12,maxWidth:"60%",textAlign: "center" }}>Your notifications will appear here once you have them</Text>
          <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => {
            router.back()
          }}
          style={{justifyContent:"center",backgroundColor: Primary,paddingVertical:6,paddingHorizontal: 12,marginVertical:10,borderRadius:7}}>
            <Text style={{color: "#fff"}}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
      <LinearGradient
         colors={["#030406","#000"]}
         start={{ x: 0, y: 0 }}
         end={{ x: 0, y: 1 }}
         style={{ flex: 1 }}
       >
        <SafeAreaView style={{ flex: 1,}}>
          <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center",padding: 16,}}>
            <View style={{flexDirection: "row",alignItems: "center",flex: 1,}}>
              <TouchableOpacity 
              style={{padding: 8,marginRight: 12,}}  
              activeOpacity={0.7}
              onPress={() => {
                  router.back()
              }}>
                <Ionicons name="arrow-back" size={20} color={white} />
              </TouchableOpacity>
              <View>
                <Text style={{color: white,fontSize: 16,fontWeight: "600",letterSpacing: 0.3,}}>Notifications</Text>
                {unreadCount > 0 && fetching === false && <Text style={{fontSize: 12,color: Primary,fontWeight: 500}}>{unreadCount} unread</Text>}
              </View>
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity 
              disabled={fetching}
              activeOpacity={0.7}
              style={{ paddingHorizontal: 12,borderRadius: 6,}} onPress={markAllAsRead}>
                <Text style={{color: "#9ca3af",fontSize: 13,}}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{flexDirection: 'row',alignItems: 'center',width: windowWidth * 0.9,height: 40,backgroundColor: secondary,borderRadius: 10,paddingHorizontal: 10,alignSelf: 'center',marginVertical: 5}}>
              <Ionicons name="search" size={17} color={white} style={{ marginRight: 7,}} />
              <TextInput
              style={{flex: 1,fontSize: 14,color: 'white',}}
              placeholder="Search notifications..."
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              value={searchQuery}
              onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && ( 
                  <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={handleClear} style={{marginHorizontal: 3,}}>
                      <Ionicons name="close-circle" size={16} color={white} />
                  </TouchableOpacity>
              )}
          </View>

          <View style={{flex: 1,marginVertical: 10}}>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.$id}
              renderItem={({item}) => {
                return(
                  <TouchableOpacity
                  activeOpacity={0.7}
                  style={{width: "90%",alignSelf:"center",flexDirection: "row",justifyContent: "space-between",marginVertical: 4}}
                  >
                    <View style={{height: 40,width: 40,justifyContent: "center",alignItems: "center"}}>
                      <Text style={styles.notificationIcon}>{getNotificationIcon(item.type)}</Text>

                    </View>
                    <View style={{width: "90%",paddingVertical: 5,paddingHorizontal: 10}}>
                      <View style={{flexDirection: "row",justifyContent: "space-between",alignItems:"center"}}>
                        <View style={{flexDirection: "row",alignItems:"center"}}>
                          <Text style={{fontWeight: 500,fontSize: 14,color: white,marginRight: 10}}>{item.title}</Text>
                          {!item.isRead && <Text style={{marginVertical: 2,paddingVertical: 2,paddingHorizontal: 5,borderRadius: 50,color: "#fff",backgroundColor:Primary,fontSize: 8,textAlign: "center"}}>1</Text>}
                        </View>
                        <Text style={{fontSize: 12,color: Gray}}>{item.timestamp}</Text>
                      </View>
                      <Text numberOfLines={2} style={{color: silver,fontSize: 13,lineHeight: 20,}}>{item.message}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={{paddingVertical: 40,justifyContent: "center",}}>
                  <Emptyreturn/>
                </View>
              }
            />

          </View>

        </SafeAreaView>
    </LinearGradient>
  )
}

export default Notifications

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  unreadCard: {
    borderColor: "#ea580c",
    backgroundColor: "#1f2937",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationHeaderLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  notificationTitleContainer: {
    flex: 1,
  },
  notificationTitle: {
    color: "#d1d5db",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  unreadTitle: {
    color: "#ffffff",
    fontWeight: "600",
  },
  notificationTimestamp: {
    color: "#6b7280",
    fontSize: 12,
  },
  notificationHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ea580c",
  },
  notificationMessage: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateMessage: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  clearSearchButton: {
    backgroundColor: "#374151",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearSearchButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
})