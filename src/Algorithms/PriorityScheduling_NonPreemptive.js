export default function returnAlgoData(data) {
  const processes = data.processes.map((p) => ({
    ...p,
    arrivalTime: p.arrivalTime || 0,
  }));

  // Sort by priority (lower number = higher priority)
  const sortedProcesses = [...processes].sort(
    (a, b) => a.priority - b.priority,
  );

  const result = [];
  const timeline = [];
  let currentTime = 0;

  sortedProcesses.forEach((process) => {
    // If process arrives after current time, idle until arrival
    if (process.arrivalTime > currentTime) {
      currentTime = process.arrivalTime;
    }

    const startTime = currentTime;
    const endTime = startTime + process.burstTime;
    const waitTime = startTime - process.arrivalTime;
    const turnaroundTime = endTime - process.arrivalTime;

    result.push({
      id: process.id,
      burstTime: process.burstTime,
      arrivalTime: process.arrivalTime,
      priority: process.priority,
      waitTime,
      turnaroundTime,
    });

    timeline.push({
      time: startTime,
      processId: process.id,
      duration: process.burstTime,
    });

    currentTime = endTime;
  });

  // Calculate averages
  const avgWaitTime =
    result.reduce((sum, p) => sum + p.waitTime, 0) / result.length;
  const avgTurnaroundTime =
    result.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.length;

  return {
    processes: result,
    avgWaitTime,
    avgTurnaroundTime,
    timeline,
  };
}
