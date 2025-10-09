"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = void 0;
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("@src/server"));
const MockOrm_1 = __importDefault(require("@src/repos/MockOrm"));
/******************************************************************************
                                    Run
******************************************************************************/
let agent;
(0, vitest_1.beforeAll)(async () => {
    exports.agent = agent = supertest_1.default.agent(server_1.default);
    await MockOrm_1.default.cleanDb();
});
