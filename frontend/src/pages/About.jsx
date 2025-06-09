import React from "react";

function About() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-base-100 rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4 text-primary">About Ticket AI</h1>
      <p className="mb-4">
        <strong>Ticket AI</strong> is a smart ticket management system designed to help users, moderators, and admins efficiently handle support requests and issues.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">How It Works</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Sign Up:</strong> Create an account as a user or moderator. Moderators can add their skills for better ticket assignment.
        </li>
        <li>
          <strong>Login:</strong> Access your dashboard based on your role.
        </li>
        <li>
          <strong>Create Tickets:</strong> Users can submit new tickets describing their issues.
        </li>
        <li>
          <strong>AI Assignment:</strong> Our AI analyzes each ticket and automatically assigns it to the most suitable moderator based on required skills and also suggest the helpful notes to resolve the issue.
        </li>
        <li>
          <strong>Track Progress:</strong> Users can view their tickets, moderators see tickets assigned to them, and admins have full visibility.
        </li>
        <li>
          <strong>Email Notifications:</strong> Moderators receive email alerts when a new ticket is assigned.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Need Help?</h2>
      <p>
        If you have queries or feedback, please write us anirudha9393@gmail.com!
      </p>
    </div>
  );
}

export default About;