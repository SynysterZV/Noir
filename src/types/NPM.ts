export interface NPMDoc {
    _id: string;
    _rev: string;
    name: string;
    time: Time;
    maintainers: Array<Maintainer>;
    "dist-tags": {
        latest: string;
    };
    description: string;
    readme: string;
    versions: Record<string,Version>;
    homepage: string;
    keywords: Array<string>;
    repository: Repository;
    bugs: {
        url: string;
    };
    license: string;
    readmeFilename: string;
    users: {
        [key: string]: boolean
    };
    contributors: Array<Maintainer>
}

interface Time {
    created: string;
    modified: string;
    [key: string]: string;
}

interface Maintainer {
    name: string,
    email: string
}

interface Repository {
    type: string;
    url: string
}

interface Version {
    name: string;
    version: string;
    description: string;
    main: string;
    scripts: {
        [key: string]: string
    };
    repository: Repository;
    keywords: Array<string>;
    author: Maintainer;
    license: string;
    bugs: {
        url: string;
    };
    homepage: string;
    dependencies: {
        [key: string]: string
    };
    devDependencies?: {
        [key: string]: string
    },
    engines?: {
        node: string;
        npm: string;
    };
    gitHead: string;
    _id: string;
    _shasum?: string;
    _from?: string;
    _npmVersion: string;
    _nodeVersion: string;
    _npmUser: Maintainer;
    dist: {
        shasum: string;
        tarball: string;
        integrity?: string;
        fileCount?: string;
        unpackedSize?: string;
        "npm-signature"?: string;
    };
    maintainers: Array<Maintainer>;
    directories: {
        [key: string]: string
    },
    contributors: Array<Maintainer>;
    depreceated: string;
}