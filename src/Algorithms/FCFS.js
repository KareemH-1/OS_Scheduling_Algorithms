// Input:
// {
//   processes: [
//     { id: 'P1', burstTime: 5 }
//   ]
// }
// Output:
// {
//   processes: [
//     { id: 'P1', burstTime: 5, waitTime: 0, turnaroundTime: 0 }
//   ],
//   avgWaitTime: 0,
//   avgTurnaroundTime: 0,
//   timeline: [
//     { time: 0, processId: 'P1' }
//   ]
// }
export default function returnAlgoData(data) {
  const processes = data.processes;
  const timeline = [];
  const result = [];

  let currentTime = 0;
  let totalWait = 0;
  let totalTurnaround = 0;

  for (const p of processes) {
    const waitTime = currentTime;
    const turnaroundTime = currentTime + p.burstTime;

    timeline.push({
      time: currentTime,
      processId: p.id,
      duration: p.burstTime,
    });
    result.push({ id: p.id, burstTime: p.burstTime, waitTime, turnaroundTime });

    totalWait += waitTime;
    totalTurnaround += turnaroundTime;
    currentTime += p.burstTime;
  }

  return {
    processes: result,
    avgWaitTime: totalWait / processes.length,
    avgTurnaroundTime: totalTurnaround / processes.length,
    timeline,
  };
}
