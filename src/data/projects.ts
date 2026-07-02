import { ExternalLink, Terminal, Shield, Cpu, Activity } from 'lucide-react';
import React from 'react';

export const projectsData = {
  EN: {
    sectionTitle: "Projects & Research",
    sectionSubtitle: "~/studies/recent-work",
    projects: [
      {
        id: 1,
        title: 'Network Scanner',
        description: 'A lightweight tool for discovering active devices and open ports on local networks. Focuses on stealth and speed.',
        content: `
## Overview
This is a **lightweight** tool for discovering active devices. It focuses on stealth and speed.

### Key Features
* Fast port scanning
* Stealthy device discovery
* Local network mapping

### Usage
\`\`\`bash
$ go run main.go -scan 192.168.1.0/24
\`\`\`

> Note: Always have permission before scanning networks.
`,
        category: 'Security',
        icon: Shield,
        tags: ['Go', 'Networking', 'CLI'],
        link: '/project/1',
      },
      {
        id: 2,
        title: 'Zero-Trust Architecture',
        description: 'A case study and implementation guide for adopting zero-trust principles in small business infrastructures.',
        content: 'This is the detailed content for Zero-Trust Architecture. Here we can write extensive details about the research, findings, and implementation.',
        category: 'Research',
        icon: Activity,
        tags: ['Architecture', 'Identity', 'Docs'],
        link: '/project/2',
      },
      {
        id: 3,
        title: 'Malware Sandbox',
        description: 'Automated environment for analyzing suspicious executables in isolated, ephemeral containers.',
        content: 'This is the detailed content for Malware Sandbox. Here we can write extensive details about the research, findings, and implementation.',
        category: 'Infrastructure',
        icon: Cpu,
        tags: ['Docker', 'Python', 'Analysis'],
        link: '/project/3',
      },
      {
        id: 4,
        title: 'SysAdmin Dashboard',
        description: 'A terminal-based monitoring dashboard for real-time server health and security log aggregation.',
        content: 'This is the detailed content for SysAdmin Dashboard. Here we can write extensive details about the research, findings, and implementation.',
        category: 'Open Source',
        icon: Terminal,
        tags: ['Rust', 'TUI', 'Linux'],
        link: '/project/4',
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
        content: 'Este é o conteúdo detalhado do Scanner de Rede. Aqui podemos escrever detalhes extensos sobre a pesquisa, descobertas e implementação.',
        category: 'Segurança',
        icon: Shield,
        tags: ['Go', 'Redes', 'CLI'],
        link: '/project/1',
      },
      {
        id: 2,
        title: 'Arquitetura Zero-Trust',
        description: 'Um estudo de caso e guia de implementação para adoção de princípios zero-trust em infraestruturas de pequenas empresas.',
        content: 'Este é o conteúdo detalhado da Arquitetura Zero-Trust. Aqui podemos escrever detalhes extensos sobre a pesquisa, descobertas e implementação.',
        category: 'Pesquisa',
        icon: Activity,
        tags: ['Arquitetura', 'Identidade', 'Docs'],
        link: '/project/2',
      },
      {
        id: 3,
        title: 'Sandbox de Malware',
        description: 'Ambiente automatizado para analisar executáveis suspeitos em contêineres efêmeros e isolados.',
        content: 'Este é o conteúdo detalhado do Sandbox de Malware. Aqui podemos escrever detalhes extensos sobre a pesquisa, descobertas e implementação.',
        category: 'Infraestrutura',
        icon: Cpu,
        tags: ['Docker', 'Python', 'Análise'],
        link: '/project/3',
      },
      {
        id: 4,
        title: 'Dashboard SysAdmin',
        description: 'Um painel de monitoramento baseado em terminal para saúde de servidores em tempo real e agregação de logs de segurança.',
        content: 'Este é o conteúdo detalhado do Dashboard SysAdmin. Aqui podemos escrever detalhes extensos sobre a pesquisa, descobertas e implementação.',
        category: 'Código Aberto',
        icon: Terminal,
        tags: ['Rust', 'TUI', 'Linux'],
        link: '/project/4',
      }
    ]
  }
};
