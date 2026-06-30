import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import AuctionList from './pages/AuctionList';
import AuctionDetails from './pages/AuctionDetails';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>British Auction RFQ</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<AuctionList />} />
            <Route path="/auction/:id" element={<AuctionDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
