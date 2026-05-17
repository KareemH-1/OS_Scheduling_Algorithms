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

  return {
    processId,
    start,
    end: start + 1,
  };
}

function createBlocksFromTimeline(timeline) {
  const blocks = timeline
    .map((step, index) => createBlockFromTimelineStep(step, index))
    .filter((block) => block.end >= block.start);

  blocks.sort((a, b) => a.start - b.start);
  return blocks;
}

function createBlocksFromProcesses(processes) {
  const blocks = [];

  for (let i = 0; i < processes.length; i++) {
    const process = processes[i];
    let processId = process.id;
    if (processId === undefined || processId === null || processId === '') {
      processId = `P${i + 1}`;
    }

    blocks.push({
      processId,
      start: i,
      end: i + 1,
    });
  }

  return blocks;
}

function getChartBlocks(data) {
  if (data && Array.isArray(data.timeline) && data.timeline.length > 0) {
    return createBlocksFromTimeline(data.timeline);
  }

  if (data && Array.isArray(data.processes) && data.processes.length > 0) {
    return createBlocksFromProcesses(data.processes);
  }

  return [];
}

export default function GanttChart({ data }) {
  const blocks = getChartBlocks(data);

  if (blocks.length === 0) {
    return null;
  }

  const useScrollableTrack = blocks.length > 15;
  const sectionWidth = `${100 / blocks.length}%`;
  const trackClassName = useScrollableTrack ? 'gantt-track gantt-track-scrollable' : 'gantt-track';

  return (
    <section className="gantt-section">
      <h2>Gantt Chart</h2>
      <div className={trackClassName} role="list" aria-label="Scheduling timeline">
        {blocks.map((block, index) => {
          let blockStyle = { width: sectionWidth };
          if (useScrollableTrack) {
            blockStyle = { width: '78px' };
          }

          return (
            <div
              key={`${block.processId}-${block.start}-${block.end}-${index}`}
              className="gantt-block"
              role="listitem"
              style={blockStyle}
            >
              <span className="gantt-second">{block.start}</span>
              <span className="gantt-process">{block.processId}</span>
              <span className="gantt-end">{block.end}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}