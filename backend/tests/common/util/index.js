"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseValidationErr = parseValidationErr;
const utils_1 = require("jet-validators/utils");
const jet_validators_1 = require("jet-validators");
/******************************************************************************
                                Functions
******************************************************************************/
/**
 * JSON parse a validation error.
 */
function parseValidationErr(arg) {
    if (!(0, jet_validators_1.isString)(arg)) {
        throw new Error('Not a string');
    }
    return (0, utils_1.parseJson)(arg);
}
