class TodoApp {
  constructor() {
    this.tasks = [];
    this.filter = "all";
    this.editingId = null;
    this.deletingId = null;
    this.clearCompletedCount = 0;

    this.initElements();
    this.bindEvents();
    this.loadTasks();
    this.render();

    // Better initial focus handling
    this.setInitialFocus();
  }

  initElements() {
    this.elements = {
      form: document.getElementById("taskForm"),
      input: document.getElementById("taskInput"),
      error: document.getElementById("errorMsg"),
      taskList: document.getElementById("taskList"),
      emptyState: document.getElementById("emptyState"),
      clearBtn: document.getElementById("clearBtn"),

      // Filters
      filters: document.querySelectorAll(".filter-btn"),
      allCount: document.getElementById("allCount"),
      pendingCount: document.getElementById("pendingCount"),
      doneCount: document.getElementById("doneCount"),

      // Stats
      totalTasks: document.getElementById("totalTasks"),
      completedTasks: document.getElementById("completedTasks"),
      pendingTasks: document.getElementById("pendingTasks"),

      // Edit Modal
      editModal: document.getElementById("editModal"),
      editInput: document.getElementById("editInput"),
      editSave: document.getElementById("saveEdit"),
      editCancel: document.getElementById("cancelEdit"),
      editClose: document.getElementById("editClose"),

      // Delete Modal
      deleteModal: document.getElementById("deleteModal"),
      deleteConfirm: document.getElementById("confirmDelete"),
      deleteCancel: document.getElementById("cancelDelete"),
      deleteClose: document.getElementById("deleteClose"),
      deletePreview: document.getElementById("deletePreview"),

      // Clear Completed Modal
      clearCompletedModal: document.getElementById("clearCompletedModal"),
      clearCompletedMessage: document.getElementById("clearCompletedMessage"),
      clearClose: document.getElementById("clearClose"),
      cancelClear: document.getElementById("cancelClear"),
      confirmClear: document.getElementById("confirmClear"),

      // Toast container
      toastContainer: document.getElementById("toastContainer"),
    };

    // Validate all required elements exist
    this.validateElements();
  }

  validateElements() {
    const requiredElements = [
      "form",
      "input",
      "taskList",
      "emptyState",
      "clearBtn",
      "editModal",
      "editInput",
      "deleteModal",
      "clearCompletedModal",
      "toastContainer",
    ];

    for (const elementKey of requiredElements) {
      if (!this.elements[elementKey]) {
        console.error(`Required element missing: ${elementKey}`);
      }
    }
  }

  bindEvents() {
    // Form Submission with better error handling
    this.elements.form.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        this.addTask(this.elements.input.value);
      } catch (error) {
        console.error("Error adding task:", error);
        this.showToast("Failed to add task", "error");
      }
    });

    this.elements.input.addEventListener("input", () => this.hideError());

    // Filters with enhanced error handling
    this.elements.filters.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        try {
          this.setFilter(btn.dataset.filter);
        } catch (error) {
          console.error("Error setting filter:", error);
        }
      });

      // Enhanced keyboard support
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.setFilter(btn.dataset.filter);
        }
      });
    });

    // Clear Completed Button
    this.elements.clearBtn.addEventListener("click", (e) => {
      try {
        this.openClearCompletedModal();
      } catch (error) {
        console.error("Error opening clear modal:", error);
        this.showToast("Failed to open clear dialog", "error");
      }
    });

    // Enhanced modal events with better error handling
    this.bindModalEvents();

    // Enhanced keyboard shortcuts
    this.bindKeyboardShortcuts();

    // Touch and mobile-specific events
    this.bindMobileEvents();

    // Window events
    this.bindWindowEvents();
  }

  bindModalEvents() {
    // Edit Modal events
    this.elements.editSave.addEventListener("click", () => this.saveEdit());
    this.elements.editCancel.addEventListener("click", () => this.closeEdit());
    this.elements.editClose.addEventListener("click", () => this.closeEdit());

    this.elements.editModal.addEventListener("click", (e) => {
      if (e.target === this.elements.editModal) this.closeEdit();
    });

    // Delete Modal events
    this.elements.deleteConfirm.addEventListener("click", () =>
      this.confirmDelete()
    );
    this.elements.deleteCancel.addEventListener("click", () =>
      this.closeDelete()
    );
    this.elements.deleteClose.addEventListener("click", () =>
      this.closeDelete()
    );

    this.elements.deleteModal.addEventListener("click", (e) => {
      if (e.target === this.elements.deleteModal) this.closeDelete();
    });

    // Clear Completed Modal events
    this.elements.clearClose.addEventListener("click", () =>
      this.closeClearCompletedModal()
    );
    this.elements.cancelClear.addEventListener("click", () =>
      this.closeClearCompletedModal()
    );
    this.elements.confirmClear.addEventListener("click", () =>
      this.clearCompletedConfirmed()
    );

    this.elements.clearCompletedModal.addEventListener("click", (e) => {
      if (e.target === this.elements.clearCompletedModal)
        this.closeClearCompletedModal();
    });
  }

  bindKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Global escape key
      if (e.key === "Escape") {
        this.closeEdit();
        this.closeDelete();
        this.closeClearCompletedModal();
      }

      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "n":
            e.preventDefault();
            this.focusInput();
            break;
          case "f":
            e.preventDefault();
            this.cycleFilters();
            break;
        }
      }
    });

    // Enter key in edit input
    this.elements.editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.saveEdit();
      }
    });
  }

  bindMobileEvents() {
    // Improve touch responsiveness
    const buttons = document.querySelectorAll("button, .filter-btn, .task-btn");
    buttons.forEach((button) => {
      // Add touch feedback
      button.addEventListener("touchstart", function () {
        this.style.opacity = "0.7";
      });

      button.addEventListener("touchend", function () {
        this.style.opacity = "";
      });
    });

    // Prevent zoom on input focus (mobile)
    this.elements.input.addEventListener("focus", function () {
      if (window.innerWidth < 768) {
        this.style.fontSize = "16px";
      }
    });

    this.elements.input.addEventListener("blur", function () {
      if (window.innerWidth < 768) {
        this.style.fontSize = "";
      }
    });
  }

  bindWindowEvents() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Handle visibility changes
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.loadTasks();
        this.render();
      }
    });
  }

  handleResize() {
    // Adjust toast container on resize
    const toasts = document.querySelectorAll(".toast");
    toasts.forEach((toast) => {
      if (window.innerWidth < 480) {
        toast.style.fontSize = "0.8rem";
      } else {
        toast.style.fontSize = "";
      }
    });
  }

  setInitialFocus() {
    // Better initial focus handling
    setTimeout(() => {
      if (this.elements.input && !this.isModalOpen()) {
        this.elements.input.focus();
      }
    }, 200);
  }

  focusInput() {
    setTimeout(() => {
      if (this.elements.input && !this.isModalOpen()) {
        this.elements.input.focus();
      }
    }, 100);
  }

  isModalOpen() {
    return (
      this.elements.editModal.classList.contains("show") ||
      this.elements.deleteModal.classList.contains("show") ||
      this.elements.clearCompletedModal.classList.contains("show")
    );
  }

  cycleFilters() {
    const filters = ["all", "pending", "completed"];
    const currentIndex = filters.indexOf(this.filter);
    const nextIndex = (currentIndex + 1) % filters.length;
    this.setFilter(filters[nextIndex]);
  }

  loadTasks() {
    try {
      const stored = localStorage.getItem("trackle-tasks");
      if (stored) {
        const parsed = JSON.parse(stored);
        this.tasks = Array.isArray(parsed) ? parsed : [];
      } else {
        this.tasks = [];
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      this.tasks = [];
      this.showToast("Failed to load saved tasks", "error");
    }
  }

  saveTasks() {
    try {
      localStorage.setItem("trackle-tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Failed to save tasks:", error);
      this.showToast("Failed to save tasks", "error");
    }
  }

  addTask(text) {
    try {
      text = text.trim();
      if (!this.validateTask(text)) return;

      const task = {
        id: Date.now() + Math.random().toString(36).slice(2),
        text: this.sanitizeHTML(text),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      this.tasks.unshift(task);
      this.saveTasks();
      this.elements.input.value = "";
      this.hideError();
      this.render();
      this.showToast("Task added successfully", "success");
    } catch (error) {
      console.error("Error in addTask:", error);
      this.showToast("Failed to add task", "error");
    }
  }

  toggleTask(id) {
    try {
      const task = this.tasks.find((t) => t.id === id);
      if (task) {
        task.completed = !task.completed;
        this.saveTasks();
        this.render();
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      this.showToast("Failed to update task", "error");
    }
  }

  editTask(id) {
    try {
      const task = this.tasks.find((t) => t.id === id);
      if (task) {
        this.editingId = id;
        this.elements.editInput.value = task.text;
        this.showModal(this.elements.editModal);
        setTimeout(() => {
          this.elements.editInput.focus();
          this.elements.editInput.select();
        }, 100);
      }
    } catch (error) {
      console.error("Error editing task:", error);
      this.showToast("Failed to open edit dialog", "error");
    }
  }

  saveEdit() {
    try {
      const text = this.elements.editInput.value.trim();
      if (!this.validateTask(text, this.editingId)) return;

      const task = this.tasks.find((t) => t.id === this.editingId);
      if (task) {
        task.text = this.sanitizeHTML(text);
        this.saveTasks();
        this.closeEdit();
        this.render();
        this.showToast("Task updated successfully", "success");
      }
    } catch (error) {
      console.error("Error saving edit:", error);
      this.showToast("Failed to save changes", "error");
    }
  }

  closeEdit() {
    this.hideModal(this.elements.editModal);
    this.editingId = null;
    this.elements.editInput.value = "";
    this.focusInput();
  }

  deleteTask(id) {
    try {
      const task = this.tasks.find((t) => t.id === id);
      if (task) {
        this.deletingId = id;
        this.elements.deletePreview.textContent = task.text;
        this.showModal(this.elements.deleteModal);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      this.showToast("Failed to open delete dialog", "error");
    }
  }

  confirmDelete() {
    try {
      this.tasks = this.tasks.filter((t) => t.id !== this.deletingId);
      this.saveTasks();
      this.closeDelete();
      this.render();
      this.showToast("Task deleted successfully", "success");
    } catch (error) {
      console.error("Error confirming delete:", error);
      this.showToast("Failed to delete task", "error");
    }
  }

  closeDelete() {
    this.hideModal(this.elements.deleteModal);
    this.deletingId = null;
    this.focusInput();
  }

  openClearCompletedModal() {
    try {
      this.clearCompletedCount = this.tasks.filter((t) => t.completed).length;
      if (this.clearCompletedCount === 0) {
        this.showToast("No completed tasks to clear", "error");
        return;
      }
      this.elements.clearCompletedMessage.textContent = `Delete ${
        this.clearCompletedCount
      } completed task${this.clearCompletedCount > 1 ? "s" : ""}?`;
      this.showModal(this.elements.clearCompletedModal);
    } catch (error) {
      console.error("Error opening clear modal:", error);
      this.showToast("Failed to open clear dialog", "error");
    }
  }

  closeClearCompletedModal() {
    this.hideModal(this.elements.clearCompletedModal);
  }

  clearCompletedConfirmed() {
    try {
      const count = this.clearCompletedCount;
      this.tasks = this.tasks.filter((t) => !t.completed);
      this.clearCompletedCount = 0;
      this.saveTasks();
      this.closeClearCompletedModal();
      this.render();
      this.showToast(
        `${count} completed task${count > 1 ? "s" : ""} cleared`,
        "success"
      );
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
      this.showToast("Failed to clear completed tasks", "error");
    }
  }

  setFilter(filterType) {
    try {
      this.filter = filterType;
      this.elements.filters.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === filterType);
      });
      this.render();
    } catch (error) {
      console.error("Error setting filter:", error);
    }
  }

  validateTask(text, excludeId = null) {
    if (!text) {
      this.showError("Task cannot be empty!");
      return false;
    }
    if (text.length > 100) {
      this.showError("Task too long! Max 100 characters.");
      return false;
    }
    if (
      this.tasks.some(
        (t) => t.id !== excludeId && t.text.toLowerCase() === text.toLowerCase()
      )
    ) {
      this.showError("Task already exists!");
      return false;
    }
    return true;
  }

  sanitizeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML.replace(
      /[<>]/g,
      (match) =>
        ({
          "<": "&lt;",
          ">": "&gt;",
        }[match])
    );
  }

  getFilteredTasks() {
    switch (this.filter) {
      case "pending":
        return this.tasks.filter((t) => !t.completed);
      case "completed":
        return this.tasks.filter((t) => t.completed);
      default:
        return this.tasks;
    }
  }

  render() {
    try {
      this.renderTasks();
      this.renderStats();
      this.renderCounts();
    } catch (error) {
      console.error("Error rendering:", error);
      this.showToast("Display error occurred", "error");
    }
  }

  renderTasks() {
    const filtered = this.getFilteredTasks();
    this.elements.taskList.innerHTML = "";
    this.elements.emptyState.classList.toggle("hidden", filtered.length > 0);

    const fragment = document.createDocumentFragment();

    filtered.forEach((task) => {
      const li = this.createTaskElement(task);
      fragment.appendChild(li);
    });

    this.elements.taskList.appendChild(fragment);
  }

  createTaskElement(task) {
    const li = document.createElement("li");
    li.className = `task-item${task.completed ? " completed" : ""}`;

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => this.toggleTask(task.id));

    // Create text span
    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;

    // Create actions div
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    // Create edit button
    const editBtn = document.createElement("button");
    editBtn.className = "task-btn edit-btn";
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
    editBtn.addEventListener("click", () => this.editTask(task.id));

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "task-btn delete-btn";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Del';
    deleteBtn.addEventListener("click", () => this.deleteTask(task.id));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(actionsDiv);

    return li;
  }

  renderStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((t) => t.completed).length;

    this.elements.totalTasks.textContent = total.toString();
    this.elements.completedTasks.textContent = completed.toString();
    this.elements.pendingTasks.textContent = (total - completed).toString();
  }

  renderCounts() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    this.elements.allCount.textContent = total.toString();
    this.elements.pendingCount.textContent = pending.toString();
    this.elements.doneCount.textContent = completed.toString();

    this.elements.clearBtn.style.display = completed > 0 ? "block" : "none";
  }

  showModal(modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Enhanced focus management
    const firstFocusable = modal.querySelector(
      "input, button, textarea, select"
    );
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
  }

  hideModal(modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  showToast(message, type = "error") {
    try {
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <i class="fas ${
          type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
        }"></i>
        <span>${this.sanitizeHTML(message)}</span>
      `;

      this.elements.toastContainer.appendChild(toast);

      // Show animation
      requestAnimationFrame(() => toast.classList.add("show"));

      // Auto-remove after 4 seconds
      const removeToast = () => {
        toast.classList.remove("show");
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      };

      const timeoutId = setTimeout(removeToast, 4000);

      // Click to dismiss
      toast.addEventListener("click", () => {
        clearTimeout(timeoutId);
        removeToast();
      });

      // Prevent too many toasts
      const existingToasts = this.elements.toastContainer.children;
      if (existingToasts.length > 3) {
        existingToasts[0].click(); // Dismiss oldest
      }
    } catch (error) {
      console.error("Error showing toast:", error);
    }
  }

  showError(message) {
    this.showToast(message, "error");
  }

  hideError() {
    this.elements.error.textContent = "";
    this.elements.error.classList.remove("show");
  }
}

// Enhanced initialization with error handling
document.addEventListener("DOMContentLoaded", () => {
  try {
    window.todoApp = new TodoApp();
    console.log("✅ Trackle Task Manager initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Trackle:", error);

    // Show fallback error UI
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #0a0e27; color: #ff4757; font-family: 'Courier New', monospace; text-align: center; padding: 1rem;">
        <div>
          <h1>⚠️ Initialization Error</h1>
          <p>Trackle failed to start. Please refresh the page.</p>
          <button onclick="window.location.reload()" style="background: #00ff88; color: #000; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-family: inherit; margin-top: 1rem;">
            🔄 Reload App
          </button>
        </div>
      </div>
    `;
  }
});
