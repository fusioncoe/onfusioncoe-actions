import { jest } from '@jest/globals'
import * as core from './core'
//import {run} from '../src/actions/authenticate-cicd-serviceprincipal/index'


const inputs = require('../.testInput/authenticate-cicd-serviceprincipal.json');

const testRun = require('../src/actions/authenticate-cicd-serviceprincipal/index').run;

testRun(inputs);





const run = jest.fn()

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/actions/authenticate-cicd-serviceprincipal/index', () => ({ run }))



//const testRun = require('../src/actions/authenticate-cicd-serviceprincipal/index').run;

describe('authenticate-cicd-serviceprincipal test', () => {

    beforeEach(() =>
        {
          //  core.getInput.mockImplementation(() => inputs)

            // Mock the wait function so that it does not actually wait.
           // run.mockImplementation(() => Promise.resolve('done!'))

        })

    afterEach(() => 
        {
            jest.resetAllMocks()
        })
 
    

    it('Test 1', async () => 
        {

            //await (await import('../src/actions/authenticate-cicd-serviceprincipal/index')).run(inputs);

            await testRun(inputs);

            // Verify the time output was set.
            //expect(core.setOutput).toHaveBeenNthCalledWith(
            //         1,
            //        'time',
            // Simple regex to match a time string in the format HH:MM:SS.
            //expect.stringMatching(/^\d{2}:\d{2}:\d{2}/)
        }
    )

})


