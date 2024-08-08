import React, { useState, useEffect } from 'react';
import './AppointmentScheduler.css';

const AppointmentScheduler = () => {
  const [advisors, setAdvisors] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all advisors on component mount
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

  // Fetch availability when an advisor is selected
  useEffect(() => {
    if (selectedAdvisor) {
      const fetchAvailability = async () => {
        try {
          const response = await fetch('http://your-server-path/api/fetch_advisor_availability.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ advisor_id: selectedAdvisor })
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();

          if (data.error) {
            throw new Error(data.message || 'Error fetching availability');
          }

          setAvailability(data.availability);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchAvailability();
    }
  }, [selectedAdvisor]);

  if (loading) return <p>Loading advisors...</p>;
  if (error) return <p>Error: {error}</p>;

  const selectedAdvisorData = advisors.find(advisor => advisor.AdvisorId === selectedAdvisor);

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
                key={advisor.AdvisorId}
                className={selectedAdvisor === advisor.AdvisorId ? 'selected' : ''}
                onClick={() => setSelectedAdvisor(advisor.AdvisorId)}
              >
                <div className="advisor-icon">{advisor.AdvisorId}</div>
                <div className="advisor-name">{advisor.Name}</div>
              </li>
            ))}
          </ul>
          <button className="continue-button">Continue</button>
        </div>
        <div className="slot-selection">
          {selectedAdvisorData && (
            <>
              <h3>Selected Advisor: {selectedAdvisorData.Name}</h3>
              <div className="time-slots">
                {availability.length > 0 ? (
                  availability.map((slot, index) => (
                    <div key={index} className="time-slot">
                      <span>{new Date(slot.date).toLocaleDateString()}</span>
                      <span>{slot.start_time} - {slot.end_time}</span>
                    </div>
                  ))
                ) : (
                  <p>No available slots for this advisor.</p>
                )}
              </div>
            </>
          )}
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
