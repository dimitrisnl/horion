export class BaseError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// ===== USER ERRORS =====
export class UserNotFoundError extends BaseError {
  constructor(message = "User not found", details?: Record<string, unknown>) {
    super("USER_NOT_FOUND", message, 404, details);
  }
}

export class UserAlreadyExistsError extends BaseError {
  constructor(
    message = "User already exists",
    details?: Record<string, unknown>,
  ) {
    super("USER_ALREADY_EXISTS", message, 409, details);
  }
}

// ===== ORGANIZATION ERRORS =====
export class OrganizationNotFoundError extends BaseError {
  constructor(
    message = "Organization not found",
    details?: Record<string, unknown>,
  ) {
    super("ORGANIZATION_NOT_FOUND", message, 404, details);
  }
}

// ===== MEMBERSHIP ERRORS =====
export class MembershipNotFoundError extends BaseError {
  constructor(
    message = "Membership not found",
    details?: Record<string, unknown>,
  ) {
    super("MEMBERSHIP_NOT_FOUND", message, 404, details);
  }
}

export class MembershipAlreadyExistsError extends BaseError {
  constructor(
    message = "Membership already exists",
    details?: Record<string, unknown>,
  ) {
    super("MEMBERSHIP_ALREADY_EXISTS", message, 409, details);
  }
}

export class InsufficientPermissionsError extends BaseError {
  constructor(
    message = "Insufficient permissions",
    details?: Record<string, unknown>,
  ) {
    super("INSUFFICIENT_PERMISSIONS", message, 403, details);
  }
}

// ===== SESSION ERRORS =====
export class SessionNotFoundError extends BaseError {
  constructor(
    message = "Session not found",
    details?: Record<string, unknown>,
  ) {
    super("SESSION_NOT_FOUND", message, 404, details);
  }
}

// ===== VERIFICATION ERRORS =====
export class VerificationNotFoundError extends BaseError {
  constructor(
    message = "Verification not found",
    details?: Record<string, unknown>,
  ) {
    super("VERIFICATION_NOT_FOUND", message, 404, details);
  }
}

export class InvalidVerificationTokenError extends BaseError {
  constructor(
    message = "Invalid verification token",
    details?: Record<string, unknown>,
  ) {
    super("INVALID_VERIFICATION_TOKEN", message, 400, details);
  }
}

export class VerificationExpiredError extends BaseError {
  constructor(
    message = "Verification has expired",
    details?: Record<string, unknown>,
  ) {
    super("VERIFICATION_EXPIRED", message, 400, details);
  }
}

// ===== INVITATION ERRORS =====
export class InvitationNotFoundError extends BaseError {
  constructor(
    message = "Invitation not found",
    details?: Record<string, unknown>,
  ) {
    super("INVITATION_NOT_FOUND", message, 404, details);
  }
}

export class InvitationAlreadyExistsError extends BaseError {
  constructor(
    message = "Invitation already exists",
    details?: Record<string, unknown>,
  ) {
    super("INVITATION_ALREADY_EXISTS", message, 409, details);
  }
}

export class InvitationExpiredError extends BaseError {
  constructor(
    message = "Invitation has expired",
    details?: Record<string, unknown>,
  ) {
    super("INVITATION_EXPIRED", message, 400, details);
  }
}

// ===== AUTHENTICATION ERRORS =====
export class AuthenticationError extends BaseError {
  constructor(
    message = "Authentication failed",
    details?: Record<string, unknown>,
  ) {
    super("AUTHENTICATION_ERROR", message, 401, details);
  }
}

// ===== SYSTEM ERRORS =====
export class UnexpectedError extends BaseError {
  constructor(
    message = "An unexpected error occurred",
    details?: Record<string, unknown>,
  ) {
    super("UNEXPECTED_ERROR", message, 500, details);
  }
}
