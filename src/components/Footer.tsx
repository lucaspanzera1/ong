export function Footer() {
  return (
    <footer id="contact" className="border-t border-black/5 dark:border-white/5 mt-20 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="text-sm text-neutral-500 dark:text-neutral-500">
          © {new Date().getFullYear()} Panzera.
        </div>

        <div className="flex items-center gap-6 mt-2 md:mt-0">
          <a href="https://github.com/lucaspanzera1" className="text-sm font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/lucas-panzera/" className="text-sm font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
