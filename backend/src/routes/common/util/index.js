"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReq = parseReq;
const utils_1 = require("jet-validators/utils");
const route_errors_1 = require("@src/common/util/route-errors");
/******************************************************************************
                              Functions
******************************************************************************/
/**
 * Throw a "ParseObjError" when "parseObject" fails. Also extract a nested
 * "ParseObjError" and add it to the nestedErrors array.
 */
function parseReq(schema) {
    return (0, utils_1.parseObject)(schema, errors => {
        throw new route_errors_1.ValidationError(errors);
    });
}
