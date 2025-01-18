import { Server } from "socket.io";

export default function setupSocket(io) {
  // Пространство имен для чата
  const chatNamespace = io.of("/hello");
  chatNamespace.on("connection", (socket) => {
    console.log("Клиент подключился к /chat");

    socket.on("message", (msg) => {
      console.log(`Сообщение в чате: ${msg}`);
    });
  });

  // Пространство имен для уведомлений
  const notificationNamespace = io.of("/bye-bye");
  notificationNamespace.on("connection", (socket) => {
    console.log("Клиент подключился к /notifications");

    socket.on("alert", (data) => {
      console.log(`Уведомление: ${data}`);
    });
  });
}
