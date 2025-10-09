"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const misc_1 = require("@src/common/util/misc");
const MockOrm_1 = __importDefault(require("./MockOrm"));
/******************************************************************************
                                Functions
******************************************************************************/
/**
 * Get one user.
 */
async function getOne(email) {
    const db = await MockOrm_1.default.openDb();
    for (const user of db.users) {
        if (user.email === email) {
            return user;
        }
    }
    return null;
}
/**
 * See if a user with the given id exists.
 */
async function persists(id) {
    const db = await MockOrm_1.default.openDb();
    for (const user of db.users) {
        if (user.id === id) {
            return true;
        }
    }
    return false;
}
/**
 * Get all users.
 */
async function getAll() {
    const db = await MockOrm_1.default.openDb();
    return db.users;
}
/**
 * Add one user.
 */
async function add(user) {
    const db = await MockOrm_1.default.openDb();
    user.id = (0, misc_1.getRandomInt)();
    db.users.push(user);
    return MockOrm_1.default.saveDb(db);
}
/**
 * Update a user.
 */
async function update(user) {
    const db = await MockOrm_1.default.openDb();
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].id === user.id) {
            const dbUser = db.users[i];
            db.users[i] = {
                ...dbUser,
                name: user.name,
                email: user.email,
            };
            return MockOrm_1.default.saveDb(db);
        }
    }
}
/**
 * Delete one user.
 */
async function delete_(id) {
    const db = await MockOrm_1.default.openDb();
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].id === id) {
            db.users.splice(i, 1);
            return MockOrm_1.default.saveDb(db);
        }
    }
}
// **** Unit-Tests Only **** //
/**
 * Delete every user record.
 */
async function deleteAllUsers() {
    const db = await MockOrm_1.default.openDb();
    db.users = [];
    return MockOrm_1.default.saveDb(db);
}
/**
 * Insert multiple users. Can't do multiple at once cause using a plain file
 * for nmow.
 */
async function insertMult(users) {
    const db = await MockOrm_1.default.openDb(), usersF = [...users];
    for (const user of usersF) {
        user.id = (0, misc_1.getRandomInt)();
        user.created = new Date();
    }
    db.users = [...db.users, ...users];
    await MockOrm_1.default.saveDb(db);
    return usersF;
}
/******************************************************************************
                                Export default
******************************************************************************/
exports.default = {
    getOne,
    persists,
    getAll,
    add,
    update,
    delete: delete_,
    deleteAllUsers,
    insertMult,
};
