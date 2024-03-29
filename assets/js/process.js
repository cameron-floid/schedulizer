class Process {
    constructor(id, arrivalTime, burstTime, priority, queueNumber) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.priority = priority;
        this.queueNumber = queueNumber;
        this.state = 'Waiting'; // Possible states: 'Waiting', 'Executing', 'Completed'
    }

    updateQueue(queueNumber) {
        this.queueNumber = queueNumber;
    }

    updatePriority(priority) {
        this.priority = priority;
    }

    execute() {
        this.state = 'Executing';
        console.log(`Process ${this.id} is executing.`);
    }

    complete() {
        this.state = 'Completed';
        console.log(`Process ${this.id} has completed.`);
    }

    hasQueue() {
        return this.queueNumber !== undefined && this.queueNumber !== null;
    }
}

export default Process;
