import * as http from "http";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

export const userRoutes = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {

  if (req.url?.startsWith("/api/users")) {
    // regex untuk mengambil bagian terakhir dari url (userID) dan parse ke integer
    const userId = parseInt(req.url.split("/").pop() || "", 10);

    switch (req.method) {
      case "GET":
        if (!userId) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(getUsers()));
        } else {
          const user = getUserById(userId);
          if (user) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
          } else {
            res.end(JSON.stringify({ message: "User not found" }));
          }
        }
        break;

      case "POST":
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });

        req.on("end", () => {
          const newUser: any = JSON.parse(data);
          const users = getUsers();
          const userExists = users.find((user) => user.id === newUser.id || user.email === newUser.email);
          
          if (userExists) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                status: 'BAD_REQUEST',
                message: "User already exists",
              })
            );
          } else {
            createUser(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
          }
        });
        break;

      case "PUT":
        if (userId) {
          let data = "";
          req.on("data", (chunk) => {
            data += chunk;
          });

          req.on("end", () => {
            const updatedUser: any = JSON.parse(data);
            const user = updateUser(userId, updatedUser);
            if (user) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(user));
            } else {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: "User not found", status: 'NOT_FOUND' }));
            }
          });
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: "Invalid user ID", status: 'BAD_REQUEST' }));
        }
        break;

      case "DELETE":
        if (userId) {
          const deletedUser = deleteUser(userId);
          if (deletedUser) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              message: 'user deleted',
              deleted_user: deletedUser
            }));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "User not found", status: 'NOT_FOUND' }));
          }
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: "Invalid user ID", status: 'BAD_REQUEST' }));
        }
        break;

      default:
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Invalid method", status: 'METHOD_NOT_ALLOWED' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Invalid endpoint", status: 'NOT_FOUND' }));
  }
};
