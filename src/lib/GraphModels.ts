// To parse this data:
//
//   import { Convert, AppRegistration } from "./file";
//
//   const appRegistration = Convert.toAppRegistration(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AuthResponse {
    token_interface: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
}

export interface AppRegistration {
    "@odata.context": string;
    "@microsoft.graph.tips": string;
    id: string;
    deletedDateTime: null;
    appId: string;
    applicationTemplateId: null;
    disabledByMicrosoftStatus: null;
    createdDateTime: Date;
    displayName: string;
    description: null;
    groupMembershipClaims: null;
    identifierUris: any[];
    isDeviceOnlyAuthSupported: null;
    isFallbackPublicClient: null;
    nativeAuthenticationApisEnabled: null;
    notes: null;
    publisherDomain: string;
    serviceManagementReference: null;
    signInAudience: string;
    tags: any[];
    tokenEncryptionKeyId: null;
    uniqueName: string;
    samlMetadataUrl: null;
    defaultRedirectUri: null;
    certification: null;
    optionalClaims: null;
    requestSignatureVerification: null;
    addIns: any[];
    api: API;
    appRoles: any[];
    info: Info;
    keyCredentials: any[];
    parentalControlSettings: ParentalControlSettings;
    passwordCredentials: PasswordCredential[];
    publicClient: PublicClient;
    requiredResourceAccess: RequiredResourceAccess[];
    verifiedPublisher: VerifiedPublisher;
    web: Web;
    servicePrincipalLockConfiguration: ServicePrincipalLockConfiguration;
    spa: PublicClient;
}

export interface API {
    acceptMappedClaims: null;
    knownClientApplications: any[];
    requestedAccessTokenVersion: null;
    oauth2PermissionScopes: any[];
    preAuthorizedApplications: any[];
}

export interface Info {
    logoUrl: null;
    marketingUrl: null;
    privacyStatementUrl: null;
    supportUrl: null;
    termsOfServiceUrl: null;
}

export interface ParentalControlSettings {
    countriesBlockedForMinors: any[];
    legalAgeGroupRule: string;
}

export interface PasswordCredential {
    customKeyIdentifier: null;
    displayName: string;
    endDateTime: Date;
    hint: string;
    keyId: string;
    secretText: null;
    startDateTime: Date;
}

export interface PublicClient {
    redirectUris: any[];
}

export interface RequiredResourceAccess {
    resourceAppId: string;
    resourceAccess: ResourceAccess[];
}

export interface ResourceAccess {
    id: string;
    interface: string;
}

export interface ServicePrincipalLockConfiguration {
    isEnabled: boolean;
    allProperties: boolean;
    credentialsWithUsageVerify: boolean;
    credentialsWithUsageSign: boolean;
    identifierUris: null;
    tokenEncryptionKeyId: boolean;
}

export interface VerifiedPublisher {
    displayName: null;
    verifiedPublisherId: null;
    addedDateTime: null;
}

export interface Web {
    homePageUrl: null;
    logoutUrl: null;
    redirectUris: any[];
    implicitGrantSettings: ImplicitGrantSettings;
    redirectUriSettings: any[];
}

export interface ImplicitGrantSettings {
    enableAccessTokenIssuance: boolean;
    enableIdTokenIssuance: boolean;
}
