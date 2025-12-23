import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Proposals from './pages/Proposals';
import Following from './pages/Following';
import AllProposals from './pages/AllProposals';
import TopicProposals from './pages/TopicProposals';
import ProposalsLayout from './pages/ProposalsLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route element={<ProposalsLayout />}>
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/proposals/following" element={<Following />} />
            <Route path="/proposals/all" element={<AllProposals />} />
          </Route>
          <Route path="/proposals/:topicId" element={<TopicProposals />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
