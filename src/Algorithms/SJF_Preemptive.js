// Input:
// {
//   processes: [
//     { id: 'P1', burstTime: 5, arrivalTime: 0 }
//   ]
// }
// Output:
// {
//   processes: [
//     { id: 'P1', burstTime: 5, arrivalTime: 0, waitTime: 0, turnaroundTime: 0 }
//   ],
//   avgWaitTime: 0,
//   avgTurnaroundTime: 0,
//   timeline: [
//     { time: 0, processId: 'P1' }
//   ]
// }
export default function returnAlgoData(data) {
  // Work on copies so we don't mutate the original
  const processes = data.processes.map((p) => ({
    ...p,
    remaining: p.burstTime,
  }));
  const timeline = [];
  const finishTime = {};

  const total = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const endTime = Math.max(...processes.map((p) => p.arrivalTime)) + total;

  let currentTime = 0;

  while (currentTime < endTime) {
    // Pick arrived process with shortest remaining time
    const available = processes.filter(
      (p) => p.arrivalTime <= currentTime && p.remaining > 0,
    );
    if (!available.length) {
      currentTime++;
      continue;
    }

    const current = available.reduce((a, b) =>
      a.remaining <= b.remaining ? a : b,
    );

    // Add to timeline, merging consecutive same-process entries
    const last = timeline[timeline.length - 1];
    if (last && last.processId === current.id) {
      // extend — GanttChart infers end from next block's start, so no explicit duration needed
    } else {
      timeline.push({ time: currentTime, processId: current.id });
    }

    current.remaining--;
    currentTime++;

    if (current.remaining === 0) finishTime[current.id] = currentTime;
  }

  let totalWait = 0,
    totalTurnaround = 0;
  const result = data.processes.map((p) => {
    const turnaroundTime = finishTime[p.id] - p.arrivalTime;
    const waitTime = turnaroundTime - p.burstTime;
    totalWait += waitTime;
    totalTurnaround += turnaroundTime;
    return {
      id: p.id,
      burstTime: p.burstTime,
      arrivalTime: p.arrivalTime,
      waitTime,
      turnaroundTime,
    };
  });

  return {
    processes: result,
    avgWaitTime: totalWait / result.length,
    avgTurnaroundTime: totalTurnaround / result.length,
    timeline,
  };
}
