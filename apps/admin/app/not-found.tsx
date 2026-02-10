export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: 0 }}>404</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>页面不存在</p>
      <a href="/login" style={{ color: '#1890ff', textDecoration: 'underline' }}>返回登录</a>
    </div>
  );
}
