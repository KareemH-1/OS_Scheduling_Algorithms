export default function returnAlgoData(data) {
  const pendingProcesses = data.processes.map(p => ({ ...p }));

  pendingProcesses.sort((a, b) => {
    if (a.arrivalTime === b.arrivalTime) {
      const idA = parseInt(a.id.replace(/\D/g, ''), 10);
      const idB = parseInt(b.id.replace(/\D/g, ''), 10);
      return idA - idB;
    }
    return a.arrivalTime - b.arrivalTime;
  });

  let currentTime = 0;
  let completedProcessesCount = 0;
  const totalProcesses = pendingProcesses.length;
  
  const readyQueue = [];
  const resultProcesses = [];
  const timeline = [];

  let totalWaitTime = 0;
  let totalTurnaroundTime = 0;

  while (completedProcessesCount < totalProcesses) {
    while (pendingProcesses.length > 0 && pendingProcesses[0].arrivalTime <= currentTime) {
      readyQueue.push(pendingProcesses.shift());
    }

    if (readyQueue.length === 0) {
      if (pendingProcesses.length > 0) {
        currentTime = pendingProcesses[0].arrivalTime;
        continue;
      }
    }

    readyQueue.sort((a, b) => {
      if (a.burstTime === b.burstTime) {
        if (a.arrivalTime === b.arrivalTime) {
          const idA = parseInt(a.id.replace(/\D/g, ''), 10);
          const idB = parseInt(b.id.replace(/\D/g, ''), 10);
          return idA - idB;
        }
        return a.arrivalTime - b.arrivalTime;
      }
      return a.burstTime - b.burstTime;
    });

    const currentProcess = readyQueue.shift();

    const waitTime = currentTime - currentProcess.arrivalTime;
    const turnaroundTime = waitTime + currentProcess.burstTime;

    timeline.push({
      processId: currentProcess.id,
      time: currentTime,
      duration: currentProcess.burstTime
    });

    resultProcesses.push({
      ...currentProcess,
      waitTime: waitTime,
      turnaroundTime: turnaroundTime
    });

    currentTime += currentProcess.burstTime;
    totalWaitTime += waitTime;
    totalTurnaroundTime += turnaroundTime;
    
    completedProcessesCount++;
  }

  resultProcesses.sort((a, b) => {
    const idA = parseInt(a.id.replace(/\D/g, ''), 10);
    const idB = parseInt(b.id.replace(/\D/g, ''), 10);
    return idA - idB;
  });

  const avgWaitTime = totalProcesses > 0 ? totalWaitTime / totalProcesses : 0;
  const avgTurnaroundTime = totalProcesses > 0 ? totalTurnaroundTime / totalProcesses : 0;

  return {
    processes: resultProcesses,
    avgWaitTime: avgWaitTime,
    avgTurnaroundTime: avgTurnaroundTime,
    timeline: timeline
  };
}
