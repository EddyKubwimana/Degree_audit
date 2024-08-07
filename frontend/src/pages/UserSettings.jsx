import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Settings from '../components/Settings';
import Sidebar from '../components/SiderBar';
import './Dashboard.css';

const UserSettings = () => {
  const [user, setUser] = useState({
    name: 'Eddy Kubwimana',
    email: 'eddy.kubwimana@ashesi.edu.gh',
  });

  const handleUpdateUser = (updatedUser) => {
    setUser({
      ...user,
      ...updatedUser,
    });
  };

  return (
    <div className = "dashboard">
       <Sidebar/>
      <Settings user={user} onUpdate={handleUpdateUser} />
    </div>
  );
};
export default UserSettings;
