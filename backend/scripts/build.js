"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const jet_logger_1 = __importDefault(require("jet-logger"));
const child_process_1 = __importDefault(require("child_process"));
/**
 * Start
 */
(async () => {
    try {
        // Remove current build
        await remove('./dist/');
        await exec('npm run lint', './');
        await exec('tsc --build tsconfig.prod.json', './');
        // Copy
        await copy('./src/public', './dist/public');
        await copy('./src/views', './dist/views');
        await copy('./src/repos/database.json', './dist/repos/database.json');
        await copy('./temp/config.js', './config.js');
        await copy('./temp/src', './dist');
        await remove('./temp/');
    }
    catch (err) {
        jet_logger_1.default.err(err);
        // eslint-disable-next-line n/no-process-exit
        process.exit(1);
    }
})();
/**
 * Remove file
 */
function remove(loc) {
    return new Promise((res, rej) => {
        return fs_extra_1.default.remove(loc, err => {
            return (!!err ? rej(err) : res());
        });
    });
}
/**
 * Copy file.
 */
function copy(src, dest) {
    return new Promise((res, rej) => {
        return fs_extra_1.default.copy(src, dest, err => {
            return (!!err ? rej(err) : res());
        });
    });
}
/**
 * Do command line command.
 */
function exec(cmd, loc) {
    return new Promise((res, rej) => {
        return child_process_1.default.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
            if (!!stdout) {
                jet_logger_1.default.info(stdout);
            }
            if (!!stderr) {
                jet_logger_1.default.warn(stderr);
            }
            return (!!err ? rej(err) : res());
        });
    });
}
