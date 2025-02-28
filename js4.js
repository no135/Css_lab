const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const feedbackMessage = document.getElementById('feedbackMessage');
const clearAllButton = document.getElementById('clearAllButton');
const totalTasksElement = document.getElementById('totalTasks');
const completedTasksElement = document.getElementById('completedTasks');
const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');
const fileInput = document.getElementById('fileInput');

// Load tasks from localStorage when the page loads
loadTasks();

// Add a task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        feedbackMessage.textContent = 'Please enter a valid task.';
        feedbackMessage.className = 'error';
        return;
    }

    feedbackMessage.textContent = '';
    const currentDateTime = new Date().toLocaleString();
    const fullTaskText = `${taskText} (Added on: ${currentDateTime})`;

    const li = document.createElement('li');
    li.textContent = fullTaskText;

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.onclick = function () {
        li.classList.toggle('completed');
        updateCounters();
        saveTasks();  // Save tasks after completion state changes
        feedbackMessage.textContent = li.classList.contains('completed')
            ? 'Task marked as completed!'
            : 'Task marked as uncompleted!';
        feedbackMessage.className = 'feedback';
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        taskList.removeChild(li);
        updateCounters();
        saveTasks();  // Save tasks after deletion
        feedbackMessage.textContent = 'Task deleted successfully!';
        feedbackMessage.className = 'feedback';
    };

    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    taskInput.value = '';
    feedbackMessage.textContent = 'Task added successfully!';
    feedbackMessage.className = 'feedback';
    taskInput.focus();
    addButton.disabled = true;
    updateCounters();
    saveTasks();  // Save the task list after adding the new task
}

// Enable or disable the Add button based on input
taskInput.addEventListener('input', function () {
    addButton.disabled = taskInput.value.trim() === '';
});

addButton.onclick = addTask;

// Add task using Enter key
taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && taskInput.value.trim() !== '') {
        addTask();
    }
});

// Clear all tasks
function clearAllTasks() {
    taskList.innerHTML = '';
    updateCounters();
    saveTasks();  // Save an empty task list
    feedbackMessage.textContent = 'All tasks cleared!';
    feedbackMessage.className = 'feedback';
}

clearAllButton.onclick = clearAllTasks;

// Update counters
function updateCounters() {
    const totalTasks = taskList.children.length;
    const completedTasks = Array.from(taskList.children).filter(task => task.classList.contains('completed')).length;

    totalTasksElement.textContent = totalTasks;
    completedTasksElement.textContent = completedTasks;
}

// Save tasks to localStorage as JSON
function saveTasks() {
    const tasks = [];
    Array.from(taskList.children).forEach(task => {
        tasks.push({
            text: task.textContent.replace('Complete', '').replace('Delete', '').trim(),
            completed: task.classList.contains('completed')
        });
    });

    // Convert the task array into JSON string and store in localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    // Get tasks from localStorage, if available
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    // If there are tasks, load them into the task list
    if (tasks) {
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text;

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.onclick = function () {
                li.classList.toggle('completed');
                updateCounters();
                saveTasks();  // Save tasks after completion state changes
                feedbackMessage.textContent = li.classList.contains('completed')
                    ? 'Task marked as completed!'
                    : 'Task marked as uncompleted!';
                feedbackMessage.className = 'feedback';
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function () {
                taskList.removeChild(li);
                updateCounters();
                saveTasks();  // Save tasks after deletion
                feedbackMessage.textContent = 'Task deleted successfully!';
                feedbackMessage.className = 'feedback';
            };

            li.appendChild(completeButton);
            li.appendChild(deleteButton);

            // Add completed class if the task is completed
            if (task.completed) {
                li.classList.add('completed');
            }

            taskList.appendChild(li);
        });
    }
    updateCounters();
}

// Export tasks to a JSON file
exportButton.addEventListener('click', function () {
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    if (tasks) {
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'tasks.json';
        link.click();
    } else {
        feedbackMessage.textContent = 'No tasks available to export.';
        feedbackMessage.className = 'error';
    }
});

// Import tasks from a JSON file
importButton.addEventListener('click', function () {
    fileInput.click();
});

fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            try {
                const tasks = JSON.parse(reader.result);
                if (Array.isArray(tasks)) {
                    taskList.innerHTML = '';
                    tasks.forEach(task => {
                        const li = document.createElement('li');
                        li.textContent = task.text;

                        const completeButton = document.createElement('button');
                        completeButton.textContent = 'Complete';
                        completeButton.onclick = function () {
                            li.classList.toggle('completed');
                            updateCounters();
                            saveTasks();  // Save tasks after completion state changes
                            feedbackMessage.textContent = li.classList.contains('completed')
                                ? 'Task marked as completed!'
                                : 'Task marked as uncompleted!';
                            feedbackMessage.className = 'feedback';
                        };

                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.onclick = function () {
                            taskList.removeChild(li);
                            updateCounters();
                            saveTasks();  // Save tasks after deletion
                            feedbackMessage.textContent = 'Task deleted successfully!';
                            feedbackMessage.className = 'feedback';
                        };

                        li.appendChild(completeButton);
                        li.appendChild(deleteButton);

                        // Add completed class if the task is completed
                        if (task.completed) {
                            li.classList.add('completed');
                        }

                        taskList.appendChild(li);
                    });
                    saveTasks();  // Save tasks after importing
                    updateCounters();
                } else {
                    feedbackMessage.textContent = 'Invalid file format.';
                    feedbackMessage.className = 'error';
                }
            } catch (e) {
                feedbackMessage.textContent = 'Failed to parse JSON.';
                feedbackMessage.className = 'error';
            }
        };
        reader.readAsText(file);
    }
});
