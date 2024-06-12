"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const sqlite3_1 = require("sqlite3");
const database = new sqlite3_1.Database("./main.sqlite");
class Repository {
    constructor(tableName) {
        this.tableName = tableName;
        this.db = database;
        this.tableName = tableName;
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const keys = Object.keys(entity);
                const values = Object.values(entity);
                const placeholders = keys.map((key) => "?").join(", ");
                const sql = `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${placeholders})`;
                this.db.run(sql, values, function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(entity);
                });
            });
        });
    }
    read(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
                this.db.get(sql, id, (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(row);
                });
            });
        });
    }
    update(id, entity) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
                this.db.run(sql, id, function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve(this.lastID);
                });
            });
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = `SELECT * FROM ${this.tableName}`;
                this.db.all(sql, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
}
exports.Repository = Repository;
