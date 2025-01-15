import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import Home from './pages/Home.tsx';
import Wagmi from './pages/Wagmi.tsx';
import Rainbow from './pages/Rainbow.tsx';
import Appkit from './pages/Appkit.tsx';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/wagmi">Wagmi</Link>
          </li>
          <li>
            <Link to="/rainbow">Rainbow</Link>
          </li>
          <li>
            <Link to="/appkit">Appkit</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="wagmi" element={<Wagmi />} />
          <Route path="rainbow" element={<Rainbow />} />
          <Route path="appkit" element={<Appkit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
