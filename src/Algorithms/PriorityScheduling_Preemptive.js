export default function returnAlgoData(data) {
  const processes = data.processes.map((p) => ({
    ...p,
    remaining: p.burstTime,
  }));
  const timeline = [];
  const finishTime = {};

  const totalBurst = processes.reduce((sum, p) => sum + p.burstTime, 0);
  let currentTime = 0;

  while (currentTime < totalBurst) {
    const available = processes.filter((p) => p.remaining > 0);

    const current = available.reduce((a, b) =>
      a.priority <= b.priority ? a : b,
    );

    const last = timeline[timeline.length - 1];
    if (!last || last.processId !== current.id) {
      timeline.push({ time: currentTime, processId: current.id });
    }

    current.remaining--;
    currentTime++;

    if (current.remaining === 0) finishTime[current.id] = currentTime;
  }

  let totalWait = 0;
  let totalTurnaround = 0;
  const result = data.processes.map((p) => {
    const turnaroundTime = finishTime[p.id];
    const waitTime = turnaroundTime - p.burstTime;
    totalWait += waitTime;
    totalTurnaround += turnaroundTime;
    return {
      id: p.id,
      burstTime: p.burstTime,
      priority: p.priority,
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
