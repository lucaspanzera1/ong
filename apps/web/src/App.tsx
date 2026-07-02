import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';
import { ProjectDetails } from './pages/ProjectDetails';
import { Admin } from './pages/Admin';
import { Tags } from './pages/Tags';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFound } from './pages/NotFound';

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

function App() {
  const [lang, setLang] = useState<'EN' | 'PT'>('EN');

  return (
    <Router>
      <div className="min-h-[100dvh] selection:bg-neutral-200 flex flex-col">
        <Header lang={lang} setLang={setLang} />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Projects lang={lang} />} />
            <Route path="/project/:id" element={<ProjectDetails lang={lang} />} />
            <Route path="/tags" element={<Tags lang={lang} />} />
            <Route
              path={ADMIN_PATH}
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound lang={lang} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
