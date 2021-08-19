export interface GitHubError {
    error: string;
    error_description?: string;
    error_uri?: string;
}
export declare function isGitHubError(data: unknown): data is GitHubError;
export declare function gitHubErrorToNetlifyError(err: GitHubError): {
    message: string;
};
export declare type GitHubScope = 'repo' | 'repo:status' | 'repo_deployment' | 'public_repo' | 'repo:invite' | 'security_events' | 'admin:repo_hook' | 'write:repo_hook' | 'read:repo_hook' | 'admin:org' | 'write:org' | 'read:org' | 'admin:public_key' | 'write:public_key' | 'read:public_key' | 'admin:org_hook' | 'gist' | 'notifications' | 'user' | 'read:user' | 'user:email' | 'user:follow' | 'delete_repo' | 'write:discussion' | 'read:discussion' | 'write:packages' | 'read:packages' | 'delete:packages' | 'admin:gpg_key' | 'write:gpg_key' | 'read:gpg_key' | 'workflow';
