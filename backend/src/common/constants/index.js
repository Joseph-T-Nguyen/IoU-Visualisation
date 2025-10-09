"use strict";
/******************************************************************************
                              Enums
******************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeEnvs = void 0;
// NOTE: These need to match the names of your ".env" files
var NodeEnvs;
(function (NodeEnvs) {
    NodeEnvs["Dev"] = "development";
    NodeEnvs["Test"] = "test";
    NodeEnvs["Production"] = "production";
})(NodeEnvs || (exports.NodeEnvs = NodeEnvs = {}));
