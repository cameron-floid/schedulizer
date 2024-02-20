// Define the Process class
class Process {
    constructor(id, arrivalTime, burstTime, priority = null, queue = null) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.priority = priority;
        this.queue = queue;
    }

    // Method to update arrival time
    updateArrivalTime(newArrivalTime) {
        this.arrivalTime = newArrivalTime;
    }

    // Method to update burst time
    updateBurstTime(newBurstTime) {
        this.burstTime = newBurstTime;
    }

    // Method to update priority
    updatePriority(newPriority) {
        this.priority = newPriority;
    }

    // Method to update queue
    updateQueue(newQueue) {
        this.queue = newQueue;
    }

    // Example method to calculate waiting time for the process
    calculateWaitingTime(currentTime) {
        // If the process hasn't arrived yet, waiting time is 0
        if (currentTime < this.arrivalTime) {
            return 0;
        }

        // If the process has arrived but not yet executed, waiting time is currentTime - arrivalTime
        return currentTime - this.arrivalTime;
    }
}


// Define the Queue class
class Queue {
    constructor(name) {
        this.name = name;
        this.processes = [];
    }

    // Method to add a process to the queue
    addProcess(process) {
        this.processes.push(process);
    }

    // Method to remove a process from the queue based on its ID
    removeProcess(processId) {
        this.processes = this.processes.filter(process => process.id !== processId);
    }

    // Method to get all processes in the queue
    getProcesses() {
        return this.processes;
    }

    // Method to reorder processes in the queue based on a custom sorting criterion
    reorderProcesses(customSortingCriterion) {
        this.processes.sort(customSortingCriterion);
    }

    // Method to clear all processes from the queue
    clearQueue() {
        this.processes = [];
    }

    // Other methods for managing processes in the queue can be added as needed
}

// Define the Scheduler class
class Scheduler {
    constructor(algorithm) {
        this.algorithm = algorithm;
        this.queues = [];
    }

    // Method to execute the scheduling algorithm
    execute() {
        // Implement scheduling algorithm based on the selected algorithm
        // Update process states and manage scheduling events
    }

    // Method to add a queue to the scheduler
    addQueue(queue) {
        this.queues.push(queue);
    }

    // Method to remove a queue from the scheduler based on its name
    removeQueue(queueName) {
        this.queues = this.queues.filter(queue => queue.name !== queueName);
    }

    // Method to get all queues in the scheduler
    getQueues() {
        return this.queues;
    }

    // Method to clear all queues from the scheduler
    clearQueues() {
        this.queues = [];
    }

    // Other methods for handling scheduling events and updating process states can be added as needed
}


// Define the UIManager class
class UIManager {
    constructor() {
        // Initialize UI elements and event listeners
        this.nProcessesInput = document.querySelector('input[name="nprocesses"]');
        this.nQueuesInput = document.getElementById('nqueues');
        this.algorithmRadios = document.querySelectorAll('input[name="algorithm"]');
        this.processAttributesBody = document.getElementById('process-attributes-body');
        this.queueAttributesBody = document.getElementById('queue-attributes-body');
        this.queuesContainer = document.getElementById('queues');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Add event listeners to capture user inputs and update the scheduling system
        this.nProcessesInput.addEventListener("change", this.handleProcessInputChange.bind(this));
        this.nQueuesInput.addEventListener("change", this.handleQueueInputChange.bind(this));
        this.algorithmRadios.forEach(radio => radio.addEventListener("change", this.handleAlgorithmChange.bind(this)));
    }

    handleProcessInputChange() {
        const numberOfProcesses = parseInt(this.nProcessesInput.value);

        // Clear existing rows from the table body
        this.processAttributesBody.innerHTML = '';

        // Add new rows based on the number of processes
        for (let i = 1; i <= numberOfProcesses; i++) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>P${i}</td>
                <td><input type="number" name="arrival_time_${i}" min="0"></td>
                <td><input type="number" name="burst_time_${i}" min="0"></td>
                <td class="priority" style="display: none;"><input type="number" name="priority_${i}" min="0"></td>
                <td class="queue-cell" style="display: none;"><input type="number" name="queue_${i}" min="0"></td>
            `;
            this.processAttributesBody.appendChild(newRow);
        }
    }

    handleQueueInputChange() {
        const numberOfQueues = parseInt(this.nQueuesInput.value);

        // Clear existing queues
        this.queuesContainer.innerHTML = '';

        // Add new queues
        for (let i = 1; i <= numberOfQueues; i++) {
            const newQueueContainer = document.createElement('div');
            newQueueContainer.classList.add('queue-container');
            newQueueContainer.innerHTML = `
                <div class="queue-row header-text-row">
                    <h3 class="header-text">Q${i}</h3>
                </div>
                <div id="queue_${i}_row" class="queue-row queue horizontal-scroll"></div>
            `;
            this.queuesContainer.appendChild(newQueueContainer);
        }
    }

    handleAlgorithmChange() {
        const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;

        // Update UI based on the selected algorithm
        if (selectedAlgorithm === "mq") {
            document.getElementById("number-of-queues-group").style.display = "block";
            document.getElementById("queue-attributes-group").style.display = "block";
        } else {
            document.getElementById("number-of-queues-group").style.display = "none";
            document.getElementById("queue-attributes-group").style.display = "none";
        }

        if (selectedAlgorithm === "rr") {
            document.getElementById("time-quantum-group").style.display = "block";
        } else {
            document.getElementById("time-quantum-group").style.display = "none";
        }
    }

    updateProcessAttributesTable(processes) {
        const processAttributesBody = document.getElementById('process-attributes-body');
        processAttributesBody.innerHTML = ''; // Clear existing rows

        processes.forEach((process, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>P${index + 1}</td>
                <td><input type="number" name="arrival_time_${index + 1}" min="0" value="${process.arrivalTime}"></td>
                <td><input type="number" name="burst_time_${index + 1}" min="0" value="${process.burstTime}"></td>
                <td class="priority" style="display: none;"><input type="number" name="priority_${index + 1}" min="0" value="${process.priority}"></td>
                <td class="queue-cell" style="display: none;"><input type="number" name="queue_${index + 1}" min="0" value="${process.queue}"></td>
            `;
            processAttributesBody.appendChild(newRow);
        });
    }

    updateQueueAttributesTable(queues) {
        const queueAttributesBody = document.getElementById('queue-attributes-body');
        queueAttributesBody.innerHTML = ''; // Clear existing rows

        queues.forEach((queue, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>Q${index + 1}</td>
                <td>
                    <select class="form-select" name="algorithm_q${index + 1}">
                        <option value="" disabled selected>Choose</option> 
                        <option value="fcfs" ${queue.algorithm === 'fcfs' ? 'selected' : ''}>FCFS</option>
                        <option value="sjf" ${queue.algorithm === 'sjf' ? 'selected' : ''}>SJF</option>
                        <option value="srjf" ${queue.algorithm === 'srjf' ? 'selected' : ''}>SRJF</option>
                        <option value="priority" ${queue.algorithm === 'priority' ? 'selected' : ''}>Priority</option>
                        <option value="rr" ${queue.algorithm === 'rr' ? 'selected' : ''}>RR</option>
                    </select>
                </td>
                <td><input type="number" name="priority_q${index + 1}" min="0" value="${queue.priority || ''}"></td>
            `;
            queueAttributesBody.appendChild(newRow);
        });
    }
}

// Main program logic
document.addEventListener("DOMContentLoaded", function () {
    // Initialize the UIManager
    const uiManager = new UIManager();

    // Call handleAlgorithmChange() to apply styles on page load
    uiManager.handleAlgorithmChange();

    // Add event listener for form submission to start the scheduler
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Start the scheduler visualization process
        uiManager.startScheduler();
    });
});
