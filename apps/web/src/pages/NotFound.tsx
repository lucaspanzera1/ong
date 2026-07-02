import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

interface NotFoundProps {
  lang: 'EN' | 'PT';
}

export function NotFound({ lang }: NotFoundProps) {
  const content = {
    EN: {
      title: '404',
      subtitle: 'Page Not Found',
      description: "The page you are looking for doesn't exist or has been moved.",
      button: 'Back to Home'
    },
    PT: {
      title: '404',
      subtitle: 'Página não encontrada',
      description: 'A página que você está procurando não existe ou foi movida.',
      button: 'Voltar ao Início'
    }
  };

  const currentContent = content[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.h1 
          className="text-9xl font-bold text-neutral-900 mb-4 tracking-tighter"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1 
          }}
        >
          {currentContent.title}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-neutral-800 mb-4">
            {currentContent.subtitle}
          </h2>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto text-lg">
            {currentContent.description}
          </p>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              <Home size={18} />
              {currentContent.button}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
