# Java Backend Convention

## Tech Stack

| Technology    | Description                 |
| ------------- | --------------------------- |
| Language      | Java                        |
| Framework     | Spring Boot                 |
| Build Tool    | Maven / Gradle              |
| Database      | PostgreSQL / MySQL          |
| ORM           | Spring Data JPA / Hibernate |
| API Style     | RESTful API                 |
| Validation    | Jakarta Validation          |
| Security      | Spring Security / JWT       |
| Logging       | SLF4J + Logback             |
| Testing       | JUnit 5 + Mockito           |
| Documentation | OpenAPI / Swagger           |

---

# 1. Project Structure

Prefer **package-by-feature** instead of package-by-layer for medium and large projects.

```
src/main/java
├── config/                 # Spring configuration classes
├── constant/               # Application constants
├── context/                # Context holders / request context / security context helpers
├── controller/             # REST controllers
├── domain/                 # Domain models / entities / DTO definitions if applicable
├── exception/              # Custom exceptions and global exception handlers
├── interceptor/            # Request/response interceptors
├── logger/                 # Logging utilities / custom logger components
├── logic/                  # Business logic implementation
├── mapper/                 # Object mapping between request, domain, response
├── repository/             # Data access layer
├── service/                # Service interfaces / service orchestration
├── util/                   # Shared utility classes
└── Application.java
```

## Rules

- common/ contains shared logic used across modules
- modules/ contains business domains
- each module should be self-contained
- avoid dumping everything into global service, controller, repository packages

---

# 2. Naming Convention

## Method Naming

Use clear verb-based names.

```

createUser()
updateUser()
deleteUser()
getUserById()
findUsersByStatus()

```

## Variable Naming

Use `camelCase`

Examples:

```

userId
createdAt
accessToken
orderItems

```

## Constant Naming

Use `UPPER_SNAKE_CASE`

```

MAX_RETRY_COUNT
DEFAULT_PAGE_SIZE
JWT_EXPIRATION_TIME

```

---

# 3. API Design Convention

## REST Endpoint Naming

Use plural resource names.

```

GET /api/users
GET /api/users/{id}
POST /api/users
PUT /api/users/{id}
DELETE /api/users/{id}

```

## Response Format

Use a common response wrapper when project requires consistency.

```

@Getter
@Builder
public class ApiResponse<T> {
private boolean success;
private T data;
private String message;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message("Success")
                .build();
    }

}

```

---

# 4. Logging Convention

Use structured and meaningful logs.

## Rules

- use info for business flow milestones
- use warn for recoverable issues
- use error for unexpected failures
- never log password, token, or sensitive data

---

# 5. Security Convention

## Rules

- never hardcode secret keys

- always use environment variables for sensitive config

- hash passwords using secure encoder

- validate authentication and authorization in security layer

- never return sensitive fields in API response

- use HTTPS in production

- JWT / session logic must be centralized

---

# 6. Code Style Convention

## General Rules

- use constructor injection

- avoid field injection

- prefer final for dependencies

- keep methods short and focused

- avoid methods longer than necessary

- extract reusable logic to helper classes or services

- do not nest logic too deeply

---

# 7. Clean Code Rules

- one class should have one main responsibility

- one method should do one thing well

- avoid magic numbers

- avoid duplicated logic

- prefer expressive names over comments

- comment only when business context is not obvious

- do not write dead code

- remove unused imports and methods

---

```

```
