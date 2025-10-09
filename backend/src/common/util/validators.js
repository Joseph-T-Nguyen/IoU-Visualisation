"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transIsDate = void 0;
exports.isRelationalKey = isRelationalKey;
const jet_validators_1 = require("jet-validators");
const utils_1 = require("jet-validators/utils");
/******************************************************************************
                                Functions
******************************************************************************/
/**
 * Database relational key.
 */
function isRelationalKey(arg) {
    return (0, jet_validators_1.isNumber)(arg) && arg >= -1;
}
/**
 * Convert to date object then check is a validate date.
 */
exports.transIsDate = (0, utils_1.transform)(arg => new Date(arg), arg => (0, jet_validators_1.isDate)(arg));
