"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jet_validators_1 = require("jet-validators");
const utils_1 = require("jet-validators/utils");
const validators_1 = require("@src/common/util/validators");
/******************************************************************************
                                 Constants
******************************************************************************/
const DEFAULT_USER_VALS = () => ({
    id: -1,
    name: '',
    created: new Date(),
    email: '',
});
/******************************************************************************
                                  Setup
******************************************************************************/
// Initialize the "parseUser" function
const parseUser = (0, utils_1.parseObject)({
    id: validators_1.isRelationalKey,
    name: jet_validators_1.isString,
    email: jet_validators_1.isString,
    created: validators_1.transIsDate,
});
/******************************************************************************
                                 Functions
******************************************************************************/
/**
 * New user object.
 */
function __new__(user) {
    const retVal = { ...DEFAULT_USER_VALS(), ...user };
    return parseUser(retVal, errors => {
        throw new Error('Setup new user failed ' + JSON.stringify(errors, null, 2));
    });
}
/**
 * Check is a user object. For the route validation.
 */
function test(arg, errCb) {
    return !!parseUser(arg, errCb);
}
/******************************************************************************
                                Export default
******************************************************************************/
exports.default = {
    new: __new__,
    test,
};
