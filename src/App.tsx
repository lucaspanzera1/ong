import { useState } from 'react';
import { Header } from './components/Header';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';

function App() {
  const [lang, setLang] = useState<'EN' | 'PT'>('EN');

  return (
    <div className="min-h-screen selection:bg-neutral-200">
      <Header lang={lang} setLang={setLang} />
      <main>
        <Projects lang={lang} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
