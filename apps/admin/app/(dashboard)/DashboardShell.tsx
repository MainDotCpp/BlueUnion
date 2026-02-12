'use client';

import React from 'react';
import { ThemedLayoutV2, ThemedTitleV2 } from '@refinedev/antd';
import { Layout as AntdLayout } from 'antd';

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemedLayoutV2
      Title={(props) => (
        <ThemedTitleV2
          {...props}
          text="蓝聚出海"
          icon={
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ED1' }}>
              🌊
            </span>
          }
        />
      )}
    >
      <AntdLayout.Content
        style={{
          padding: '24px',
          minHeight: '100vh',
        }}
      >
        {children}
      </AntdLayout.Content>
    </ThemedLayoutV2>
  );
}
