import { motion } from 'framer-motion';
import { Globe, Mail } from 'lucide-react';
import { PixelCodeIcon, PixelLinkedinIcon } from '../components/Footer';

interface AboutProps {
  lang: 'EN' | 'PT';
}

const CONTENT = {
  PT: {
    title: 'Sobre Mim',
    role: 'Estudante | Entusiasta de Redes e Segurança',
    bio: [
      'Olá, sou Lucas Panzera. Sou um estudante apaixonado por explorar como a internet funciona por baixo dos panos.',
      'Tenho um grande interesse nas áreas de redes de computadores, cibersegurança e administração de sistemas.',
      'Sempre em busca de aprender coisas novas, montar laboratórios e entender a fundo a tecnologia que nos conecta.'
    ],
    skills: 'Habilidades',
    contact: 'Contato / Links',
  },
  EN: {
    title: 'About Me',
    role: 'Student | Networking & Security Enthusiast',
    bio: [
      "Hi, I'm Lucas Panzera. I'm a student passionate about exploring how the internet works under the hood.",
      "I have a strong interest in computer networking, cybersecurity, and systems administration.",
      "Always looking to learn new things, build home labs, and deeply understand the technology that connects us."
    ],
    skills: 'Skills',
    contact: 'Contact / Links',
  }
};

const SKILLS = [
  'Linux', 'Networking', 'Cybersecurity', 'Python', 'Bash',
  'Docker', 'System Administration', 'AWS', 'Proxmox', 'Firewalls'
];

export function About({ lang }: AboutProps) {
  const t = CONTENT[lang];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 w-full flex-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
                Lucas Panzera
              </h1>
              <p className="text-lg text-neutral-500 dark:text-neutral-400 font-mono bg-neutral-100 dark:bg-white/5 inline-block px-3 py-1 rounded-md border border-neutral-200 dark:border-white/10">
                {t.role}
              </p>
            </div>

            <div className="space-y-4 text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg">
              {t.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                {t.skills}
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {SKILLS.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1.5 text-sm font-mono bg-neutral-100 dark:bg-[#111111] text-neutral-700 dark:text-neutral-300 rounded-md border border-neutral-200 dark:border-neutral-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                {t.contact}
              </h2>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/lucas-panzera/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105" aria-label="LinkedIn">
                  <PixelLinkedinIcon className="w-5 h-5" />
                </a>
                <a href="https://github.com/lucaspanzera1" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105" aria-label="GitHub">
                  <PixelCodeIcon className="w-5 h-5" />
                </a>
                <a href="https://www.lucaspanzera.com/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105" aria-label="Website">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="mailto:lucassouzapanzera@gmail.com" className="p-3 rounded-xl bg-neutral-100 dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-all hover:scale-105" aria-label="Email">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
