"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonfile_1 = __importDefault(require("jsonfile"));
const ENV_1 = __importDefault(require("@src/common/constants/ENV"));
const constants_1 = require("@src/common/constants");
/******************************************************************************
                                Constants
******************************************************************************/
const DB_FILE_NAME = (ENV_1.default.NodeEnv === constants_1.NodeEnvs.Test
    ? 'database.test.json'
    : 'database.json');
/******************************************************************************
                                Functions
******************************************************************************/
/**
 * Fetch the json from the file.
 */
function openDb() {
    return jsonfile_1.default.readFile(__dirname + '/' + DB_FILE_NAME);
}
/**
 * Update the file.
 */
function saveDb(db) {
    return jsonfile_1.default.writeFile((__dirname + '/' + DB_FILE_NAME), db);
}
/**
 * Empty the database
 */
function cleanDb() {
    return jsonfile_1.default.writeFile((__dirname + '/' + DB_FILE_NAME), {});
}
/******************************************************************************
                                Export default
******************************************************************************/
exports.default = {
    openDb,
    saveDb,
    cleanDb,
};
