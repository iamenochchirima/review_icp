import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Proposals from './pages/Proposals';
import AllProposals from './pages/AllProposals';
import TopicProposals from './pages/TopicProposals';
import ProposalDetails from './pages/ProposalDetails';
import ProposalsLayout from './pages/ProposalsLayout';
import Learn from './pages/Learn';
import LearnTopic from './pages/LearnTopic';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route element={<ProposalsLayout />}>
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/proposals/all" element={<AllProposals />} />
          </Route>
          <Route path="/proposals/:topicId" element={<TopicProposals />} />
          <Route path="/proposal/:proposalId" element={<ProposalDetails />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:topicId" element={<LearnTopic />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
