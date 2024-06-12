const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("users.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("USER REPO: Connected to the users database.");
  }
});

class UserRepository {
  constructor() {
    this.db = db;
  }

  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async createUser(user) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO users (username, first_name, last_name, password, email, role_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user.username,
          user.firstname,
          user.lastname,
          user.password,
          user.email,
          user.role_id,
        ],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getUserRole(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT role_id FROM users WHERE id = ?`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  async getUserById(userId) {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async deleteUser(userId) {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM users WHERE id = ?`, [userId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async updateUser(userID, user) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE users SET username = ?, email = ?, first_name = ?, last_name = ? WHERE id = ?`,
        [user.username, user.email, user.firstname, user.lastname, userID],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getAllUsers() {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM users`, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async updateUserPassword(userID, password) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE users SET password = ? WHERE id = ?`,
        [password, userID],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}

module.exports = UserRepository;
