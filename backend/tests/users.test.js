"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inserturlparams_1 = __importDefault(require("inserturlparams"));
const utils_1 = require("jet-validators/utils");
const UserRepo_1 = __importDefault(require("@src/repos/UserRepo"));
const User_1 = __importDefault(require("@src/models/User"));
const UserService_1 = require("@src/services/UserService");
const HttpStatusCodes_1 = __importDefault(require("@src/common/constants/HttpStatusCodes"));
const route_errors_1 = require("@src/common/util/route-errors");
const Paths_1 = __importDefault(require("./common/Paths"));
const util_1 = require("./common/util");
const setup_1 = require("./support/setup");
/******************************************************************************
                               Constants
******************************************************************************/
// Dummy users for GET req
const DB_USERS = [
    User_1.default.new({ name: 'Sean Maxwell', email: 'sean.maxwell@gmail.com' }),
    User_1.default.new({ name: 'John Smith', email: 'john.smith@gmail.com' }),
    User_1.default.new({ name: 'Gordan Freeman', email: 'gordan.freeman@gmail.com' }),
];
// Don't compare "id" and "created" cause those are set dynamically by the 
// database
const compareUserArrays = (0, utils_1.customDeepCompare)({
    onlyCompareProps: ['name', 'email'],
});
/******************************************************************************
                                 Tests
  IMPORTANT: Following TypeScript best practices, we test all scenarios that
  can be triggered by a user under normal circumstances. Not all theoretically
  scenarios (i.e. a failed database connection).
******************************************************************************/
describe('UserRouter', () => {
    let dbUsers = [];
    // Run before all tests
    beforeEach(async () => {
        await UserRepo_1.default.deleteAllUsers();
        dbUsers = await UserRepo_1.default.insertMult(DB_USERS);
    });
    // Get all users
    describe(`"GET:${Paths_1.default.Users.Get}"`, () => {
        // Success
        it('should return a JSON object with all the users and a status code ' +
            `of "${HttpStatusCodes_1.default.OK}" if the request was successful.`, async () => {
            const res = await setup_1.agent.get(Paths_1.default.Users.Get);
            expect(res.status).toBe(HttpStatusCodes_1.default.OK);
            expect(compareUserArrays(res.body.users, DB_USERS)).toBeTruthy();
        });
    });
    // Test add user
    describe(`"POST:${Paths_1.default.Users.Add}"`, () => {
        // Test add user success
        it(`should return a status code of "${HttpStatusCodes_1.default.CREATED}" if the ` +
            'request was successful.', async () => {
            const user = User_1.default.new({ name: 'a', email: 'a@a.com' }), res = await setup_1.agent.post(Paths_1.default.Users.Add).send({ user });
            expect(res.status).toBe(HttpStatusCodes_1.default.CREATED);
        });
        // Missing param
        it('should return a JSON object with an error message of and a status ' +
            `code of "${HttpStatusCodes_1.default.BAD_REQUEST}" if the user param was ` +
            'missing.', async () => {
            const res = await setup_1.agent.post(Paths_1.default.Users.Add).send({ user: null });
            expect(res.status).toBe(HttpStatusCodes_1.default.BAD_REQUEST);
            const errorObj = (0, util_1.parseValidationErr)(res.body.error);
            expect(errorObj.message).toBe(route_errors_1.ValidationError.MESSAGE);
            expect(errorObj.errors[0].prop).toBe('user');
        });
    });
    // Update users
    describe(`"PUT:${Paths_1.default.Users.Update}"`, () => {
        // Success
        it(`should return a status code of "${HttpStatusCodes_1.default.OK}" if the ` +
            'request was successful.', async () => {
            const user = DB_USERS[0];
            user.name = 'Bill';
            const res = await setup_1.agent.put(Paths_1.default.Users.Update).send({ user });
            expect(res.status).toBe(HttpStatusCodes_1.default.OK);
        });
        // Id is the wrong data type
        it('should return a JSON object with an error message and a status code ' +
            `of "${HttpStatusCodes_1.default.BAD_REQUEST}" if the user param was missing`, async () => {
            const user = User_1.default.new();
            user.id = '5';
            const res = await setup_1.agent.put(Paths_1.default.Users.Update).send({ user });
            expect(res.status).toBe(HttpStatusCodes_1.default.BAD_REQUEST);
            const errorObj = (0, util_1.parseValidationErr)(res.body.error);
            expect(errorObj.message).toBe(route_errors_1.ValidationError.MESSAGE);
            expect(errorObj.errors[0].prop).toBe('user');
            expect(errorObj.errors[0].children?.[0].prop).toBe('id');
        });
        // User not found
        it('should return a JSON object with the error message of ' +
            `"${UserService_1.USER_NOT_FOUND_ERR}" and a status code of ` +
            `"${HttpStatusCodes_1.default.NOT_FOUND}" if the id was not found.`, async () => {
            const user = User_1.default.new({ id: 4, name: 'a', email: 'a@a.com' }), res = await setup_1.agent.put(Paths_1.default.Users.Update).send({ user });
            expect(res.status).toBe(HttpStatusCodes_1.default.NOT_FOUND);
            expect(res.body.error).toBe(UserService_1.USER_NOT_FOUND_ERR);
        });
    });
    // Delete User
    describe(`"DELETE:${Paths_1.default.Users.Delete}"`, () => {
        const getPath = (id) => (0, inserturlparams_1.default)(Paths_1.default.Users.Delete, { id });
        // Success
        it(`should return a status code of "${HttpStatusCodes_1.default.OK}" if the ` +
            'request was successful.', async () => {
            const id = dbUsers[0].id, res = await setup_1.agent.delete(getPath(id));
            expect(res.status).toBe(HttpStatusCodes_1.default.OK);
        });
        // User not found
        it('should return a JSON object with the error message of ' +
            `"${UserService_1.USER_NOT_FOUND_ERR}" and a status code of ` +
            `"${HttpStatusCodes_1.default.NOT_FOUND}" if the id was not found.`, async () => {
            const res = await setup_1.agent.delete(getPath(-1));
            expect(res.status).toBe(HttpStatusCodes_1.default.NOT_FOUND);
            expect(res.body.error).toBe(UserService_1.USER_NOT_FOUND_ERR);
        });
    });
});
