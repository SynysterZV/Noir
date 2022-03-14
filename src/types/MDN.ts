export interface MDNDoc {
    doc: {
        isMarkdown: boolean;
        isTranslated: boolean;
        isActive: boolean;
        flaws: {};
        title: string;
        mdn_url: string;
        locale: string;
        native: string;
        sidebarHTML: string;
        summary: string;
        popularity: number;
        modified: string;
        source: {
            folder: string;
            github_url: string;
            last_commit_url: string;
            filename: string;
        };
        short_title: string;
        pageTititle: string
        noIndexing: boolean
    }
}