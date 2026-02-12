# Mapa de Locais Favoritos

Aplicação web para visualizar um mapa interativo, buscar endereços, marcar locais e salvar favoritos com persistência local.

## Tecnologias e Decisões Técnicas

| Tecnologia                              | Motivo                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------ |
| **React 19 + Vite 7**                   | Base moderna com HMR rápido e build otimizado                            |
| **TypeScript**                          | Tipagem estática para segurança e produtividade                          |
| **TailwindCSS 4**                       | Estilização utilitária, responsiva e sem CSS custom desnecessário        |
| **Google Maps JavaScript API**          | Mapa interativo com ampla documentação e ecossistema                     |
| **Google Geocoding API**                | Conversão de endereço para coordenadas (lat/lng)                         |
| **@react-google-maps/api**              | Componentes React declarativos para o Google Maps                        |
| **React Query (@tanstack/react-query)** | Gerenciamento de requisições assíncronas com cache, loading e erro       |
| **Zustand**                             | Gerenciamento de estado global leve e simples, com middleware de persist |
| **React Router DOM**                    | Roteamento SPA                                                           |
| **localStorage**                        | Persistência dos favoritos entre sessões (via Zustand persist)           |

## Estrutura do Projeto

```
src/
├── main.tsx                          # Bootstrap da aplicação
├── App.tsx                           # Rotas (React Router)
├── styles/index.css                  # Tailwind + tema
├── app/providers.tsx                 # Providers (QueryClient, Router, Google Maps)
├── config/env.ts                     # Variáveis de ambiente e constantes
├── types/map.ts                      # Interfaces TypeScript
├── stores/favoritesStore.ts          # Estado global (Zustand + persist)
├── hooks/useGeocode.ts               # Hook de geocoding (React Query)
├── components/
│   ├── ui/                           # Componentes reutilizáveis (Button, Input)
│   ├── map/
│   │   ├── MapView.tsx               # Mapa interativo
│   │   └── SaveLocationPanel.tsx     # Painel para salvar local clicado
│   ├── search/AddressSearch.tsx      # Busca de endereço
│   └── favorites/FavoritesList.tsx   # Lista de locais favoritos
└── pages/MapPage.tsx                 # Página principal
```

## Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- npm 9+
- Chave de API do Google com **Maps JavaScript API** e **Geocoding API** ativadas

### Passos

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd project-frontend-ivara
```

2. Instale as dependências:

```bash
npm install
```

3. Configure a variável de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e insira sua chave:

```
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Acesse no navegador: [http://localhost:5173](http://localhost:5173)

### Build para produção

```bash
npm run build
npm run preview
```

## Funcionalidades

- **Mapa interativo** centralizado em Uberlândia-MG
- **Busca de endereço** com geocoding e marcador automático
- **Clique no mapa** exibe coordenadas e opção de salvar
- **Favoritos persistentes** com nome, latitude e longitude
- **Lista interativa** — clicar em um favorito centraliza o mapa
- **Layout responsivo** — sidebar lateral (desktop) ou superior (mobile)
- **Loading e erros** tratados via React Query

## Obtendo a Chave da API Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative as APIs: **Maps JavaScript API** e **Geocoding API**
4. Em Credenciais, crie uma **Chave de API**
5. Em Credenciais, clique na chave de API, selecione **Restringir chave** e selecione **Maps JavaScript API** e **Geocoding API**
6. Copie a chave para o arquivo `.env`
