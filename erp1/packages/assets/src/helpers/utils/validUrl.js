export default function validUrl(string) {
  if (/mailto\:|tel\:|sms\:/.test(string)) {
    return true;
  }
  if (
    /^{{(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?}}$/g.test(
      string
    )
  ) {
    // Prevent user from entering dumb URL variable like {{https://example.com}}
    return false;
  }
  return (
    /^((https?|ftp|smtp):\/\/)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g.test(
      string
    ) ||
    (string.startsWith('{{') && string.endsWith('}}'))
  );
}
export const ROLE = {
  ADMIN: 'admin',
  USER: 'user'
};

export const ROLE_PATH = {
  [ROLE.ADMIN]: ['/', '/user', '/samples', '/settings'],
  [ROLE.USER]: ['/', '/me']
};

export function isValidUrlWithRole(path, role) {
  return !!ROLE_PATH[role].some(x => x === path);
}
