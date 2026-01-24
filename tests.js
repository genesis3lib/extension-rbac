/**
 * Genesis3 Module Test Configuration - RBAC Extension
 *
 * Tests the complete Role-Based Access Control integration including:
 * - Spring Boot user entity and repository
 * - Django user models and permissions
 * - Database migrations (Liquibase and Django)
 * - Security configuration
 * - User profile endpoints
 */

module.exports = {
  moduleId: 'extension-rbac',
  moduleName: 'Role-Based Access Control',

  scenarios: [
    {
      name: 'rbac-spring-boot-complete',
      description: 'RBAC with Spring Boot - complete user management and security',
      dependencies: ['extension-rdbms'],
      config: {
        moduleId: 'rbac-spring',
        kind: 'extension',
        type: 'rbac',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          enableJwtAuth: true
        }
      },
      expectedFiles: [
        // JPA Entities
        'backend/src/main/java/com/example/jpa/entity/UserEntity.java',
        'backend/src/main/java/com/example/jpa/repository/UserRepository.java',
        'backend/src/main/java/com/example/jpa/enumtype/UserRole.java',
        // Service Layer
        'backend/src/main/java/com/example/service/UserService.java',
        // Controller
        'backend/src/main/java/com/example/controller/secure/UserProfileController.java',
        // Response Models
        'backend/src/main/java/com/example/model/rsp/UserRsp.java',
        // Configuration
        'backend/src/main/java/com/example/config/SecurityConfig.java',
        'backend/src/main/java/com/example/config/CorsConfig.java',
        'backend/src/main/resources/application-security.yaml',
        // Database Migrations
        'backend/src/main/resources/db/changelog/changes/010-create-users-table.yaml'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/jpa/entity/UserEntity.java',
          contains: [
            '@Entity',
            '@Table(name = "users")',
            'String email',
            'UserRole role',
            'String externalAuthId',
            'String externalAuthProvider',
            'Boolean enabled',
            'String tenantId'
          ]
        },
        {
          file: 'backend/src/main/java/com/example/jpa/enumtype/UserRole.java',
          contains: [
            'enum UserRole',
            'ROOT',
            'ADMIN',
            'USER'
          ]
        },
        {
          file: 'backend/src/main/java/com/example/jpa/repository/UserRepository.java',
          contains: [
            'JpaRepository',
            'findByEmail',
            'findByExternalAuthId',
            'Optional<UserEntity>'
          ]
        },
        {
          file: 'backend/src/main/java/com/example/service/UserService.java',
          contains: [
            'createOrUpdateUser',
            'findByEmail',
            'UserRepository',
            '@Service',
            '@Transactional'
          ]
        },
        {
          file: 'backend/src/main/java/com/example/controller/secure/UserProfileController.java',
          contains: [
            '@RestController',
            '@RequestMapping("/api/v1/protected/user")',
            '@GetMapping("/profile")',
            'UserService',
            'ResponseBody<UserRsp>'
          ]
        },
        {
          file: 'backend/src/main/java/com/example/config/SecurityConfig.java',
          contains: [
            '@Configuration',
            '@EnableWebSecurity',
            'SecurityFilterChain',
            'permitAll',
            'authenticated'
          ]
        },
        {
          file: 'backend/src/main/resources/db/changelog/changes/010-create-users-table.yaml',
          contains: [
            'createTable',
            'tableName: users',
            'email',
            'role',
            'external_auth_id',
            'tenant_id'
          ]
        }
      ]
    },
    {
      name: 'rbac-django-complete',
      description: 'RBAC with Django REST Framework - complete user management',
      dependencies: ['extension-rdbms'],
      config: {
        moduleId: 'rbac-django',
        kind: 'extension',
        type: 'rbac',
        providers: ['drf'],
        enabled: true,
        fieldValues: {
          enableJwtAuth: true
        }
      },
      expectedFiles: [
        // Django App
        'backend/app_rbac/__init__.py',
        'backend/app_rbac/apps.py',
        'backend/app_rbac/models.py',
        'backend/app_rbac/views.py',
        'backend/app_rbac/urls.py',
        'backend/app_rbac/serializers.py',
        'backend/app_rbac/permissions.py',
        // Migrations
        'backend/app_rbac/migrations/__init__.py',
        'backend/app_rbac/migrations/0001_initial.py'
      ],
      fileContentChecks: [
        {
          file: 'backend/app_rbac/models.py',
          contains: [
            'class User(models.Model)',
            'email = models.EmailField',
            'UserRole',
            'external_auth_id',
            'external_auth_provider',
            'tenant_id',
            'enabled',
            'deleted'
          ]
        },
        {
          file: 'backend/app_rbac/views.py',
          contains: [
            'UserProfileView',
            'APIView',
            'Response',
            'get_object_or_404'
          ]
        },
        {
          file: 'backend/app_rbac/serializers.py',
          contains: [
            'UserProfileSerializer',
            'serializers.Serializer',
            'email',
            'roles',
            'enabled'
          ]
        },
        {
          file: 'backend/app_rbac/permissions.py',
          contains: [
            'HasRole',
            'BasePermission',
            'has_permission'
          ]
        },
        {
          file: 'backend/app_rbac/migrations/0001_initial.py',
          contains: [
            'migrations.CreateModel',
            'User',
            'email',
            'role'
          ]
        }
      ]
    },
    {
      name: 'rbac-user-profile-response-format',
      description: 'RBAC user profile endpoint - verify response format consistency',
      dependencies: ['extension-rdbms'],
      config: {
        moduleId: 'rbac-profile',
        kind: 'extension',
        type: 'rbac',
        providers: ['spring', 'drf'],
        enabled: true,
        fieldValues: {
          enableJwtAuth: true
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/controller/secure/UserProfileController.java',
        'backend/src/main/java/com/example/model/rsp/UserRsp.java',
        'backend/app_rbac/views.py',
        'backend/app_rbac/serializers.py'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/model/rsp/UserRsp.java',
          contains: [
            'String email',
            'String name',
            'List<String> roles',
            'Boolean enabled',
            'String externalAuthProvider'
          ]
        },
        {
          file: 'backend/app_rbac/serializers.py',
          contains: [
            'email',
            'name',
            'roles',
            'enabled',
            'external_auth_provider'
          ]
        }
      ]
    },
    {
      name: 'rbac-without-jwt',
      description: 'RBAC without JWT authentication - basic RBAC only',
      dependencies: ['extension-rdbms'],
      config: {
        moduleId: 'rbac-no-jwt',
        kind: 'extension',
        type: 'rbac',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          enableJwtAuth: false
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/jpa/entity/UserEntity.java',
        'backend/src/main/java/com/example/service/UserService.java'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/jpa/entity/UserEntity.java',
          contains: [
            'UserEntity',
            'email',
            'role'
          ]
        }
      ]
    },
    {
      name: 'rbac-security-endpoints',
      description: 'RBAC security configuration - verify protected and public endpoints',
      dependencies: ['extension-rdbms'],
      config: {
        moduleId: 'rbac-security',
        kind: 'extension',
        type: 'rbac',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          enableJwtAuth: true
        }
      },
      expectedFiles: [
        'backend/src/main/java/com/example/config/SecurityConfig.java'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/java/com/example/config/SecurityConfig.java',
          contains: [
            '/api/v1/public/**',
            '/actuator/health',
            'permitAll()',
            '/api/v1/protected/**',
            'authenticated()'
          ]
        }
      ]
    },
    {
      name: 'rbac-database-schema',
      description: 'RBAC database schema - verify Liquibase migration structure',
      dependencies: ['extension-rdbms'],
      config: {
        moduleId: 'rbac-schema',
        kind: 'extension',
        type: 'rbac',
        providers: ['spring'],
        enabled: true,
        fieldValues: {
          enableJwtAuth: true
        }
      },
      expectedFiles: [
        'backend/src/main/resources/db/changelog/changes/010-create-users-table.yaml'
      ],
      fileContentChecks: [
        {
          file: 'backend/src/main/resources/db/changelog/changes/010-create-users-table.yaml',
          contains: [
            'id:',
            'autoIncrement: true',
            'email:',
            'type: varchar(255)',
            'nullable: false',
            'role:',
            'type: varchar(20)',
            'external_auth_id:',
            'external_auth_provider:',
            'tenant_id:',
            'enabled:',
            'deleted:',
            'created_at:',
            'updated_at:',
            'addUniqueConstraint',
            'columnNames: email',
            'createIndex'
          ]
        }
      ]
    }
  ]
};
