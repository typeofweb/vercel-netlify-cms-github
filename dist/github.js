"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitHubErrorToNetlifyError = exports.isGitHubError = void 0;
function isGitHubError(data) {
    return Boolean(typeof data === 'object' && data && 'error' in data);
}
exports.isGitHubError = isGitHubError;
function gitHubErrorToNetlifyError(err) {
    const message = [
        `GitHub Error: ${err.error}`,
        err === null || err === void 0 ? void 0 : err.error_description,
        err === null || err === void 0 ? void 0 : err.error_uri,
    ]
        .filter(Boolean)
        .join(' | ');
    return { message };
}
exports.gitHubErrorToNetlifyError = gitHubErrorToNetlifyError;
//# sourceMappingURL=github.js.map