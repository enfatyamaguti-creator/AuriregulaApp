# AuriRegula Pro

**Auriculoterapia Clínica Baseada no Raciocínio Neurofisiológico**
Método R.E.G.U.L.A.® — Ferramenta de apoio clínico integrativo

---

## Pré-requisitos

- [Node.js 18+](https://nodejs.org/) — **instalar antes de tudo**
- Conta no [Supabase](https://supabase.com) (gratuita)

---

## Instalação

### 1. Instalar Node.js

Baixe e instale em: https://nodejs.org/  
Escolha a versão **LTS**. Reinicie o computador após instalar.

Verifique a instalação:
```bash
node --version
npm --version
```

### 2. Instalar dependências do projeto

Abra o terminal na pasta do projeto e rode:
```bash
npm install
```

### 3. Configurar Supabase

1. Acesse https://supabase.com e crie um projeto gratuito
2. No painel do Supabase: **Settings → API**
3. Copie `Project URL` e `anon public key`
4. Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 4. Criar o banco de dados

No Supabase: **SQL Editor → New query**

Execute nesta ordem:
1. Cole e execute o conteúdo de `database/schema.sql`
2. Cole e execute o conteúdo de `database/seed-pontos.sql`

### 5. Adicionar a imagem da orelha

Coloque o arquivo `ORELHA.png` em:
```
public/images/ORELHA.png
```

*(imagem 425×390px do pavilhão auricular feminino)*

### 6. Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Estrutura do Projeto

```
src/
├── app/                    # Páginas (Next.js App Router)
│   ├── page.tsx            # Home / Dashboard
│   ├── protocolos/         # Biblioteca de protocolos
│   ├── avaliacao/          # Formulário e resultado
│   ├── mulher/             # Módulo Saúde da Mulher
│   ├── populacoes/         # Populações especiais
│   ├── pacientes/          # Prontuários
│   └── ebook/              # Leitor de capítulos
├── components/
│   ├── MapaAuricular/      # Mapa SVG interativo
│   ├── Layout/             # Header, BottomNav, etc.
│   ├── ProtoCard/          # Card de protocolo
│   └── Formulario/         # Avaliação clínica
├── lib/
│   ├── protocolos.ts       # Dados dos protocolos
│   ├── pontos-auriculares.ts # Coordenadas dos pontos
│   ├── capitulos.ts        # Conteúdo do ebook
│   ├── supabase.ts         # Cliente Supabase
│   └── utils.ts            # Utilitários
├── types/
│   └── index.ts            # Tipos TypeScript
database/
├── schema.sql              # Estrutura do banco
└── seed-pontos.sql         # 34 pontos auriculares
public/
└── images/
    └── ORELHA.png          # Imagem do pavilhão (você fornece)
```

---

## Deploy (Vercel)

1. Crie conta em https://vercel.com
2. Conecte ao repositório GitHub
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático a cada `git push`

---

## Próximas funcionalidades

- [ ] Autenticação completa (login/cadastro)
- [ ] Painel administrativo (CRUD de protocolos)
- [ ] Exportar PDF do prontuário
- [ ] Busca global
- [ ] Modo escuro
- [ ] Favoritos sincronizados
- [ ] 130+ protocolos completos

---

*"Seu corpo não está apenas doente. Muitas vezes, ele está desregulado."*
— Método R.E.G.U.L.A.®
