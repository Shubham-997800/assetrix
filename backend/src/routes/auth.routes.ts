import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  deleteSessionSchema,
} from '../validators/auth.schema';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required: [email, password, confirmPassword, firstName, lastName, termsAccepted]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@company.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: SecureP@ss1
 *         confirmPassword:
 *           type: string
 *           format: password
 *           example: SecureP@ss1
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         employeeId:
 *           type: string
 *           example: EMP001
 *         designation:
 *           type: string
 *           example: Software Engineer
 *         departmentId:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           enum: [SUPER_ADMIN, ADMIN, DEPARTMENT_MANAGER, TECHNICIAN, EMPLOYEE]
 *           default: EMPLOYEE
 *         termsAccepted:
 *           type: boolean
 *           example: true
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@company.com
 *         password:
 *           type: string
 *           format: password
 *           example: SecureP@ss1
 *         rememberMe:
 *           type: boolean
 *           default: false
 *     ForgotPasswordRequest:
 *       type: object
 *       required: [email]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@company.com
 *     ResetPasswordRequest:
 *       type: object
 *       required: [token, password, confirmPassword]
 *       properties:
 *         token:
 *           type: string
 *           example: abc123resettoken
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           example: NewSecureP@ss1
 *         confirmPassword:
 *           type: string
 *           format: password
 *           example: NewSecureP@ss1
 *     VerifyEmailRequest:
 *       type: object
 *       required: [token]
 *       properties:
 *         token:
 *           type: string
 *           example: abc123verifytoken
 *     ResendVerificationRequest:
 *       type: object
 *       required: [email]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@company.com
 *     UserSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [SUPER_ADMIN, ADMIN, DEPARTMENT_MANAGER, TECHNICIAN, EMPLOYEE]
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION]
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *           nullable: true
 *         avatar:
 *           type: string
 *           nullable: true
 *         role:
 *           type: string
 *           enum: [SUPER_ADMIN, ADMIN, DEPARTMENT_MANAGER, TECHNICIAN, EMPLOYEE]
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION]
 *         employeeId:
 *           type: string
 *           nullable: true
 *         designation:
 *           type: string
 *           nullable: true
 *         departmentId:
 *           type: string
 *           nullable: true
 *         emailVerified:
 *           type: boolean
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         department:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             code:
 *               type: string
 *     SessionInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         browserName:
 *           type: string
 *           nullable: true
 *         browserVersion:
 *           type: string
 *           nullable: true
 *         os:
 *           type: string
 *           nullable: true
 *         deviceType:
 *           type: string
 *           nullable: true
 *         ipAddress:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         lastActiveAt:
 *           type: string
 *           format: date-time
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *     LoginHistoryEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         ipAddress:
 *           type: string
 *           nullable: true
 *         browserName:
 *           type: string
 *           nullable: true
 *         browserVersion:
 *           type: string
 *           nullable: true
 *         os:
 *           type: string
 *           nullable: true
 *         deviceType:
 *           type: string
 *           nullable: true
 *         location:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [SUCCESS, FAILED]
 *         failureReason:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// ─── REGISTER ─────────────────────────────────────────────

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user account
 *     description: |
 *       Creates a new user account with email verification.
 *       A verification email is sent upon successful registration.
 *       Default status is PENDING_VERIFICATION until email is verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             register:
 *               summary: New user registration
 *               value:
 *                 email: john.doe@company.com
 *                 password: SecureP@ss1
 *                 confirmPassword: SecureP@ss1
 *                 firstName: John
 *                 lastName: Doe
 *                 phone: "+1234567890"
 *                 employeeId: "EMP001"
 *                 designation: "Software Engineer"
 *                 termsAccepted: true
 *     responses:
 *       201:
 *         description: Registration successful. Verification email sent.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/UserSummary'
 *                         accessToken:
 *                           type: string
 *       409:
 *         description: Email or Employee ID already registered
 *       422:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema, 'body'),
  authController.register
);

// ─── LOGIN ────────────────────────────────────────────────

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Log in with email and password
 *     description: |
 *       Authenticates a user and returns access/refresh tokens.
 *       Refresh token is set as an httpOnly cookie.
 *       Supports "remember me" for extended token validity (30 days).
 *       Tracks device information and detects suspicious logins.
 *       Implements brute force protection with account lockout.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             login:
 *               summary: Standard login
 *               value:
 *                 email: john.doe@company.com
 *                 password: SecureP@ss1
 *                 rememberMe: false
 *             rememberMe:
 *               summary: Login with remember me
 *               value:
 *                 email: john.doe@company.com
 *                 password: SecureP@ss1
 *                 rememberMe: true
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/UserProfile'
 *                         accessToken:
 *                           type: string
 *       401:
 *         description: Invalid credentials or account locked
 *       403:
 *         description: Account suspended or email not verified
 *       422:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema, 'body'),
  authController.login
);

// ─── REFRESH TOKEN ────────────────────────────────────────

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     description: |
 *       Generates a new access/refresh token pair using a valid refresh token.
 *       The refresh token can be provided via the httpOnly cookie or in the request body.
 *       Token rotation is enforced: each refresh token is single-use.
 *       If a previously used refresh token is detected, all sessions are revoked (theft detection).
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token (optional if provided as cookie)
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *       401:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Internal server error
 */
router.post('/refresh', authController.refreshToken);

// ─── LOGOUT ───────────────────────────────────────────────

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Log out the current user
 *     description: Revokes the current session. Clears the refresh token cookie.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post('/logout', authenticate, authController.logout);

// ─── LOGOUT ALL ───────────────────────────────────────────

/**
 * @swagger
 * /auth/logout-all:
 *   post:
 *     tags: [Authentication]
 *     summary: Log out from all devices
 *     description: |
 *       Revokes all active sessions for the authenticated user.
 *       All refresh tokens are invalidated.
 *       User will need to log in again on all devices.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post('/logout-all', authenticate, authController.logoutAll);

// ─── FORGOT PASSWORD ─────────────────────────────────────

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Request a password reset
 *     description: |
 *       Sends a password reset email if an account with the given email exists.
 *       Always returns a success response to prevent email enumeration attacks.
 *       The reset token expires in 1 hour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *           examples:
 *             forgot:
 *               summary: Forgot password
 *               value:
 *                 email: john.doe@company.com
 *     responses:
 *       200:
 *         description: Password reset email sent (if account exists)
 *       422:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema, 'body'),
  authController.forgotPassword
);

// ─── RESET PASSWORD ───────────────────────────────────────

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Reset password with token
 *     description: |
 *       Resets the user's password using a valid reset token.
 *       All existing sessions are revoked after password reset.
 *       A confirmation email is sent.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *           examples:
 *             reset:
 *               summary: Reset password
 *               value:
 *                 token: abc123resettoken
 *                 password: NewSecureP@ss1
 *                 confirmPassword: NewSecureP@ss1
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired reset token, or passwords don't match
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema, 'body'),
  authController.resetPassword
);

// ─── VERIFY EMAIL ─────────────────────────────────────────

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     tags: [Authentication]
 *     summary: Verify email address via link
 *     description: |
 *       Verifies the user's email address using the token from the verification link.
 *       Supports both GET (query param) and POST (body) requests.
 *       Activates the account upon successful verification.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired verification token
 *       500:
 *         description: Internal server error
 */
router.get('/verify-email', authController.verifyEmail);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     tags: [Authentication]
 *     summary: Verify email address via token
 *     description: |
 *       Verifies the user's email address using the token sent during registration.
 *       Activates the account upon successful verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyEmailRequest'
 *           examples:
 *             verify:
 *               summary: Verify email
 *               value:
 *                 token: abc123verifytoken
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired verification token
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/verify-email',
  validate(verifyEmailSchema, 'body'),
  authController.verifyEmail
);

// ─── RESEND VERIFICATION ─────────────────────────────────

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     tags: [Authentication]
 *     summary: Resend email verification link
 *     description: |
 *       Generates a new verification token and sends a verification email.
 *       Always returns a success response to prevent email enumeration.
 *       Rate limited to prevent abuse.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendVerificationRequest'
 *           examples:
 *             resend:
 *               summary: Resend verification
 *               value:
 *                 email: john.doe@company.com
 *     responses:
 *       200:
 *         description: Verification email sent (if account exists and unverified)
 *       400:
 *         description: Email is already verified
 *       422:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
router.post(
  '/resend-verification',
  authRateLimiter,
  validate(resendVerificationSchema, 'body'),
  authController.resendVerification
);

// ─── ME ───────────────────────────────────────────────────

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile information including department details.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/me', authenticate, authController.me);

// ─── SESSIONS ─────────────────────────────────────────────

/**
 * @swagger
 * /auth/sessions:
 *   get:
 *     tags: [Authentication]
 *     summary: Get active sessions
 *     description: |
 *       Returns all sessions (active and historical) for the authenticated user.
 *       Includes device information, browser details, IP addresses, and status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SessionInfo'
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/sessions', authenticate, authController.getSessions);

// ─── DELETE SESSION ───────────────────────────────────────

/**
 * @swagger
 * /auth/sessions/{id}:
 *   delete:
 *     tags: [Authentication]
 *     summary: Delete (revoke) a specific session
 *     description: |
 *       Revokes a specific session by ID. The user can only revoke their own sessions.
 *       If the revoked session was the last active session, Redis cache is cleared.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Session ID to revoke
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
router.delete('/sessions/:id', authenticate, authController.deleteSession);

// ─── LOGIN HISTORY ────────────────────────────────────────

/**
 * @swagger
 * /auth/login-history:
 *   get:
 *     tags: [Authentication]
 *     summary: Get login history
 *     description: |
 *       Returns paginated login history for the authenticated user.
 *       Includes IP addresses, device information, and login status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Login history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LoginHistoryEntry'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/login-history', authenticate, authController.getLoginHistory);

export default router;
