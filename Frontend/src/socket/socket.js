import { io } from "socket.io-client";

let socket = null;

const listenerMap = new Map();

const connectSocket = () => {

    if (socket) {
        return socket;
    }

    socket = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
    });

    
    socket.on("connect_error", (err) => {
        console.error("Socket Error:", err.message);
    });

    return socket;
};

const getSocket = () => socket;

const disconnectSocket = () => {

    if (!socket) return;

    listenerMap.forEach((callbacks, event) => {
        callbacks.forEach(cb => socket.off(event, cb));
    });

    listenerMap.clear();

    socket.disconnect();

    socket = null;
};

const ensureSocket = () => {

    if (!socket) {
        connectSocket();
    }

    return socket;
};

const emit = (event, payload) => {

    const s = ensureSocket();

    if (s.connected) {

        s.emit(event, payload);

    } else {

        s.once("connect", () => {

            s.emit(event, payload);

        });

    }

};

const addListener = (event, callback) => {

    const s = ensureSocket();

    if (!listenerMap.has(event)) {
        listenerMap.set(event, new Set());
    }

    const callbacks = listenerMap.get(event);

    if (callbacks.has(callback)) {
        return;
    }

    callbacks.add(callback);

    s.on(event, callback);

};

const removeListener = (event, callback) => {

    if (!socket) return;

    if (callback) {

        socket.off(event, callback);

        listenerMap.get(event)?.delete(callback);

        return;

    }

    const callbacks = listenerMap.get(event);

    if (!callbacks) return;

    callbacks.forEach(cb => socket.off(event, cb));

    listenerMap.delete(event);

};





/* ---------- Emits ---------- */

const joinConversation = (conversationId) => {

    emit("joinConversation", conversationId);

};

const leaveConversation = (conversationId) => {

    emit("leaveConversation", conversationId);

};

const markConversationRead = (
    conversationId,
    lastMessageId
) => {

    emit("markConversationRead", {
        conversationId,
        lastMessageId
    });

};

const startTyping = (conversationId) => {

    emit("typing:start", conversationId);

};

const stopTyping = (conversationId) => {

    emit("typing:stop", conversationId);

};





/* ---------- Listeners ---------- */

const onConnect = callback =>
    addListener("connect", callback);

const onDisconnect = callback =>
    addListener("disconnect", callback);

const onNewMessage = callback =>
    addListener("newMessage", callback);

const onConversationUpdated = callback =>
    addListener("conversationUpdated", callback);

const onConversationRead = callback =>
    addListener("conversationRead", callback);

const onTypingStart = callback =>
    addListener("typing:start", callback);

const onTypingStop = callback =>
    addListener("typing:stop", callback);

const onOnlineUsers = callback =>
    addListener("onlineUsers", callback);

const onMessageUpdated = callback =>
    addListener("messageUpdated", callback);

const onMessageDeleted = callback =>
    addListener("messageDeleted", callback);

export {

    connectSocket,
    disconnectSocket,
    getSocket,

    joinConversation,
    leaveConversation,

    markConversationRead,

    startTyping,
    stopTyping,

    onConnect,
    onDisconnect,

    onNewMessage,
    onConversationUpdated,
    onConversationRead,

    onTypingStart,
    onTypingStop,

    onOnlineUsers,

    onMessageUpdated,
    onMessageDeleted,

    removeListener

};