# 🎨 Kitchensink Modernized - Frontend

A modern, responsive React frontend for the Kitchensink application, built with React 18, Vite, and Tailwind CSS. Features include JWT authentication, role-based access control, internationalization, real-time job tracking, and a beautiful, accessible UI.

> **Project Context:** This is the frontend for the MongoDB Modernization Factory Developer Candidate Challenge, showcasing modern React development practices and enterprise-grade features.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [Key Features Deep Dive](#-key-features-deep-dive)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Core Features
- ✅ **Member Management** - Create, read, update, delete members with validation
- ✅ **Search & Pagination** - Real-time search with paginated results
- ✅ **Form Validation** - Client-side validation with user-friendly error messages
- ✅ **Responsive Design** - Mobile-first, works on all screen sizes

### Authentication & Security
- ✅ **JWT Authentication** - Secure login with access and refresh tokens
- ✅ **Token Auto-Refresh** - Seamless token renewal (transparent to user)
- ✅ **Role-Based UI** - Different views for Admin, User, and Viewer roles
- ✅ **Session Management** - View and revoke active sessions from multiple devices
- ✅ **Protected Routes** - Automatic redirection for unauthorized access

### Advanced Features
- ✅ **Internationalization (i18n)** - Support for English, Hindi, and Spanish
- ✅ **Language Selector** - Switch languages on-the-fly
- ✅ **Bulk Operations** - Select and delete multiple members at once
- ✅ **Excel Upload** - Bulk import members from Excel files
- ✅ **Background Jobs** - Track async operations with real-time progress
- ✅ **Job Sidebar** - See all background jobs with status indicators
- ✅ **Recent Activity Feed** - Real-time activity log
- ✅ **Quick Stats Dashboard** - Member counts and quick actions
- ✅ **Smart Delete** - Single item = immediate, multiple = background job

### User Experience
- ✅ **Modern UI** - Beautiful gradient design with smooth animations
- ✅ **Toast Notifications** - Success/error messages with react-hot-toast
- ✅ **Loading States** - Skeleton screens and spinners
- ✅ **Optimistic Updates** - Instant UI feedback
- ✅ **Keyboard Navigation** - Full keyboard accessibility
- ✅ **Dark Mode Compatible** - Styled for both light and dark themes

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.2** - Latest React with concurrent features
- **Vite 5.x** - Lightning-fast build tool
- **React Router 6** - Client-side routing with v6 API

### Styling
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library (800+ icons)
- **Custom Design System** - Consistent colors, spacing, and components

### State Management & Data
- **React Context** - Global state (auth, user)
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Toast notifications

### Internationalization
- **react-i18next** - i18n framework
- **i18next** - Translation management
- **date-fns** - Date localization

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (v18.0.0 or higher)
  ```bash
  node -v  # Should show v18.x or higher
  ```
- **npm 9+** (comes with Node.js)
  ```bash
  npm -v
  ```
- **Backend Running** - The Spring Boot backend must be running on port 8081

---

### Installation

#### Option 1: Automatic (with backend startup script)

```bash
# Clone frontend repository
git clone https://github.com/nitinkumaragarwal0896-arch/kitchensink-frontend.git

# The backend's start-all.sh script will automatically find and start the frontend
cd ../kitchensink-modernized
./start-all.sh
```

#### Option 2: Manual Installation

```bash
# Clone repository
git clone https://github.com/nitinkumaragarwal0896-arch/kitchensink-frontend.git
cd kitchensink-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:3000**

---

### Default Credentials

Use these credentials to log in:

| Username | Password | Role | Access |
|----------|----------|------|--------|
| `admin` | `Admin@2024` | ADMIN | Full access - manage members, users, roles |
| `user` | `User@2024` | USER | Create, read, update members |
| `viewer` | `Viewer@2024` | VIEWER | Read-only access |

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:8081

# API Version
VITE_API_VERSION=v1

# Default Language
VITE_DEFAULT_LANGUAGE=en

# Feature Flags
VITE_ENABLE_DARK_MODE=false
VITE_ENABLE_ANALYTICS=false
```

### Vite Configuration

The project uses Vite for blazing-fast development:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
})
```

---

## 🏗️ Project Structure

```
kitchensink-frontend/
├── public/                        # Static assets
│   └── favicon.ico
├── src/
│   ├── assets/                    # Images, fonts, etc.
│   ├── components/                # Reusable components
│   │   ├── Layout.jsx             # Main layout with sidebar & header
│   │   ├── Modal.jsx              # Reusable modal component
│   │   ├── LanguageSelector.jsx  # Language switcher
│   │   ├── JobsSidebar.jsx        # Background jobs sidebar
│   │   ├── JobDetailsModal.jsx    # Job details popup
│   │   ├── RecentActivity.jsx     # Activity feed
│   │   └── QuickStats.jsx         # Stats cards
│   ├── context/                   # React Context
│   │   └── AuthContext.jsx        # Auth state & token management
│   ├── pages/                     # Page components
│   │   ├── LoginPage.jsx          # Login form
│   │   ├── DashboardPage.jsx      # Dashboard with stats & recent members
│   │   ├── MembersPage.jsx        # Member list with CRUD operations
│   │   ├── AdminUsersPage.jsx     # User management (admin only)
│   │   ├── AdminRolesPage.jsx     # Role management (admin only)
│   │   └── ActiveSessionsPage.jsx # Session management
│   ├── services/                  # API services
│   │   └── api.js                 # Axios instance & API methods
│   ├── utils/                     # Utility functions
│   │   └── validation.js          # Form validation helpers
│   ├── i18n.js                    # i18n configuration
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles & Tailwind imports
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Example environment file
├── package.json                   # Dependencies
├── tailwind.config.js             # Tailwind configuration
├── vite.config.js                 # Vite configuration
└── README.md                      # This file
```

---

## 🎯 Key Features Deep Dive

### 1. Authentication Flow

```
┌─────────────────────────────────────────────────┐
│  User enters username & password                │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  POST /api/v1/auth/login                        │
│  Response: { accessToken, refreshToken }        │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Tokens stored in localStorage                  │
│  User state stored in AuthContext               │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Every API request includes:                    │
│  Authorization: Bearer <accessToken>            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Token expires (1 hour)                         │
│  → Axios interceptor catches 401                │
│  → Calls /api/v1/auth/refresh with refreshToken│
│  → Gets new accessToken                         │
│  → Retries original request                     │
│  → User never notices! ✅                        │
└─────────────────────────────────────────────────┘
```

### 2. Internationalization

**Switching Languages:**
```jsx
// Language selector in header
<LanguageSelector />

// Using translations in components
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome', { name: 'John' })}</h1>
      <p>{t('dashboard.subtitle')}</p>
    </div>
  );
}
```

**Supported Languages:**
- 🇬🇧 English (en)
- 🇮🇳 Hindi (hi)
- 🇪🇸 Spanish (es)

### 3. Bulk Operations with Job Tracking

```javascript
// User selects multiple members and clicks "Delete Selected"
const handleBulkDelete = async (memberIds) => {
  // Start bulk delete job
  const response = await memberAPI.bulkDelete(memberIds);
  
  // Response: { jobId: "67890def...", status: "PENDING" }
  toast.success(`Bulk delete job created for ${memberIds.length} members`);
  
  // JobsSidebar automatically starts polling for job status
  // Shows real-time progress: 0% → 25% → 50% → 100%
  // User can continue using the app while job runs in background!
};
```

### 4. Excel Upload

```jsx
// User uploads Excel file
<input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

// Process file
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  
  // Upload to backend
  const response = await memberAPI.excelUpload(file);
  
  // Background job created
  // Job sidebar shows progress
  // When complete, member list auto-refreshes
};
```

### 5. Real-Time Job Tracking

The `JobsSidebar` component polls for job updates:

```javascript
// Polling logic
useEffect(() => {
  const hasActiveJobs = jobs.some(
    job => job.status === 'IN_PROGRESS' || job.status === 'PENDING'
  );
  
  // Poll every 0.5s if active jobs, every 2s otherwise
  const pollInterval = hasActiveJobs ? 500 : 2000;
  
  const interval = setInterval(() => {
    fetchJobs();
  }, pollInterval);
  
  return () => clearInterval(interval);
}, [jobs]);
```

**Job Status Indicators:**
- 🟡 **PENDING** - Yellow, pulsing
- 🔄 **IN_PROGRESS** - Yellow, spinning icon, shows progress %
- ✅ **COMPLETED** - Green, check icon
- ❌ **FAILED** - Red, X icon

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Development Workflow

1. **Start Backend First**
   ```bash
   cd kitchensink-modernized
   ./start-all.sh
   ```

2. **Make Changes to Frontend**
   - Vite will hot-reload changes automatically
   - No page refresh needed!

3. **Check Console for Errors**
   - Browser DevTools (F12)
   - Look for API errors, validation issues

4. **Test Authentication**
   - Try logging in as different users (admin, user, viewer)
   - Check role-based UI changes

5. **Test Internationalization**
   - Switch languages using the selector in header
   - Verify all text translates correctly

---

## 🧪 Testing

### Manual Testing Checklist

<details>
<summary><b>Authentication</b></summary>

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show error)
- [ ] Logout (should clear tokens and redirect to login)
- [ ] Token auto-refresh on expiry
- [ ] Session management (view active sessions)
- [ ] Logout from specific device
- [ ] Logout from all devices
</details>

<details>
<summary><b>Member Management</b></summary>

- [ ] View member list
- [ ] Search members by name/email/phone
- [ ] Pagination (next/previous page)
- [ ] Create new member with valid data
- [ ] Create member with invalid data (should show validation errors)
- [ ] Update existing member
- [ ] Delete single member (immediate deletion)
- [ ] Bulk delete multiple members (background job)
- [ ] Excel upload (bulk import)
</details>

<details>
<summary><b>Internationalization</b></summary>

- [ ] Switch to Hindi - verify UI text changes
- [ ] Switch to Spanish - verify UI text changes
- [ ] Switch back to English
- [ ] Check dates are formatted correctly for each language
- [ ] Verify backend messages are localized
</details>

<details>
<summary><b>Background Jobs</b></summary>

- [ ] Start bulk delete job - verify it appears in sidebar
- [ ] Job shows progress (0% → 100%)
- [ ] Job status icon changes (pending → in-progress → completed)
- [ ] Click job to see details (success/failed items)
- [ ] Cancel pending job
- [ ] Delete completed job
- [ ] Member list auto-refreshes when job completes
</details>

<details>
<summary><b>Role-Based Access</b></summary>

- [ ] Login as ADMIN - see all features
- [ ] Login as USER - see limited features (no admin menu)
- [ ] Login as VIEWER - read-only access (no edit/delete buttons)
- [ ] Try accessing admin routes as USER (should be blocked)
</details>

---

## 🚀 Deployment

### Build for Production

```bash
# Create production build
npm run build

# Output: dist/ directory
# - Optimized and minified
# - Ready for deployment
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Netlify Configuration:**

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_BASE_URL = "https://your-backend.herokuapp.com"
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Deploy to Docker

<details>
<summary><b>Dockerfile</b></summary>

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
</details>

<details>
<summary><b>nginx.conf</b></summary>

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://backend:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
</details>

**Build and run:**
```bash
docker build -t kitchensink-frontend .
docker run -d -p 3000:80 kitchensink-frontend
```

---

## 🔧 Troubleshooting

<details>
<summary><b>Backend Connection Issues</b></summary>

**Problem:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solutions:**
```bash
# 1. Check if backend is running
curl http://localhost:8081/actuator/health

# 2. Check CORS configuration in backend
# Ensure SecurityConfig.java has:
# .cors(cors -> cors.configurationSource(corsConfigurationSource()))

# 3. Update API base URL in src/services/api.js
const BASE_URL = 'http://localhost:8081';
```
</details>

<details>
<summary><b>Token Refresh Loop</b></summary>

**Problem:** Infinite loop of token refresh requests

**Solutions:**
```javascript
// Check Axios interceptor in src/services/api.js
// Ensure _retry flag is set correctly:
if (error.response?.status === 401 && !error.config._retry) {
  error.config._retry = true;  // ← IMPORTANT!
  // ... refresh logic ...
}
```
</details>

<details>
<summary><b>Language Not Changing</b></summary>

**Problem:** Clicking language selector doesn't change text

**Solutions:**
```javascript
// 1. Check browser console for i18n errors
// 2. Verify translation files exist:
//    src/i18n.js should have:
const resources = {
  en: { translation: { /* ... */ } },
  hi: { translation: { /* ... */ } },
  es: { translation: { /* ... */ } }
};

// 3. Check component is using useTranslation:
const { t } = useTranslation();
```
</details>

<details>
<summary><b>Excel Upload Fails</b></summary>

**Problem:** Excel upload returns error

**Solutions:**
```bash
# 1. Check file format (.xlsx or .xls)
# 2. Check file structure (columns: Name, Email, Phone)
# 3. Check backend logs for validation errors
# 4. Verify user has member:create permission
```
</details>

<details>
<summary><b>Jobs Not Showing in Sidebar</b></summary>

**Problem:** Background jobs don't appear

**Solutions:**
```javascript
// 1. Check if JobsSidebar is rendered
// 2. Check console for API errors
// 3. Verify polling is working:
//    Should see GET /api/v1/jobs requests every 0.5-2s
// 4. Check if user is authenticated
```
</details>

---

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef3f2',
          100: '#fee4e2',
          // ... your custom colors
          900: '#7f1d1d',
        }
      }
    }
  }
}
```

### Adding New Language

1. **Add translation file** in `src/i18n.js`:
```javascript
const resources = {
  // ... existing languages ...
  fr: {
    translation: {
      dashboard: {
        welcome: 'Bienvenue, {{name}}!',
        // ... more translations
      }
    }
  }
};
```

2. **Add to language selector** in `src/components/LanguageSelector.jsx`:
```jsx
const languages = [
  // ... existing ...
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];
```

---

## 📚 Learn More

### React + Vite Resources
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)

### Libraries Used
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [React Hot Toast](https://react-hot-toast.com)
- [react-i18next](https://react.i18next.com)
- [Axios](https://axios-http.com)

---

## 🤝 Contributing

This is a showcase project for MongoDB Modernization Factory Developer Candidate Challenge.

---

## 📝 License

This project is created for MongoDB Modernization Factory Developer Candidate Challenge.

---

## 👤 Author

**Nitin Agarwal**
- GitHub: [@nitinkumaragarwal0896-arch](https://github.com/nitinkumaragarwal0896-arch)
- Frontend Repo: [kitchensink-frontend](https://github.com/nitinkumaragarwal0896-arch/kitchensink-frontend)
- Backend Repo: [kitchensink-modernized](https://github.com/nitinkumaragarwal0896-arch/kitchensink-modernized)

---

## 🙏 Acknowledgments

- MongoDB team for the Modernization Factory challenge
- React team for an amazing framework
- Vite team for blazing-fast tooling
- Tailwind CSS team for the utility-first approach
- Open source community for incredible libraries

---

**Need Help?** Check the [Troubleshooting](#-troubleshooting) section or create an issue on GitHub!
