import * as core from '@actions/core';


//import { runnerParameters } from '../../lib/runnerParameters';




(async() => {
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
})().catch(error => {
    //const logger = runnerParameters.logger;
    //logger.error(`failed: ${error}`);    
    core.endGroup();
});