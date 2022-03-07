import { Card, Spin } from 'antd';

export function GlobalLoading() {
  return (
    <Card
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spin />
    </Card>
  );
}
