import { VercelRequest, VercelResponse } from '@vercel/node';
import { ModuleOptions } from 'simple-oauth2';
import { GitHubScope } from './github';
export declare const oauthConfig: ModuleOptions;
export declare function randomState(): string;
interface Options {
    secure?: boolean;
    scopes?: GitHubScope[];
}
/** Render a html response with a script to finish a client-side github authentication */
export declare function renderResponse(status: 'success' | 'error', content: any): string;
/** An endpoint to start an OAuth2 authentication */
export declare const getAuth: (options?: Options) => (req: VercelRequest, res: VercelResponse) => void;
export declare const auth: (req: VercelRequest, res: VercelResponse) => void;
/** An endpoint to finish an OAuth2 authentication */
export declare const getCallback: (options?: Options) => (req: VercelRequest, res: VercelResponse) => Promise<void>;
export declare const callback: (req: VercelRequest, res: VercelResponse) => Promise<void>;
export {};
