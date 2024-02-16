document.addEventListener("DOMContentLoaded", function () {
    // Function to set the current year
    function setCopyrightYear() {
        const yearEle = document.getElementById("year");
        const year = new Date().getFullYear();
        yearEle.textContent = year;
    }

    // Function to toggle headers and columns based on the selected algorithm
    function toggleHeadersAndColumns(selectedAlgorithm) {
        const priorityHeader = document.getElementById("priorityHeader");
        const queueHeader = document.getElementById("queueHeader");
        const queueCells = document.querySelectorAll('.queue');
        const priorityCells = document.querySelectorAll('.priority');
        const numberOfQueuesGroup = document.getElementById("number-of-queues-group");
        const queueAttributesGroup = document.getElementById("queue-attributes-group");
    
        if (selectedAlgorithm === "fcfs" || selectedAlgorithm === "sjf" || selectedAlgorithm === "srjf") {
            // For algorithms where priority and queue are not used
            priorityHeader.style.display = "none";
            queueHeader.style.display = "none";
            queueCells.forEach(cell => cell.style.display = "none");
            priorityCells.forEach(cell => cell.style.display = "none");
            numberOfQueuesGroup.style.display = "none";
            queueAttributesGroup.style.display = "none";
        } else if (selectedAlgorithm === "priority") {
            // For Priority algorithm
            priorityHeader.style.display = "table-cell";
            queueHeader.style.display = "none";
            queueCells.forEach(cell => cell.style.display = "none");
            priorityCells.forEach(cell => cell.style.display = "table-cell");
            numberOfQueuesGroup.style.display = "none";
            queueAttributesGroup.style.display = "none";
        } else if (selectedAlgorithm === "rr") {
            // For Round Robin algorithm
            priorityHeader.style.display = "none";
            queueHeader.style.display = "none";
            queueCells.forEach(cell => cell.style.display = "none");
            priorityCells.forEach(cell => cell.style.display = "none");
            numberOfQueuesGroup.style.display = "none";
            queueAttributesGroup.style.display = "none";
        } else if (selectedAlgorithm === "mq") {
            // For Multi Queue algorithm
            priorityHeader.style.display = "none";
            queueHeader.style.display = "table-cell";
            queueCells.forEach(cell => cell.style.display = "table-cell");
            priorityCells.forEach(cell => cell.style.display = "none");
            numberOfQueuesGroup.style.display = "block";
            queueAttributesGroup.style.display = "block";
        }
    }    

    // Function to toggle visibility of the time quantum group
    function toggleTimeQuantumGroup(selectedAlgorithm) {
        const timeQuantumGroup = document.getElementById("time-quantum-group");
        if (selectedAlgorithm === "rr") {
            timeQuantumGroup.style.display = "block";
        } else {
            timeQuantumGroup.style.display = "none";
        }
    }

    // Add event listener to algorithm radio buttons
    const algorithmRadios = document.querySelectorAll('input[name="algorithm"]');
    algorithmRadios.forEach(function (radio) {
        radio.addEventListener("change", function () {
            // Get selected algorithm
            const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;

            // Toggle headers and columns depending on the selected algorithm
            toggleHeadersAndColumns(selectedAlgorithm);

            // Toggle visibility of time quantum group
            toggleTimeQuantumGroup(selectedAlgorithm);
        });
    });

    // Function to add more processes to the processes input table
    const nProcessesInput = document.querySelector('input[name="nprocesses"]');
    const processAttributesBody = document.getElementById('process-attributes-body');
    nProcessesInput.addEventListener("change", function () {
        // Get the number of processes entered by the user
        const numberOfProcesses = parseInt(nProcessesInput.value);

        // Clear existing rows from the table body
        processAttributesBody.innerHTML = '';

        // Add new rows based on the number of processes
        for (let i = 1; i <= numberOfProcesses; i++) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>P${i}</td>
                <td><input type="number" name="arrival_time_${i}" min="0"></td>
                <td><input type="number" name="burst_time_${i}" min="0"></td>
                <td class="priority" style="display: none;"><input type="number" name="priority_${i}" min="0"></td>
                <td class="queue" style="display: none;"><input type="number" name="queue_${i}" min="0"></td>
            `;
            processAttributesBody.appendChild(newRow);
        }

        // Get selected algorithm
        const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;

        // Toggle headers and columns depending on the selected algorithm
        toggleHeadersAndColumns(selectedAlgorithm);

        // Toggle visibility of time quantum group
        toggleTimeQuantumGroup(selectedAlgorithm);
    });

    // Function to add queue attributes rows based on the number of queues
    const nQueuesInput = document.getElementById('nqueues');
    const queueAttributesBody = document.getElementById('queue-attributes-body');
    nQueuesInput.addEventListener("change", function () {
        const numberOfQueues = parseInt(nQueuesInput.value);

        // Clear existing rows from the table body
        queueAttributesBody.innerHTML = '';

        // Add new rows based on the number of queues
        for (let i = 1; i <= numberOfQueues; i++) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>Q${i}</td>
                <td>
                    <select name="algorithm_q${i}">
                        <option value="fcfs" selected>FCFS</option>
                        <option value="sjf">SJF</option>
                        <option value="srjf">SRJF</option>
                        <option value="priority">Priority</option>
                        <option value="rr">RR</option>
                    </select>
                </td>
                <td><input type="number" name="priority_q${i}" min="0"></td>
                `;
            queueAttributesBody.appendChild(newRow); // Append rows to the queue attributes table body
        }
    });

    // Call the function to set the current year
    setCopyrightYear();
});
