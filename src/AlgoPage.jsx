import { useState } from 'react';
import returnFCFSData from './Algorithms/FCFS.js';
import returnSJFPreemptiveData from './Algorithms/SJF_Preemptive.js';
import returnSJFNonPreemptiveData from './Algorithms/SJF_NonPreemptive.js';
import returnPriorityPreemptiveData from './Algorithms/PriorityScheduling_Preemptive.js';
import returnPriorityNonPreemptiveData from './Algorithms/PriorityScheduling_NonPreemptive.js';
import returnRoundRobinData from './Algorithms/RoundRobin.js';
import GanttChart from './components/GanttChart.jsx';
import './styles/AlgoPage.css';

export default function AlgoPage(props) {
  const algo = props.algo;
  const [processes, setProcesses] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState('');
  const [results, setResults] = useState(null);
  const [processInput, setProcessInput] = useState({
    burstTime: '',
    arrivalTime: '',
    priority: ''
  });
  const [error, setError] = useState('');

  const usesArrivalTime = algo === 'SJF-P' || algo === 'SJF-NP';
  const isPriority = algo === 'PS-P' || algo === 'PS-NP';
  const isRoundRobin = algo === 'RR';

  function getAlgorithmFunction() {
    if (algo === 'FCFS') {
      return returnFCFSData;
    }
    if (algo === 'SJF-P') {
      return returnSJFPreemptiveData;
    }
    if (algo === 'SJF-NP') {
      return returnSJFNonPreemptiveData;
    }
    if (algo === 'PS-P') {
      return returnPriorityPreemptiveData;
    }
    if (algo === 'PS-NP') {
      return returnPriorityNonPreemptiveData;
    }
    if (algo === 'RR') {
      return returnRoundRobinData;
    }
  }

  function sanitizeNumericInput(value) {
    return value.replace(/[^0-9]/g, '');
  }

  function handleNumericKeyDown(event, onEnter) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onEnter) {
        onEnter();
      }
      return;
    }

    if (event.key.length === 1 && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  function handleInputChange(event) {
    const name = event.target.name;
    const value = sanitizeNumericInput(event.target.value);
    const newInput = Object.assign({}, processInput);
    newInput[name] = value;
    setProcessInput(newInput);
  }

  function handleProcessKeyDown(event) {
    handleNumericKeyDown(event, handleAddProcess);
  }

  function handleTimeQuantumKeyDown(event) {
    handleNumericKeyDown(event, handleStart);
  }

  function handleAddProcess() {
    setError('');

    const burstTime = sanitizeNumericInput(processInput.burstTime);
    const arrivalTime = sanitizeNumericInput(processInput.arrivalTime);
    const priority = sanitizeNumericInput(processInput.priority);

    if (!burstTime) {
      setError('Burst Time is required');
      return;
    }

    if (usesArrivalTime && !arrivalTime) {
      setError('Arrival Time is required');
      return;
    }

    if (isPriority && !priority) {
      setError('Priority is required');
      return;
    }

    const newProcess = {
      id: `P${processes.length + 1}`,
      burstTime: parseInt(burstTime)
    };

    if (isPriority) {
      newProcess.priority = parseInt(priority);
    } else if (usesArrivalTime) {
      newProcess.arrivalTime = parseInt(arrivalTime);
    }

    const newProcesses = processes.slice();
    newProcesses.push(newProcess);

    setProcesses(newProcesses);
    setProcessInput({
      burstTime: '',
      arrivalTime: '',
      priority: ''
    });
  }

  function handleRemoveProcess(index) {
    const newProcesses = processes.slice();
    newProcesses.splice(index, 1);

    const renumberedProcesses = newProcesses.map((process, i) => ({
      ...process,
      id: `P${i + 1}`
    }));

    setProcesses(renumberedProcesses);
    setResults(null);
  }

  function handleStart() {
    setError('');

    if (processes.length === 0) {
      setError('Please add at least one process');
      return;
    }

    const parsedTimeQuantum = sanitizeNumericInput(timeQuantum);

    if (isRoundRobin && !parsedTimeQuantum) {
      setError('Time Quantum is required for Round Robin');
      return;
    }

    const algoFunction = getAlgorithmFunction();
    
    const data = {
      processes: processes
    };

    if (isRoundRobin) {
      data.timeQuantum = parseInt(parsedTimeQuantum);
    }

    const result = algoFunction(data);
    setResults(result);
  }

  function handleTimeQuantumChange(event) {
    setTimeQuantum(sanitizeNumericInput(event.target.value));
  }

  return (
    <div className="algo-page">
      <div className="algo-container">
        <h1 className="algo-title">{algo}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-section">
          <h2>Add Processes</h2>
          
          <div className="input-group">
            <input
              type="text"
              name="burstTime"
              placeholder="Burst Time"
              value={processInput.burstTime}
              onChange={handleInputChange}
              onKeyDown={handleProcessKeyDown}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            {usesArrivalTime ? (
              <input
                type="text"
                name="arrivalTime"
                placeholder="Arrival Time"
                value={processInput.arrivalTime}
                onChange={handleInputChange}
                onKeyDown={handleProcessKeyDown}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ) : isPriority ? (
              <input
                type="text"
                name="priority"
                placeholder="Priority"
                value={processInput.priority}
                onChange={handleInputChange}
                onKeyDown={handleProcessKeyDown}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ) : null}
            <button onClick={handleAddProcess} className="btn-add">
              Add Process
            </button>
          </div>

          {isRoundRobin && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Time Quantum"
                value={timeQuantum}
                onChange={handleTimeQuantumChange}
                onKeyDown={handleTimeQuantumKeyDown}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          )}
        </div>

        {processes.length > 0 && (
          <div className="processes-table-section">
            <h2>Processes List</h2>
            <table className="processes-table">
              <thead>
                <tr>
                  <th>Process ID</th>
                  <th>Burst Time</th>
                  {usesArrivalTime && <th>Arrival Time</th>}
                  {isPriority && <th>Priority</th>}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process, i) => (
                  <tr key={i}>
                    <td>{process.id}</td>
                    <td>{process.burstTime}</td>
                    {usesArrivalTime && <td>{process.arrivalTime}</td>}
                    {isPriority && <td>{process.priority}</td>}
                    <td>
                      <button
                        onClick={() => handleRemoveProcess(i)}
                        className="btn-remove"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleStart} className="btn-start">
              Start Algorithm
            </button>
          </div>
        )}

        {results && (
          <div className="results-section">
            <h2>Results</h2>
            <GanttChart data={results} />
            <table className="results-table">
              <thead>
                <tr>
                  <th>Process ID</th>
                  <th>Burst Time</th>
                  {usesArrivalTime && <th>Arrival Time</th>}
                  {isPriority && <th>Priority</th>}
                  <th>Wait Time</th>
                  <th>Turnaround Time</th>
                </tr>
              </thead>
              <tbody>
                {results.processes.map((process, i) => (
                  <tr key={i} className="result-row">
                    <td>{process.id}</td>
                    <td>{process.burstTime}</td>
                    {usesArrivalTime && <td>{process.arrivalTime}</td>}
                    {isPriority && <td>{process.priority}</td>}
                    <td className="highlight-wait">{process.waitTime}</td>
                    <td className="highlight-turnaround">{process.turnaroundTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="averages-section">
              <div className="average-box">
                <h3>Average Waiting Time</h3>
                <p className="average-value">{results.avgWaitTime.toFixed(2)}</p>
              </div>
              <div className="average-box">
                <h3>Average Turnaround Time</h3>
                <p className="average-value">{results.avgTurnaroundTime.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
