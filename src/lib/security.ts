function normalizeDomain(value: string | undefined) {
  return (value ?? "").trim().toLowerCase().replace(/^@/, "");
}

function getRequiredEmailDomain() {
  return normalizeDomain(process.env.REQUIRED_EMAIL_DOMAIN);
}

export function isUniversityEmailPolicyEnabled() {
  return process.env.REQUIRE_UNIVERSITY_EMAIL === "true";
}

export function isAllowedEmail(email: string | null | undefined) {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();
  if (!isUniversityEmailPolicyEnabled()) return true;

  const requiredDomain = getRequiredEmailDomain();
  if (!requiredDomain) return false;

  return normalizedEmail.endsWith(`@${requiredDomain}`);
}
