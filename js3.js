const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = taskText;
        li.appendChild(span);

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.addEventListener('click', () => {
            // Toggle the 'completed' class, which adds/removes the strikethrough style
            span.classList.toggle('completed');
        });
        li.appendChild(completeButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => li.remove());
        li.appendChild(deleteButton);

        taskList.appendChild(li);
        taskInput.value = '';
    }
});

// Add CSS to apply strikethrough when the 'completed' class is toggled
const style = document.createElement('style');
style.innerHTML = `
    .completed {
        text-decoration: line-through;
        color: grey;
    }
`;
document.head.appendChild(style);
