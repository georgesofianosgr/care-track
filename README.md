# 📱 CareTrack - Daily Activity Tracker

A modern, mobile-first Progressive Web App (PWA) for tracking daily activities and building healthy habits. Built with React, TypeScript, and Tailwind CSS.

![CareTrack Demo](https://via.placeholder.com/800x400/3B82F6/ffffff?text=CareTrack+Demo)

## ✨ Features

### 🎯 Core Functionality
- **Activity Management**: Create, edit, and delete custom activities
- **Weekly Tracking**: Visual weekly grid with intuitive checkboxes
- **Flexible Scheduling**: Set different days for each activity
- **Progress Analytics**: Weekly and monthly completion statistics
- **Data Persistence**: All data saved locally in your browser

### 📱 Mobile-First Design
- **PWA Support**: Install as a native app on mobile devices
- **Responsive Layout**: Optimized for phones, tablets, and desktop
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Offline Capable**: Works without internet connection

### 🎨 User Experience
- **Clean Interface**: Modern, minimalist design
- **Week Navigation**: Easy browsing of past and future weeks
- **Collapsible Summary**: Quick overview of progress statistics
- **Confirmation Dialogs**: Safe deletion with confirmation prompts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/caretrack.git
   cd caretrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
# Build the app
npm run build

# Preview the build
npm run preview
```

## 📱 PWA Installation

### On Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Tap the "Share" button (iOS) or menu (Android)
3. Select "Add to Home Screen"
4. The app will appear as a native app icon

### On Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Follow the installation prompts

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Aria Components** - Accessible UI components
- **Vite** - Fast build tool and dev server

### PWA Features
- **Service Worker** - Offline caching
- **Web App Manifest** - Native app experience
- **LocalStorage** - Client-side data persistence

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ActivityModal.tsx    # Create/edit activity modal
│   └── WeeklyTracker.tsx    # Main tracking interface
├── hooks/               # Custom React hooks
│   └── useLocalStorage.ts   # LocalStorage management
├── utils/               # Utility functions
│   └── dateUtils.ts         # Date manipulation helpers
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🎨 Design Philosophy

### Mobile-First
- Designed primarily for mobile usage
- Touch-friendly interface elements
- Responsive breakpoints for larger screens

### Accessibility
- Screen reader compatible
- Keyboard navigation support
- High contrast color scheme
- Semantic HTML structure

### Performance
- Lightweight bundle size
- Optimized images and assets
- Efficient re-rendering
- Service worker caching

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type Checking
npm run type-check   # Run TypeScript compiler
```

### Code Style
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting (recommended)

### Adding New Features

1. **Components**: Add new components in `src/components/`
2. **Types**: Define TypeScript types in `src/types.ts`
3. **Utilities**: Add helper functions in `src/utils/`
4. **Hooks**: Create custom hooks in `src/hooks/`

## 🗂️ Data Structure

### Activity
```typescript
interface Activity {
  id: string;
  name: string;
  days: number[]; // 0-6 (Sunday to Saturday)
}
```

### Activity Completion
```typescript
interface ActivityCompletion {
  activityId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}
```

## 🌟 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Write TypeScript for all new code
- Follow the existing component structure
- Add proper error handling
- Test on mobile devices
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/caretrack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/caretrack/discussions)

## 🎯 Roadmap

### Planned Features
- [ ] Data export (CSV, JSON)
- [ ] Activity templates
- [ ] Streak tracking
- [ ] Reminder notifications
- [ ] Data backup/sync
- [ ] Dark mode support
- [ ] Activity categories
- [ ] Goal setting

### Performance Improvements
- [ ] Virtual scrolling for large datasets
- [ ] Image optimization
- [ ] Bundle size optimization
- [ ] Enhanced caching strategies

---

**Built with ❤️ for building better habits**

*CareTrack helps you maintain consistency in your daily activities, one check at a time.*