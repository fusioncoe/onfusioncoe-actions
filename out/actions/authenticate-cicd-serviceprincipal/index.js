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
//import { runnerParameters } from '../../lib/runnerParameters';
(() => __awaiter(void 0, void 0, void 0, function* () {
    core.startGroup('authenticate-cicd-serviceprincipal:');
    const cred = {
        client_id: core.getInput('client_id'),
        client_secret: core.getInput('client_secret'),
        tenant_id: core.getInput('tenant_id'),
        grant_type: 'client_credentials',
        scope: core.getInput('scope')
    };
    //core.setOutput('SPN_BEARER', 'SPN BEARER VALUE');
    core.exportVariable('SPN_BEARER', 'SPN BEARER VALUE');
    core.endGroup();
}))().catch(error => {
    //const logger = runnerParameters.logger;
    //logger.error(`failed: ${error}`);    
    core.endGroup();
});

//# sourceMappingURL=index.js.map
