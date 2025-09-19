//import { Logger, RunnerParameters } from "@microsoft/powerplatform-cli-wrapper";
import { cwd } from "node:process";
import { ActionLogger } from "././actionLogger";
import getExePath from "./getExePath";

const PacInstalledEnvVarName = 'POWERPLATFORMTOOLS_PACINSTALLED';
const PacPathEnvVarName = 'POWERPLATFORMTOOLS_PACPATH';

function getAutomationAgent(): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonPackage = require("../../package.json")
    const productName = jsonPackage.name.split("/")[1];
    return productName + "/" + jsonPackage.version;
}

class ActionsRunnerParameters implements RunnerParameters {
    workingDir: string = process.env['GITHUB_WORKSPACE'] || cwd();
    logger: Logger = new ActionLogger();
    agent: string = getAutomationAgent();
    pacPath?: string = process.env[PacPathEnvVarName];

    public get runnersDir(): string {
        if (process.env[PacInstalledEnvVarName] !== 'true') {
            throw new Error(`PAC is not installed. Please run the actions-install action first.`);
        }
        return getExePath();
    }

}

const runnerParameters: RunnerParameters = new ActionsRunnerParameters();

export { runnerParameters, getAutomationAgent, PacInstalledEnvVarName, PacPathEnvVarName };
