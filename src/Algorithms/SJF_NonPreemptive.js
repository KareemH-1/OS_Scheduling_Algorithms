export default function returnAlgoData(data) {
  const processes = data.processes.map((p) => ({
    ...p,
    arrivalTime: p.arrivalTime || 0,
    done: false,
  }));

  const timeline = [];
  const finishTime = {};
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;

  while (completed < n) {
    const available = processes.filter(
      (p) => p.arrivalTime <= currentTime && !p.done,
    );

    if (!available.length) {
      const nextArrival = Math.min(
        ...processes.filter((p) => !p.done).map((p) => p.arrivalTime)
      );
      currentTime = nextArrival;
      continue;
    }

    const current = available.reduce((a, b) =>
      a.burstTime <= b.burstTime ? a : b,
    );

    timeline.push({ time: currentTime, processId: current.id });
    currentTime += current.burstTime;
    finishTime[current.id] = currentTime;
    current.done = true;
    completed++;
  }

  const shift = timeline[0].time;
  const shiftedTimeline = timeline.map((t) => ({
    ...t,
    time: t.time - shift,
  }));

  let totalWait = 0;
  let totalTurnaround = 0;

  const result = data.processes.map((p) => {
    const arrivalTime = p.arrivalTime || 0;
    const shiftedFinish = finishTime[p.id] - shift;
    const shiftedArrival = Math.max(0, arrivalTime - shift);

    const turnaroundTime = shiftedFinish - shiftedArrival;
    const waitTime = turnaroundTime - p.burstTime;

    totalWait += waitTime;
    totalTurnaround += turnaroundTime;

    return {
      id: p.id,
      burstTime: p.burstTime,
      arrivalTime,
      waitTime,
      turnaroundTime,
    };
  });

  return {
    processes: result,
    avgWaitTime: totalWait / result.length,
    avgTurnaroundTime: totalTurnaround / result.length,
    timeline: shiftedTimeline,
  };
}