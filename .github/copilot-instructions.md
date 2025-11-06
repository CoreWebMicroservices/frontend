# GitHub Copilot Instructions – Core Microservices Frontend (React + TypeScript + Vite)

## 🎯 Project Overview

This project is the **frontend** of the Core Microservices platform. It provides and example of the user interface for authentication, user management, and communication modules. The app is built with **React**, **TypeScript**, and **Vite** for fast development and performance.

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
│   ├── app/              # App skeleton: layout, header, footer, 404, router, and other
│   ├── common/           # Shared utilities: axios API controller, error handlers, helpers,
│   ├── user/             # User core service (auth, profile, etc.)
│   ├── communication/    # Communication core service (messaging, notifications, etc.)
│   ├── translation/      # Translation core service (i18n, language tools, etc.)
│   ├── .../              # Other core service folders as needed
│   └── main.tsx          # App entry point
│
├── public/               # Static assets
├── index.html            # Main HTML template
└── vite.config.ts        # Vite configuration
```

---

## 🧩 Coding Guidelines

### 1. General

- Use **functional components** with **React Hooks**.
- Always type props, hooks, and state.
- Use **ESLint** and **Prettier** for consistency.
- Avoid large monolithic components — prefer **modular and reusable** ones.
- Always use global (alias) imports (e.g., `@/app/layout/Applaout`) instead of relative imports.

### 2. API Layer

- Use a centralized `axiosInstance` from common/utils/CoreMsApi.ts.
- Handle authentication via **JWT tokens** (stored in `localStorage`).
- Use **React Query** for requests, caching, and invalidation logic.

### 3. Authentication

- Support both:
  - **Email/password** login
  - **OAuth2 (Google, GitHub, etc.)** redirect login flow
- Handle access and refresh tokens automatically (refresh before expiry).
- Protect routes with an `AuthGuard` component.

### 4. State Management

State Management

- Use **React Query** for server state (data fetching, caching, and sync with backend).
- Use **Hookstate** for local and client state management. Prefer simple, modular state logic.
- Each core service/component (e.g., user, communication, translation) should have its own `store/` folder with state files colocated.
- Avoid Redux and complex global state unless absolutely necessary.

### 5. UI / UX

- Use **React Bootstrap** for buttons, modals, forms, inputs, etc.
- Apply consistent **dark/light theme** handling via context.

### 6. Folder Naming

- Use lowercase and hyphen-separated folder names (e.g., `user-profile/`).
- Component files: `PascalCase` (e.g., `UserCard.tsx`).
- Hooks: `useCamelCase.ts`.

### 7. Testing

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
    "Operation completed successfully.",
    "Failed to complete operation."
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

1. **Use the existing structure** — Copilot should suggest code in the appropriate folder.
2. **Prefer React Query** over manual fetch calls.
3. **Type everything** (props, state, API responses).
4. **Use React Bootstrap components** for styling, not inline styles.
5. **For API calls**, import from `src/api` instead of hardcoding URLs.
6. **Wrap routes** that require login with `AuthGuard`.
7. **Error handling**: Always display error messages using shadcn/ui `Alert` components.
8. **Use environment variables**: `import.meta.env.VITE_API_URL` for backend base URL.

---

## 🧩 Example Copilot Prompts

"Generate a login form with React Hook Form and shadcn/ui."
"Add React Query mutation for `/api/auth/signin` endpoint."
"Create a `useCurrentUser` hook using `/api/user/me` endpoint."
"Implement a protected route component that redirects to /login if user is not authenticated."

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
