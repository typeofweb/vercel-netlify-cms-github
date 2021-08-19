"use strict";
//
// From https://github.com/robinpokorny/netlify-cms-now
// with the goal of moving to a reusable npm module
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.callback = exports.getCallback = exports.auth = exports.getAuth = exports.renderResponse = exports.randomState = exports.oauthConfig = void 0;
const crypto_1 = require("crypto");
const simple_oauth2_1 = require("simple-oauth2");
const github_1 = require("./github");
const { OAUTH_CLIENT_ID = '', OAUTH_CLIENT_SECRET = '', OAUTH_HOST = 'https://github.com', OAUTH_TOKEN_PATH = '/login/oauth/access_token', OAUTH_AUTHORIZE_PATH = '/login/oauth/authorize', } = process.env;
exports.oauthConfig = Object.freeze({
    client: Object.freeze({
        id: OAUTH_CLIENT_ID,
        secret: OAUTH_CLIENT_SECRET,
    }),
    auth: Object.freeze({
        tokenHost: OAUTH_HOST,
        tokenPath: OAUTH_TOKEN_PATH,
        authorizePath: OAUTH_AUTHORIZE_PATH,
    }),
});
function randomState() {
    return crypto_1.randomBytes(6).toString('hex');
}
exports.randomState = randomState;
const defaultOptions = {
    secure: true,
    scopes: ['repo', 'user'],
};
/** Render a html response with a script to finish a client-side github authentication */
function renderResponse(status, content) {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Authorizing ...</title>
  </head>
  <body>
    <p id="message"></p>
    <script>
      // Output a message to the user
      function sendMessage(message) {
        document.getElementById("message").innerText = message;
        document.title = message
      }

      // Handle a window message by sending the auth to the "opener"
      function receiveMessage(message) {
        console.debug("receiveMessage", message);
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(content)}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
        sendMessage("Authorized, closing ...");
      }

      sendMessage("Authorizing ...");
      window.addEventListener("message", receiveMessage, false);

      console.debug("postMessage", "authorizing:github", "*")
      window.opener.postMessage("authorizing:github", "*");
    </script>
  </body>
</html>
  `.trim();
}
exports.renderResponse = renderResponse;
/** An endpoint to start an OAuth2 authentication */
exports.getAuth = (options = {}) => function auth(req, res) {
    var _a, _b;
    const protocol = ((_a = options.secure) !== null && _a !== void 0 ? _a : defaultOptions.secure) ? 'https' : 'http';
    const scope = ((_b = options.scopes) !== null && _b !== void 0 ? _b : defaultOptions.scopes).join(',');
    const { host } = req.headers;
    console.debug('auth host=%o', host);
    const authorizationCode = new simple_oauth2_1.AuthorizationCode(exports.oauthConfig);
    const url = authorizationCode.authorizeURL({
        redirect_uri: `${protocol}://${host}/api/callback`,
        scope,
        state: randomState(),
    });
    res.writeHead(301, { Location: url });
    res.end();
};
exports.auth = exports.getAuth();
/** An endpoint to finish an OAuth2 authentication */
exports.getCallback = (options = {}) => async function callback(req, res) {
    var _a;
    const protocol = ((_a = options.secure) !== null && _a !== void 0 ? _a : defaultOptions.secure) ? 'https' : 'http';
    try {
        if (github_1.isGitHubError(req.query)) {
            throw github_1.gitHubErrorToNetlifyError(req.query);
        }
        const code = req.query.code;
        const { host } = req.headers;
        const authorizationCode = new simple_oauth2_1.AuthorizationCode(exports.oauthConfig);
        const accessToken = await authorizationCode.getToken({
            code,
            redirect_uri: `${protocol}://${host}/api/callback`,
        });
        if (github_1.isGitHubError(accessToken.token)) {
            throw github_1.gitHubErrorToNetlifyError(accessToken.token);
        }
        console.debug('callback host=%o', host);
        const { token } = authorizationCode.createToken(accessToken);
        if (github_1.isGitHubError(token)) {
            throw github_1.gitHubErrorToNetlifyError(token);
        }
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(renderResponse('success', {
            token: token.token.access_token,
            provider: 'github',
        }));
    }
    catch (e) {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(renderResponse('error', e));
    }
};
exports.callback = exports.getCallback();
//# sourceMappingURL=index.js.map