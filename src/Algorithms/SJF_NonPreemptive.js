export default function returnAlgoData(data) {

  const processes = data.processes.map((p) => ({
    ...p,
    arrivalTime: p.arrivalTime || 0,
    done: false,
  }));
 
  const timeline = [];
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;

  while (completed < n) {
 
    const available = processes.filter(
      (p) => p.arrivalTime <= currentTime && !p.done,
    );
 
    if (!available.length) {
      currentTime++;
      continue;
    }
 
    const current = available.reduce((a, b) =>
      a.burstTime <= b.burstTime ? a : b,
    );
 
    const startTime = currentTime;
    const endTime   = startTime + current.burstTime;
    
    timeline.push({
      time: startTime,
      processId: current.id,
      duration: current.burstTime,
    });
    
    currentTime = endTime;
    
    current.done = true;
    completed++;
  }

  let totalWait = 0;
  let totalTurnaround = 0;
 
  const result = data.processes.map((p) => {
    
    const arrivalTime = p.arrivalTime || 0;
 
    const block = timeline.find((t) => t.processId === p.id);

    const finishTime = block.time + block.duration;
 
    const turnaroundTime = finishTime - arrivalTime;
 
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
    timeline,
  };
}