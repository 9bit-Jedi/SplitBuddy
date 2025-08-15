import React from 'react';
import { Outlet } from 'react-router-dom';

export default function LogoOnlyLayout() {
  return (
    <div>
      <h1>Logo Only Layout</h1>
      <Outlet />
    </div>
  );
}
