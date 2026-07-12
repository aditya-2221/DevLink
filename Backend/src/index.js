import http from "http";
import dotenv from "dotenv";

import app from "./app.js";
import dbConnect from "./db/index.js";

import { initializeSocket } from "./socket/socket.service.js";

dotenv.config({
    path: "./.env"
});

const server = http.createServer(app);

initializeSocket(server);

dbConnect()
    .then(() => {

        server.listen(
            process.env.PORT || 8000,
            () => {

                console.log(
                    `Server is listening at port : ${process.env.PORT || 8000}`
                );

            }
        );

    })
    .catch((error) => {

        console.log(
            "MONGODB connection failed !!!",
            error
        );

    });