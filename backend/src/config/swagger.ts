import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Assetrix API',
      version: '1.0.0',
      description: 'Assetrix - Smart Assets. Sustainable Future. Enterprise AI-Powered Asset Management System API',
      contact: {
        name: 'Assetrix Team',
        email: 'api@assetrix.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/${config.apiVersion}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT access token',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {},
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            totalItems: { type: 'integer' },
            totalPages: { type: 'integer' },
            currentPage: { type: 'integer' },
            hasNextPage: { type: 'boolean' },
            hasPreviousPage: { type: 'boolean' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string', nullable: true },
            avatar: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_MANAGER', 'TECHNICIAN', 'EMPLOYEE'] },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'] },
            employeeId: { type: 'string', nullable: true },
            designation: { type: 'string', nullable: true },
            departmentId: { type: 'string', nullable: true },
            managerId: { type: 'string', nullable: true },
            emailVerified: { type: 'boolean' },
            lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserDetail: {
          allOf: [
            { $ref: '#/components/schemas/User' },
            {
              type: 'object',
              properties: {
                department: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    code: { type: 'string' },
                  },
                },
                manager: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                  },
                },
                _count: {
                  type: 'object',
                  properties: {
                    directReports: { type: 'integer' },
                    allocatedAssets: { type: 'integer' },
                    bookings: { type: 'integer' },
                  },
                },
              },
            },
          ],
        },
        CreateUser: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@assetrix.com' },
            password: { type: 'string', format: 'password', minLength: 8, example: 'SecureP@ss1' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            phone: { type: 'string', example: '+1234567890' },
            role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_MANAGER', 'TECHNICIAN', 'EMPLOYEE'], default: 'EMPLOYEE' },
            employeeId: { type: 'string', example: 'EMP-001' },
            designation: { type: 'string', example: 'Software Engineer' },
            departmentId: { type: 'string', format: 'uuid' },
            managerId: { type: 'string', format: 'uuid' },
          },
        },
        UpdateUser: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string', nullable: true },
            employeeId: { type: 'string', nullable: true },
            designation: { type: 'string', nullable: true },
            departmentId: { type: 'string', format: 'uuid', nullable: true },
            managerId: { type: 'string', format: 'uuid', nullable: true },
          },
        },
        ProfileUpdate: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string', nullable: true },
            avatar: { type: 'string', format: 'uri', nullable: true },
          },
        },
        ChangeRole: {
          type: 'object',
          required: ['role'],
          properties: {
            role: { type: 'string', enum: ['SUPER_ADMIN', 'ADMIN', 'DEPARTMENT_MANAGER', 'TECHNICIAN', 'EMPLOYEE'] },
          },
        },
        ChangeStatus: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'] },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Access denied. No token provided.' },
                  statusCode: { type: 'integer', example: 401 },
                },
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Insufficient permissions.' },
                  statusCode: { type: 'integer', example: 403 },
                },
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Resource not found.' },
                  statusCode: { type: 'integer', example: 404 },
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Validation failed' },
                  errors: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['email: Invalid email format'],
                  },
                  statusCode: { type: 'integer', example: 422 },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
