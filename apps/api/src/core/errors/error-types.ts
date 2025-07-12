import {z} from "zod";

export class BaseError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists",
  ORGANIZATION_NOT_FOUND: "Organization not found",
  MEMBERSHIP_NOT_FOUND: "Membership not found",
  MEMBERSHIP_ALREADY_EXISTS: "Membership already exists",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",
  SESSION_NOT_FOUND: "Session not found",
  VERIFICATION_NOT_FOUND: "Verification not found",
  INVALID_VERIFICATION_TOKEN: "Invalid verification token",
  VERIFICATION_EXPIRED: "Verification has expired",
  INVITATION_NOT_FOUND: "Invitation not found",
  INVITATION_ALREADY_EXISTS: "Invitation already exists",
  INVITATION_EXPIRED: "Invitation has expired",
  UNEXPECTED_ERROR: "An unexpected error occurred",
};

// ===== USER ERRORS =====
export class UserNotFoundError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.USER_NOT_FOUND,
    details?: Record<string, unknown>,
  ) {
    super("USER_NOT_FOUND", message, details);
  }
}

export class UserAlreadyExistsError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.USER_ALREADY_EXISTS,
    details?: Record<string, unknown>,
  ) {
    super("USER_ALREADY_EXISTS", message, details);
  }
}

// ===== ORGANIZATION ERRORS =====
export class OrganizationNotFoundError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.ORGANIZATION_NOT_FOUND,
    details?: Record<string, unknown>,
  ) {
    super("ORGANIZATION_NOT_FOUND", message, details);
  }
}

// ===== MEMBERSHIP ERRORS =====
export class MembershipNotFoundError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND,
    details?: Record<string, unknown>,
  ) {
    super("MEMBERSHIP_NOT_FOUND", message, details);
  }
}

export class MembershipAlreadyExistsError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.MEMBERSHIP_ALREADY_EXISTS,
    details?: Record<string, unknown>,
  ) {
    super("MEMBERSHIP_ALREADY_EXISTS", message, details);
  }
}

export class InsufficientPermissionsError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS,
    details?: Record<string, unknown>,
  ) {
    super("INSUFFICIENT_PERMISSIONS", message, details);
  }
}

// ===== SESSION ERRORS =====
export class SessionNotFoundError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.SESSION_NOT_FOUND,
    details?: Record<string, unknown>,
  ) {
    super("SESSION_NOT_FOUND", message, details);
  }
}

// ===== VERIFICATION ERRORS =====
export class VerificationNotFoundError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.VERIFICATION_NOT_FOUND,
    details?: Record<string, unknown>,
  ) {
    super("VERIFICATION_NOT_FOUND", message, details);
  }
}

export class InvalidVerificationTokenError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.INVALID_VERIFICATION_TOKEN,
    details?: Record<string, unknown>,
  ) {
    super("INVALID_VERIFICATION_TOKEN", message, details);
  }
}

export class VerificationExpiredError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.VERIFICATION_EXPIRED,
    details?: Record<string, unknown>,
  ) {
    super("VERIFICATION_EXPIRED", message, details);
  }
}

// ===== INVITATION ERRORS =====
export class InvitationNotFoundError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.INVITATION_NOT_FOUND,
    details?: Record<string, unknown>,
  ) {
    super("INVITATION_NOT_FOUND", message, details);
  }
}

export class InvitationAlreadyExistsError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.INVITATION_ALREADY_EXISTS,
    details?: Record<string, unknown>,
  ) {
    super("INVITATION_ALREADY_EXISTS", message, details);
  }
}

export class InvitationExpiredError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.INVITATION_EXPIRED,
    details?: Record<string, unknown>,
  ) {
    super("INVITATION_EXPIRED", message, details);
  }
}

// ===== SYSTEM ERRORS =====
export class UnexpectedError extends BaseError {
  constructor(
    message = ERROR_MESSAGES.UNEXPECTED_ERROR,
    details?: Record<string, unknown>,
  ) {
    super("UNEXPECTED_ERROR", message, details);
  }
}

// ===== ORPC =====
export const orpcErrors = {
  // User Errors
  USER_NOT_FOUND: {
    message: ERROR_MESSAGES.USER_NOT_FOUND,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },
  USER_ALREADY_EXISTS: {
    message: ERROR_MESSAGES.USER_ALREADY_EXISTS,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  // Organization Errors
  ORGANIZATION_NOT_FOUND: {
    message: ERROR_MESSAGES.ORGANIZATION_NOT_FOUND,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  // Membership Errors
  MEMBERSHIP_NOT_FOUND: {
    message: ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },
  MEMBERSHIP_ALREADY_EXISTS: {
    message: ERROR_MESSAGES.MEMBERSHIP_ALREADY_EXISTS,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },
  INSUFFICIENT_PERMISSIONS: {
    message: ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  // Session Errors
  SESSION_NOT_FOUND: {
    message: ERROR_MESSAGES.SESSION_NOT_FOUND,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  // Verification Errors
  VERIFICATION_NOT_FOUND: {
    message: ERROR_MESSAGES.VERIFICATION_NOT_FOUND,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },
  INVALID_VERIFICATION_TOKEN: {
    message: ERROR_MESSAGES.INVALID_VERIFICATION_TOKEN,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },
  VERIFICATION_EXPIRED: {
    message: ERROR_MESSAGES.VERIFICATION_EXPIRED,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  // Invitation Errors
  INVITATION_NOT_FOUND: {
    message: ERROR_MESSAGES.INVITATION_NOT_FOUND,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },
  INVITATION_ALREADY_EXISTS: {
    message: ERROR_MESSAGES.INVITATION_ALREADY_EXISTS,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  INVITATION_EXPIRED: {
    message: ERROR_MESSAGES.INVITATION_EXPIRED,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  // System Errors
  UNEXPECTED_ERROR: {
    message: ERROR_MESSAGES.UNEXPECTED_ERROR,
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  // RPC ONLY
  FAILED_TO_SEND_MAGIC_LINK_EMAIL: {
    message: "Failed to send magic link email",
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  FAILED_TO_SEND_INVITATION_EMAIL: {
    message: "Failed to send invitation email",
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  INPUT_VALIDATION_FAILED: {
    message: "Input validation failed",
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },

  UNAUTHORIZED: {
    message: "You must be logged in to perform this action",
    data: z
      .object({
        details: z.record(z.unknown()).optional(),
      })
      .optional(),
  },
} as const;
