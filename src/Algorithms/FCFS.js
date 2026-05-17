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
  const result = [];
  const timeline = [];

  for (let i = 0; i < processes.length; i++) {
    result.push({
      id: processes[i].id,
      burstTime: processes[i].burstTime,
      waitTime: 0,
      turnaroundTime: 0
    });

    timeline.push({
      time: i,
      processId: processes[i].id
    });
  }

  return {
    processes: result,
    avgWaitTime: 0,
    avgTurnaroundTime: 0,
    timeline
  };
}
