const http = require("http");
const url = require("url");
const bcrypt = require("bcrypt");
const UserRepository = require("./data/user-repository");
const path = require("path");

const userRepository = new UserRepository();

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const { pathname } = url.parse(req.url);
  console.log(pathname);
  if (pathname === "/register" && req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", async () => {
      try {
        const { username, firstname, lastname, email, password } =
          JSON.parse(data);
        const hashedPassword = await bcrypt.hash(password, 10);
        // check if the user already exists
        const user = await userRepository.getUserByUsername(username);
        if (user) {
          res.statusCode = 409;
          res.end(JSON.stringify({ message: "user already exists" }));
          return;
        }
        // if the user does not exist, create the user

        await userRepository.createUser({
          username,
          firstname,
          lastname,
          email,
          password: hashedPassword,
          role_id: 2,
        });
        res.statusCode = 201;
        res.end(JSON.stringify({ message: "user created" }));
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify({ message: "error creating user" }));
      }
    });
  } else if (pathname === "/login" && req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", async () => {
      try {
        const { username, password } = JSON.parse(data);
        const user = await userRepository.getUserByUsername(username);
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                id: user.id,
                username: user.username,
                role_id: user.role_id,
              })
            );
          } else {
            res.statusCode = 401;
            res.end(JSON.stringify({ message: "password is incorrect" }));
          }
        } else {
          res.statusCode = 401;
          res.end(JSON.stringify({ message: "username is incorrect" }));
        }
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify({ message: "invalid user" }));
      }
    });
  } else if (pathname === "/verify" && req.method === "POST") {
    // verify the user
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", async () => {
      try {
        const { user_id, decodedToken } = JSON.parse(data);

        const user = await userRepository.getUserById(user_id);
        if (
          user.id === decodedToken.id &&
          user.role_id === decodedToken.role_id
        ) {
          res.statusCode = 200;
          res.end(JSON.stringify({ message: "user verified" }));
          return;
        }

        res.statusCode = 401;
        res.end(JSON.stringify({ message: "user not verified" }));
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end("invalid user");
      }
    });
  } else if (pathname.startsWith("/users/") && req.method === "PUT") {
    try {
      const userID = pathname.substring(7);
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        const data = JSON.parse(body);
        if (userID.endsWith("/password")) {
          // remove the /password from the userID
          const userID = pathname.substring(7, pathname.length - 9);
          const user = await userRepository.getUserById(userID);
          if (user) {
            const { oldPassword, newPassword } = data;
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (isMatch) {
              const hashedPassword = await bcrypt.hash(newPassword, 10);
              await userRepository.updateUserPassword(userID, hashedPassword);
              res.statusCode = 200;
              res.end(JSON.stringify({ message: "password updated" }));
            } else {
              res.statusCode = 401;
              res.end(JSON.stringify({ message: "password is incorrect" }));
            }
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "user not found" }));
          }
          return;
        }

        await userRepository.updateUser(userID, data);

        // get the updated user
        const user = await userRepository.getUserById(userID);

        res.statusCode = 200;
        res.end(JSON.stringify(user));
      });
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end("error updating user");
    }
  } else if (pathname.startsWith("/users/") && req.method === "GET") {
    try {
      const userId = pathname.substring(7);
      const user = await userRepository.getUserById(userId);
      if (user) {
        res.statusCode = 200;
        console.log(user);
        res.end(
          JSON.stringify({
            id: user.id,
            username: user.username,
            firstname: user.first_name,
            lastname: user.last_name,
            email: user.email,
            role_id: user.role_id,
          })
        );
      } else {
        res.statusCode = 404;
        res.end("User not found");
      }
    } catch (error) {
      res.statusCode = 500;
      res.end("error getting user");
    }
  } else if (pathname === "/users" && req.method === "GET") {
    try {
      const users = await userRepository.getAllUsers();
      res.statusCode = 200;
      res.end(JSON.stringify(users));
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end("error getting users");
    }
  } else if (pathname.startsWith("/users/") && req.method === "DELETE") {
    try {
      const userId = pathname.substring(7);
      const deletedUser = await userRepository.deleteUser(userId);
      if (deletedUser) {
        res.statusCode = 200;
        res.end(JSON.stringify(deletedUser));
      } else {
        res.statusCode = 404;
        res.end("User not found");
      }
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end("Error deleting user");
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "route not found" }));
  }
});

server.listen(4000, () => {
  console.log("server is running on port 4000");
});
