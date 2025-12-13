import packageJson from '../../package.json' with { type: 'json' };

const { name, version, description, keywords, homepage, bugs, repository, author } = packageJson;
export { name, version, description, keywords, homepage, bugs, repository, author };
