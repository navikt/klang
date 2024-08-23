export const removeSaksnummer = (url: string | undefined) => {
  if (url === undefined) {
    return undefined;
  }
  const [path, query] = url.split('?');

  if (query === undefined) {
    return path;
  }

  const params = query.split('&');
  const filtered = params.filter((param) => !param.startsWith('saksnummer='));

  if (filtered.length === 0) {
    return path;
  }

  return `${path}?${filtered.join('&')}`;
};
