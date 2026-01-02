import { config } from "@lib/config";
import { FetchHttpClient, HttpClient } from "@lib/FetchHttpClient";

const baseURL = config.apiUrl;
export const httpClient: HttpClient = new FetchHttpClient(baseURL);

export const microsoftClarityProjectId = config.microsoftClarityProjectId;
export const authRequiredPathParamKey = "auth-required";
export const authRequiredTypePathParamKey = "auth-type";
