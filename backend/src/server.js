"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jet_logger_1 = __importDefault(require("jet-logger"));
const routes_1 = __importDefault(require("@src/routes"));
const Paths_1 = __importDefault(require("@src/common/constants/Paths"));
const ENV_1 = __importDefault(require("@src/common/constants/ENV"));
const HttpStatusCodes_1 = __importDefault(require("@src/common/constants/HttpStatusCodes"));
const route_errors_1 = require("@src/common/util/route-errors");
const constants_1 = require("@src/common/constants");
/******************************************************************************
                                Setup
******************************************************************************/
const app = (0, express_1.default)();
// **** Middleware **** //
// Basic middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS for frontend dev server
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));
// Show routes called in console during development
if (ENV_1.default.NodeEnv === constants_1.NodeEnvs.Dev) {
    app.use((0, morgan_1.default)('dev'));
}
// Security
if (ENV_1.default.NodeEnv === constants_1.NodeEnvs.Production) {
    // eslint-disable-next-line n/no-process-env
    if (!process.env.DISABLE_HELMET) {
        app.use((0, helmet_1.default)());
    }
}
// Add APIs, must be after middleware
app.use(Paths_1.default.Base, routes_1.default);
// Add error handler
app.use((err, _, res, next) => {
    if (ENV_1.default.NodeEnv !== constants_1.NodeEnvs.Test.valueOf()) {
        jet_logger_1.default.err(err, true);
    }
    let status = HttpStatusCodes_1.default.BAD_REQUEST;
    if (err instanceof route_errors_1.RouteError) {
        status = err.status;
        res.status(status).json({ error: err.message });
    }
    return next(err);
});
/******************************************************************************
                                Export default
******************************************************************************/
exports.default = app;
