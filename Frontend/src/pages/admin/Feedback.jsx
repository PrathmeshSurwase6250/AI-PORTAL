import React from 'react';
import FeedbackTable from '../../components/admin/FeedbackTable';

const Feedback = () => {
  return (
    <div>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">System Feedback</h1>
          <p className="text-gray-500 mt-1">Review feedback and sentiment from users across the portal.</p>
        </div>
      </div>
      
      <FeedbackTable />
    </div>
  );
};

export default Feedback;
