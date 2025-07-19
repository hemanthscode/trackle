# Trackle – Advanced To-Do List App

🎯 **Project Objective**  
Trackle is a modern, feature-rich web-based to-do list application built with Bulma CSS framework. It provides an intuitive interface for task management with real-time statistics, filtering capabilities, and seamless data persistence through browser local storage.

## ✨ Features

### **Core Functionality**
- ➕ **Instant Task Addition** – Add tasks with Enter key or click  
- ✅ **Smart Toggle System** – Mark tasks complete/incomplete with visual feedback  
- ✏️ **Inline Editing** – Edit tasks directly with click-to-edit functionality  
- 🗑️ **Safe Deletion** – Delete tasks with confirmation dialogs  
- 💾 **Auto-Save** – Automatic persistence via `localStorage` with no data loss  

### **Advanced Features**
- 📊 **Real-time Statistics** – Live counters for total, completed, and remaining tasks  
- 🔍 **Smart Filtering** – Filter by All, Completed, or Pending tasks  
- 📱 **Fully Responsive** – Optimized for desktop, tablet, and mobile devices  
- ⚠️ **Input Validation** – Prevents empty tasks with user-friendly notifications  
- 🎨 **Modern UI/UX** – Gradient backgrounds, smooth animations, and hover effects  
- 💬 **Toast Notifications** – Success, warning, and error messages with auto-dismiss  
- 🎭 **Visual State Management** – Completed tasks show strikethrough styling  
- ⌨️ **Keyboard Shortcuts** – Enter to add, Escape to cancel editing  

## 📁 Project Structure

```
📦 trackle/
├── 📄 index.html          # Main app layout with Bulma framework
├── 🎨 styles.css          # Custom styling and responsive design
├── ⚙️ script.js           # ES6+ class-based app logic & storage
├── 📚 README.md           # Comprehensive project documentation
└── 📁 assets/             # Static resources
    ├── 🖼️ icons/          # Custom task icons
    └── 🖼️ images/         # App images and screenshots
```

## 🛠️ Tech Stack

### **Frontend Framework**
- **HTML5** – Semantic markup with accessibility features  
- **Bulma CSS** – Modern CSS framework for responsive design  
- **Font Awesome** – Professional icon library  
- **JavaScript ES6+** – Class-based architecture with modern features  

### **Data & Storage**
- **Browser Local Storage** – Client-side persistent task storage  
- **JSON Serialization** – Structured data format for task objects  

### **Development Tools**
- **CDN Integration** – Fast loading via Bulma and Font Awesome CDNs  
- **Responsive Design** – Mobile-first approach with Bulma's grid system  
- **Cross-browser Compatibility** – Works on all modern browsers  

## 🚀 Getting Started

### **Quick Setup**
1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Start Adding Tasks** – No server or installation required!

### **File Dependencies**
- Bulma CSS (v1.0.4) – Loaded via CDN
- Font Awesome (v6.4.0) – Loaded via CDN
- No build process or npm dependencies needed

## 🎮 How to Use

### **Adding Tasks**
- Type your task in the input field
- Press `Enter` or click the **Add** button
- Empty tasks are automatically rejected with notifications

### **Managing Tasks**
- **Complete**: Click the checkbox to mark tasks as done
- **Edit**: Click the edit icon (✏️) to modify task text
- **Delete**: Click the trash icon (🗑️) and confirm deletion

### **Filtering & Organization**
- Use **All**, **Completed**, or **Pending** buttons to filter tasks
- View live statistics for total, completed, and remaining tasks
- Tasks persist automatically – no manual saving required

## 🎨 UI/UX Design Features

### **Visual Design**[1]
- **Full-page Responsive Layout** – Optimized for all screen sizes
- **Modern Gradient Background** – Eye-catching purple-blue gradient
- **Clean Card-based Interface** – Tasks displayed in elegant cards
- **Smooth Animations** – Slide-in effects for new tasks and hover states

### **User Experience**
- **Intuitive Icons** – Clear visual indicators for all actions
- **Color-coded Feedback** – Success (green), warnings (yellow), errors (red)
- **Mobile-optimized** – Touch-friendly buttons and responsive layout
- **Keyboard Navigation** – Full keyboard accessibility support

## 🔧 Technical Implementation

### **Class-based Architecture**
```javascript
class TodoApp {
  // Modern ES6+ class structure
  // Modular method organization
  // Clean separation of concerns
}
```

### **Key Components**
- **Task Management** – CRUD operations with validation
- **Local Storage Handler** – Automatic save/load functionality
- **Filter System** – Dynamic task filtering with state management
- **Notification System** – Toast messages with auto-dismiss
- **Statistics Engine** – Real-time task counting and updates

## 📱 Responsive Breakpoints

| Screen Size | Layout Changes |
|-------------|---------------|
| **Desktop** (1024px+) | Full 8-column centered layout |
| **Tablet** (769px-1023px) | 10-column layout with adjusted spacing |
| **Mobile** (< 768px) | Single column, stacked buttons, compressed header |

## 🎯 Future Enhancements

### **Planned Features**
- 🎨 **Dark/Light Theme Toggle** – User preference customization
- 📅 **Due Date Support** – Calendar integration with overdue alerts  
- 🏷️ **Task Categories** – Color-coded task organization
- 🔍 **Search Functionality** – Find tasks by keyword
- 📊 **Productivity Analytics** – Task completion trends and insights
- ☁️ **Cloud Sync** – Backup tasks to cloud storage services

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for:
- Bug fixes and improvements
- New feature implementations  
- UI/UX enhancements
- Documentation updates


**Built with ❤️ using modern web technologies and Bulma CSS framework**