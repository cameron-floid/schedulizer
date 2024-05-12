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
    // Reset UI elements
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

    this.handleAlgorithmChange(); // Update scheduler
  }

  initializeEventListeners() {
    // Add event listeners
    this.nProcessesInput.addEventListener("change", this.handleProcessInputChange.bind(this));
    this.nQueuesInput.addEventListener("change", this.handleQueueInputChange.bind(this));
    this.algorithmRadios.forEach(radio => radio.addEventListener("change", this.handleAlgorithmChange.bind(this)));
  }

  processAttributesChanged(processIndex) {
    // Update scheduler queues and processes
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
        // Store changes in the scheduler queues and processes
        let process;
        if (!isNaN(queueIndex) && queueIndex > 0 && queueIndex <= this.scheduler.queues.length) {
          process = new Process(processIndex, arrivalTime, burstTime, priority, queueIndex);
          this.scheduler.addOrUpdateProcess(process);
        } else {
          process = new Process(processIndex, arrivalTime, burstTime, null, null);
          this.scheduler.addOrUpdateProcess(process);
        }
      }
    }
  }

  handleAlgorithmChange() {
    // Update scheduler algorithm and queues based on UI changes
    const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
    this.scheduler.updateAlgorithm(selectedAlgorithm);
    this.addQueueToScheduler(selectedAlgorithm);
    this.toggleProcessAttributeHeaders(selectedAlgorithm);
    this.toggleProcessAttributeColumns(selectedAlgorithm);
  }

  handleProcessInputChange() {
    // Handle changes in process inputs
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
    // Handle changes in queue inputs
    const numberOfQueues = parseInt(this.nQueuesInput.value);
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

      this.addQueueToScheduler("mq", i, priorityInput.value);
    }

    this.addQueueToScreen("mq");
    this.renderQueues();
  }

  updateQueueInformation(queueIndex) {
    // Update queue information based on UI changes
    const algorithmSelect = document.querySelector(`select[name="algorithm_q${queueIndex}"]`);
    const priorityInput = document.querySelector(`input[name="priority_q${queueIndex}"]`);

    const selectedAlgorithm = algorithmSelect.value;
    const selectedPriority = priorityInput.value;

    this.scheduler.updateQueueAlgorithm(queueIndex, selectedAlgorithm);
    this.scheduler.updateQueuePriority(queueIndex, selectedPriority);

    // Update queue header
    this.updateQueueHeader(queueIndex, selectedAlgorithm, selectedPriority);

    // Update processes in the queue
    this.updateProcessesInQueue(queueIndex, selectedPriority);
  }

  updateQueueHeader(queueIndex, algorithm, priority) {
    // Update queue header in UI
    const queueHeader = document.querySelector(`#queues .queue-container:nth-child(${queueIndex}) .header-text-row .header-text`);
    if (queueHeader) {
      queueHeader.textContent = `Q${queueIndex} (${algorithm}), Q-Priority=${priority}`;
    }
  }

  updateProcessesInQueue(queueIndex, priority) {
    // Update processes in the queue in UI
    const queueRow = document.getElementById(`queue_${queueIndex}_row`);
    if (queueRow) {
      const processes = queueRow.querySelectorAll('.process');
      processes.forEach((processElement, index) => {
        const processId = processElement.querySelector('.process-label').textContent;
        const process = this.scheduler.findProcessById(processId, queueIndex - 1);
        if (process) {
          process.updatePriority(priority);
        }
      });
    }
  }

  addQueueToScheduler(selectedAlgorithm, queueNumber, priority) {
    // Add queue to scheduler
    if (selectedAlgorithm === "mq" && queueNumber) {
      this.scheduler.addOrUpdateQueue(new Queue(`Q${queueNumber}`, selectedAlgorithm, priority));
    }
  }

  addQueueToScreen(queuetype) {
    // Add queue to UI
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

  toggleProcessAttributeHeaders(algorithm) {
    // Toggle process attribute headers based on algorithm
    const priorityHeader = document.getElementById('priorityHeader');
    const queueHeader = document.getElementById('queueHeader');
    priorityHeader.style.display = algorithm === "priority" ? "table-cell" : "none";
    queueHeader.style.display = algorithm === "mq" ? "table-cell" : "none";
  }

  toggleProcessAttributeColumns(algorithm) {
    // Toggle process attribute columns based on algorithm
    const priorityCells = document.querySelectorAll('.priorityCell');
    const queueCells = document.querySelectorAll('.queueCell');
    priorityCells.forEach(cell => cell.style.display = algorithm === "priority" ? "table-cell" : "none");
    queueCells.forEach(cell => cell.style.display = algorithm === "mq" ? "table-cell" : "none");
  }

  renderQueues() {
    // Render queues in UI
    const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
    this.addQueueToScreen(selectedAlgorithm === "mq" ? "" : "rq");
  }
}

export default UIManager;
