import React, { useState, useEffect } from 'react';
import './AppointmentScheduler.css';

const AppointmentScheduler = () => {
  const [advisors, setAdvisors] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await fetch('http://13.51.206.149/Degree_audit/backend/actions/return_advisors.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);

        if (data.error) {
          throw new Error(data.message || 'Error fetching advisors');
        }

        setAdvisors(data.advisors);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisors();
  }, []);

  if (loading) return <p>Loading advisors...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='main-content'>
      <div className="appointment-scheduler">
        <div className="advisor-selection">
          <div className="search">
            <h3>Select Advisor</h3>
            <input className="input" type="text" placeholder="Search Advisor" />
          </div>
          <ul>
            {advisors.map(advisor => (
              <li
                key={advisor.id}
                className={selectedAdvisor === advisor.id ? 'selected' : ''}
                onClick={() => setSelectedAdvisor(advisor.id)}
              >
                <div className="advisor-icon">{advisor.id}</div>
                <div className="advisor-name">{advisor.name}</div>
              </li>
            ))}
          </ul>
          <button className="continue-button">Continue</button>
        </div>
        <div className="slot-selection">
          <h3>Choose Slot</h3>
          <div className="time-slots">
            {timeSlots.map((slot, index) => (
              <div key={index} className="time-slot">
                <span>{slot.day}</span>
                <span>{slot.slots}</span>
              </div>
            ))}
          </div>
          <div>
            <h3><i>Reason for Appointment<span className="asterik">*</span></i></h3>
            <textarea
              placeholder="Reason for Appointment"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;

