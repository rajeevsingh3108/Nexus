let draggedTask = null;
let currentColumn = null;
let taskId = 0;
let currentProject = 'platform';

// Project data structure
const projectData = {
    platform: {
        title: 'Platform Launch',
        tasks: {
            backlog: [
                {
                    id: 1,
                    title: "Build UI kit component library",
                    description: "Create a comprehensive design system with reusable components for consistent user experience across the platform",
                    priority: "high",
                    tag: "design",
                    assignee: "JS"
                },
                {
                    id: 2,
                    title: "Build design system",
                    description: "Establish design principles, color palettes, typography, and spacing guidelines",
                    priority: "medium",
                    tag: "design",
                    assignee: "AD"
                },
                {
                    id: 3,
                    title: "Build settings UI",
                    description: "Design and implement user preferences and configuration interface",
                    priority: "low",
                    tag: "design",
                    assignee: "MK"
                }
            ],
            todo: [
                {
                    id: 4,
                    title: "API integration with backend",
                    description: "Connect frontend components with REST API endpoints and handle data flow",
                    priority: "high",
                    tag: "development",
                    assignee: "RK"
                },
                {
                    id: 5,
                    title: "Advanced search functionality",
                    description: "Implement filtering, sorting, and search capabilities across all data",
                    priority: "medium",
                    tag: "development",
                    assignee: "SP"
                },
                {
                    id: 6,
                    title: "Design onboarding flow",
                    description: "Create smooth user onboarding experience with interactive tutorials",
                    priority: "low",
                    tag: "design",
                    assignee: "UI"
                }
            ],
            "in-progress": [
                {
                    id: 7,
                    title: "Responsive design implementation",
                    description: "Optimize layouts for mobile, tablet, and desktop viewing experiences",
                    priority: "high",
                    tag: "development",
                    assignee: "DV"
                },
                {
                    id: 8,
                    title: "Performance optimization",
                    description: "Improve loading times, reduce bundle size, and optimize rendering",
                    priority: "medium",
                    tag: "development",
                    assignee: "PO"
                },
                {
                    id: 9,
                    title: "Create rapid prototypes",
                    description: "Build interactive prototypes for user testing and validation",
                    priority: "low",
                    tag: "design",
                    assignee: "PR"
                }
            ],
            done: [
                {
                    id: 10,
                    title: "User authentication system",
                    description: "Secure login, registration, and session management implementation",
                    priority: "high",
                    tag: "development",
                    assignee: "AU"
                },
                {
                    id: 11,
                    title: "Database schema design",
                    description: "Optimized data structure and relationships for scalable performance",
                    priority: "medium",
                    tag: "development",
                    assignee: "DB"
                },
                {
                    id: 12,
                    title: "Market research analysis",
                    description: "Comprehensive competitor analysis and market positioning strategy",
                    priority: "low",
                    tag: "testing",
                    assignee: "MR"
                }
            ]
        }
    },
    marketing: {
        title: 'Marketing Plan',
        tasks: {
            backlog: [
                {
                    id: 13,
                    title: "Social media strategy",
                    description: "Develop comprehensive social media marketing strategy",
                    priority: "high",
                    tag: "design",
                    assignee: "SM"
                }
            ],
            todo: [
                {
                    id: 14,
                    title: "Content calendar creation",
                    description: "Plan and schedule content for next quarter",
                    priority: "medium",
                    tag: "design",
                    assignee: "CC"
                }
            ],
            "in-progress": [],
            done: []
        }
    },
    roadmap: {
        title: 'Roadmap',
        tasks: {
            backlog: [
                {
                    id: 15,
                    title: "Q1 Planning",
                    description: "Define goals and milestones for Q1",
                    priority: "high",
                    tag: "development",
                    assignee: "PM"
                }
            ],
            todo: [],
            "in-progress": [],
            done: []
        }
    },
    create: {
        title: 'Create Team Board',
        tasks: {
            backlog: [],
            todo: [],
            "in-progress": [],
            done: []
        }
    }
};

// Team data structure
const teamData = {
    design: {
        title: 'Design Team Board',
        tasks: {
            backlog: [
                {
                    id: 16,
                    title: "Design system update",
                    description: "Update design system with new components",
                    priority: "medium",
                    tag: "design",
                    assignee: "DT"
                }
            ],
            todo: [],
            "in-progress": [],
            done: []
        }
    },
    marketing: {
        title: 'Marketing Team Board',
        tasks: {
            backlog: [
                {
                    id: 17,
                    title: "Campaign analysis",
                    description: "Analyze performance of recent campaigns",
                    priority: "high",
                    tag: "testing",
                    assignee: "MT"
                }
            ],
            todo: [],
            "in-progress": [],
            done: []
        }
    },
    development: {
        title: 'Development Team Board',
        tasks: {
            backlog: [
                {
                    id: 18,
                    title: "Code review process",
                    description: "Improve code review workflow",
                    priority: "low",
                    tag: "development",
                    assignee: "DV"
                }
            ],
            todo: [],
            "in-progress": [],
            done: []
        }
    }
};

// Get current tasks based on active project/team
function getCurrentTasks() {
    const projectTasks = projectData[currentProject];
    if (projectTasks) {
        return projectTasks.tasks;
    }
    
    const teamTasks = teamData[currentProject];
    if (teamTasks) {
        return teamTasks.tasks;
    }
    
    return projectData.platform.tasks; // fallback
}

// Get current title
function getCurrentTitle() {
    const project = projectData[currentProject];
    if (project) {
        return project.title;
    }
    
    const team = teamData[currentProject];
    if (team) {
        return team.title;
    }
    
    return 'Platform Launch'; // fallback
}

// Initialize the app
function init() {
    loadTasks();
    setupDragAndDrop();
    updateColumnCounts();
    setupNavigation();
    addScrollEffects();
    
    // Set initial task ID to highest existing ID
    taskId = getMaxTaskId();
}

// Get maximum task ID across all projects and teams
function getMaxTaskId() {
    let maxId = 0;
    
    // Check project data
    Object.values(projectData).forEach(project => {
        Object.values(project.tasks).forEach(column => {
            column.forEach(task => {
                if (task.id > maxId) maxId = task.id;
            });
        });
    });
    
    // Check team data
    Object.values(teamData).forEach(team => {
        Object.values(team.tasks).forEach(column => {
            column.forEach(task => {
                if (task.id > maxId) maxId = task.id;
            });
        });
    });
    
    return maxId;
}

// Setup navigation
function setupNavigation() {
    // Project navigation
    document.querySelectorAll('[data-project]').forEach(item => {
        item.addEventListener('click', function() {
            const project = this.getAttribute('data-project');
            switchToProject(project);
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Team navigation
    document.querySelectorAll('[data-team]').forEach(item => {
        item.addEventListener('click', function() {
            const team = this.getAttribute('data-team');
            switchToTeam(team);
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Switch to project
function switchToProject(projectKey) {
    currentProject = projectKey;
    document.getElementById('page-title').textContent = getCurrentTitle();
    loadTasks();
    updateColumnCounts();
    showNotification(`Switched to ${getCurrentTitle()}`, 'success');
}

// Switch to team
function switchToTeam(teamKey) {
    currentProject = teamKey;
    document.getElementById('page-title').textContent = getCurrentTitle();
    loadTasks();
    updateColumnCounts();
    showNotification(`Switched to ${getCurrentTitle()}`, 'success');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Add scroll effects for enhanced UX
function addScrollEffects() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        const tasks = column.querySelector('.tasks');
        tasks.addEventListener('scroll', (e) => {
            const scrollTop = e.target.scrollTop;
            const header = column.querySelector('.column-header');
            if (scrollTop > 10) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.boxShadow = 'none';
                header.style.backdropFilter = 'none';
            }
        });
    });
}

// Load tasks into columns
function loadTasks() {
    const currentTasks = getCurrentTasks();
    
    Object.keys(currentTasks).forEach(column => {
        const tasksContainer = document.getElementById(`${column}-tasks`);
        tasksContainer.innerHTML = '';
        
        currentTasks[column].forEach(task => {
            const taskElement = createTaskElement(task);
            tasksContainer.appendChild(taskElement);
        });
    });
}

// Create task element with enhanced styling and action buttons
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.draggable = true;
    taskDiv.dataset.taskId = task.id;
    taskDiv.dataset.priority = task.priority;
    
    const assigneeInitials = task.assignee || 'UN';
    
    // Determine which buttons to show based on column
    let actionButtons = '';
    const currentColumn = findTaskColumn(task.id);
    
    if (currentColumn === 'backlog') {
        actionButtons = `
            <div class="task-actions">
                <button class="task-btn complete-btn" onclick="completeTask(${task.id})" title="Mark as Complete">✓</button>
                <button class="task-btn remove-btn" onclick="removeTask(${task.id})" title="Remove Task">✕</button>
            </div>
        `;
    } else {
        actionButtons = `
            <div class="task-actions">
                <button class="task-btn remove-btn" onclick="removeTask(${task.id})" title="Remove Task">✕</button>
            </div>
        `;
    }
    
    taskDiv.innerHTML = `
        <div class="task-header">
            <div class="task-title">${task.title}</div>
            ${actionButtons}
        </div>
        <div class="task-description">${task.description}</div>
        <div class="task-tags">
            <span class="tag ${task.tag}">${task.tag}</span>
        </div>
        <div class="task-footer">
            <div class="task-priority">
                <div class="priority-dot priority-${task.priority}"></div>
                <span>${task.priority}</span>
            </div>
            <div class="task-assignee">${assigneeInitials}</div>
        </div>
    `;
    
    // Add hover effects
    taskDiv.addEventListener('mouseenter', () => {
        if (!taskDiv.classList.contains('dragging')) {
            taskDiv.style.transform = 'translateY(-4px) scale(1.02)';
        }
    });
    
    taskDiv.addEventListener('mouseleave', () => {
        if (!taskDiv.classList.contains('dragging')) {
            taskDiv.style.transform = '';
        }
    });
    
    return taskDiv;
}

// Complete task (move from backlog to done)
function completeTask(taskId) {
    const currentTasks = getCurrentTasks();
    const taskIndex = currentTasks.backlog.findIndex(task => task.id == taskId);
    
    if (taskIndex > -1) {
        const task = currentTasks.backlog.splice(taskIndex, 1)[0];
        currentTasks.done.push(task);
        
        // Remove from DOM and add to done column
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
        }
        
        // Add to done column
        const newTaskElement = createTaskElement(task);
        const doneTasksContainer = document.getElementById('done-tasks');
        
        // Animation
        newTaskElement.style.opacity = '0';
        newTaskElement.style.transform = 'translateY(-20px) scale(0.9)';
        doneTasksContainer.appendChild(newTaskElement);
        
        requestAnimationFrame(() => {
            newTaskElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            newTaskElement.style.opacity = '1';
            newTaskElement.style.transform = 'translateY(0) scale(1)';
        });
        
        // Setup drag and drop for new task
        newTaskElement.addEventListener('dragstart', handleDragStart);
        newTaskElement.addEventListener('dragend', handleDragEnd);
        
        updateColumnCounts();
        showNotification('Task completed successfully!', 'success');
    }
}

// Remove task
function removeTask(taskId) {
    if (confirm('Are you sure you want to remove this task?')) {
        const currentTasks = getCurrentTasks();
        let removed = false;
        
        // Find and remove task from any column
        Object.keys(currentTasks).forEach(column => {
            const taskIndex = currentTasks[column].findIndex(task => task.id == taskId);
            if (taskIndex > -1) {
                currentTasks[column].splice(taskIndex, 1);
                removed = true;
            }
        });
        
        if (removed) {
            // Remove from DOM with animation
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskElement) {
                taskElement.style.transition = 'all 0.3s ease';
                taskElement.style.transform = 'scale(0.8)';
                taskElement.style.opacity = '0';
                
                setTimeout(() => {
                    taskElement.remove();
                    updateColumnCounts();
                }, 300);
            }
            
            showNotification('Task removed successfully!', 'success');
        }
    }
}

// Enhanced drag and drop setup
function setupDragAndDrop() {
    updateDragAndDropListeners();
}

function updateDragAndDropListeners() {
    const tasks = document.querySelectorAll('.task');
    const columns = document.querySelectorAll('.column');
    
    tasks.forEach(task => {
        task.removeEventListener('dragstart', handleDragStart);
        task.removeEventListener('dragend', handleDragEnd);
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
    });
    
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
        column.addEventListener('dragenter', handleDragEnter);
        column.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    draggedTask = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    
    // Add visual feedback
    document.querySelectorAll('.column').forEach(col => {
        col.style.transform = 'scale(1.02)';
        col.style.opacity = '0.8';
    });
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    this.style.transform = '';
    draggedTask = null;
    
    // Reset visual feedback
    document.querySelectorAll('.column').forEach(col => {
        col.style.transform = '';
        col.style.opacity = '';
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedTask) {
        const targetColumn = this.dataset.column;
        const sourceColumn = findTaskColumn(draggedTask.dataset.taskId);
        
        if (targetColumn !== sourceColumn) {
            moveTask(draggedTask.dataset.taskId, sourceColumn, targetColumn);
            const tasksContainer = this.querySelector('.tasks');
            
            // Remove old task element and create new one (to update buttons)
            const taskId = draggedTask.dataset.taskId;
            const currentTasks = getCurrentTasks();
            const task = currentTasks[targetColumn].find(t => t.id == taskId);
            
            draggedTask.remove();
            
            if (task) {
                const newTaskElement = createTaskElement(task);
                tasksContainer.appendChild(newTaskElement);
                
                // Setup drag and drop for new task
                newTaskElement.addEventListener('dragstart', handleDragStart);
                newTaskElement.addEventListener('dragend', handleDragEnd);
                
                // Add success animation
                newTaskElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    newTaskElement.style.transform = '';
                }, 200);
            }
            
            updateColumnCounts();
            showNotification(`Task moved to ${targetColumn.replace('-', ' ')}!`, 'success');
        }
    }
}

function findTaskColumn(taskId) {
    const currentTasks = getCurrentTasks();
    for (let column in currentTasks) {
        if (currentTasks[column].find(task => task.id == taskId)) {
            return column;
        }
    }
    return null;
}

function moveTask(taskId, sourceColumn, targetColumn) {
    const currentTasks = getCurrentTasks();
    const taskIndex = currentTasks[sourceColumn].findIndex(task => task.id == taskId);
    if (taskIndex > -1) {
        const task = currentTasks[sourceColumn].splice(taskIndex, 1)[0];
        currentTasks[targetColumn].push(task);
    }
}

function updateColumnCounts() {
    const currentTasks = getCurrentTasks();
    Object.keys(currentTasks).forEach(column => {
        const count = currentTasks[column].length;
        const columnElement = document.querySelector(`[data-column="${column}"]`);
        const countElement = columnElement.querySelector('.column-count');
        countElement.textContent = count;
        
        // Animate count change
        countElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            countElement.style.transform = '';
        }, 200);
    });
}

// Enhanced modal functions
function openModal(column = null) {
    currentColumn = column;
    const modal = document.getElementById('taskModal');
    modal.style.display = 'block';
    
    // Reset form
    document.getElementById('taskForm').reset();
    
    // Focus on title input with slight delay for animation
    setTimeout(() => {
        document.getElementById('taskTitle').focus();
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('taskModal');
    modal.style.display = 'none';
    currentColumn = null;
}

// Handle form submission with animation
document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;
    const tag = document.getElementById('taskTag').value;
    const assignee = document.getElementById('taskAssignee').value;
    
    const newTask = {
        id: ++taskId,
        title,
        description,
        priority,
        tag,
        assignee: assignee.substring(0, 2).toUpperCase() || 'UN'
    };
    
    const targetColumn = currentColumn || 'backlog';
    const currentTasks = getCurrentTasks();
    currentTasks[targetColumn].push(newTask);
    
    // Add task to DOM with animation
    const taskElement = createTaskElement(newTask);
    const tasksContainer = document.getElementById(`${targetColumn}-tasks`);
    
    // Initial state for animation
    taskElement.style.opacity = '0';
    taskElement.style.transform = 'translateY(-20px) scale(0.9)';
    tasksContainer.appendChild(taskElement);
    
    // Animate in
    requestAnimationFrame(() => {
        taskElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        taskElement.style.opacity = '1';
        taskElement.style.transform = 'translateY(0) scale(1)';
    });
    
    // Setup drag and drop for new task
    taskElement.addEventListener('dragstart', handleDragStart);
    taskElement.addEventListener('dragend', handleDragEnd);
    
    updateColumnCounts();
    closeModal();
    showNotification('Task created successfully!', 'success');
});

// Enhanced theme toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const themeText = document.getElementById('theme-text');
    const isLightMode = document.body.classList.contains('light-mode');
    themeText.textContent = isLightMode ? 'Light mode' : 'Glass mode';
    
    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
    
    // Save theme preference
    localStorage.setItem('theme', isLightMode ? 'light' : 'glass');
    
    showNotification(`Switched to ${isLightMode ? 'light' : 'glass'} mode`, 'success');
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('theme-text').textContent = 'Light mode';
    }
}

// Enhanced event listeners
window.addEventListener('click', function(e) {
    const modal = document.getElementById('taskModal');
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openModal();
    }
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    init();
});

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.0001;
        const x = e.clientX * speed;
        const y = e.clientY * speed;
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add performance optimization
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateDragAndDropListeners();
    }, 250);
});

// Add visibility change handler to pause animations when tab is not active
document.addEventListener('visibilitychange', function() {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(shape => {
        if (document.hidden) {
            shape.style.animationPlayState = 'paused';
        } else {
            shape.style.animationPlayState = 'running';
        }
    });
});



// Footer JavaScript functionality

class FooterManager {
    constructor() {
        this.footer = null;
        this.footerContent = null;
        this.heartElement = null;
        this.nameElement = null;
        this.clickCount = 0;
        this.init();
    }

    init() {
        this.createFooter();
        this.setupEventListeners();
        this.addInteractiveEffects();
    }

    createFooter() {
        // Create footer element if it doesn't exist
        if (!document.querySelector('.footer')) {
            this.footer = document.createElement('footer');
            this.footer.className = 'footer';
            
            // Add glow effect element
            const glowElement = document.createElement('div');
            glowElement.className = 'footer-glow';
            this.footer.appendChild(glowElement);
            
            // Create footer content
            this.footerContent = document.createElement('div');
            this.footerContent.className = 'footer-content';
            
            this.footerContent.innerHTML = `
                <span>Made with</span>
                <span class="footer-heart">♥</span>
                <span>by</span>
                <span class="footer-name">Nexus Team</span>
            `;
            
            this.footer.appendChild(this.footerContent);
            
            // Add to main container
            const container = document.querySelector('.container') || document.body;
            container.appendChild(this.footer);
        }
        
        // Get references to elements
        this.footer = document.querySelector('.footer');
        this.footerContent = document.querySelector('.footer-content');
        this.heartElement = document.querySelector('.footer-heart');
        this.nameElement = document.querySelector('.footer-name');
    }

    setupEventListeners() {
        if (!this.heartElement || !this.nameElement) return;

        // Heart click animation
        this.heartElement.addEventListener('click', () => {
            this.animateHeart();
        });

        // Name click easter egg
        this.nameElement.addEventListener('click', () => {
            this.handleNameClick();
        });

        // Hover effects
        this.footer.addEventListener('mouseenter', () => {
            this.onFooterHover();
        });

        this.footer.addEventListener('mouseleave', () => {
            this.onFooterLeave();
        });

        // Double click on footer for theme toggle
        this.footer.addEventListener('dblclick', () => {
            if (typeof toggleTheme === 'function') {
                toggleTheme();
                this.showFooterMessage('Theme toggled! 🎨');
            }
        });
    }

    animateHeart() {
        if (!this.heartElement) return;

        // Create floating hearts effect
        this.createFloatingHearts();
        
        // Pulse effect
        this.heartElement.style.transform = 'scale(1.5)';
        this.heartElement.style.color = '#ff4757';
        
        setTimeout(() => {
            this.heartElement.style.transform = '';
            this.heartElement.style.color = '';
        }, 300);

        // Show appreciation message
        this.showFooterMessage('Thanks for the love! ❤️');
    }

    createFloatingHearts() {
        const heartsCount = 5;
        const footerRect = this.footer.getBoundingClientRect();
        
        for (let i = 0; i < heartsCount; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '♥';
            heart.style.cssText = `
                position: fixed;
                left: ${footerRect.left + Math.random() * footerRect.width}px;
                top: ${footerRect.top}px;
                color: #ff6b6b;
                font-size: 14px;
                pointer-events: none;
                z-index: 9999;
                animation: floatUpHeart 2s ease-out forwards;
            `;
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 2000);
        }
    }

    handleNameClick() {
        this.clickCount++;
        
        const messages = [
            'Hi there! 👋',
            'You found the easter egg! 🥚',
            'Keep clicking for more surprises! ✨',
            'You\'re persistent! 🎯',
            'Almost there... 🤔',
            'Surprise! You unlocked the secret! 🎉'
        ];

        if (this.clickCount <= messages.length) {
            this.showFooterMessage(messages[this.clickCount - 1]);
        }

        if (this.clickCount === 3) {
            this.addRainbowEffect();
        }

        if (this.clickCount === 6) {
            this.addConfettiEffect();
            this.clickCount = 0; // Reset
        }
    }

    addRainbowEffect() {
        if (!this.nameElement) return;
        
        this.nameElement.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd)';
        this.nameElement.style.backgroundSize = '300% 300%';
        this.nameElement.style.animation = 'rainbowGradient 2s ease infinite';
        
        setTimeout(() => {
            this.nameElement.style.background = '';
            this.nameElement.style.animation = '';
        }, 4000);
    }

    addConfettiEffect() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
        const footerRect = this.footer.getBoundingClientRect();
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    left: ${footerRect.left + Math.random() * footerRect.width}px;
                    top: ${footerRect.top - 20}px;
                    width: 6px;
                    height: 6px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    pointer-events: none;
                    z-index: 9999;
                    border-radius: 50%;
                    animation: confettiFall 3s ease-out forwards;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 100);
        }
    }

    onFooterHover() {
        if (!this.footerContent) return;
        
        this.footerContent.style.transform = 'translateY(-2px)';
        this.footerContent.style.filter = 'brightness(1.1)';
    }

    onFooterLeave() {
        if (!this.footerContent) return;
        
        this.footerContent.style.transform = '';
        this.footerContent.style.filter = '';
    }

    showFooterMessage(message) {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = 'footer-message';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--glass-bg);
            backdrop-filter: var(--backdrop-blur);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 12px 20px;
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            animation: fadeInUp 0.3s ease forwards;
            box-shadow: var(--shadow-light);
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'fadeOutDown 0.3s ease forwards';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 2000);
    }

    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUpHeart {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100px) scale(0.5);
                }
            }
            
            @keyframes confettiFall {
                0% {
                    opacity: 1;
                    transform: translateY(0) rotateZ(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translateY(200px) rotateZ(360deg);
                }
            }
            
            @keyframes rainbowGradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes fadeOutDown {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    addInteractiveEffects() {
        this.addDynamicStyles();
        
        // Add mouse move effect
        document.addEventListener('mousemove', (e) => {
            if (!this.footer) return;
            
            const footerRect = this.footer.getBoundingClientRect();
            const isOverFooter = e.clientY >= footerRect.top && e.clientY <= footerRect.bottom;
            
            if (isOverFooter) {
                const x = ((e.clientX - footerRect.left) / footerRect.width - 0.5) * 20;
                const y = ((e.clientY - footerRect.top) / footerRect.height - 0.5) * 10;
                
                if (this.footerContent) {
                    this.footerContent.style.transform = `translate(${x}px, ${y}px)`;
                }
            } else {
                if (this.footerContent) {
                    this.footerContent.style.transform = '';
                }
            }
        });
    }

    // Public method to update footer text
    updateFooterText(text) {
        if (this.nameElement) {
            this.nameElement.textContent = text;
        }
    }

    // Public method to change heart color
    setHeartColor(color) {
        if (this.heartElement) {
            this.heartElement.style.color = color;
        }
    }
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.footerManager = new FooterManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FooterManager;
}