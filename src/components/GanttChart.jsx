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
    end: start,
  };
}

function getTimelineFinalEnd(data, timeline) {
  if (data && Array.isArray(data.processes) && data.processes.length > 0) {
    const maxTurnaround = Math.max(...data.processes.map((process) => Number(process.turnaroundTime) || 0));
    if (Number.isFinite(maxTurnaround) && maxTurnaround > 0) {
      return maxTurnaround;
    }
  }

  const lastStep = timeline[timeline.length - 1];
  const lastStart = Number(lastStep?.time);
  if (Number.isFinite(lastStart)) {
    return lastStart + 1;
  }

  return timeline.length;
}

function createBlocksFromTimeline(data, timeline) {
  const blocks = timeline
    .map((step, index) => createBlockFromTimelineStep(step, index))
    .filter((block) => block.end >= block.start);

  blocks.sort((a, b) => a.start - b.start);

  const finalEnd = getTimelineFinalEnd(data, timeline);
  for (let i = 0; i < blocks.length; i++) {
    const nextBlock = blocks[i + 1];
    if (nextBlock) {
      blocks[i].end = nextBlock.start;
    } else {
      blocks[i].end = finalEnd;
    }
  }

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
    return createBlocksFromTimeline(data, data.timeline);
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
  const contentStyle = {};

  if (useScrollableTrack) {
    contentStyle.width = `${blocks.length * 78}px`;
  }

  const finalTime = blocks[blocks.length - 1].end;

  return (
    <section className="gantt-section">
      <h2>Gantt Chart</h2>
      <div className={useScrollableTrack ? 'gantt-scroll-container' : ''}>
        <div className="gantt-track" role="list" aria-label="Scheduling timeline" style={contentStyle}>
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
                <span className="gantt-process">{block.processId}</span>
              </div>
            );
          })}
        </div>

        <div className="gantt-time-axis" aria-hidden="true" style={contentStyle}>
          {blocks.map((block, index) => {
            let cellStyle = { width: sectionWidth };
            if (useScrollableTrack) {
              cellStyle = { width: '78px' };
            }

            return (
              <div key={`time-${block.processId}-${block.start}-${index}`} className="gantt-time-cell" style={cellStyle}>
                <span className="gantt-time-marker" />
                <span className="gantt-time-label">{block.start}</span>
              </div>
            );
          })}

          <div className="gantt-time-cell gantt-time-cell-last">
            <span className="gantt-time-marker" />
            <span className="gantt-time-label">{finalTime}</span>
          </div>
        </div>
      </div>
    </section>
  );
}