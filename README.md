# TaskFlow

A modern, responsive task management web application built with vanilla JavaScript and Firebase. TaskFlow helps users stay organized and productive by providing an intuitive interface for managing daily tasks with categorization, progress tracking, and real-time synchronization.

## Features

### 🔐 Authentication
- **Google Sign-In**: Quick authentication using Google accounts
- **Email/Password**: Traditional sign-up and login with automatic account creation
- **Secure**: Firebase Authentication ensures user data security

### 📋 Task Management
- **Add Tasks**: Create new tasks with custom text and categories
- **Categories**: Organize tasks into Personal, Work, Shopping, and Health
- **Complete Tasks**: Mark tasks as done with visual feedback
- **Delete Tasks**: Remove unwanted tasks with confirmation
- **Real-time Sync**: Changes sync instantly across devices using Firestore

### 📊 Dashboard
- **Statistics Overview**: View total, active, and completed task counts
- **Progress Tracking**: Visual progress circle showing completion percentage
- **Filter Tasks**: Switch between All, Active, and Completed tasks
- **Date Display**: Current date shown in the header

### 🎨 User Interface
- **Modern Design**: Clean, minimal interface with Inter font
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme Ready**: CSS variables for easy theming
- **Icons**: RemixIcon integration for consistent iconography
- **Smooth Animations**: CSS transitions for interactive elements

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication & Firestore)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: RemixIcon
- **Fonts**: Google Fonts (Inter)

## Project Structure

```
TaskFlow/
├── index.html      # Main HTML structure
├── style.css       # Application styling
└── script.js       # Application logic and Firebase integration
```

## Setup and Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for Firebase services
- GitHub account (for cloning the repository)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Advaith7876/TaskFlow.git
   cd TaskFlow
   ```

2. **Open in browser:**
   - Open `index.html` in your web browser
   - Or serve via a local server for better experience

### Firebase Configuration

The app is pre-configured with Firebase settings. For production use:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Google and Email/Password providers)
3. Enable Firestore Database
4. Update the `firebaseConfig` object in `script.js` with your project credentials

## Usage

1. **Sign In**: Choose Google sign-in or enter email/password
2. **Add Tasks**: Type your task and select a category, then click "Add Task"
3. **Manage Tasks**: Click the checkbox to complete, or delete button to remove
4. **Filter**: Use the filter tabs to view All, Active, or Completed tasks
5. **Track Progress**: Monitor your productivity with the stats dashboard

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Firebase](https://firebase.google.com/) for backend services
- [RemixIcon](https://remixicon.com/) for beautiful icons
- [Google Fonts](https://fonts.google.com/) for typography
- [Inter Font](https://rsms.me/inter/) for modern typography

---

**Stay organized, stay productive with TaskFlow!** 🚀