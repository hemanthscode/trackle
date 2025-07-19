class TodoApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    this.currentFilter = 'all';
    this.editingTaskId = null;
    
    this.initializeElements();
    this.bindEvents();
    this.render();
  }

  initializeElements() {
    this.taskInput = document.getElementById('taskInput');
    this.addTaskBtn = document.getElementById('addTaskBtn');
    this.tasksContainer = document.getElementById('tasksContainer');
    this.emptyState = document.getElementById('emptyState');
    this.totalTasksEl = document.getElementById('totalTasks');
    this.completedTasksEl = document.getElementById('completedTasks');
    this.remainingTasksEl = document.getElementById('remainingTasks');
    this.filterButtons = document.querySelectorAll('[data-filter]');
  }

  bindEvents() {
    // Add task events
    this.addTaskBtn.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });

    // Filter events
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    // Prevent form submission if wrapped in form
    document.addEventListener('submit', (e) => e.preventDefault());
  }

  addTask() {
    const taskText = this.taskInput.value.trim();
    
    if (!taskText) {
      this.showNotification('Please enter a task!', 'is-warning');
      this.taskInput.focus();
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.unshift(newTask);
    this.taskInput.value = '';
    this.saveToStorage();
    this.render();
    this.showNotification('Task added successfully!', 'is-success');
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveToStorage();
      this.render();
      
      const message = task.completed ? 'Task completed!' : 'Task marked as pending';
      const type = task.completed ? 'is-success' : 'is-info';
      this.showNotification(message, type);
    }
  }

  editTask(id) {
    if (this.editingTaskId) {
      this.cancelEdit();
    }

    this.editingTaskId = id;
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    const taskTextElement = taskElement.querySelector('.task-text');
    const originalText = taskTextElement.textContent;

    taskElement.classList.add('editing');
    
    const input = document.createElement('input');
    input.className = 'input task-edit-input';
    input.type = 'text';
    input.value = originalText;
    
    taskTextElement.innerHTML = '';
    taskTextElement.appendChild(input);
    
    input.focus();
    input.select();

    const saveEdit = () => {
      const newText = input.value.trim();
      if (newText && newText !== originalText) {
        this.updateTaskText(id, newText);
        this.showNotification('Task updated!', 'is-success');
      } else if (!newText) {
        this.showNotification('Task text cannot be empty!', 'is-warning');
        input.focus();
        return;
      }
      this.cancelEdit();
    };

    const cancelEdit = () => {
      this.cancelEdit();
    };

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') saveEdit();
      if (e.key === 'Escape') cancelEdit();
    });

    input.addEventListener('blur', saveEdit);
  }

  cancelEdit() {
    if (this.editingTaskId) {
      this.editingTaskId = null;
      this.render();
    }
  }

  updateTaskText(id, newText) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.text = newText;
      this.saveToStorage();
    }
  }

  deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.saveToStorage();
      this.render();
      this.showNotification('Task deleted!', 'is-danger');
    }
  }

  setFilter(filter) {
    this.currentFilter = filter;
    
    // Update active filter button
    this.filterButtons.forEach(btn => {
      btn.classList.remove('is-active');
      if (btn.dataset.filter === filter) {
        btn.classList.add('is-active');
      }
    });
    
    this.render();
  }

  getFilteredTasks() {
    switch (this.currentFilter) {
      case 'completed':
        return this.tasks.filter(task => task.completed);
      case 'pending':
        return this.tasks.filter(task => !task.completed);
      default:
        return this.tasks;
    }
  }

  render() {
    const filteredTasks = this.getFilteredTasks();
    
    // Update statistics
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(t => t.completed).length;
    const remainingTasks = totalTasks - completedTasks;
    
    this.totalTasksEl.textContent = totalTasks;
    this.completedTasksEl.textContent = completedTasks;
    this.remainingTasksEl.textContent = remainingTasks;
    
    // Render tasks
    if (filteredTasks.length === 0) {
      this.tasksContainer.innerHTML = '';
      this.emptyState.classList.add('show');
    } else {
      this.emptyState.classList.remove('show');
      this.renderTasks(filteredTasks);
    }
  }

  renderTasks(tasks) {
    this.tasksContainer.innerHTML = tasks.map(task => `
      <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
        <div class="task-content">
          <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
            onchange="app.toggleTask(${task.id})"
          >
          <span class="task-text">${this.escapeHtml(task.text)}</span>
          <div class="task-actions">
            <button class="edit-btn" onclick="app.editTask(${task.id})" title="Edit task">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="app.deleteTask(${task.id})" title="Delete task">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  saveToStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
  }

  showNotification(message, type = 'is-info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type} is-light`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      min-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <button class="delete"></button>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
    
    // Remove on click
    notification.querySelector('.delete').addEventListener('click', () => {
      notification.remove();
    });
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TodoApp();
});
