# Galeria App - Profesjonalna Platforma Zarządzania Zdjęciami

Zaawansowana aplikacja galerii fotograficznej z integracją Google Drive, zaprojektowana dla fotografów i agencji kreatywnych. Projekt demonstruje pełny stack nowoczesnych technologii webowych z naciskiem na wydajność, bezpieczeństwo i user experience.

## Przegląd techniczny

Aplikacja stanowi kompleksowe rozwiązanie do zarządzania galeriami fotograficznymi z automatyczną optymalizacją obrazów. Implementuje zaawansowane wzorce architektoniczne, w tym Server Components, background processing oraz secure API design. System obsługuje workflow od uploadu zdjęć, przez kompresję w tle, po zarządzanie uprawnieniami użytkowników.

## Kluczowe osiągnięcia techniczne

### 🔐 **Zaawansowana architektura autoryzacji**

- Implementacja OAuth 2.0 z Google z custom authorization flow
- Role-based access control z mapowaniem użytkowników do zasobów Google Drive
- Session management z NextAuth.js i secure token handling
- Middleware autoryzacyjne dla wszystkich API endpoints

### 📸 **Inteligentne zarządzanie mediami**

- Real-time upload z progress tracking i error handling
- Batch processing dla operacji na wielu plikach jednocześnie
- Automatyczne organizowanie zasobów z timestamp-based naming
- Dynamic album cover management z visual feedback

### 🖼️ **Optymalizacja obrazów i performance**

- Background image compression z Sharp (resize do 1920px, 80% jakość JPEG)
- Lazy loading z intersection observer API
- Progressive image enhancement z thumbnail-to-fullsize workflow
- Memory-efficient streaming dla dużych plików
- Client-side caching strategii dla thumbnails

### 🎨 **Advanced UI/UX Implementation**

- Fully responsive design z mobile-first approach
- Keyboard navigation support (←/→, Escape, Tab navigation)
- Modal system z focus management i accessibility compliance
- Toast notification system z queue management
- Loading states i optimistic UI updates
- Gesture support dla touch devices

### ⚡ **Performance i skalowałność**

- Server Components dla reduced JavaScript bundle size
- Streaming responses dla improved perceived performance
- Background task processing z job queue implementation
- API rate limiting i error boundary handling
- Image optimization z Next.js Image component

## Stack technologiczny i implementacja

### **Frontend Architecture**

- **Next.js 15.3.4** - App Router z Server Components, Streaming, Parallel Routes
- **React 19** - Concurrent Features, useTransition, useOptimistic hooks
- **TypeScript** - Strict mode, advanced type patterns, generic constraints
- **Tailwind CSS 4** - Custom design system, responsive utilities, dark mode ready

### **Backend & Cloud Integration**

- **Next.js API Routes** - RESTful API design, middleware composition
- **Google Drive API v3** - File operations, permissions management, streaming uploads
- **Google OAuth 2.0** - Service Account authentication, token refresh logic
- **Sharp** - High-performance image processing, memory optimization

### **Development & Quality Assurance**

- **ESLint** - Custom rules, code quality enforcement
- **TypeScript** - Type safety, interface design, generic programming
- **Git Hooks** - Pre-commit validation, conventional commits
- **Error Boundaries** - Graceful error handling, user feedback

## Wzorce architektoniczne

### **Clean Architecture Implementation**

```
├── Presentation Layer (UI Components, Pages)
├── Application Layer (API Routes, Business Logic)
├── Domain Layer (Types, Interfaces, Business Rules)
└── Infrastructure Layer (Google APIs, External Services)
```

### **Design Patterns Used**

- **Repository Pattern** - Data access abstraction dla Google Drive
- **Factory Pattern** - Service client creation i configuration
- **Observer Pattern** - Real-time UI updates, progress tracking
- **Command Pattern** - Background task processing
- **Middleware Pattern** - Request/response pipeline w API routes

## Funkcjonalności biznesowe

### **Multi-tenant Architecture**

- Izolacja danych per klient z folder-based segregation
- Scalable permission system obsługujący różne role użytkowników
- Automated data organization z intelligent naming conventions

### **Advanced Image Processing Pipeline**

- **Background compression** - Asynchronous job processing z Sharp
- **Batch operations** - Bulk compression z progress tracking
- **Format optimization** - JPEG compression z quality control
- **Thumbnail generation** - Multiple size variants dla różnych kontekstów

### **User Experience Innovations**

- **Keyboard-first navigation** - Full accessibility compliance
- **Touch gesture support** - Swipe navigation, pinch-to-zoom ready
- **Progressive enhancement** - Graceful fallbacks, no-JS compatibility
- **Real-time feedback** - Toast notifications, loading states, error handling

## Integracje zewnętrzne

### **Google Cloud Platform**

```typescript
// Service Account authentication z credential management
const auth = new google.auth.GoogleAuth({
	keyFile: path.join(process.cwd(), 'google-credentials.json'),
	scopes: ['https://www.googleapis.com/auth/drive'],
})

// Drive API client z error handling i retry logic
const drive = google.drive({ version: 'v3', auth })
```

### **NextAuth.js Custom Implementation**

```typescript
// Custom signIn callback z role-based access control
callbacks: {
  async signIn({ user }) {
    return clientFolderMapping.hasOwnProperty(user.email) || false
  }
}
```

## Architektura komponentów

### **Core Application Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # RESTful API endpoints
│   ├── components/        # Reusable UI components
│   ├── dashboard/         # Client dashboard feature
│   └── album/[id]/        # Dynamic album routes
├── lib/                   # Business logic & utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── drive.ts          # Google Drive API client
│   ├── permissions.ts    # Access control logic
│   └── background-tasks.ts # Async job processing
└── types/                # TypeScript definitions
```

### **Key Components & Features**

#### **PhotoGrid Component**

- **Virtual scrolling** dla performance z dużymi albumami
- **Intersection Observer** lazy loading implementation
- **Keyboard navigation** z focus management
- **Modal system** z backdrop click handling i escape key support

#### **Background Task System**

```typescript
// Asynchronous image compression pipeline
export async function startBackgroundCompression(albumId: string) {
	// Job queuing, progress tracking, error recovery
	const photosToCompress = await getUncompressedPhotos(albumId)

	for (const photo of photosToCompress) {
		await compressAndReplace(photo)
	}
}
```

#### **API Architecture**

- **RESTful design** z proper HTTP methods i status codes
- **Middleware composition** dla authentication, validation, error handling
- **Streaming responses** dla large file operations
- **Rate limiting** i abuse prevention

## Performance Metrics

### **Core Web Vitals Optimization**

- **LCP (Largest Contentful Paint)** < 2.5s przez image optimization
- **FID (First Input Delay)** < 100ms z code splitting
- **CLS (Cumulative Layout Shift)** < 0.1 przez proper image sizing

### **Technical Achievements**

- **Bundle size optimization** - Code splitting, tree shaking
- **Memory management** - Proper cleanup, garbage collection
- **Caching strategies** - Browser cache, CDN optimization
- **Error boundaries** - Graceful degradation, user feedback

## Security Implementation

### **Authentication & Authorization**

- **OAuth 2.0** implementation z Google provider
- **JWT token management** z secure cookie handling
- **Role-based access control** z granular permissions
- **CSRF protection** w form submissions

### **Data Protection**

- **Input validation** na wszystkich endpoints
- **SQL injection prevention** (choć używamy NoSQL w Google Drive)
- **XSS protection** przez proper escaping
- **Secure headers** implementation

## Umiejętności techniczne zaprezentowane

### **Full-Stack Development**

- **Frontend**: React 19, Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Node.js, RESTful API design, Google Cloud integration
- **Database**: Google Drive API jako storage layer z custom query optimization

### **Cloud & DevOps**

- **Google Cloud Platform**: Drive API, OAuth 2.0, Service Accounts
- **Performance Optimization**: Image compression, lazy loading, caching strategies
- **Security**: Authentication flows, permission management, data protection

### **Advanced Programming Concepts**

- **Asynchronous Programming**: Background tasks, job queues, streaming
- **Design Patterns**: Repository, Factory, Observer, Middleware patterns
- **Architecture**: Clean Architecture, separation of concerns, modular design

### **User Experience Engineering**

- **Accessibility**: WCAG compliance, keyboard navigation, screen reader support
- **Performance**: Core Web Vitals optimization, progressive enhancement
- **Mobile-First**: Responsive design, touch gestures, cross-device compatibility

---

## Kontakt

**Bartosz** - Full-Stack Developer  
📧 Email: [kontakt]  
🔗 Portfolio: [link]  
💼 LinkedIn: [profil]

---

_Projekt komercyjny - kod źródłowy dostępny na życzenie dla potencjalnych pracodawców i klientów._
