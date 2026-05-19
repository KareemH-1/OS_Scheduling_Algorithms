// Input:
// {
//   processes: [
//     { id: 'P1', burstTime: 5, arrivalTime: 0 }
//   ]
// }
// Output:
// {
//   processes: [
//     { id: 'P1', burstTime: 5, arrivalTime: 0, startTime: 0, waitTime: 0, turnaroundTime: 5 }
//   ],
//   avgWaitTime: 0,
//   avgTurnaroundTime: 5,
//   timeline: [
//     { time: 0, processId: 'P1', duration: 5 }
//   ]
// }
export default function returnAlgoData(data) {
  const processes = data.processes.map(p => ({
    ...p,
    arrivalTime: p.arrivalTime ?? 0
  }));
  
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const timeline = [];
  const result = [];

  let currentTime = 0;
  let totalWait = 0;
  let totalTurnaround = 0;

  for (const p of processes) {
    const startTime = Math.max(currentTime, p.arrivalTime);
    const waitTime = startTime - p.arrivalTime;
    const completionTime = startTime + p.burstTime;
    const turnaroundTime = completionTime - p.arrivalTime;

    timeline.push({
      time: startTime,
      processId: p.id,
      duration: p.burstTime,
    });
    result.push({ 
      id: p.id, 
      burstTime: p.burstTime, 
      arrivalTime: p.arrivalTime,
      startTime,
      waitTime, 
      turnaroundTime 
    });

    totalWait += waitTime;
    totalTurnaround += turnaroundTime;
    currentTime = completionTime;
  }

  return {
    processes: result,
    avgWaitTime: totalWait / processes.length,
    avgTurnaroundTime: totalTurnaround / processes.length,
    timeline,
  };
}
