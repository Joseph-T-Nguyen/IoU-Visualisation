"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jet_validators_1 = require("jet-validators");
const utils_1 = require("jet-validators/utils");
const HttpStatusCodes_1 = __importDefault(require("@src/common/constants/HttpStatusCodes"));
const UserService_1 = __importDefault(require("@src/services/UserService"));
const User_1 = __importDefault(require("@src/models/User"));
const util_1 = require("./common/util");
/******************************************************************************
                                Constants
******************************************************************************/
const Validators = {
    add: (0, util_1.parseReq)({ user: User_1.default.test }),
    update: (0, util_1.parseReq)({ user: User_1.default.test }),
    delete: (0, util_1.parseReq)({ id: (0, utils_1.transform)(Number, jet_validators_1.isNumber) }),
};
/******************************************************************************
                                Functions
******************************************************************************/
/**
 * Get all users.
 */
async function getAll(_, res) {
    const users = await UserService_1.default.getAll();
    res.status(HttpStatusCodes_1.default.OK).json({ users });
}
/**
 * Add one user.
 */
async function add(req, res) {
    const { user } = Validators.add(req.body);
    await UserService_1.default.addOne(user);
    res.status(HttpStatusCodes_1.default.CREATED).end();
}
/**
 * Update one user.
 */
async function update(req, res) {
    const { user } = Validators.update(req.body);
    await UserService_1.default.updateOne(user);
    res.status(HttpStatusCodes_1.default.OK).end();
}
/**
 * Delete one user.
 */
async function delete_(req, res) {
    const { id } = Validators.delete(req.params);
    await UserService_1.default.delete(id);
    res.status(HttpStatusCodes_1.default.OK).end();
}
/******************************************************************************
                                Export default
******************************************************************************/
exports.default = {
    getAll,
    add,
    update,
    delete: delete_,
};
