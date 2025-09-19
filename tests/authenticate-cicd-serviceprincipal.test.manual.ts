// stand alone test using the following command:
// npx node tests\authenticate-cicd-serviceprincipal.test.manual.ts

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

//import { createRequire } from 'module';
import  {run}  from "../src/actions/authenticate-cicd-serviceprincipal/index.ts"


//import inputs from '../.testInput/authenticate-cicd-serviceprincipal.json'// with { type: 'json' }

const inputs = require('../.testInput/authenticate-cicd-serviceprincipal.json') as JSON;
//const run = require('./src/actions/authenticate-cicd-serviceprincipal/index.ts').run;

//fetch('../.testInput/authenticate-cicd-serviceprincipal.json')
//   .then (json => 
//    {
//        console.log(json.json)
//        runAction(json.json())
 //   });


(async () => {
    await run(inputs);
}) 
