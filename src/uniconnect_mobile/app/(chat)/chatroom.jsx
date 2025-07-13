import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, TouchableOpacity, Modal, Alert } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header';
import { white, silver, Gray, Primary, secondary } from '../../utils/colors';
import { LegendList } from '@legendapp/list';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { getMessages } from '../../lib/chat/chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Appwriteconfig } from '../../lib/appwriteenv';
import { Databases, Client } from 'react-native-appwrite';
import { createMessage, sendMessage, getOtherParticipant, markMessagesAsRead, updateMessage, deleteMessage } from '../../lib/chat/chat';
import { useToast } from '@/context/ToastProvider';
import MessagesEmptyState from '../../components/messagesskeleton';
import { useAuthGuard } from '../../utils/useAuthGuard';

const Chatroom = () => {
    const { showError, showSuccess } = useToast();
          const { isAuthenticated, checking } = useAuthGuard('/');
    
    const client = new Client();
    const databases = new Databases(client);

    client
        .setEndpoint(Appwriteconfig.endpoint) 
        .setProject(Appwriteconfig.projectId) 
        .setPlatform(Appwriteconfig.platform);

    const { chatroomId, title } = useLocalSearchParams()
    const [isFetchingMessages, setIsFetchingMessages] = useState(false)
    const [sending, setSending] = useState(false)
    const [messages, setMessages] = useState([])
    const [currentUserId, setcurrentUserId] = useState("")
    const [receiverId, setreceiverId] = useState("")
    const [senderName, setSenderName] = useState("")
    const [messageContent, setMessageContent] = useState("")
    const [selectedMessageId, setSelectedMessageId] = useState(null)
    const [isInitialized, setIsInitialized] = useState(false)
    
    const [showOptionsModal, setShowOptionsModal] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editingMessageId, setEditingMessageId] = useState(null)
    const [originalMessageContent, setOriginalMessageContent] = useState("")

    useEffect(() => {
        if (!chatroomId) {
            router.replace("/chat")
        } else {
            initializeChat();
        }
    }, [chatroomId])

    const initializeChat = async () => {
        try {
            await getUser();
            await getMessage();
            await fetchReceiverId();
            setIsInitialized(true);
        } catch (error) {
            console.log("Error initializing chat:", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            console.log("Chat focused, refreshing messages");
            if (isInitialized && currentUserId) {
                getMessage();
            }
        }, [chatroomId, currentUserId, isInitialized])
    );

    const getUser = async () => {
        try {
            const user = await AsyncStorage.getItem("user")
            if (user) {
                const userInfo = JSON.parse(user);
                console.log("Setting current user:", userInfo.$id);
                setcurrentUserId(userInfo.$id)
                setSenderName(userInfo.name)
                return userInfo.$id; 
            }
        } catch (error) {
            console.log("Error getting user:", error);
        }
        return null;
    }

    const getMessage = async () => {
        try {
            setIsFetchingMessages(true);
            const result = await getMessages(chatroomId)
            if(!result.success){
                showError("Failed to fetch messages. Please try again later.");
                setMessages([]);
                router.replace("/chat")
                return
            }

            if (result.success) {
                console.log("Fetched messages:", result.result.documents.length);
                setMessages(result.result.documents)

                const userId = currentUserId || await getCurrentUserId();
                
                if (userId) {
                    console.log("Marking messages as read for user:", userId);
                    const markResult = await markMessagesAsRead(chatroomId, userId);
                    if (!markResult.success) {
                        console.log("Failed to mark messages as read");
                        }
                    console.log("Mark as read result:", markResult);
                } else {
                    console.log("No user ID available to mark messages as read");
                }

            } else {
                console.log("No messages found.");
            }

        } catch (error) {
            console.log("Error in getMessage:", error);
        } finally {
            setIsFetchingMessages(false);
        }
    }

    const getCurrentUserId = async () => {
        try {
            const user = await AsyncStorage.getItem("user");
            if (user) {
                const userInfo = JSON.parse(user);
                return userInfo.$id;
            }
        } catch (error) {
            console.log("Error getting current user ID:", error);
        }
        return null;
    }

    const fetchReceiverId = async () => {
        try {
            const userId = currentUserId || await getCurrentUserId();
            if (!userId) {
                console.log("No user ID available for fetchReceiverId");
                return;
            }

            const result = await getOtherParticipant(chatroomId, userId);
            if (result.success) {
                const id = result.receiverId;
                // console.log("Setting receiver ID:", id);
                setreceiverId(id)
            } else {
                showError("Could not find other participant");
                router.replace("/chat")
            }
        } catch (error) {
            console.log("Error fetching receiver ID:", error);
        }
    };

    const handlesendMessage = async () => {
        if (!messageContent.trim()) return;
        
        try {
            setSending(true)

            if (isEditing && editingMessageId) {
                const res = await updateMessage(editingMessageId, messageContent.trim());
                
                if (res.success) {
                    setMessageContent("");
                    setIsEditing(false);
                    setEditingMessageId(null);
                    setOriginalMessageContent("");
                    showSuccess("Message updated successfully");
                    await getMessage(); 
                } else {
                    showError("Failed to update message");
                    return
                }
            } else {
                const res = await sendMessage({
                    content: messageContent,
                    senderId: currentUserId,
                    senderName: senderName, 
                    receiverId: receiverId,
                });

                if (res.success) {
                    setMessageContent("");       
                } else {
                    showError("Failed to send message");
                    return
                }
            }
        } catch (error) {
            console.log("Send/Update Message Error:", error);
            showError("Something went wrong while processing the message");
        } finally {
            setSending(false)
        }
    }

    const handleDeleteMessage = async (messageId) => {
        try {
            Alert.alert(
                "Delete Message",
                "Are you sure you want to delete this message?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                const result = await updateMessage(messageId, "", true); 
                                
                                if (result.success) {
                                    showSuccess("Message deleted successfully");
                                    await getMessage();
                                } else {
                                    showError("Failed to delete message");
                                    return
                                }
                            } catch (error) {
                                console.log("Delete message error:", error);
                                showError("Something went wrong while deleting the message");
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            console.log("Error in handleDeleteMessage:", error);
        }
    };

    const handleEditMessage = (message) => {
        setIsEditing(true);
        setEditingMessageId(message.$id);
        setMessageContent(message.content);
        setOriginalMessageContent(message.content);
        setShowOptionsModal(false);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditingMessageId(null);
        setMessageContent("");
        setOriginalMessageContent("");
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffInHours = Math.abs(now - messageTime) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return messageTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const getReadStatus = (readBy, senderId, currentUserId) => {
        if (senderId !== currentUserId) return null;

        try {
            const readByArray = readBy ? JSON.parse(readBy) : [];
            
            const otherUsersWhoRead = readByArray.filter(userId => userId !== senderId);
            const isReadByOthers = otherUsersWhoRead.length > 0;
            
            return {
                isRead: isReadByOthers, 
                readCount: otherUsersWhoRead.length
            };
        } catch (error) {
            console.error('Error parsing readBy:', error);
            return {
                isRead: false,
                readCount: 0
            };
        }
    };

    const isMessageEdited = (createdAt, updatedAt) => {
        if (!createdAt || !updatedAt) return false;
        const created = new Date(createdAt).getTime();
        const updated = new Date(updatedAt).getTime();
        return Math.abs(updated - created) > 1000;
    };

    const isMessageDeleted = (message) => {
        return message.isDeleted || (message.content === "" && message.deletedAt) || message.content === "[DELETED]";
    };

    useEffect(() => {
        if (!chatroomId || !currentUserId) return;

        const channel = `databases.${Appwriteconfig.databaseId}.collections.${Appwriteconfig.messagesColletionId}.documents`;
        
        console.log("Subscribing to realtime channel:", channel);
        
        const unsubscribe = client.subscribe(channel, async (response) => {
            console.log("Realtime event received:", response.events);
            
            if (response.payload && response.payload.chatroomId === chatroomId) {
                console.log("Event is for current chatroom");
                
                if (response.events[0].includes('.create')) {
                    console.log("New message created");
                    await getMessage(); 
                } else if (response.events[0].includes('.update')) {
                    console.log("Message updated");
                    const result = await getMessages(chatroomId);
                    if (result.success) {
                        setMessages(result.result.documents);
                    }
                } else if (response.events[0].includes('.delete')) {
                    console.log("Message deleted");
                    await getMessage();
                }
            } else {
                console.log("Event not for current chatroom, ignoring...");
            }
        });

        return () => {
            console.log("Unsubscribing from realtime");
            unsubscribe();
        };

    }, [chatroomId, currentUserId]);

    const renderReadStatus = (readStatus) => {
        if (!readStatus) return null;

        const { isRead } = readStatus;
        
        return (
            <View style={styles.readStatusContainer}>
                {isRead ? (
                    <Ionicons 
                        name="checkmark-done" 
                        size={12} 
                        color="#4FC3F7" 
                        style={styles.readStatusIcon}
                    />
                ) : (
                    <Ionicons 
                        name="checkmark" 
                        size={12} 
                        color={silver} 
                        style={styles.readStatusIcon}
                    />
                )}
            </View>
        );
    };

    const handleMessageOptions = (message) => {
        if (message.senderId === currentUserId && !isMessageDeleted(message)) {
            setSelectedMessage(message);
            setShowOptionsModal(true);
        }
    };

    const renderMessage = ({ item, index }) => {
        const isMyMessage = item.senderId === currentUserId;
        const readStatus = getReadStatus(item.readBy, item.senderId, currentUserId);
        const messageWasEdited = isMessageEdited(item.$createdAt, item.$updatedAt);
        const messageIsDeleted = isMessageDeleted(item);

        return (
            <View style={[
                styles.messageContainer,
                isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
            ]}>
                <View style={[
                    styles.messageBubble,
                    isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
                    messageIsDeleted && styles.deletedMessageBubble
                ]}>
                    {!isMyMessage && item.senderName && !messageIsDeleted && (
                        <Text style={styles.senderName}>{item.senderName}</Text>
                    )}
                    
                    <View style={styles.messageContentContainer}>
                        {messageIsDeleted ? (
                            <View style={styles.deletedMessageContainer}>
                                <Ionicons 
                                    name="trash-outline" 
                                    size={14} 
                                    color={silver} 
                                    style={styles.deletedIcon}
                                />
                                <Text style={styles.deletedMessageText}>
                                    This message was deleted
                                </Text>
                            </View>
                        ) : (
                            <Text style={[
                                styles.messageText,
                                isMyMessage ? styles.myMessageText : styles.otherMessageText
                            ]}>
                                {item.content}
                            </Text>
                        )}
                        
                        <View style={styles.messageFooter}>
                            <View style={styles.timeAndStatusContainer}>
                                <Text style={[
                                    styles.timeText,
                                    isMyMessage ? styles.myTimeText : styles.otherTimeText,
                                    messageIsDeleted && styles.deletedTimeText
                                ]}>
                                    {formatTime(item.$updatedAt || item.$createdAt)}
                                </Text>
                                
                                {messageWasEdited && !messageIsDeleted && (
                                    <Text style={[
                                        styles.editedText,
                                        isMyMessage ? styles.myEditedText : styles.otherEditedText
                                    ]}>
                                        edited
                                    </Text>
                                )}
                                
                                {!messageIsDeleted && renderReadStatus(readStatus)}
                            </View>
                            
                            {isMyMessage && !messageIsDeleted && (
                                <TouchableOpacity
                                    onPress={() => handleMessageOptions(item)}
                                    style={styles.optionsButton}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons 
                                        name="ellipsis-horizontal" 
                                        size={14} 
                                        color={silver} 
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const MessageOptionsModal = () => (
        <Modal
            visible={showOptionsModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowOptionsModal(false)}
        >
            <TouchableWithoutFeedback onPress={() => setShowOptionsModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleEditMessage(selectedMessage)}
                        >
                            <Ionicons name="create-outline" size={20} color={white} />
                            <Text style={styles.optionText}>Edit Message</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.optionSeparator} />
                        
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => {
                                setShowOptionsModal(false);
                                handleDeleteMessage(selectedMessage.$id);
                            }}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                            <Text style={[styles.optionText, { color: "#FF6B6B" }]}>Delete Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={{ paddingVertical: 3 }}>
                        <Header
                            title={title}
                            color={white}
                            Size={17}
                            showBackButton={true}
                            showIcons={false}
                            backPath="/chat"
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        {!isFetchingMessages && messages.length === 0 ? (
                            <MessagesEmptyState />
                        ) : (
                            <LegendList
                                data={messages}
                                keyExtractor={(item) => item?.$id}
                                renderItem={renderMessage}
                                contentContainerStyle={styles.messagesContainer}
                                recycleItems={true}
                                alignItemsAtEnd
                                maintainScrollAtEnd
                                maintainScrollAtEndThreshold={0.5}
                                maintainVisibleContentPosition
                                estimatedItemSize={100}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>

                    {isEditing && (
                        <View style={styles.editingIndicator}>
                            <View style={styles.editingContent}>
                                <Ionicons name="create-outline" size={16} color={Primary} />
                                <Text style={styles.editingText}>Editing message</Text>
                            </View>
                            <TouchableOpacity onPress={cancelEdit} style={styles.cancelButton}>
                                <Ionicons name="close" size={16} color={silver} />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder={isEditing ? 'Edit message...' : 'Message ...'}
                            value={messageContent}
                            onChangeText={setMessageContent}
                            style={styles.textInput}
                            multiline
                            placeholderTextColor={silver}
                        />
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.sendButton}
                            disabled={messageContent.trim() === "" || sending || isFetchingMessages}
                            onPress={handlesendMessage}
                        >
                            <Ionicons 
                                name={isEditing ? "checkmark" : "paper-plane"} 
                                size={17} 
                                color={messageContent.trim() === "" || sending ? silver : Primary} 
                            />
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
            
            <MessageOptionsModal />
        </SafeAreaView>
    )
}

export default Chatroom

const styles = StyleSheet.create({
    messagesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messageContainer: {
        marginVertical: 4,
        maxWidth: '80%',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
        maxWidth: '100%',
    },
    myMessageBubble: {
        backgroundColor: secondary,
        borderBottomRightRadius: 4,
    },
    otherMessageBubble: {
        backgroundColor: "#111111",
        borderBottomLeftRadius: 4,
    },
    deletedMessageBubble: {
        backgroundColor: "#0a0a0a",
        borderWidth: 1,
        borderColor: "#333333",
        borderStyle: 'dashed',
    },
    deletedMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.6,
    },
    deletedIcon: {
        marginRight: 6,
    },
    deletedMessageText: {
        fontSize: 14,
        color: silver,
        fontStyle: 'italic',
    },
    deletedTimeText: {
        color: silver,
        opacity: 0.5,
    },
    messageContentContainer: {
        flex: 1,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 4,
    },
    myMessageText: {
        color: white,
    },
    otherMessageText: {
        color: white,
    },
    senderName: {
        fontSize: 12,
        color: silver,
        marginBottom: 4,
        fontWeight: '600',
    },
    messageFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    timeText: {
        fontSize: 11,
        opacity: 0.7,
    },
    myTimeText: {
        color: white,
    },
    otherTimeText: {
        color: silver,
    },
    editedText: {
        fontSize: 10,
        fontStyle: 'italic',
        opacity: 0.6,
        marginLeft: 4,
    },
    myEditedText: {
        color: white,
    },
    otherEditedText: {
        color: silver,
    },
    optionsButton: {
        padding: 2,
        marginLeft: 8,
    },
    timeAndStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    readStatusContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    readStatusIcon: {
        marginLeft: 2,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: Gray,
        borderRadius: 20,
        marginHorizontal: 10
    },
    textInput: {
        minHeight: 40,
        color: "#fff",
        flexGrow: 1,
        padding: 10,
        flexShrink: 1
    },
    sendButton: {
        width: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsContainer: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingVertical: 8,
        minWidth: 150,
        borderWidth: 1,
        borderColor: Gray,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    optionText: {
        color: white,
        fontSize: 16,
        fontWeight: '500',
    },
    optionSeparator: {
        height: 1,
        backgroundColor: Gray,
        marginHorizontal: 16,
    },
    editingIndicator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#1a1a1a',
        borderTopWidth: 1,
        borderTopColor: Gray,
    },
    editingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    editingText: {
        color: Primary,
        fontSize: 14,
        fontWeight: '500',
    },
    cancelButton: {
        padding: 4,
    },
})