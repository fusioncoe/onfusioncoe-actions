import * as core from '@actions/core';
import fetch from 'node-fetch';


//import { runnerParameters } from '../../lib/runnerParameters';

type authResponse = {
  access_token: string;
};


(async() => {
    core.startGroup('authenticate-cicd-serviceprincipal:');
    const cred = {
        client_id: core.getInput('client_id'),
        client_secret: core.getInput('client_secret'),
        grant_type: 'client_credentials',
        scope: core.getInput('scope')
    };

    const tenant_id = core.getInput('tenant_id');
    const fetchUrl = `https://login.microsoftonline.com/${tenant_id}}/oauth2/v2.0/token`

    const response = await fetch(fetchUrl, {
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

    var authResponse = (await response.json()) as authResponse;

    const bearer = `bearer ${authResponse.access_token}`;

    //core.setOutput('SPN_BEARER', 'SPN BEARER VALUE');
    core.exportVariable('SPN_BEARER', bearer);
    core.endGroup();
})().catch(error => {
    //const logger = runnerParameters.logger;
    //logger.error(`failed: ${error}`);    
    core.endGroup();
});