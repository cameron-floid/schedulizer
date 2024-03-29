import Scheduler from './scheduler.js';
import Queue from './queue.js';
import Process from './process.js';

class UIManager {
    constructor() {
        this.nProcessesInput = document.querySelector('input[name="nprocesses"]');
        this.nQueuesInput = document.getElementById('nqueues');
        this.algorithmRadios = document.querySelectorAll('input[name="algorithm"]');
        this.processAttributesBody = document.getElementById('process-attributes-body');
        this.queueAttributesBody = document.getElementById('queue-attributes-body');
        this.queuesContainer = document.getElementById('queues');

        this.scheduler = new Scheduler();

        this.initializeEventListeners();
        this.handleAlgorithmChange();
    }

    handleReset() {
        this.nProcessesInput.value = '';
        this.nQueuesInput.value = '';
        this.algorithmRadios.forEach(radio => radio.checked = false);
        this.processAttributesBody.innerHTML = '';
        this.queueAttributesBody.innerHTML = '';
        document.getElementById("number-of-queues-group").style.display = "none";
        document.getElementById("queue-attributes-group").style.display = "none";
        document.getElementById("time-quantum-group").style.display = "none";
        this.queuesContainer.innerHTML = '';
        document.getElementById("fcfs").checked = true;

        this.handleAlgorithmChange();
    }

    initializeEventListeners() {
        this.nProcessesInput.addEventListener("change", this.handleProcessInputChange.bind(this));
        this.nQueuesInput.addEventListener("change", this.handleQueueInputChange.bind(this));
        this.algorithmRadios.forEach(radio => radio.addEventListener("change", this.handleAlgorithmChange.bind(this)));
    }

    processAttributesChanged(processIndex) {
        const arrivalTimeInput = document.querySelector(`input[name="arrival_time_${processIndex}"]`);
        const burstTimeInput = document.querySelector(`input[name="burst_time_${processIndex}"]`);
        const priorityInput = document.querySelector(`input[name="priority_${processIndex}"]`);
        const queueInputInput = document.querySelector(`input[name="queue_${processIndex}"]`);
    
        if (arrivalTimeInput && burstTimeInput) {
            const arrivalTime = parseInt(arrivalTimeInput.value);
            const burstTime = parseInt(burstTimeInput.value);
            const queueIndex = parseInt(queueInputInput.value);
            const priority = priorityInput.value ? parseInt(priorityInput.value) : null;



            if (arrivalTime >= 0 && burstTime >= 0) {
                const process = new Process(processIndex, arrivalTime, burstTime, priority, queueIndex);
    
                if (queueIndex > 0 && queueIndex <= this.scheduler.queues.length) {
                    this.scheduler.queues[queueIndex - 1].addProcess(process);
                    this.addProcessToScreen(process, queueIndex);
                } else {

                    // update the process queue number
                    process.updateQueue(0);

                    // add to RQ
                    this.scheduler.queues[0].addProcess(process);
                    this.addProcessToScreen(process, "RQ");
                }
            } else {
                // alert('Arrival time and burst time must be non-negative integers.');
            }
        }
    }

    handleProcessInputChange() {
        const numberOfProcesses = parseInt(this.nProcessesInput.value);
        this.processAttributesBody.innerHTML = '';
    
        for (let i = 1; i <= numberOfProcesses; i++) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>P${i}</td>
                <td><input type="number" name="arrival_time_${i}" min="0"></td>
                <td><input type="number" name="burst_time_${i}" min="0"></td>
                <td class="priorityCell" style="display: none;"><input type="number" name="priority_${i}" min="0"></td>
                <td class="queueCell" style="display: none;"><input type="number" name="queue_${i}" min="0"></td>
            `;
    
            // Add event listener to the row
            newRow.addEventListener('change', () => {
                this.processAttributesChanged(i);
            });
    
            this.processAttributesBody.appendChild(newRow);
        }
    
        const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
        this.toggleProcessAttributeColumns(selectedAlgorithm);
    }

    handleQueueInputChange() {
        const numberOfQueues = parseInt(this.nQueuesInput.value);
        this.queueAttributesBody.innerHTML = '';

        for (let i = 1; i <= numberOfQueues; i++) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>Q${i}</td>
                <td>
                    <select class="form-select" name="algorithm_q${i}">
                        <option value="" disabled selected>Choose</option> 
                        <option value="fcfs">FCFS</option>
                        <option value="sjf">SJF</option>
                        <option value="srjf">SRJF</option>
                        <option value="priority">Priority</option>
                        <option value="rr">RR</option>
                    </select>
                </td>
                <td><input type="number" name="priority_q${i}" min="0"></td>
            `;

            this.queueAttributesBody.appendChild(newRow);

            const algorithmSelect = newRow.querySelector(`select[name="algorithm_q${i}"]`);
            const priorityInput = newRow.querySelector(`input[name="priority_q${i}"]`);

            algorithmSelect.addEventListener('change', () => {
                this.updateQueueInformation(i);
            });

            priorityInput.addEventListener('input', () => {
                this.updateQueueInformation(i);
            });

            // Add the queue to the scheduler
            const priority = priorityInput.value;
            this.addQueueToScheduler("mq", i, priority);
        }

        this.addQueueToScreen("");
    }

    updateQueueInformation(queueIndex) {
        const algorithmSelect = document.querySelector(`select[name="algorithm_q${queueIndex}"]`);
        const priorityInput = document.querySelector(`input[name="priority_q${queueIndex}"]`);

        let algorithmInfo = '';
        let priorityInfo = '';

        if (algorithmSelect && algorithmSelect.value) {
            algorithmInfo = `: ${algorithmSelect.options[algorithmSelect.selectedIndex].text}`;
        }

        if (priorityInput && priorityInput.value) {
            priorityInfo = `, Q-Priority=${priorityInput.value}`;
        }

        const queueHeader = document.querySelector(`#queues .queue-container:nth-child(${queueIndex}) .header-text-row .header-text`);
        if (queueHeader) {
            queueHeader.textContent = `Q${queueIndex} ${algorithmInfo} ${priorityInfo}`;
        }

        const selectedAlgorithm = algorithmSelect.value;
        const selectedPriority = priorityInput.value;

        if (this.scheduler && this.scheduler.queues.length >= queueIndex) {
            const queue = this.scheduler.queues[queueIndex - 1];
            queue.algorithm = selectedAlgorithm;
            queue.priority = selectedPriority;
        }

        const queueRow = document.getElementById(`queue_${queueIndex}_row`);
        if (queueRow) {
            const processes = queueRow.querySelectorAll('.process');
            processes.forEach((processElement, index) => {
                const processId = processElement.querySelector('.process-label').textContent;
                const process = this.findProcessById(processId);
                if (process) {
                    process.updateQueue(`Q${queueIndex}`);
                    process.updatePriority(selectedPriority);
                }
            });
        }
    }

    findProcessById(processId) {
        for (const queue of this.scheduler.queues) {
            for (const process of queue.processes) {
                if (process.id === processId) {
                    return process;
                }
            }
        }
        return null;
    }

    addQueueToScheduler(selectedAlgorithm, queue_number, priority) {
        switch (selectedAlgorithm) {
            case "fcfs":
            case "rr":
            case "sjf":
            case "srjf":
                const queue_name = "RQ";
                const queue_exists = this.scheduler.queues.find(q => q.name === queue_name);
                if (!queue_exists) {
                    const nQ = new Queue(queue_name, selectedAlgorithm, 0);
                    this.scheduler.addQueue(nQ);
                }
                break;
            case "mq":
                if (queue_number) {
                    const queue_name = `Q${queue_number}`;
                    const queue_exists = this.scheduler.queues.find(q => q.name === queue_name);
                    if (!queue_exists) {
                        const nQ = new Queue(queue_name, selectedAlgorithm, priority);
                        this.scheduler.addQueue(nQ);
                    }
                }
                break;
            default:
                console.log("Invalid algorithm.");
                console.log(selectedAlgorithm);
                break;
        }
    }

    handleAlgorithmChange() {
        const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
        if (selectedAlgorithm === "mq") {
            document.getElementById("number-of-queues-group").style.display = "block";
            document.getElementById("queue-attributes-group").style.display = "block";
        } else {
            document.getElementById("number-of-queues-group").style.display = "none";
            document.getElementById("queue-attributes-group").style.display = "none";
            this.addQueueToScreen("rq");
        }
        if (selectedAlgorithm === "rr") {
            document.getElementById("time-quantum-group").style.display = "block";
        } else {
            document.getElementById("time-quantum-group").style.display = "none";
        }
        this.toggleProcessAttributeHeaders(selectedAlgorithm);
        this.toggleProcessAttributeColumns(selectedAlgorithm);
        this.addQueueToScheduler(selectedAlgorithm);

        console.log(this.scheduler.queues);
    }

    toggleProcessAttributeHeaders(algorithm) {
        const priorityHeader = document.getElementById('priorityHeader');
        const queueHeader = document.getElementById('queueHeader');
        priorityHeader.style.display = algorithm === "priority" ? "table-cell" : "none";
        queueHeader.style.display = algorithm === "mq" ? "table-cell" : "none";
    }

    toggleProcessAttributeColumns(algorithm) {
        const priorityCells = document.querySelectorAll('.priorityCell');
        const queueCells = document.querySelectorAll('.queueCell');
        priorityCells.forEach(cell => cell.style.display = algorithm === "priority" ? "table-cell" : "none");
        queueCells.forEach(cell => cell.style.display = algorithm === "mq" ? "table-cell" : "none");
    }

    addProcessToScreen(process, queueIndex) {

        let queueRow;

        if (queueIndex === "RQ") {
            queueRow = document.getElementById(`rq`);
        } else {
            queueRow = document.getElementById(`queue_${queueIndex}_row`);
        }
        
        if (queueRow) {
            const newProcessElement = document.createElement('div');
            newProcessElement.classList.add('process');
            newProcessElement.innerHTML = `
                <div class="process">
                    <p class="process-arrival-time">${process.arrivalTime}</p>
                    <p class="process-label">P${process.id}</p>
                    <p class="process-burst-time">${process.burstTime}</p>
                </div> 
            `;
            
            queueRow.appendChild(newProcessElement);
        }
    }

    addQueueToScreen(queuetype) {
        const numberOfQueues = parseInt(this.nQueuesInput.value);
        this.queuesContainer.innerHTML = '';
        
        if (queuetype === "rq") {
            const newQueueContainer = document.createElement('div');
            newQueueContainer.classList.add('queue-container');
            newQueueContainer.innerHTML = `
                <div class="queue-row header-text-row">
                    <h3 class="header-text">R.Q</h3>
                </div>
                <div id="rq" class="queue-row queue horizontal-scroll"></div>
            `;
            this.queuesContainer.appendChild(newQueueContainer);
        } else {
            for (let i = 1; i <= numberOfQueues; i++) {
                const algorithmSelect = document.querySelector(`select[name="algorithm_q${i}"]`);
                const priorityInput = document.querySelector(`input[name="priority_q${i}"]`);
                let algorithmInfo = '';
                let priorityInfo = '';
                if (algorithmSelect && algorithmSelect.value) {
                    algorithmInfo = `(${algorithmSelect.options[algorithmSelect.selectedIndex].text}`;
                }
                if (priorityInput && priorityInput.value) {
                    priorityInfo = `, Q-Priority=${priorityInput.value})`;
                }
                const newQueueContainer = document.createElement('div');
                newQueueContainer.classList.add('queue-container');
                newQueueContainer.innerHTML = `
                    <div class="queue-row header-text-row">
                        <h3 class="header-text">Q${i} ${algorithmInfo} ${priorityInfo}</h3>
                    </div>
                    <div id="queue_${i}_row" class="queue-row queue horizontal-scroll"></div>
                `;
                this.queuesContainer.appendChild(newQueueContainer);
            }
        }
        
        const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
        this.toggleProcessAttributeColumns(selectedAlgorithm);
    }

    startScheduler() {
        console.log('Scheduler started!');
    }
}

export default UIManager;
