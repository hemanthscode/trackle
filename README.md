# Trackle - Terminal Task Manager

> A sleek, cyberpunk-inspired task management application with a terminal interface aesthetic

## Overview

Trackle is a modern, terminal-themed task manager that combines the nostalgic appeal of command-line interfaces with contemporary web technologies. Built with vanilla JavaScript, HTML5, and CSS3, it offers a clean, efficient way to manage your tasks while providing an immersive terminal experience.

## Features

### Core Functionality
- **Task Management**: Add, edit, delete, and toggle task completion
- **Smart Filtering**: View all tasks, pending tasks, or completed tasks
- **Persistent Storage**: Tasks are automatically saved to local storage
- **Bulk Operations**: Clear all completed tasks with confirmation modal

### User Experience
- **Terminal Aesthetic**: Authentic command-line interface design with blinking cursor
- **Modal Dialogs**: Clean modal interfaces for editing and deletion confirmations
- **Toast Notifications**: Non-intrusive success/error messages with auto-dismiss
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation**: Full keyboard support with ESC key modal dismissal

### Technical Features
- **XSS Protection**: Secure HTML sanitization prevents code injection
- **Input Validation**: Comprehensive validation with duplicate detection
- **Performance Optimized**: Efficient DOM manipulation and event handling
- **Accessibility Ready**: ARIA labels and screen reader support
- **Cross-Browser Compatible**: Works on all modern browsers

## Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, but recommended for development)

### Quick Start

1. **Download the project files**
   ```bash
   git clone https://github.com/yourusername/trackle-task-manager.git
   cd trackle-task-manager
   ```

2. **File structure should look like this:**
   ```
   trackle/
   ├── index.html
   ├── styles/
   │   └── styles.css
   ├── scripts/
   │   └── app.js
   └── assets/
       └── icons/
           └── favicon.ico
   ```

3. **Open in browser**
   - **Option A**: Double-click `index.html` to open directly in browser
   - **Option B**: Use a local server (recommended)
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (with http-server)
     npx http-server
     
     # Then visit http://localhost:8000
     ```

## Usage

### Basic Operations

#### Adding Tasks
1. Type your task in the input field after the `root@trackle:~$` prompt
2. Press Enter or click the "Add" button
3. Task appears at the top of the list

#### Managing Tasks
- **Complete Task**: Click the checkbox next to any task
- **Edit Task**: Hover over a task and click the "Edit" button
- **Delete Task**: Hover over a task and click the "Del" button
- **Clear Completed**: Click "Clear Done" button when you have completed tasks

#### Filtering Tasks
Use the filter buttons to view different task sets:
- **All**: Shows all tasks (default)
- **Pending**: Shows only incomplete tasks
- **Done**: Shows only completed tasks

### Keyboard Shortcuts
- **Escape**: Close any open modal
- **Enter**: Confirm actions in modals
- **Tab**: Navigate through interface elements

### Data Persistence
- Tasks are automatically saved to browser's local storage
- Data persists between browser sessions
- No server or account required

## File Structure

```
trackle/
├── index.html              # Main HTML structure
├── styles/
│   └── styles.css          # All styling and responsive design
├── scripts/
│   └── app.js              # Application logic and functionality
├── assets/
│   └── icons/
│       └── favicon.ico     # Browser tab icon
└── README.md               # Project documentation
```

### Key Components

#### HTML Structure
- Semantic HTML5 markup
- Accessibility attributes (ARIA labels)
- Modal dialogs for confirmations
- Toast notification container

#### CSS Architecture
- CSS Custom Properties (variables) for theming
- Flexbox layout system
- Mobile-first responsive design
- Terminal-inspired color scheme and typography

#### JavaScript Classes
- `TodoApp`: Main application class
- Modular method organization
- Event-driven architecture
- Local storage integration

## Technologies Used

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Styling, animations, and responsive design
- **Vanilla JavaScript (ES6+)**: Application logic and DOM manipulation

### External Dependencies
- **Font Awesome 6.4.0**: Icons and visual elements (loaded via CDN with integrity check)

### Browser APIs
- **Local Storage API**: Data persistence
- **DOM API**: Dynamic content manipulation
- **Event API**: User interaction handling

## Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome  | 60+            | ✅ Fully Supported |
| Firefox | 55+            | ✅ Fully Supported |
| Safari  | 12+            | ✅ Fully Supported |
| Edge    | 79+            | ✅ Fully Supported |

## Security Features

### Input Sanitization
- HTML content is sanitized to prevent XSS attacks
- Special characters are properly escaped
- User input validation and length limits

### External Resources
- Font Awesome loaded with SHA-512 integrity check
- Subresource Integrity (SRI) protection
- CORS headers for secure external resource loading

## Performance Optimizations

### Client-Side
- Efficient DOM manipulation with document fragments
- Event delegation for dynamic content
- Debounced input handling
- Minimal reflows and repaints

### Loading
- Optimized CSS and JavaScript file sizes
- Font preloading for better performance
- Minimal external dependencies

## Customization

### Theming
The application uses CSS custom properties for easy theming. Key variables include:

```css
:root {
  --primary: #00ff88;      /* Main accent color */
  --accent: #ff9500;       /* Secondary accent */
  --error: #ff4757;        /* Error states */
  --success: #4caf50;      /* Success states */
  --bg-dark: #0a0e27;      /* Dark background */
  --bg-black: #000;        /* Pure black backgrounds */
}
```

### Configuration
Modify these constants in `app.js` to customize behavior:

```javascript
const CONFIG = {
  MAX_TASK_LENGTH: 100,           // Maximum characters per task
  LOCAL_STORAGE_KEY: 'trackle-tasks', // Storage key name
  TOAST_DURATION: 4000            // Toast display time (ms)
};
```

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly across different browsers
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards
- Use ES6+ JavaScript features
- Follow semantic HTML practices
- Maintain consistent CSS naming conventions
- Add comments for complex logic
- Ensure responsive design compatibility

### Bug Reports
When reporting bugs, please include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Terminal design inspired by classic command-line interfaces
- Color scheme influenced by cyberpunk aesthetics
- Icons provided by Font Awesome
- Built with modern web standards and best practices

## Roadmap

### Planned Features
- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] Import/export functionality
- [ ] Keyboard shortcuts overlay
- [ ] Dark/light theme toggle
- [ ] Task search functionality
- [ ] Drag and drop reordering

### Known Issues
- Local storage has browser-imposed size limits
- No synchronization across devices (local only)

**Made with ❤️ by the Trackle Team**
