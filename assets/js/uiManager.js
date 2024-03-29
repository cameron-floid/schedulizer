import Templates from './templates.js';
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
    this.nQueuesInput.addEventListener("change", this.handleQueueInputChange.bind(this)); // Add this line
    this.algorithmRadios.forEach(radio => radio.addEventListener("change", this.handleAlgorithmChange.bind(this)));
  }

  processAttributesChanged(processIndex) {
    const arrivalTimeInput = document.querySelector(`input[name="arrival_time_${processIndex}"]`);
    const burstTimeInput = document.querySelector(`input[name="burst_time_${processIndex}"]`);
    const priorityInput = document.querySelector(`input[name="priority_${processIndex}"]`);
    const queueInputInput = document.querySelector(`input[name="queue_${processIndex}"]`);
  
    if (arrivalTimeInput && burstTimeInput && queueInputInput) {
      const arrivalTime = parseInt(arrivalTimeInput.value);
      const burstTime = parseInt(burstTimeInput.value);
      const queueIndex = parseInt(queueInputInput.value);
      let priority = null;
  
      if (priorityInput) {
        if (document.querySelector('input[name="algorithm"]:checked')) {
          const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
          if (selectedAlgorithm === "priority") {
            priority = priorityInput.value ? parseInt(priorityInput.value) : null;
          }
        }
      }
  
      if (arrivalTime >= 0 && burstTime >= 0) {
        // Create the new process
        let process;
        if (!isNaN(queueIndex) && queueIndex > 0 && queueIndex <= this.scheduler.queues.length) {
          process = new Process(processIndex, arrivalTime, burstTime, priority, queueIndex);
          this.scheduler.queues[queueIndex - 1].addProcess(process);
          this.addProcessToScreen(process, queueIndex);
        } else {
          process = new Process(processIndex, arrivalTime, burstTime, null, null);
          if (document.querySelector('input[name="algorithm"]:checked')) {
            const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
            if (selectedAlgorithm !== "priority") {
              this.scheduler.queues[0].addProcess(process);
              this.addProcessToScreen(process, "RQ");
            }
          }
        }
  
        // Add all processes in individual queues to the ready queue as well
        if (document.querySelector('input[name="algorithm"]:checked')) {
          const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
          if (selectedAlgorithm !== "priority") {
            this.scheduler.queues.slice(1).forEach(queue => {
              queue.processes.forEach(process => {
                if (!this.scheduler.queues[0].hasProcessWithId(process.id)) {
                  this.scheduler.queues[0].addProcess(process);
                  this.addProcessToScreen(process, "RQ");
                }
              });
            });
          }
        }
      }
    }
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
  }

  handleProcessInputChange() {
    const numberOfProcesses = parseInt(this.nProcessesInput.value);
    this.processAttributesBody.innerHTML = '';

    for (let i = 1; i <= numberOfProcesses; i++) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = Templates.processRowTemplate(i);

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
    const previousNumberOfQueues = this.scheduler.queues.length;

    // Remove excess queue elements from the UI
    const numberOfQueuesToRemove = Math.max(0, previousNumberOfQueues - numberOfQueues);
    this.removeQueueFromScreen(numberOfQueuesToRemove);

    // Remove excess queues from the scheduler
    this.removeQueuesFromScheduler(numberOfQueuesToRemove);

    this.queueAttributesBody.innerHTML = '';

    for (let i = 1; i <= numberOfQueues; i++) {
      const newRow = document.createElement('tr');
      newRow.innerHTML = Templates.queueRowTemplate(i);

      this.queueAttributesBody.appendChild(newRow);

      const algorithmSelect = newRow.querySelector(`select[name="algorithm_q${i}"]`);
      const priorityInput = newRow.querySelector(`input[name="priority_q${i}"]`);

      algorithmSelect.addEventListener('change', () => {
        this.updateQueueInformation(i);
      });

      priorityInput.addEventListener('input', () => {
        this.updateQueueInformation(i);
      });

      // Add the queue to the scheduler if it doesn't already exist
      const priority = priorityInput.value;
      this.addQueueToScheduler("mq", i, priority);
    }

    // Add the queues to the display panel
    this.addQueueToScreen("mq");

    this.renderQueues();
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

  addProcessToScreen(process, queueIndex) {
    let queueContainer;

    if (queueIndex === "RQ") {
      // If the queueIndex is "RQ", find the ready queue container
      queueContainer = document.querySelector(`#queues .queue-container.ready-queue`);
    } else {
      // Otherwise, find the queue container corresponding to the given queueIndex
      queueContainer = document.querySelector(`#queues .queue-container:nth-child(${queueIndex})`);
    }

    if (queueContainer) {
      // Use the process element template to create the process element
      const processElementTemplate = Templates.processElementTemplate(process.id, process.arrivalTime, process.burstTime);
      queueContainer.insertAdjacentHTML('beforeend', processElementTemplate);
    }

    console.log(this.scheduler.queues);
  }

  addQueueToScheduler(selectedAlgorithm, queue_number, priority) {
    switch (selectedAlgorithm) {
      case "fcfs":
      case "rr":
      case "sjf":
      case "srjf":
      case "priority":
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
        console.log("Invalid algorithm ", selectedAlgorithm);
        break;
    }

    console.log(this.scheduler.queues);
  }

  addQueueToScreen(queuetype) {
    const numberOfQueues = parseInt(this.nQueuesInput.value);
    this.queuesContainer.innerHTML = '';

    if (queuetype === "rq") {
      const readyQueueTemplate = Templates.queueContainerTemplate("R.Q", "", "");
      const newQueueContainer = document.createElement('div');
      newQueueContainer.classList.add('queue-container');
      newQueueContainer.innerHTML = readyQueueTemplate;
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
        const queueContainerTemplate = Templates.queueContainerTemplate(`Q${i}`, algorithmInfo, priorityInfo);
        const newQueueContainer = document.createElement('div');
        newQueueContainer.classList.add('queue-container');
        newQueueContainer.innerHTML = queueContainerTemplate;
        this.queuesContainer.appendChild(newQueueContainer);
      }
    }

    const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
    this.toggleProcessAttributeColumns(selectedAlgorithm);
  }

  removeQueueFromScreen(numberOfQueuesToRemove) {
    for (let i = 1; i <= numberOfQueuesToRemove; i++) {
      const queueContainerToRemove = document.querySelector(`#queues .queue-container:nth-child(${i})`);
      if (queueContainerToRemove) {
        queueContainerToRemove.remove();
      }
    }
  }

  removeQueuesFromScheduler(numberOfQueuesToRemove) {
    for (let i = 0; i < numberOfQueuesToRemove; i++) {
      const removedQueue = this.scheduler.queues.pop();
      if (removedQueue) {
        // Remove processes from removed queue
        removedQueue.processes.forEach(process => {
          // Update process queue information
          process.updateQueue(null);
          process.updatePriority(null);
        });
      }
    }
  }

  renderQueues() {
    const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
    this.addQueueToScreen(selectedAlgorithm === "mq" ? "" : "rq");
  }

  startScheduler() {
    console.log('Scheduler started!');
  }
}

export default UIManager;