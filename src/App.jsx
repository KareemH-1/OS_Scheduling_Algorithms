import { useState } from 'react';
import AlgoPage from './AlgoPage.jsx';

export default function App() {
  const [currentAlgo, setCurrentAlgo] = useState(' ');

  const members = [
    {
      name: "Kareem Ahmed",
      id: "254915",
      img: "https://github.com/KareemH-1.png"
    },
    {
      name: "Mazen Mahmoud",
      id: "254720",
      img: "https://github.com/MazenMDev.png"
    },
    {
      name: "Mostafa Mohamed",
      id: "254595",
      img: "https://github.com/mostafamohamedsaeed152.png"
    },
    {
      name: "Mohanad Yasser",
      id: "255245",
      img: "https://github.com/Mohanadyasser-eng.png"
    },
    {
      name: "Hazem Hesham",
      id: "252864",
      img: "https://github.com/Zoomacs.png"
    }
  ];

  function changeMainContent(algo) {
    setCurrentAlgo(algo);
  }

  function renderMainContent() {
    if (currentAlgo !== ' ') {
      return (
        <div>
          <button onClick={() => changeMainContent(' ')}>
            ↩ Go Back
          </button>
          <AlgoPage algo={currentAlgo} />
        </div>
      );
    }

    return (
      <div>
        <div className="header">
          <h1>Operating Systems Job Scheduling Algorithms</h1>
          <p>
            This is an implementation of{' '}
            <span>First Come First Serve (FCFS)</span>
            <span>Shortest Job First Preemptive (SJF)</span>
            <span>Shortest Job First Non-Preemptive (SJF)</span>
            <span>Priority Scheduling Preemptive</span>
            <span>Priority Scheduling Non- Preemptive</span>
            <span>Round Robin (RR)</span>
          </p>
        </div>

        <h1 className="select-algo-title">Select an Algorithm</h1>
        <div className="Algorithms-grid"> 
          <button onClick={() => changeMainContent('FCFS')}>
            First Come First Serve (FCFS)
          </button>
          <button onClick={() => changeMainContent('SJF-P')}>
            Shortest Job First Preemptive (SJF)
          </button>
          <button onClick={() => changeMainContent('SJF-NP')}>
            Shortest Job First Non-Preemptive (SJF)
          </button>
          <button onClick={() => changeMainContent('PS-P')}>
            Priority Scheduling Preemptive
          </button>
          <button onClick={() => changeMainContent('PS-NP')}>
            Priority Scheduling Non- Preemptive
          </button>
          <button onClick={() => changeMainContent('RR')}>
            Round Robin (RR)
          </button>
        </div>

        <div className="Credits">
          <h2>This is a Course Project for Operating Systems Concepts Course (CS251x)</h2>
          <h3>Team Members</h3>
          <div className="membersGrid">
            <div className="member">
              <div className="info">
                {members.map((member) => (
                  <div key={member.id} className="member-cont">
                    <img src={member.img} alt="Member Image" />
                    <div className="info">
                      <h2 className="Name">{member.name}</h2>
                      <h2>{member.id}</h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>{renderMainContent()}</div>;
}
