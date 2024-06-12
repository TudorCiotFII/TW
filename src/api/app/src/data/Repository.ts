import { Database } from "sqlite3";

const database = new Database("./main.sqlite");

export class Repository<T> {
  protected db: Database;

  constructor(private tableName: string) {
    this.db = database;
    this.tableName = tableName;
  }

  async create(entity: T): Promise<T> {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(entity);
      const values = Object.values(entity);
      const placeholders = keys.map((key) => "?").join(", ");
      const sql = `INSERT INTO ${this.tableName} (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;
      this.db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        }
        resolve(entity);
      });
    });
  }

  async read(id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
      this.db.get(sql, id, (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row as T);
      });
    });
  }

  async update(id: number, entity: T): Promise<T> {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(entity);
      const values = Object.values(entity);
      const placeholders = keys.map((key) => `${key} = ?`).join(", ");
      const sql = `UPDATE ${this.tableName} SET ${placeholders} WHERE id = ?`;
      this.db.run(sql, [...values, id], function (err) {
        if (err) {
          reject(err);
        }
        resolve(entity);
      });
    });
  }

  async delete(id: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
      this.db.run(sql, id, function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID as T);
      });
    });
  }

  async list(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName}`;
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows as T[]);
      });
    });
  }
}
