# O Projeto da Minha ONG 🚀

Fala, dev! 👋 Construí este projeto do zero para ser a plataforma definitiva (e mais performática possível) para gerenciar uma ONG. A ideia era criar um sistema completo: um front-end super rápido e moderno, e um back-end robusto, seguro e com umas sacadas muito legais que eu implementei ao longo do caminho.

Tudo aqui foi feito com muito carinho, utilizando um ecossistema moderno em um monorepo gerenciado pelo **Turborepo** e **pnpm**.

## 🛠️ A Stack que Escolhi

Fiz questão de escolher ferramentas que me dessem produtividade, mas que não abrissem mão de performance e tipagem forte ponta a ponta:

### Front-end (`apps/web`)
Para a interface, fui de **React 19** com **Vite** para ter aquele build instantâneo e uma DX maravilhosa.
- **Estilização:** **Tailwind CSS v4** (direto ao ponto e super leve).
- **Animações:** **Framer Motion** para dar aquela vida à interface.
- **Gráficos:** **Recharts** para o painel de analytics administrativo.
- **Markdown:** Utilizei **React Markdown** (com `remark-gfm`) para renderizar os artigos do blog perfeitamente.
- **Roteamento:** **React Router v7** para lidar com as páginas.
- **Linter:** Resolvi testar o **Oxlint** para ter um linting absurdamente rápido em Rust.

### Back-end (`apps/api`)
O motor por trás de tudo. Construí a API com **NestJS** (amo a organização e a arquitetura dele) e **TypeScript**, conectando a um banco **MongoDB** via **Mongoose**. 

Aqui estão algumas das lógicas mais legais que implementei no back-end:

1. **Autenticação Passwordless (Sem Senha):** 
   Cansado de gerenciar senhas esquecidas, implementei um fluxo de *Magic Links*. O administrador coloca o e-mail, a API dispara um link via **Nodemailer** e, ao clicar, ele recebe um JWT super seguro em um cookie `httpOnly` (criado com a lib `jose`). Ah, e por segurança, travei o login para um único e-mail permitido via variável de ambiente (`AUTH_ALLOWED_EMAIL`). 🔐

2. **Blog com IA Integrada:**
   Aqui foi onde eu me diverti! O sistema de artigos tem suporte nativo para português e inglês. Para não ter que traduzir tudo na mão, integrei a API da **Groq** (rodando o modelo `llama-3.3-70b-versatile`). Fiz um *prompt engineering* rigoroso para que a IA traduza o texto mantendo **absolutamente toda** a formatação original em Markdown, sem quebrar código, imagens ou links. 🤖✨

3. **Analytics Customizado (Privacy-First):**
   Eu não queria injetar scripts do Google Analytics e vazar dados dos usuários para terceiros. Então eu criei o meu próprio sistema de tracking! Ele captura visualizações anonimizando o IP e descobrindo o país (com `geoip-lite`), além de parsear o User-Agent (`ua-parser-js`) para saber o dispositivo e navegador. Tudo isso gera métricas reais para o dashboard do admin usando pipelines de agregação direto no MongoDB, e respeitando os logs de consentimento de cookies. 📊

4. **Controle Anti-fraude em Views e Votos:**
   Como o sistema permite que as pessoas deem Upvote/Downvote nos artigos e conta as visualizações, criei uma lógica pesada de *Rate Limiting* cruzando `voterHash` (derivado de cookies) e `ipHash`. Se um usuário tentar ser espertinho e ficar limpando os cookies para dar mais votos, o sistema o barra pela rede (limitei a 30 votos novos por IP por hora).

## 🚀 Como Rodar Essa Belezura

Se você quiser subir isso na sua máquina local, é muito fácil. Eu já deixei tudo engatilhado no `package.json` da raiz.

1. Instale todas as dependências do monorepo:
```bash
pnpm install
```

2. Suba o banco de dados MongoDB localmente via Docker (configurei um compose pra isso):
```bash
pnpm run docker:up
```

3. Rode tudo de uma vez (Frontend e API simultâneos) graças à magia do Turborepo:
```bash
pnpm run dev
```

*(Importante: Lembre-se de duplicar os arquivos `.env.example` para `.env` na raiz e dentro dos apps e preencher as chaves de API, como a da Groq).*

---

Espero que você curta explorar esse código tanto quanto eu curti escrevê-lo. É um projeto que junta minhas práticas favoritas de desenvolvimento web moderno. Qualquer dúvida sobre a arquitetura ou sobre as decisões que tomei, é só olhar o código (tentei deixar o mais limpo possível)! ✌️
