# Schedulizer

Schedulizer is a web-based application that visualizes various CPU scheduling algorithms. It provides a user-friendly interface to input process parameters and select different scheduling algorithms to observe their behavior visually.

## Features

- Supports the following CPU scheduling algorithms:
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Shortest Remaining Job First (SRJF)
  - Priority Scheduling
  - Round Robin (RR)
  - Multi-Level Queue (MLQ)
- Allows users to input process parameters such as arrival time, burst time, priority, and queue number.
- Visualizes the execution of processes using Gantt charts.
- Provides an option to specify the time quantum for Round Robin scheduling.
- Supports uploading process data in JSON format for visualization.

## Installation

1. Clone the repository:
Save to grepper
git clone https://github.com/username/schedulizer.git

css
Copy code

2. Navigate to the project directory:
Save to grepper
cd schedulizer

markdown
Copy code

3. Open the `index.html` file in your web browser.

## Usage

1. Open the Schedulizer application in your web browser.
2. Input the number of processes and specify their parameters (arrival time, burst time, priority, queue number).
3. Select the desired scheduling algorithm from the available options.
4. Optionally, specify the time quantum for Round Robin scheduling.
5. Click the "Visualize" button to observe the execution of processes using the selected algorithm.
6. Explore the Gantt chart and observe the scheduling behavior.
7. Click the "Reset" button to clear the input fields and start over.

## Contributing

Contributions are welcome! If you'd like to contribute to Schedulizer, please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Create a new Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).