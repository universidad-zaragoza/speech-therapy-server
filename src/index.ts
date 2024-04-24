import express from "express";
import { Server as SocketIOServer, Socket } from "socket.io";
import cors from "cors";
import fs from "fs";
import https from "https";
import bodyParser from "body-parser";
import webcamRoutes from "./shared/routes/webcam";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/webcam", webcamRoutes);

// Ruta al certificado y clave TLS/SSL
const tlsOptions = {
  key: fs.readFileSync("mk-signed-cert/192.168.1.109-key.pem"),
  cert: fs.readFileSync("mk-signed-cert/192.168.1.109.pem"),
};

// Crear servidor HTTPS
const httpsServer = https.createServer(tlsOptions, app);

// Crear instancia de Socket.IO para los servidores HTTP y HTTPS
const httpsIo = new SocketIOServer(httpsServer, {
  cors: {
    origin: "*",
  },
});

// Manejo de conexiones WebSocket para el servidor HTTPS
httpsIo.on("connection", (socket: Socket) => {
  console.log("Cliente WebSocket conectado al servidor HTTPS");

  socket.on("tomarFoto", () => {
    console.log("Solicitud para tomar la foto recibida");

    setTimeout(() => {
      socket.emit("fotoLista", "Una imagen enviada");
      console.log("Imagen enviada...");
    }, 5000);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Configurar el puerto
const PORT = 443;

httpsServer.listen(PORT, () => {
  console.log("Servidor HTTPS y WebSocket escuchando en el puerto 443");
});
