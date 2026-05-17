function getStepProcessId(step, index) {
  if (step && step.processId !== undefined && step.processId !== null && step.processId !== '') {
    return step.processId;
  }
  if (step && step.id !== undefined && step.id !== null && step.id !== '') {
    return step.id;
  }
  return `P${index + 1}`;
}

function createBlockFromTimelineStep(step, index) {
  const processId = getStepProcessId(step, index);
  const time = Number(step?.time);
  const start = Number.isFinite(time) ? time : index;
  return { processId, start, end: start };
}

function getTimelineFinalEnd(data, timeline) {
  if (data && Array.isArray(data.processes) && data.processes.length > 0) {
    const maxTurnaround = Math.max(...data.processes.map((p) => Number(p.turnaroundTime) || 0));
    if (Number.isFinite(maxTurnaround) && maxTurnaround > 0) return maxTurnaround;
  }
  const lastStep = timeline[timeline.length - 1];
  const lastStart = Number(lastStep?.time);
  if (Number.isFinite(lastStart)) return lastStart + 1;
  return timeline.length;
}

function createBlocksFromTimeline(data, timeline) {
  const blocks = timeline
    .map((step, index) => createBlockFromTimelineStep(step, index))
    .filter((block) => block.end >= block.start);

  blocks.sort((a, b) => a.start - b.start);

  const finalEnd = getTimelineFinalEnd(data, timeline);
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].end = blocks[i + 1] ? blocks[i + 1].start : finalEnd;
  }
  return blocks;
}

function createBlocksFromProcesses(processes) {
  return processes.map((process, i) => ({
    processId: process.id || `P${i + 1}`,
    start: i,
    end: i + 1,
  }));
}

function getChartBlocks(data) {
  if (data && Array.isArray(data.timeline) && data.timeline.length > 0)
    return createBlocksFromTimeline(data, data.timeline);
  if (data && Array.isArray(data.processes) && data.processes.length > 0)
    return createBlocksFromProcesses(data.processes);
  return [];
}

export default function GanttChart({ data }) {
  const blocks = getChartBlocks(data);
  if (blocks.length === 0) return null;

  const totalStart = blocks[0].start;
  const totalEnd = blocks[blocks.length - 1].end;
  const totalDuration = totalEnd - totalStart || 1;

  const widthPercent = (block) =>
    `${((block.end - block.start) / totalDuration) * 100}%`;

  const offsetPercent = (time) =>
    `${((time - totalStart) / totalDuration) * 100}%`;

  return (
    <section className="gantt-section">
      <h2>Gantt Chart</h2>
      <div className="gantt-track" role="list" aria-label="Scheduling timeline">
        {blocks.map((block, index) => (
          <div
            key={`${block.processId}-${block.start}-${block.end}-${index}`}
            className="gantt-block"
            role="listitem"
            style={{ width: widthPercent(block) }}
          >
            <span className="gantt-process">{block.processId}</span>
          </div>
        ))}
      </div>

      <div className="gantt-time-axis" aria-hidden="true">
        {blocks.map((block, index) => (
          <div
            key={`time-${block.processId}-${block.start}-${index}`}
            className="gantt-time-cell"
            style={{ left: offsetPercent(block.start) }}
          >
            <span className="gantt-time-marker" />
            <span className="gantt-time-label">{block.start}</span>
          </div>
        ))}
        <div className="gantt-time-cell" style={{ left: offsetPercent(totalEnd) }}>
          <span className="gantt-time-marker" />
          <span className="gantt-time-label">{totalEnd}</span>
        </div>
      </div>
    </section>
  );
}