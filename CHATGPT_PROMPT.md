# ChatGPT Prompt - Copy This

---

## PROMPT (Copy from here):

I have a Next.js 16 project called "Nexus Platform" - an enterprise dashboard application. Here's the complete context:

**Tech Stack:** Next.js 16.2.10, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, recharts, next-themes, lucide-react

**Project Structure:**
- `src/app/` - Pages (landing, login, register, dashboard with sub-pages)
- `src/components/` - UI components (auth, dashboard, landing, shared, ui)
- `src/contexts/` - React Context for dashboard state
- `src/hooks/` - Custom hooks (use-count-up, use-in-view, use-scroll-shadow)
- `src/lib/utils.ts` - cn() utility

**Key Features Built:**
1. Landing page with 16 sections (hero, features, architecture, AI, security, etc.)
2. Dashboard with collapsible sidebar, top navbar, command palette (Ctrl+K)
3. Theme support (light/dark mode)
4. Auth pages UI (login, register, forgot/reset password, verify email)
5. Notification dropdown, search, profile dropdown

**Current State:**
- Frontend UI is complete
- No backend/API integration
- No actual authentication
- All data is hardcoded/mock
- Dashboard pages are placeholder content

**What I need help with:**
[DESCRIBE YOUR TASK HERE - e.g., "Add real authentication", "Connect to a backend API", "Add new dashboard features", "Fix bugs", "Improve performance", etc.]

**Important:** This is Next.js 16 which has breaking changes from earlier versions. Please check `node_modules/next/dist/docs/` for documentation before suggesting code.

---

## Example Prompts You Can Use:

### 1. Authentication Add karne ke liye:
"I want to add JWT authentication to this project. Create a login API endpoint, protect dashboard routes, and add user session management. Use Next.js 16 App Router patterns."

### 2. Backend Connect karne ke liye:
"Help me connect this frontend to a REST API backend. Create API services for user login, registration, dashboard data fetching, and notifications."

### 3. Naye Features ke liye:
"Add a real-time notifications system with WebSocket support. Create a notifications context and update the notification dropdown to show live data."

### 4. Bug Fix ke liye:
"The sidebar collapse animation is laggy on mobile. Fix the performance issue and ensure smooth transitions."

### 5. Code Quality ke liye:
"Review my code and suggest improvements. Add proper TypeScript types, error handling, and optimize the components for better performance."

### 6. Testing ke liye:
"Write unit tests for the dashboard components using Jest and React Testing Library."

---

## How to Use:
1. Open ChatGPT
2. Copy the PROMPT section above
3. Replace "[DESCRIBE YOUR TASK HERE]" with your specific requirement
4. Paste and send
5. ChatGPT will understand your entire project and help you!
