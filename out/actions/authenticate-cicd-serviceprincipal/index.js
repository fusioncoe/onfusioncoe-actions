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
    const tenant_id = core.getInput('tenant_id');
    const fetchUrl = `https://login.microsoftonline.com/${tenant_id}}/oauth2/v2.0/token`;
    const response = yield (0, node_fetch_1.default)(fetchUrl, {
        method: 'POST',
        body: JSON.stringify(cred),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }
    var authResponse = (yield response.json());
    const bearer = `bearer ${authResponse.access_token}`;
    //core.setOutput('SPN_BEARER', 'SPN BEARER VALUE');
    core.exportVariable('SPN_BEARER', bearer);
    core.endGroup();
}))().catch(error => {
    //const logger = runnerParameters.logger;
    //logger.error(`failed: ${error}`);    
    core.endGroup();
});

//# sourceMappingURL=index.js.map
