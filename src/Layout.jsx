import './Layout.css';
export default function Layout({ children }) {
  return (
    <main className='layout'>
      {children}
      WASD or arrow keys for moving. R for reset.
    </main>
  );
}
