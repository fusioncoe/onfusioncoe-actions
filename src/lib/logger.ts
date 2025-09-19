// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
export interface Logger {
    
    log(...args: string[]): void;    
    info(...args: string[]): void;
    warn(...args: string[]): void;
    error(...args: string[]): void;
    debug(...args: string[]): void;      
}
