"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const node_fetch_1 = require("node-fetch");
(() => __awaiter(void 0, void 0, void 0, function* () {
    core.startGroup('authenticate-cicd-serviceprincipal:');
    const cred = {
        client_id: core.getInput('client_id'),
        client_secret: core.getInput('client_secret'),
        grant_type: 'client_credentials',
        scope: core.getInput('scope')
    };
    core.setCommandEcho(true);
    const tenant_id = core.getInput('tenant_id');
    const fetchUrl = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`;
    const response = yield (0, node_fetch_1.default)(fetchUrl, {
        method: 'POST',
        body: JSON.stringify(cred),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Error Authenticating! status: ${response.status} : ${response.statusText}`);
    }
    var authResponse = (yield response.json());
    console.warn(response);
    console.warn(authResponse);
    const bearer = `bearer ${authResponse.access_token}`;
    const appResponse = yield (0, node_fetch_1.default)("https://graph.microsoft.com/v1.0/applications/44dc6d96-28ad-4a74-8f67-4397c2652eab", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': bearer
        },
    });
    if (!appResponse.ok) {
        throw new Error(`Error Getting App Info! status: ${appResponse.status} : ${appResponse.statusText}`);
    }
    var appReg = (yield response.json());
    //core.setOutput('SPN_BEARER', 'SPN BEARER VALUE');
    core.exportVariable('SPN_BEARER', appReg.displayName);
    core.endGroup();
}))().catch(error => {
    console.warn(error);
    //const logger = runnerParameters.logger;
    //logger.error(`failed: ${error}`);    
    core.endGroup();
});

//# sourceMappingURL=index.js.map
