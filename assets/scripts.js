document.addEventListener("DOMContentLoaded", function() {
    // Function to set the current year
    function setCopyrightYear() {
        const yearEle = document.getElementById("year");
        const year = new Date().getFullYear();
        yearEle.textContent = year;
    }

    // Function to toggle headers and columns based on the selected algorithm
    function toggleHeadersAndColumns(selectedAlgorithm) {
        if (selectedAlgorithm === "fcfs" || selectedAlgorithm === "sjf" || selectedAlgorithm === "srjf") {
            // For algorithms where priority and queue are not used
            document.getElementById("priorityHeader").style.display = "none";
            document.getElementById("queueHeader").style.display = "none";

            // Hide corresponding columns
            const priorityCells = document.querySelectorAll('.priority');
            const queueCells = document.querySelectorAll('.queue');
            priorityCells.forEach(cell => cell.style.display = "none");
            queueCells.forEach(cell => cell.style.display = "none");
        } else if (selectedAlgorithm === "priority") {
            // For Priority algorithm
            document.getElementById("priorityHeader").style.display = "table-cell";
            document.getElementById("queueHeader").style.display = "none";

            // Show priority column and hide queue column
            const priorityCells = document.querySelectorAll('.priority');
            const queueCells = document.querySelectorAll('.queue');
            priorityCells.forEach(cell => cell.style.display = "table-cell");
            queueCells.forEach(cell => cell.style.display = "none");
        } else if (selectedAlgorithm === "rr" || selectedAlgorithm === "mq") {
            // For Round Robin and Multi Queue algorithms
            document.getElementById("priorityHeader").style.display = "table-cell";
            document.getElementById("queueHeader").style.display = "table-cell";

            // Show both priority and queue columns
            const priorityCells = document.querySelectorAll('.priority');
            const queueCells = document.querySelectorAll('.queue');
            priorityCells.forEach(cell => cell.style.display = "table-cell");
            queueCells.forEach(cell => cell.style.display = "table-cell");
        }
    }

    // Add event listener to other radio buttons
    const algorithmRadios = document.querySelectorAll('input[name="algorithm"]');
    algorithmRadios.forEach(function(radio) {
        radio.addEventListener("change", function() {
            // Get selected algorithm
            const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;

            // Toggle headers and columns depending on the selected algorithm
            toggleHeadersAndColumns(selectedAlgorithm);
        });
    });

    // Call the function to set the current year
    setCopyrightYear();
});
