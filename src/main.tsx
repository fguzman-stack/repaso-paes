import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure light mode is clean and properly applied from stored preference
try {
  const stored = localStorage.getItem('paes_user_state');
  if (stored) {
    const data = JSON.parse(stored);
    if (data.state?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } else {
    document.documentElement.classList.remove('dark');
  }
} catch {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById('root')!).render(<App />);
