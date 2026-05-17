// Input:
// {
//   processes: [
//     { id: 'P1', burstTime: 5 }
//   ],
//   timeQuantum: 2
// }
// Output:
// {
//   processes: [
//     { id: 'P1', burstTime: 5, waitTime: 0, turnaroundTime: 5 }
//   ],
//   avgWaitTime: 0,
//   avgTurnaroundTime: 5,
//   timeline: [
//     { time: 0, processId: 'P1', duration: 2 },
//     ...
//   ]
// }
export default function returnRoundRobinData(data) {
  let originalProcesses = data.processes;
  let quantum = Number(data.timeQuantum);
  let timeline = [];

  if (originalProcesses.length === 0) {
    return {
      processes: [],
      avgWaitTime: 0,
      avgTurnaroundTime: 0,
      timeline: timeline,
    };
  }

  let processes = [];
  for (let k = 0; k < originalProcesses.length; k++) {
    let copy = {
      id: originalProcesses[k].id,
      burstTime: originalProcesses[k].burstTime,
    };
    processes.push(copy);
  }

  let currentTime = 0;
  while (processes.length > 0) {
    for (let i = 0; i < processes.length; i++) {
      let runTime = quantum;
      if (processes[i].burstTime < quantum) {
        runTime = processes[i].burstTime;
      }

      let entry = {
        time: currentTime,
        processId: processes[i].id,
        duration: runTime,
      };
      timeline.push(entry);

      currentTime += runTime;
      processes[i].burstTime -= runTime;

      if (processes[i].burstTime <= 0) {
        processes.splice(i, 1);
        i--;
      }
    }
  }


  let processesData = [];
  let totalWaitTime = 0;
  let totalTurnaroundTime = 0;

  for (let i = 0; i < originalProcesses.length; i++) {
    let id = originalProcesses[i].id;
    let waitTime = 0;
    let lastEndTime = 0;

    for (let j = 0; j < timeline.length; j++) {
    
      if (timeline[j].processId === id) {
        
        
        let startTime = timeline[j].time;
        let endTime = startTime + timeline[j].duration;
        
        waitTime += startTime - lastEndTime;
        lastEndTime = endTime;
        
      }
    }

    let turnaroundTime = lastEndTime;

    let processData = {
      id: id,
      burstTime: originalProcesses[i].burstTime,
      waitTime: waitTime,
      turnaroundTime: turnaroundTime,
    };
    processesData.push(processData);

    totalWaitTime += waitTime;
    totalTurnaroundTime += turnaroundTime;
  }

  let avgWaitTime = totalWaitTime / processesData.length;
  let avgTurnaroundTime = totalTurnaroundTime / processesData.length;

  return {
    processes: processesData,
    avgWaitTime: avgWaitTime,
    avgTurnaroundTime: avgTurnaroundTime,
    timeline: timeline,
  };
}