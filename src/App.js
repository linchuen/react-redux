import React from 'react';
import { Example } from './component/example';
import { Industry } from './component/industry';
import { Statistics } from './component/statistics';
import { Leaderboard } from './component/leaderboard';
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Example />} />
          <Route path="growth" element={<Industry />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ position: 'sticky', top: '0', zIndex: '99' }}>
        <div className="container px-lg-5">
          <a className="navbar-brand" href="#!">Lin's 個人網站</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link active" to="/">首頁</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/growth">產業成長概況</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/statistics">股票圖表</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/leaderboard">股票成長排行表</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/nothing-here">Nothing Here</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
      <footer className="py-5 bg-dark">
        <div className="container"><p className="m-0 text-center text-white">Copyright &copy; Your Website 2022</p></div>
      </footer>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
