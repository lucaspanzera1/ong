import { Header } from './components/Header';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen selection:bg-neutral-200">
      <Header />
      <main>
        <Projects />
      </main>
      <Footer />
    </div>
  );
}

export default App;
