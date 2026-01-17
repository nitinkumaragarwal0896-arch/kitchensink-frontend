# Kitchensink Frontend

Modern React frontend for the Kitchensink Modernized application, featuring a clean UI with authentication, member management, and admin capabilities.

## 🎨 Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with automatic token refresh
- **React Hot Toast** - Notifications
- **Lucide React** - Beautiful icons
- **Date-fns** - Date formatting

## ✨ Features

### User Features
- ✅ **Authentication** - Login/Register with JWT
- ✅ **Member Management** - CRUD operations for members
- ✅ **Session Management** - View and manage active sessions across devices
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Real-time Validation** - Form validation with helpful error messages

### Admin Features
- ✅ **User Management** - Create, enable/disable, unlock users
- ✅ **Role Management** - Create and assign roles with granular permissions
- ✅ **Permission System** - Fine-grained RBAC (member:read, user:create, etc.)
- ✅ **Dashboard** - Overview of members and system stats

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn
- Backend API running on http://localhost:8081

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### 3. Login

Use the default credentials:
- **Admin**: `admin` / `admin123` (full access)
- **User**: `user` / `user12345` (read/write members)

## 📦 Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

## 🏗️ Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx          # Main layout with sidebar
│   │   └── ProtectedRoute.jsx  # Auth guard for routes
│   ├── context/         # React context providers
│   │   └── AuthContext.jsx     # Authentication state
│   ├── pages/           # Page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── MembersPage.jsx
│   │   ├── ActiveSessionsPage.jsx
│   │   ├── AdminUsersPage.jsx
│   │   └── AdminRolesPage.jsx
│   ├── services/        # API services
│   │   └── api.js              # Axios instance + API endpoints
│   ├── App.jsx          # Root component with routes
│   ├── index.css        # Global styles + Tailwind
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
└── package.json         # Dependencies
```

## 🔧 Configuration

### Backend API URL

The frontend proxies API requests to the backend. Update `vite.config.js` if your backend runs on a different port:

```javascript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',  // ← Change this if needed
        changeOrigin: true
      }
    }
  }
})
```

### Environment Variables (Optional)

Create a `.env` file for custom configuration:

```env
VITE_API_BASE_URL=http://localhost:8081
```

## 📱 Key Features Explained

### Automatic Token Refresh

The app automatically refreshes expired access tokens using refresh tokens:

```javascript
// In api.js - Axios interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/api/v1/auth/refresh', { refreshToken });
      
      // Retry original request with new token
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

### Session Management

Users can view all active sessions and revoke them:
- Current session is highlighted with a blue ring
- Warning when deleting current session
- Automatic logout if current session is revoked
- Shows device info, IP, and last activity

### Permission-Based UI

Components conditionally render based on user permissions:

```javascript
import { useAuth } from '../context/AuthContext';

function MembersPage() {
  const { hasPermission } = useAuth();
  
  return (
    <>
      {hasPermission('member:read') && <MembersList />}
      {hasPermission('member:create') && <CreateButton />}
    </>
  );
}
```

## 🎨 UI Components

### Color Scheme

```javascript
// tailwind.config.js - Brand colors
colors: {
  brand: {
    50: '#fef2f2',
    // ...
    600: '#dc2626',  // Primary red
  },
  surface: {
    // Neutral grays for backgrounds
  }
}
```

### Animations

The app uses Tailwind animations for smooth transitions:
- `animate-fade-in` - Page transitions
- `animate-spin` - Loading spinners
- Staggered delays for list items

## 🧪 Development Tips

### Hot Module Replacement (HMR)

Vite provides instant HMR - changes reflect immediately without full page reload.

### React DevTools

Install React DevTools browser extension for debugging:
- Chrome: [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Firefox: [React DevTools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### API Testing

Use the browser DevTools Network tab to inspect API calls, or use the backend Swagger UI:
- http://localhost:8081/swagger-ui/index.html

## 🐛 Troubleshooting

### Issue: "Failed to fetch members"

**Solution:** Ensure the backend is running on port 8081:
```bash
cd ../kitchensink-modernized
./start-all.sh
```

### Issue: "Login failed" or "Access denied"

**Solution:** 
1. Check your credentials (admin/admin123, user/user12345)
2. Verify the backend is running
3. Clear localStorage and try again:
   ```javascript
   localStorage.clear()
   window.location.reload()
   ```

### Issue: Blank page after login

**Solution:**
1. Check browser console for errors
2. Verify API endpoints return data:
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:8081/api/v1/members
   ```

### Issue: Token refresh fails

**Solution:** Refresh tokens are valid for 7 days. If expired, login again.

## 📚 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Security Considerations

### Token Storage

Access and refresh tokens are stored in `localStorage`:
- ✅ Simple and works across tabs
- ❌ Vulnerable to XSS attacks

**For production**, consider:
- Using `httpOnly` cookies for tokens
- Implementing Content Security Policy (CSP)
- Adding CSRF protection

### API Security

- All API calls include JWT token in `Authorization` header
- Tokens are refreshed automatically before expiry
- Revoked sessions are cleaned up server-side

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables for Production

Set these in your hosting platform:
```
VITE_API_BASE_URL=https://your-backend-api.com
```

## 📄 License

This project is part of the Kitchensink Modernization initiative.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## 📞 Support

For issues or questions:
- Check the [Backend README](https://github.com/nitinkumaragarwal0896-arch/kitchensink-modernized)
- Open an issue on GitHub

---

Built with ❤️ using React + Vite + Tailwind CSS
