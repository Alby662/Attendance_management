'use client';

import React, { ReactNode } from 'react';
import { MembersProvider } from './members-context';
import { AttendanceProvider } from './attendance-context';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <MembersProvider>
      <AttendanceProvider>
        {children}
      </AttendanceProvider>
    </MembersProvider>
  );
};
