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

  static queueRowTemplate(index) {
    return `
      <tr id="queue_${index}_row">
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
      </tr>
    `;
  }

  static queueContainerTemplate(index, algorithmInfo, priorityInfo) {
    return `
        <div class="queue-container">
          <div class="queue-row header-text-row">
            <h3 class="header-text">${index} ${algorithmInfo} ${priorityInfo}</h3>
          </div>
          <div id="queue_${index}_row" class="queue-row queue horizontal-scroll"></div>
        </div>
      `;
  }

  static queueContainerTemplateWithName(queueName, algorithmInfo, priorityInfo) {
    return `
        <div class="queue-row header-text-row">
          <h3 class="header-text">${queueName} ${algorithmInfo} ${priorityInfo}</h3>
        </div>
        <div id="${queueName.toLowerCase()}" class="queue-row queue horizontal-scroll"></div>
      `;
  }

  static processElementTemplate(id, arrivalTime, burstTime) {
    return `
        <p class="process-arrival-time">${arrivalTime}</p>
        <p class="process-label">P${id}</p>
        <p class="process-burst-time">${burstTime}</p>
      `;
  }

  static processRowTemplate(index) {
    return `
          <td>P${index}</td>
          <td><input type="number" name="arrival_time_${index}" min="0"></td>
          <td><input type="number" name="burst_time_${index}" min="0"></td>
          <td class="priorityCell" style="display: none;"><input type="number" name="priority_${index}" min="0"></td>
          <td class="queueCell" style="display: none;"><input type="number" name="queue_${index}" min="0"></td>
      `;
  }
}

export default Templates;