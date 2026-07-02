import { motion } from 'framer-motion';
import { ExternalLink, Terminal, Shield, Cpu, Activity } from 'lucide-react';

interface ProjectsProps {
  lang: 'EN' | 'PT';
}

const content = {
  EN: {
    sectionTitle: "Projects & Research",
    sectionSubtitle: "~/studies/recent-work",
    projects: [
      {
        id: 1,
        title: 'Network Scanner',
        description: 'A lightweight tool for discovering active devices and open ports on local networks. Focuses on stealth and speed.',
        category: 'Security',
        icon: Shield,
        tags: ['Go', 'Networking', 'CLI'],
        link: '#',
      },
      {
        id: 2,
        title: 'Zero-Trust Architecture',
        description: 'A case study and implementation guide for adopting zero-trust principles in small business infrastructures.',
        category: 'Research',
        icon: Activity,
        tags: ['Architecture', 'Identity', 'Docs'],
        link: '#',
      },
      {
        id: 3,
        title: 'Malware Sandbox',
        description: 'Automated environment for analyzing suspicious executables in isolated, ephemeral containers.',
        category: 'Infrastructure',
        icon: Cpu,
        tags: ['Docker', 'Python', 'Analysis'],
        link: '#',
      },
      {
        id: 4,
        title: 'SysAdmin Dashboard',
        description: 'A terminal-based monitoring dashboard for real-time server health and security log aggregation.',
        category: 'Open Source',
        icon: Terminal,
        tags: ['Rust', 'TUI', 'Linux'],
        link: '#',
      }
    ]
  },
  PT: {
    sectionTitle: "Projetos e Pesquisa",
    sectionSubtitle: "~/estudos/trabalhos-recentes",
    projects: [
      {
        id: 1,
        title: 'Scanner de Rede',
        description: 'Uma ferramenta leve para descobrir dispositivos ativos e portas abertas em redes locais. Foco em stealth e velocidade.',
        category: 'Segurança',
        icon: Shield,
        tags: ['Go', 'Redes', 'CLI'],
        link: '#',
      },
      {
        id: 2,
        title: 'Arquitetura Zero-Trust',
        description: 'Um estudo de caso e guia de implementação para adoção de princípios zero-trust em infraestruturas de pequenas empresas.',
        category: 'Pesquisa',
        icon: Activity,
        tags: ['Arquitetura', 'Identidade', 'Docs'],
        link: '#',
      },
      {
        id: 3,
        title: 'Sandbox de Malware',
        description: 'Ambiente automatizado para analisar executáveis suspeitos em contêineres efêmeros e isolados.',
        category: 'Infraestrutura',
        icon: Cpu,
        tags: ['Docker', 'Python', 'Análise'],
        link: '#',
      },
      {
        id: 4,
        title: 'Dashboard SysAdmin',
        description: 'Um painel de monitoramento baseado em terminal para saúde de servidores em tempo real e agregação de logs de segurança.',
        category: 'Código Aberto',
        icon: Terminal,
        tags: ['Rust', 'TUI', 'Linux'],
        link: '#',
      }
    ]
  }
};

export function Projects({ lang }: ProjectsProps) {
  const currentContent = content[lang];

  return (
    <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="mb-16 border-b border-black/10 dark:border-white/10 pb-8 transition-colors duration-300">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2 transition-colors duration-300">{currentContent.sectionTitle}</h2>
        <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm transition-colors duration-300">{currentContent.sectionSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentContent.projects.map((project, index) => {
          const Icon = project.icon;
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <a 
                href={project.link}
                className="group relative flex flex-col justify-between h-full p-6 bg-white dark:bg-[#151515] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-300 transition-colors duration-300"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-neutral-900 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400 transition-colors">
                        {project.category}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-3 group-hover:underline decoration-1 underline-offset-4 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm mb-8 transition-colors">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-mono text-[10px] uppercase tracking-wider transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
