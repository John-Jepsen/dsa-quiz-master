# 🧠 DSA Quiz Master

An interactive Data Structures and Algorithms quiz application built with React, TypeScript, and Vite. Test your knowledge across various DSA topics with real-time progress tracking and leaderboards.

## 🚀 Features

- **Multi-topic Quizzes**: Test your knowledge on arrays, linked lists, trees, graphs, sorting algorithms, and more
- **User Authentication**: Personal profiles with progress tracking
- **Database Storage**: Persistent data storage using IndexedDB
- **Real-time Progress**: Track your performance across different topics
- **Leaderboards**: Compete with other users and see your rankings
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Offline Support**: Works offline with local database storage

## �️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Database**: IndexedDB (browser-based)
- **Styling**: Tailwind CSS, Radix UI
- **Build Tool**: Vite
- **Deployment**: GitHub Pages with GitHub Actions
- **State Management**: React Hooks + IndexedDB

## 🎯 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/John-Jepsen/dsa-quiz-master.git
cd dsa-quiz-master
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🗄️ Database

This application uses IndexedDB for client-side data storage, providing:

- **Persistent Storage**: Data survives browser restarts and updates
- **Offline Support**: Works without internet connection
- **Automatic Migration**: Seamlessly migrates from localStorage to IndexedDB
- **Data Export**: Backup functionality for user data
- **Development Tools**: Debug panel in development mode

For more details, see [DATABASE.md](DATABASE.md).

## 🌐 Live Demo

Visit the live application: [https://john-jepsen.github.io/dsa-quiz-master](https://john-jepsen.github.io/dsa-quiz-master)

## 🚀 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a new deployment.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
