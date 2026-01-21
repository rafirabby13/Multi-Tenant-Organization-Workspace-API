
#  Multi-Tenant Organization Workspace API 

#### https://multi-tenant-organization-workspace-api.onrender.com/


A robust, enterprise-grade RESTful API built with Node.js, Express, and TypeScript. This system is designed to manage multiple organizations in a strictly isolated multi-tenant environment, allowing Platform Admins to oversee the system while Organization Admins manage their own projects, tasks, and employees.

## Checkout ER-Diagram:
### https://drive.google.com/file/d/1DeAZ9GoBma73WrXVmSu3krWHZIGgGu_0/view?usp=sharing
## Project Overview

### Problem Solved
Many B2B applications require data isolation where one client (Organization) cannot access another client's data. This API enforces strict "Tenant Isolation" at both the API level and the Database level.

### Key Features

- Multi-Tenancy: Strict data isolation between organizations.
- Role-Based Access Control (RBAC): Distinct roles for Platform Admin, Org Admin, and Org Member.
- Secure Authentication: JWT-based stateless authentication with password hashing (Bcrypt).
- Scalable Architecture: Modular, service-oriented folder structure.
- Type Safety: Fully typed with TypeScript and Zod validation.




## Folder Structure

 This project follows a Modular Architecture (Domain-Driven Design Lite), where each feature is self-contained. This ensures scalability and maintainability.

```
job_task_sm_tech_server/
├─ .vscode/
│  └─ settings.json
├─ prisma/
│  ├─ generated/
│  │  └─ prisma/
│  │     ├─ internal/
│  │     │  ├─ class.ts
│  │     │  ├─ prismaNamespace.ts
│  │     │  └─ prismaNamespaceBrowser.ts
│  │     ├─ models/
│  │     │  ├─ Organization.ts
│  │     │  ├─ Project.ts
│  │     │  ├─ Task.ts
│  │     │  └─ User.ts
│  │     ├─ browser.ts
│  │     ├─ client.ts
│  │     ├─ commonInputTypes.ts
│  │     ├─ enums.ts
│  │     └─ models.ts
│  ├─ migrations/
│  │  ├─ 20260120165501_crate_models/
│  │  │  └─ migration.sql
│  │  ├─ 20260121062319_org_status/
│  │  │  └─ migration.sql
│  │  ├─ 20260121092345_project_fixed/
│  │  │  └─ migration.sql
│  │  ├─ 20260121092719_project_description/
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema/
│     ├─ enums.prisma
│     ├─ organization.prisma
│     ├─ project.prisma
│     ├─ schema.prisma
│     ├─ task.prisma
│     └─ user.prisma
├─ src/
│  ├─ app/
│  │  ├─ errors/
│  │  │  └─ AppError.ts
│  │  ├─ helpers/
│  │  │  ├─ jwtHelper.ts
│  │  │  └─ pick.ts
│  │  ├─ middlewares/
│  │  │  ├─ auth.ts
│  │  │  ├─ globalErrorHandler.ts
│  │  │  └─ validateRequest.ts
│  │  ├─ modules/
│  │  │  ├─ auth/
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ auth.routes.ts
│  │  │  │  └─ auth.service.ts
│  │  │  ├─ organization/
│  │  │  │  ├─ organization.controller.ts
│  │  │  │  ├─ organization.interface.ts
│  │  │  │  ├─ organization.routes.ts
│  │  │  │  ├─ organization.service.ts
│  │  │  │  └─ organization.validation.ts
│  │  │  ├─ project/
│  │  │  │  ├─ project.controller.ts
│  │  │  │  ├─ project.interface.ts
│  │  │  │  ├─ project.routes.ts
│  │  │  │  ├─ project.services.ts
│  │  │  │  └─ project.validation.ts
│  │  │  ├─ task/
│  │  │  │  ├─ task.controller.ts
│  │  │  │  ├─ task.interface.ts
│  │  │  │  ├─ task.routes.ts
│  │  │  │  ├─ task.service.ts
│  │  │  │  └─ task.validation.ts
│  │  │  └─ user/
│  │  │     ├─ user.constant.ts
│  │  │     ├─ user.controller.ts
│  │  │     ├─ user.interface.ts
│  │  │     ├─ user.routes.ts
│  │  │     ├─ user.service.ts
│  │  │     └─ user.validation.ts
│  │  ├─ routes/
│  │  │  └─ index.ts
│  │  └─ shared/
│  │     ├─ catchAsync.ts
│  │     └─ sendResponse.ts
│  ├─ config/
│  │  └─ index.ts
│  ├─ lib/
│  │  └─ prisma.ts
│  ├─ scripts/
│  │  └─ seedPlatformAdmin.ts
│  ├─ app.ts
│  └─ server.ts
├─ .env
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ prisma.config.ts
└─ tsconfig.json



```

## Database Choice Reasoning

### Database Selected: PostgreSQL ORM Used: Prisma
#### Why PostgreSQL?
- Relational Integrity: The project requires strict relationships (One Organization -> Many Projects -> Many Tasks). A relational database enforces these constraints via Foreign Keys better than NoSQL.

- ACID Compliance: Essential for business applications to ensure data validity during complex transactions (e.g., deleting an Organization must cascade delete its projects).

- Structured Data: The data model (Users, Tasks, Projects) is highly structured and predictable, making SQL the optimal choice over the flexibility of MongoDB.

#### Why Prisma?
Prisma was chosen for its type-safe database queries. It auto-generates TypeScript types based on the schema, drastically reducing runtime errors and ensuring that our API code is always in sync with the database structure.
## How Authorization is Enforced


### Route-Level Protection (Middleware)
 We use a Higher-Order Function auth(...roles) to protect routes.

- JWT Verification: The middleware decodes the token and attaches the user payload to req.user.

- Role Check: It compares the user's role against the allowed roles for that specific route.

Example: Only PLATFORM_ADMIN can access POST /create-organization.

### Service-Level Logic (Business Rules)
This is where the Multi-Tenancy magic happens. Even if a user has the correct role, we verify they own the data.

- Tenant Isolation: When fetching data (e.g., getTaskById), the service checks if currentUser.organizationId matches the data's organizationId.

- Member Restrictions: If a user is just an ORG_MEMBER, the service automatically injects a filter (e.g., where: { assigneeId: currentUser.id }) to ensure they only see tasks assigned to them.
## Postman Usage Notes

A complete Postman Collection has been provided for testing.

### checkout this Postman Documentation: https://documenter.getpostman.com/view/45502579/2sBXVkA9P5

### Prerequisites
 ** Import the Collection: Drag and drop the provided .json file into Postman.

** No Environment Setup Needed: The collection uses the hosted API URL directly.

### Testing Flow (Recommended)
*** Login:

- Open the Auth folder.

- Use the Platform Admin Login request.

- Copy the accessToken from the response.

*** Set Token:

- In Postman, go to the Headers tab of any protected route.

- Key: Authorization

- Value: your_copied_token

(Note: Ideally, automate this with Postman Scripts, but manual copy-paste works for review).

*** Create Organization: Use the Platform Admin token to create a new Org.

*** Create Org Admin: Create a user for that Org.

*** Login as Org Admin: Get a new token to manage projects and tasks.

### Test Credentials
- Platform Admin Email:   platformadmin@gmail.com
- Platform Admin Password: platformadmin123

- Organization Admin Email: wal@technova.com
- Organization Admin Password: Walton123!

- Organization Member Email: member1@org.com
- Organization Member Password: SecurePassword123!






## Tech Stack

- Runtime: Node.js

- Framework: Express.js

- Language: TypeScript

- Database: PostgreSQL

- ORM: Prisma

- Validation: Zod

- Authentication: JSON Web Tokens (JWT) & Bcrypt