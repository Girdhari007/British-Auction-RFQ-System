import React from 'react';

function ActivityLog({ activities }) {
  if (!activities || activities.length === 0) {
    return <div className="activity-log"><p>No activities recorded</p></div>;
  }

  return (
    <div className="activity-log">
      <h3>Activity Log</h3>
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>
            <span className="timestamp">
              {new Date(activity.timestamp).toLocaleString()}
            </span>
            <span className="action">{activity.action}</span>
            <span className="details">{activity.details}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityLog;
