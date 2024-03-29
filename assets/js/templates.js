class Templates {
    static processAttributesTemplate(index) {
        return `
        <td>P${index}</td>
        <td><input type="number" name="arrival_time_${index}" min="0"></td>
        <td><input type="number" name="burst_time_${index}" min="0"></td>
        <td class="priorityCell" style="display: none;"><input type="number" name="priority_${index}" min="0"></td>
        <td class="queueCell" style="display: none;"><input type="number" name="queue_${index}" min="0"></td>
      `;
    }

    static queueAttributesTemplate(index) {
        return `
        <td>Q${index}</td>
        <td>
          <select class="form-select" name="algorithm_q${index}">
            <option value="" disabled selected>Choose</option> 
            <option value="fcfs">FCFS</option>
            <option value="sjf">SJF</option>
            <option value="srjf">SRJF</option>
            <option value="priority">Priority</option>
            <option value="rr">RR</option>
          </select>
        </td>
        <td><input type="number" name="priority_q${index}" min="0"></td>
      `;
    }

    static queueContainerTemplate(index, algorithmInfo, priorityInfo) {
        return `
        <div class="queue-container">
          <div class="queue-row header-text-row">
            <h3 class="header-text">Q${index} ${algorithmInfo} ${priorityInfo}</h3>
          </div>
          <div id="queue_${index}_row" class="queue-row queue horizontal-scroll"></div>
        </div>
      `;
    }

    static processElementTemplate(id, arrivalTime, burstTime) {
        return `
        <p class="process-arrival-time">${arrivalTime}</p>
        <p class="process-label">P${id}</p>
        <p class="process-burst-time">${burstTime}</p>
      `;
    }
}

export default Templates;