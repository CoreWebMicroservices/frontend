# GitHub Copilot Instructions – Core Microservices Frontend (React + TypeScript + Vite)

## 🎯 Project Overview

This project is the **frontend** of the Core Microservices platform—a comprehensive demonstration of enterprise-grade **modular architecture** patterns. It showcases how to build scalable, maintainable web applications using React, TypeScript, and modern architectural principles.

### **What This Project Demonstrates:**

**Modular & Composable Architecture**: Each business domain (user management, communication, etc.) is implemented as a standalone module that can be reused across different applications.

**Enterprise Patterns**: Real-world patterns for authentication (JWT + OAuth2), role-based access control, API layer abstraction, and cross-cutting concerns.

**Component Composition**: Shows how to build complex pages by composing independent components from different modules—enabling maximum flexibility and reusability.

**Configuration over Convention**: Common components accept configuration parameters instead of hardcoding business logic, making them truly reusable.

### **Key Business Modules:**

- **User Management**: Authentication, user profiles, admin functionality, role management
- **Communication**: Messaging, notifications, activity feeds (placeholder for future expansion)
- **Translation**: Internationalization support (placeholder for future expansion)

### **Perfect for:**

- Learning enterprise React architecture patterns
- Building scalable multi-tenant applications
- Creating reusable component libraries
- Understanding modular frontend design principles

---

## 🧱 Tech Stack

- **React 18+**
- **TypeScript**
- **Vite**
- **React Router v6+**
- **Axios** for API calls
- **React Query** for data fetching and caching
- **React Bootstrap** for UI components

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/              # App-level composition and configuration
│   │   ├── layout/       # App layout components (header, footer, etc.)
│   │   ├── router/       # Centralized routing configuration
│   │   │   ├── AppRouter.tsx    # Main router component
│   │   │   ├── AppRoutes.tsx    # Route definitions & component composition
│   │   │   └── routes.ts        # Route paths constants
│   │   ├── App.tsx       # Main app component
│   │   └── style/        # Global styles
│   │
│   ├── common/           # Shared, reusable utilities & components
│   │   ├── component/    # Reusable UI components (DataTable, Breadcrumb, etc.)
│   │   ├── router/       # Configurable auth guards & router utilities
│   │   ├── model/        # Shared TypeScript interfaces
│   │   └── utils/        # API layer, error handlers, helpers
│   │
│   ├── user/             # User module (standalone & composable)
│   │   ├── component/    # User-specific components only
│   │   ├── store/        # User state management (Hookstate)
│   │   ├── model/        # User TypeScript interfaces
│   │   └── config.ts     # User module configuration
│   │
│   ├── communication/    # Communication module (standalone & composable)
│   │   ├── component/    # Communication-specific components only
│   │   ├── store/        # Communication state management
│   │   ├── model/        # Communication TypeScript interfaces
│   │   └── config.ts     # Communication module configuration
│   │
│   ├── translation/      # Translation module (standalone & composable)
│   │   └── ...           # Similar modular structure
│   │
│   └── main.tsx          # App entry point
│
├── public/               # Static assets
├── index.html            # Main HTML template
└── vite.config.ts        # Vite configuration
```

---

## 🏗️ Design Paradigm: Modular & Composable Architecture

### 🎯 Core Principles

**1. Standalone Modules**

- Each module (user, communication, etc.) is **completely independent**
- Modules contain only business logic components, no routing configuration
- Modules can be used in different apps or contexts without modification
- No hardcoded dependencies between modules

**2. App-Level Composition**

- The `/app` layer decides how to **compose modules together**
- Routes are defined at app-level in `/app/router/AppRoutes.tsx`
- Pages can mix components from multiple modules:
  ```tsx
  // Example: Compose different modules on one page
  <UsersPage>
    <UserList /> {/* from user module */}
    <StatsGraph /> {/* from analytics module */}
    <ActivityFeed /> {/* from communication module */}
  </UsersPage>
  ```

**3. Configurable Common Components**

- Common components (like `AuthGuards`) accept configuration parameters
- No hardcoded routes or app-specific logic in shared components
- Enables reuse across different applications

**4. Centralized Route Management**

- All route paths in `/app/router/routes.ts`
- All route configurations in `/app/router/AppRoutes.tsx`
- Modules import routes from centralized location: `@/app/router/routes`

**5. Dependency Injection Pattern**

- Modules don't directly import from other modules
- Cross-module communication via events or dependency injection
- App layer provides dependencies to modules

### 🔧 Implementation Guidelines

**Module Structure (e.g., `/user/`)**:

- ✅ `component/` - Pure UI components
- ✅ `store/` - State management with Hookstate
- ✅ `model/` - TypeScript interfaces
- ✅ `config.ts` - Module configuration (uses centralized routes)
- ❌ No router files
- ❌ No route definitions
- ❌ No direct imports from other modules

**App Structure (`/app/`)**:

- ✅ `router/` - All routing logic centralized here
- ✅ `layout/` - App-wide layout components
- ✅ Composes modules into complete pages
- ✅ Manages cross-module communication

**Common Structure (`/common/`)**:

- ✅ Configurable, reusable components
- ✅ No hardcoded app-specific logic
- ✅ Accepts configuration parameters
- ✅ Can be used across different apps

---

## 🏗️ Backend Architecture (Java Microservices)

The backend is built using **Java Spring Boot** microservices architecture located at: https://github.com/dmitry3325/core-microservices

### Microservice Structure:

Each service follows the pattern:

- **`service-name-api`**: API definitions and OpenAPI/Swagger specifications (in `resources/`)
- **`service-name-service`**: Main service implementation with controllers, business logic, and data access

### Available Microservices:

- **user-ms**: User Management Service

  - **user-api**: API specifications for authentication and user management endpoints
  - **user-service**: Implementation of user authentication, profiles, roles, password management
  - API Endpoints: `/api/auth/*` and `/api/user/*`

- **communication-ms**: Communication Service
  - **communication-api**: API specifications for messaging and notification endpoints
  - **communication-service**: Implementation of email, SMS, push notifications, simple chat
  - API Endpoints: `/api/communication/*`

### API Documentation:

- **API Specifications**: Located in each `-api` module's `resources/` folder
- **OpenAPI/Swagger**: Use these specs to understand available endpoints, request/response models
- **Authentication**: All services use JWT tokens for authentication
- **Database**: PostgreSQL with environment-based configuration

### Frontend Integration:

- Reference the API specifications in `resources/` folders for endpoint definitions
- Use the established patterns in `CoreMsApi.ts` for API calls
- Follow the `ApiResponseHandler` pattern for consistent error handling

---

## 🧩 Coding Guidelines

### 1. General

- Use **functional components** with **React Hooks**.
- Always type props, hooks, and state.
- Use **ESLint** and **Prettier** for consistency.
- Avoid large monolithic components — prefer **modular and reusable** ones.
- Always use global (alias) imports (e.g., `@/app/layout/AppLayout`) instead of relative imports.

### 2. Modular Architecture

- **Modules are standalone**: Each module (user, communication) contains only business components
- **No routing in modules**: Route definitions belong in `/app/router/AppRoutes.tsx`
- **Centralized routes**: Import routes from `@/app/router/routes` not from module files
- **Composable pages**: Mix components from different modules at app-level
- **Configurable common components**: Pass configuration instead of hardcoding values

### 3. API Layer

- Use a centralized `axiosInstance` from common/utils/CoreMsApi.ts.
- Handle authentication via **JWT tokens** (stored in `localStorage`).
- Use **React Query** for requests, caching, and invalidation logic.

### 4. Authentication

- Support both:
  - **Email/password** login
  - **OAuth2 (Google, GitHub, etc.)** redirect login flow
- Handle access and refresh tokens automatically (refresh before expiry).
- Use configurable `AuthGuards` for route protection:
  ```tsx
  // In AppRoutes.tsx
  loader: authGuards.redirectIfNotInRole([AppRoles.UserMsAdmin]);
  ```
- **SUPER_ADMIN** automatically has access to all endpoints
- Authentication state managed via Hookstate in `user/store/AuthState.ts`

### 5. State Management

State Management

- Use **React Query** for server state (data fetching, caching, and sync with backend).
- Use **Hookstate** for local and client state management. Prefer simple, modular state logic.
- Each core service/component (e.g., user, communication, translation) should have its own `store/` folder with state files colocated.
- Avoid Redux and complex global state unless absolutely necessary.

### 6. UI / UX

- Use **React Bootstrap** for buttons, modals, forms, inputs, etc.
- Apply consistent **dark/light theme** handling via context.

### 7. Folder Naming

- Use lowercase and hyphen-separated folder names (e.g., `user-profile/`).
- Component files: `PascalCase` (e.g., `UserCard.tsx`).
- Hooks: `useCamelCase.ts`.

### 8. Testing

- Use **Vitest** + **React Testing Library**.
- Write tests for major components and hooks.
- Maintain at least 60% coverage for now.

---

## 📋 API Response Handling Standards

### ProfileState Pattern

When working with state management functions, follow these patterns for consistent API response handling:

#### Return Type Guidelines

1. **For all API operations** - Always use `CoreMsApiResonse<T>` return type:

   - Provides `result: boolean`, `response: T`, and `errors: CoreMsApiError[]`
   - Enables detailed error handling with specific error messages from the backend
   - Examples:
     - `getProfileInfo(): Promise<CoreMsApiResonse<User>>`
     - `updateProfilePassword(): Promise<CoreMsApiResonse<{ success: boolean }>>`

2. **When to use `ApiSuccessfulResponse`**:
   - Only use for direct API responses that don't need detailed error context
   - Prefer `CoreMsApiResonse<T>` for all state management functions to maintain error detail access

#### State Management Function Structure

```typescript
export async function someStateFunction(
  data: SomeData
): Promise<CoreMsApiResonse<ReturnType>> {
  // Set loading state
  someState.isInProgress.set(true);

  // Make API call - NO try-catch needed (handled in userMsApi.apiRequest)
  const res = await userMsApi.apiRequest<ReturnType>(
    HttpMethod.METHOD,
    "/api/endpoint",
    data
  );

  // Clear loading state
  someState.isInProgress.set(false);

  // Update state if successful
  if (res.result === true && res.response) {
    someState.data.set(res.response);
  }

  // Return response directly
  return res;
}
```

#### Component Response Handling

1. **For CoreMsApiResonse<T>**:

```typescript
const result = await someStateFunction(data);
if (result.result) {
  // Success - use result.response
  setSuccessMessage("Operation successful!");
} else {
  // Error - use result.errors for detailed messages
  const errorMessage =
    result.errors.length > 0
      ? result.errors.map((err) => err.description).join(", ")
      : "Default error message";
  setErrorMessage(errorMessage);
}
```

2. **For ApiSuccessfulResponse**:

```typescript
const result = await someSimpleOperation(data);
if (result.result) {
  // Success
  setSuccessMessage("Operation successful!");
} else {
  // Error - use generic message
  setErrorMessage("Operation failed. Please try again.");
}
```

### Key Principles

- **No try-catch blocks** in state functions - error handling is done in `userMsApi.apiRequest`
- **Consistent loading states** - always set `isInProgress` before/after API calls
- **Appropriate response types** - use detailed responses for data operations, simple responses for actions
- **State updates** - update local state when API calls succeed
- **Direct return** - return API response directly without additional processing

### File Structure Guidelines

- **State files** (`/store/`): Handle API calls and state management
- **Component files** (`/component/`): Handle UI logic and response processing
- **Model files** (`/model/`): Define TypeScript interfaces
- **API files** (`/utils/`): Handle HTTP requests and error processing

### Error Handling Best Practices

- **Use MessageHandler with built-in state** for the cleanest approach:

  ```typescript
  import { useMessageState } from "@/common/utils/MessageHandler";

  const { success, error, handleResponse, clearAll } = useMessageState();

  // Handle API response - state is managed automatically
  const result = await someApiCall(data);
  handleResponse(
    result,
    "Failed to complete operation.",
    "Operation completed successfully."d
  );
  ```

- **Alternative: Use MessageHandler utility** with manual state management:

  ```typescript
  import MessageHandler from "@/common/utils/MessageHandler";

  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string[] | null>(null);
  const messageHandler = MessageHandler.useMessageHandler();

  // Handle API response
  const result = await someApiCall(data);
  messageHandler.handleResponse(
    result,
    "Operation completed successfully.",
    "Failed to complete operation.",
    setUpdateSuccess,
    setUpdateError
  );
  ```

- **Display messages in UI** with proper formatting (works with both approaches):

  ```typescript
  {
    success && (
      <Alert variant="success">
        <strong>Success!</strong> {success}
      </Alert>
    );
  }

  {
    error && (
      <Alert variant="danger">
        <strong>Error:</strong>
        <pre className="mb-0 mt-1" style={{ whiteSpace: "pre-wrap" }}>
          {MessageHandler.formatErrorsForDisplay(error)}
        </pre>
      </Alert>
    );
  }
  ```

- **Benefits of MessageHandler**:
  - **useMessageState**: Built-in state management eliminates boilerplate
  - **useMessageHandler**: Manual state control for complex scenarios
  - Consistent error/success message formatting
  - Automatic combination of context + specific API errors
  - Built-in success message auto-clearing
  - Standardized multi-line error display
  - Clear separation of concerns

---

## 🧠 Copilot Hints

When generating code with GitHub Copilot, follow these rules:

1. **Follow modular architecture** — Components go in module `/component/` folders, routes go in `/app/router/`
2. **Use centralized routes** — Import from `@/app/router/routes` not hardcoded paths
3. **Prefer React Query** over manual fetch calls.
4. **Type everything** (props, state, API responses).
5. **Use React Bootstrap components** for styling, not inline styles.
6. **For API calls**, use patterns from `common/utils/CoreMsApi.ts`.
7. **Configurable components** — Accept configuration props instead of hardcoding values
8. **Error handling**: Always display error messages using `ApiResponseAlert` components.
9. **Use environment variables**: `import.meta.env.VITE_API_URL` for backend base URL.

---

## 🧩 Example Copilot Prompts

**Modular Component Creation:**

- "Create a user profile component in `/user/component/profile/` using APP_ROUTES"
- "Generate a reusable DataTable component in `/common/component/` with configuration props"

**API Integration:**

- "Add React Query mutation for `/api/auth/signin` using CoreMsApi patterns"
- "Create user state management in `/user/store/` with Hookstate"

**Route & Navigation:**

- "Add new route to `/app/router/AppRoutes.tsx` with proper AuthGuard configuration"
- "Update `/app/router/routes.ts` with new route paths"

**Cross-Module Composition:**

- "Create a dashboard page that combines UserList + ActivityFeed + StatsGraph components"

---

## 🚀 Deployment

### Development

```bash
npm install
npm run dev
```

### Production

```bash
npm run build
npm run preview
```

The frontend should connect to the backend via:

```
VITE_API_URL=https://api.corems.local
```

© 2025 Core Microservices – Frontend powered by React, Vite, and TypeScript.

#### Component Response Handling

1. **For CoreMsApiResonse<T>**:

```typescript
const result = await someStateFunction(data);
if (result.result) {
  // Success - use result.response
  setSuccessMessage("Operation successful!");
} else {
  // Error - use result.errors for detailed messages
  const errorMessage =
    result.errors.length > 0
      ? result.errors.map((err) => err.description).join(", ")
      : "Default error message";
  setErrorMessage(errorMessage);
}
```

2. **For ApiSuccessfulResponse**:

```typescript
const result = await someSimpleOperation(data);
if (result.result) {
  // Success
  setSuccessMessage("Operation successful!");
} else {
  // Error - use generic message
  setErrorMessage("Operation failed. Please try again.");
}
```

### Key Principles

- **No try-catch blocks** in state functions - error handling is done in `userMsApi.apiRequest`
- **Consistent loading states** - always set `isInProgress` before/after API calls
- **Appropriate response types** - use detailed responses for data operations, simple responses for actions
- **State updates** - update local state when API calls succeed
- **Direct return** - return API response directly without additional processing

### File Structure Guidelines

- **State files** (`/store/`): Handle API calls and state management
- **Component files** (`/component/`): Handle UI logic and response processing
- **Model files** (`/model/`): Define TypeScript interfaces
- **API files** (`/utils/`): Handle HTTP requests and error processing

### Error Handling Best Practices

- Display specific error messages from API responses when available
- Provide fallback error messages for better UX
- Clear error states when operations succeed
- Use appropriate UI components (Alert, Toast) for error display
