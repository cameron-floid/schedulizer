class Queue {
    constructor(name, algorithm, priority) {
        this.name = name;
        this.algorithm = algorithm;
        this.priority = priority;
        this.processes = [];
    }

    addProcess(process) {
        this.processes.push(process);
    }

    removeProcess(processId) {
        this.processes = this.processes.filter(process => process.id !== processId);
    }
}

export default Queue;
