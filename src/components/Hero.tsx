import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section id="about" className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-[70vh] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-sm tracking-wider text-neutral-500 uppercase">System Online</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 mb-6">
          Exploring tech, <br className="hidden md:block" />
          <span className="text-neutral-400">code & security.</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mb-10 font-light leading-relaxed">
          Hi, I'm a technology enthusiast focused on software engineering and cybersecurity. This is where I share my personal projects, experiments, and learnings.
        </p>

        <motion.a
          href="#projects"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-none text-sm font-medium hover:bg-neutral-800 transition-colors font-mono"
        >
          ./view-projects.sh
        </motion.a>
      </motion.div>
    </section>
  );
}
