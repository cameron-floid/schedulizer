class Scheduler {
    constructor() {
        this.queues = [];
        this.processInterval = null;
        this.uiManager = null;
    }

    setUIManager(uiManager) {
        this.uiManager = uiManager;
    }

    execute() {
        // Check for processes in queues every second
        // this.processInterval = setInterval(() => {
        //     this.checkQueues();
        // }, 1000);
    }

    addQueue(queue) {
        this.queues.push(queue);
    }

    queue_exists(name) {
        return this.queues.find(queue => queue.name === name);
    }

    findProcessById(processId, queueIndex) {
        if (queueIndex >= 0 && queueIndex < this.queues.length) {
            const queue = this.queues[queueIndex];
            for (const process of queue.processes) {
                if (process.id === processId) {
                    return process;
                }
            }
        }
        return null;
    }    

    removeQueue(queueName) {
        this.queues = this.queues.filter(queue => queue.name !== queueName);
    }

    getQueues() {
        return this.queues;
    }

    clearQueues() {
        this.queues = [];
    }

    checkQueues() {
        let highestPriorityQueue = null;
    
        // Find the queue with the highest priority process
        for (const queue of this.queues) {
            if (queue.processes.length > 0) {
                if (!highestPriorityQueue || queue.priority > highestPriorityQueue.priority) {
                    highestPriorityQueue = queue;
                }
            }
        }
    
        // Execute the process from the queue with the highest priority
        if (highestPriorityQueue) {
            this.executeProcess(highestPriorityQueue);
        }
    }
    

    executeProcess(queue) {
        let processToExecute;

        // Apply scheduling algorithm to select process to execute
        switch (queue.algorithm) {
            case 'fcfs':
                processToExecute = this.fcfs(queue);
                break;
            case 'rr':
                processToExecute = this.rr(queue);
                break;
            case 'sjf':
                processToExecute = this.sjf(queue);
                break;
            case 'priority':
                processToExecute = this.priority(queue);
                break;
            case 'mlq':
                processToExecute = this.mlq(queue);
                break;
        }

        if (processToExecute) {
            // Execute the selected process
            processToExecute.execute();
            // Here you can update the UI with the Gantt chart
            this.uiManager.updateGanttChart(processToExecute);
        } else {
            console.log('No process to execute.');
        }
    }
}

export default Scheduler;
