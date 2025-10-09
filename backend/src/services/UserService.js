"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_NOT_FOUND_ERR = void 0;
const route_errors_1 = require("@src/common/util/route-errors");
const HttpStatusCodes_1 = __importDefault(require("@src/common/constants/HttpStatusCodes"));
const UserRepo_1 = __importDefault(require("@src/repos/UserRepo"));
/******************************************************************************
                                Constants
******************************************************************************/
exports.USER_NOT_FOUND_ERR = 'User not found';
/******************************************************************************
                                Functions
******************************************************************************/
/**
 * Get all users.
 */
function getAll() {
    return UserRepo_1.default.getAll();
}
/**
 * Add one user.
 */
function addOne(user) {
    return UserRepo_1.default.add(user);
}
/**
 * Update one user.
 */
async function updateOne(user) {
    const persists = await UserRepo_1.default.persists(user.id);
    if (!persists) {
        throw new route_errors_1.RouteError(HttpStatusCodes_1.default.NOT_FOUND, exports.USER_NOT_FOUND_ERR);
    }
    // Return user
    return UserRepo_1.default.update(user);
}
/**
 * Delete a user by their id.
 */
async function _delete(id) {
    const persists = await UserRepo_1.default.persists(id);
    if (!persists) {
        throw new route_errors_1.RouteError(HttpStatusCodes_1.default.NOT_FOUND, exports.USER_NOT_FOUND_ERR);
    }
    // Delete user
    return UserRepo_1.default.delete(id);
}
/******************************************************************************
                                Export default
******************************************************************************/
exports.default = {
    getAll,
    addOne,
    updateOne,
    delete: _delete,
};
