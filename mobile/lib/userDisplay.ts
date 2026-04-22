export function getUserDisplayName(user?: { fullName?: string | null; email?: string | null } | null) {
  const fullName = user?.fullName?.trim();
  if (fullName) {
    return fullName;
  }

  const email = user?.email?.trim();
  if (email) {
    return email;
  }

  return 'User';
}
