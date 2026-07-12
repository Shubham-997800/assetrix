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
} from '../validators/auth.schema';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user account
 *     description: Creates a new user account with email verification. Sends a verification email upon successful registration.
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
 *         description: Email already registered
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

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in with email and password
 *     description: Authenticates a user and returns access/refresh tokens. Refresh token is set as an httpOnly cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             login:
 *               summary: User login
 *               value:
 *                 email: john.doe@company.com
 *                 password: SecureP@ss1
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

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     description: |
 *       Generates a new access/refresh token pair using a valid refresh token.
 *       The refresh token can be provided via the httpOnly cookie or in the request body.
 *       Token rotation is enforced: each refresh token is single-use.
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
router.post('/refresh-token', authController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
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
 *                 description: The refresh token to revoke (optional if provided as cookie)
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request a password reset
 *     description: |
 *       Sends a password reset email if an account with the given email exists.
 *       Always returns a success response to prevent email enumeration.
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

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with token
 *     description: Resets the user's password using a valid reset token. All existing sessions are revoked.
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
 *         description: Invalid or expired reset token
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

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     tags: [Auth]
 *     summary: Verify email address
 *     description: Verifies the user's email address using the token sent during registration.
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

/**
 * @swagger
 * /api/v1/auth/resend-verification:
 *   post:
 *     tags: [Auth]
 *     summary: Resend email verification link
 *     description: |
 *       Generates a new verification token and sends a verification email.
 *       Always returns a success response to prevent email enumeration.
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

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile information.
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

export default router;
