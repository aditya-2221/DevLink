import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

import { User } from "../models/user.model.js";
import registerSocketEvents from "./socket.events.js";

const onlineUsers = new Map();

let io;

const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    });

    io.use(async (socket, next) => {

    try {

        

        const cookies = parse(
            socket.handshake.headers.cookie || ""
        );

       

        const token = cookies.accessToken;

        

        if (!token) {
            return next(new Error("Unauthorized - No Token"));
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        

        const user = await User.findById(decoded._id);


        if (!user) {
            return next(new Error("Unauthorized - User Not Found"));
        }

        socket.user = user;

        next();

    } catch (err) {

        console.error("SOCKET AUTH ERROR:");
        console.error(err);

        next(err);

    }

});

    io.on("connection", (socket) => {


        const userId =
            socket.user._id.toString();

        onlineUsers.set(
            userId,
            socket.id
        );

        io.emit(
            "onlineUsers",
            [...onlineUsers.keys()]
        );

        registerSocketEvents(
            io,
            socket,
            onlineUsers
        );

        socket.on("disconnect", () => {

            onlineUsers.delete(userId);

            io.emit(
                "onlineUsers",
                [...onlineUsers.keys()]
            );

        });

    });

    return io;

};

const getIO = () => io;

export {
    initializeSocket,
    getIO,
    onlineUsers
};