import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';
import { ProjectDetails } from './pages/ProjectDetails';

function App() {
  const [lang, setLang] = useState<'EN' | 'PT'>('EN');

  return (
    <Router>
      <div className="min-h-screen selection:bg-neutral-200">
        <Header lang={lang} setLang={setLang} />
        <main>
          <Routes>
            <Route path="/" element={<Projects lang={lang} />} />
            <Route path="/project/:id" element={<ProjectDetails lang={lang} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
