import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface PrivacyProps {
  lang: 'EN' | 'PT';
}

const CONTENT = {
  PT: {
    eyebrow: 'Privacidade',
    title: 'Cookies e privacidade',
    intro:
      'Esta página explica quais cookies o site usa, por que, e como você pode mudar de ideia a qualquer momento — em conformidade com a LGPD (Lei Geral de Proteção de Dados).',
    sections: [
      {
        heading: 'Cookies essenciais (sem consentimento)',
        body: [
          'ong_session: usado apenas na área administrativa, para manter a sessão de quem gerencia o conteúdo do site.',
          'ong_vid: um identificador anônimo usado para evitar votos e visualizações duplicadas em artigos (por exemplo, impedir que a mesma pessoa vote duas vezes no mesmo artigo). É estritamente necessário para essa funcionalidade e por isso não exige consentimento — hoje ele não tem expiração automática.',
        ],
      },
      {
        heading: 'Cookie de analytics (opcional, com consentimento)',
        body: [
          'ong_aid: um identificador anônimo usado apenas se você clicar em "Aceitar" no aviso de cookies. Ele nos ajuda a entender quais páginas são mais acessadas e como o tráfego varia ao longo do tempo.',
          'Por acesso, guardamos: a página visitada, o site de origem (só o domínio, nunca a URL completa), se o dispositivo é celular/tablet/computador, o navegador, e o país aproximado (calculado localmente a partir do IP — o IP em si nunca é guardado).',
          'Nada disso é enviado a terceiros. Os dados são apagados automaticamente após aproximadamente 13 meses.',
        ],
      },
      {
        heading: 'Seus direitos',
        body: [
          'Para garantir que sua navegação inicial seja tranquila e anônima, o aviso de consentimento só aparece automaticamente após 1 minuto no site.',
          'Você pode aceitar ou recusar o cookie de analytics a qualquer momento clicando no ícone de Cookie no rodapé do site.',
          'Recusar depois de ter aceitado também apaga os dados já coletados sobre você, não só os futuros.',
          'Você também pode apagar seus dados de analytics a qualquer momento pela opção "Excluir meus dados", acessível pelo mesmo ícone de Cookie no rodapé.',
        ],
      },
    ],
    back: 'cd ..',
  },
  EN: {
    eyebrow: 'Privacy',
    title: 'Cookies and privacy',
    intro:
      'This page explains which cookies the site uses, why, and how you can change your mind at any time — in line with LGPD (Brazil’s general data protection law).',
    sections: [
      {
        heading: 'Essential cookies (no consent needed)',
        body: [
          'ong_session: used only in the admin area, to keep the site content manager’s session.',
          'ong_vid: an anonymous identifier used to prevent duplicate votes and views on articles (e.g. stopping the same person from voting twice on the same article). It is strictly necessary for that feature and therefore doesn’t require consent — today it has no automatic expiry.',
        ],
      },
      {
        heading: 'Analytics cookie (optional, consent-based)',
        body: [
          'ong_aid: an anonymous identifier used only if you click "Accept" on the cookie notice. It helps us understand which pages get the most visits and how traffic changes over time.',
          'Per visit, we store: the page visited, the referring site (domain only, never the full URL), whether the device is mobile/tablet/desktop, the browser, and an approximate country (computed locally from the IP — the IP itself is never stored).',
          'None of this is sent to third parties. Data is automatically deleted after roughly 13 months.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'To ensure your initial browsing is smooth and anonymous, the consent notice only appears automatically after 1 minute on the site.',
          'You can accept or reject the analytics cookie at any time by clicking the Cookie icon in the site footer.',
          'Rejecting after having accepted also deletes data already collected about you, not just future data.',
          'You can also delete your analytics data at any time via the "Delete my data" option, accessible through the same Cookie icon in the footer.',
        ],
      },
    ],
    back: 'cd ..',
  },
};

export function Privacy({ lang }: PrivacyProps) {
  const content = CONTENT[lang];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-24 px-6 max-w-3xl mx-auto"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mb-12 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {content.back}
      </Link>

      <header className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800/50 text-neutral-900 dark:text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-mono text-sm tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
            {content.eyebrow}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6">
          {content.title}
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {content.intro}
        </p>
      </header>

      <div className="border-t border-black/10 dark:border-white/10 pt-12 flex flex-col gap-12">
        {content.sections.map(section => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              {section.heading}
            </h2>
            <div className="flex flex-col gap-3">
              {section.body.map(paragraph => (
                <p key={paragraph} className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </motion.article>
  );
}
