import React from "react";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Ping<span>notes</span></h2>
      // features of list in ping note
      <ul>
        <li>Dashboard</li>
        <li>Notes</li>
        <li>Users</li>
        <li>Teachers</li>
        <li>Groups</li>
        <li>Subjects</li>
        <li>Files</li>
        <li>Admin</li>
      </ul>
    </aside>
  );
};

export default Sidebar;