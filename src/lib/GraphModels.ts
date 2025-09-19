// To parse this data:
//
//   import { Convert, AppRegistration } from "./file";
//
//   const appRegistration = Convert.toAppRegistration(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AppRegistration {
    "@odata.context":                  string;
    "@microsoft.graph.tips":           string;
    id:                                string;
    deletedDateTime:                   null;
    appId:                             string;
    applicationTemplateId:             null;
    disabledByMicrosoftStatus:         null;
    createdDateTime:                   Date;
    displayName:                       string;
    description:                       null;
    groupMembershipClaims:             null;
    identifierUris:                    any[];
    isDeviceOnlyAuthSupported:         null;
    isFallbackPublicClient:            null;
    nativeAuthenticationApisEnabled:   null;
    notes:                             null;
    publisherDomain:                   string;
    serviceManagementReference:        null;
    signInAudience:                    string;
    tags:                              any[];
    tokenEncryptionKeyId:              null;
    uniqueName:                        string;
    samlMetadataUrl:                   null;
    defaultRedirectUri:                null;
    certification:                     null;
    optionalClaims:                    null;
    requestSignatureVerification:      null;
    addIns:                            any[];
    api:                               API;
    appRoles:                          any[];
    info:                              Info;
    keyCredentials:                    any[];
    parentalControlSettings:           ParentalControlSettings;
    passwordCredentials:               PasswordCredential[];
    publicClient:                      PublicClient;
    requiredResourceAccess:            RequiredResourceAccess[];
    verifiedPublisher:                 VerifiedPublisher;
    web:                               Web;
    servicePrincipalLockConfiguration: ServicePrincipalLockConfiguration;
    spa:                               PublicClient;
}

export interface API {
    acceptMappedClaims:          null;
    knownClientApplications:     any[];
    requestedAccessTokenVersion: null;
    oauth2PermissionScopes:      any[];
    preAuthorizedApplications:   any[];
}

export interface Info {
    logoUrl:             null;
    marketingUrl:        null;
    privacyStatementUrl: null;
    supportUrl:          null;
    termsOfServiceUrl:   null;
}

export interface ParentalControlSettings {
    countriesBlockedForMinors: any[];
    legalAgeGroupRule:         string;
}

export interface PasswordCredential {
    customKeyIdentifier: null;
    displayName:         string;
    endDateTime:         Date;
    hint:                string;
    keyId:               string;
    secretText:          null;
    startDateTime:       Date;
}

export interface PublicClient {
    redirectUris: any[];
}

export interface RequiredResourceAccess {
    resourceAppId:  string;
    resourceAccess: ResourceAccess[];
}

export interface ResourceAccess {
    id:   string;
    type: string;
}

export interface ServicePrincipalLockConfiguration {
    isEnabled:                  boolean;
    allProperties:              boolean;
    credentialsWithUsageVerify: boolean;
    credentialsWithUsageSign:   boolean;
    identifierUris:             null;
    tokenEncryptionKeyId:       boolean;
}

export interface VerifiedPublisher {
    displayName:         null;
    verifiedPublisherId: null;
    addedDateTime:       null;
}

export interface Web {
    homePageUrl:           null;
    logoutUrl:             null;
    redirectUris:          any[];
    implicitGrantSettings: ImplicitGrantSettings;
    redirectUriSettings:   any[];
}

export interface ImplicitGrantSettings {
    enableAccessTokenIssuance: boolean;
    enableIdTokenIssuance:     boolean;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAppRegistration(json: string): AppRegistration {
        return cast(JSON.parse(json), r("AppRegistration"));
    }

    public static appRegistrationToJson(value: AppRegistration): string {
        return JSON.stringify(uncast(value, r("AppRegistration")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "AppRegistration": o([
        { json: "@odata.context", js: "@odata.context", typ: "" },
        { json: "@microsoft.graph.tips", js: "@microsoft.graph.tips", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "deletedDateTime", js: "deletedDateTime", typ: null },
        { json: "appId", js: "appId", typ: "" },
        { json: "applicationTemplateId", js: "applicationTemplateId", typ: null },
        { json: "disabledByMicrosoftStatus", js: "disabledByMicrosoftStatus", typ: null },
        { json: "createdDateTime", js: "createdDateTime", typ: Date },
        { json: "displayName", js: "displayName", typ: "" },
        { json: "description", js: "description", typ: null },
        { json: "groupMembershipClaims", js: "groupMembershipClaims", typ: null },
        { json: "identifierUris", js: "identifierUris", typ: a("any") },
        { json: "isDeviceOnlyAuthSupported", js: "isDeviceOnlyAuthSupported", typ: null },
        { json: "isFallbackPublicClient", js: "isFallbackPublicClient", typ: null },
        { json: "nativeAuthenticationApisEnabled", js: "nativeAuthenticationApisEnabled", typ: null },
        { json: "notes", js: "notes", typ: null },
        { json: "publisherDomain", js: "publisherDomain", typ: "" },
        { json: "serviceManagementReference", js: "serviceManagementReference", typ: null },
        { json: "signInAudience", js: "signInAudience", typ: "" },
        { json: "tags", js: "tags", typ: a("any") },
        { json: "tokenEncryptionKeyId", js: "tokenEncryptionKeyId", typ: null },
        { json: "uniqueName", js: "uniqueName", typ: "" },
        { json: "samlMetadataUrl", js: "samlMetadataUrl", typ: null },
        { json: "defaultRedirectUri", js: "defaultRedirectUri", typ: null },
        { json: "certification", js: "certification", typ: null },
        { json: "optionalClaims", js: "optionalClaims", typ: null },
        { json: "requestSignatureVerification", js: "requestSignatureVerification", typ: null },
        { json: "addIns", js: "addIns", typ: a("any") },
        { json: "api", js: "api", typ: r("API") },
        { json: "appRoles", js: "appRoles", typ: a("any") },
        { json: "info", js: "info", typ: r("Info") },
        { json: "keyCredentials", js: "keyCredentials", typ: a("any") },
        { json: "parentalControlSettings", js: "parentalControlSettings", typ: r("ParentalControlSettings") },
        { json: "passwordCredentials", js: "passwordCredentials", typ: a(r("PasswordCredential")) },
        { json: "publicClient", js: "publicClient", typ: r("PublicClient") },
        { json: "requiredResourceAccess", js: "requiredResourceAccess", typ: a(r("RequiredResourceAccess")) },
        { json: "verifiedPublisher", js: "verifiedPublisher", typ: r("VerifiedPublisher") },
        { json: "web", js: "web", typ: r("Web") },
        { json: "servicePrincipalLockConfiguration", js: "servicePrincipalLockConfiguration", typ: r("ServicePrincipalLockConfiguration") },
        { json: "spa", js: "spa", typ: r("PublicClient") },
    ], false),
    "API": o([
        { json: "acceptMappedClaims", js: "acceptMappedClaims", typ: null },
        { json: "knownClientApplications", js: "knownClientApplications", typ: a("any") },
        { json: "requestedAccessTokenVersion", js: "requestedAccessTokenVersion", typ: null },
        { json: "oauth2PermissionScopes", js: "oauth2PermissionScopes", typ: a("any") },
        { json: "preAuthorizedApplications", js: "preAuthorizedApplications", typ: a("any") },
    ], false),
    "Info": o([
        { json: "logoUrl", js: "logoUrl", typ: null },
        { json: "marketingUrl", js: "marketingUrl", typ: null },
        { json: "privacyStatementUrl", js: "privacyStatementUrl", typ: null },
        { json: "supportUrl", js: "supportUrl", typ: null },
        { json: "termsOfServiceUrl", js: "termsOfServiceUrl", typ: null },
    ], false),
    "ParentalControlSettings": o([
        { json: "countriesBlockedForMinors", js: "countriesBlockedForMinors", typ: a("any") },
        { json: "legalAgeGroupRule", js: "legalAgeGroupRule", typ: "" },
    ], false),
    "PasswordCredential": o([
        { json: "customKeyIdentifier", js: "customKeyIdentifier", typ: null },
        { json: "displayName", js: "displayName", typ: "" },
        { json: "endDateTime", js: "endDateTime", typ: Date },
        { json: "hint", js: "hint", typ: "" },
        { json: "keyId", js: "keyId", typ: "" },
        { json: "secretText", js: "secretText", typ: null },
        { json: "startDateTime", js: "startDateTime", typ: Date },
    ], false),
    "PublicClient": o([
        { json: "redirectUris", js: "redirectUris", typ: a("any") },
    ], false),
    "RequiredResourceAccess": o([
        { json: "resourceAppId", js: "resourceAppId", typ: "" },
        { json: "resourceAccess", js: "resourceAccess", typ: a(r("ResourceAccess")) },
    ], false),
    "ResourceAccess": o([
        { json: "id", js: "id", typ: "" },
        { json: "type", js: "type", typ: "" },
    ], false),
    "ServicePrincipalLockConfiguration": o([
        { json: "isEnabled", js: "isEnabled", typ: true },
        { json: "allProperties", js: "allProperties", typ: true },
        { json: "credentialsWithUsageVerify", js: "credentialsWithUsageVerify", typ: true },
        { json: "credentialsWithUsageSign", js: "credentialsWithUsageSign", typ: true },
        { json: "identifierUris", js: "identifierUris", typ: null },
        { json: "tokenEncryptionKeyId", js: "tokenEncryptionKeyId", typ: true },
    ], false),
    "VerifiedPublisher": o([
        { json: "displayName", js: "displayName", typ: null },
        { json: "verifiedPublisherId", js: "verifiedPublisherId", typ: null },
        { json: "addedDateTime", js: "addedDateTime", typ: null },
    ], false),
    "Web": o([
        { json: "homePageUrl", js: "homePageUrl", typ: null },
        { json: "logoutUrl", js: "logoutUrl", typ: null },
        { json: "redirectUris", js: "redirectUris", typ: a("any") },
        { json: "implicitGrantSettings", js: "implicitGrantSettings", typ: r("ImplicitGrantSettings") },
        { json: "redirectUriSettings", js: "redirectUriSettings", typ: a("any") },
    ], false),
    "ImplicitGrantSettings": o([
        { json: "enableAccessTokenIssuance", js: "enableAccessTokenIssuance", typ: true },
        { json: "enableIdTokenIssuance", js: "enableIdTokenIssuance", typ: true },
    ], false),
};
