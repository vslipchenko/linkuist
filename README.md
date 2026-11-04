# Linkuist

**Linkuist** is a link-management service with a social layer. Save links as **Linkards**: rich link cards with a note, tags and an automatic preview. Organize them as private or public, and share thoughts through posts, comments and replies on your profile.

Built on a **MEAN + GraphQL** stack: MongoDB, Express, Angular, Node.js and Apollo.

> ⚠️ **Status:** work in progress. See the [Roadmap](#roadmap).

---

## Features

### Linkards
- Save any URL as a **Linkard**, with an optional **note** and **tags**.
- Mark a Linkard **private** or **public**, and flag it as **paid** content.
- **Automatic link previews.** The server fetches the page and pulls out its title, site name, description, preview image and favicon from Open Graph and standard meta tags. It follows redirects, falls back between user agents, and times out quickly so slow sites don't hold anything up.
- Each user has their own Linkards page at `/:username/linkards`.

### Profiles and posts
- Public profiles at `/:username`, with avatar, background image, name, bio and a **verified** badge. Edit your profile at `/:username/settings/profile`.
- **Posts** on your profile, with **like** / **dislike** and **share** (repost).
- **Comments** on posts and **replies** to comments, each with its own like / dislike.
- Posts, comments and replies load 8 at a time.

### Accounts and UI
- Sign up and sign in with email, username and password. Passwords are hashed with bcrypt.
- JWT access tokens and refresh tokens. Each user has a per-user `accessKey`, so their tokens can be revoked.
- The UI is in **English** and **Russian** (ngx-translate).
- Installable as a PWA (web app manifest).

## Tech stack

| Layer | Technologies |
|---|---|
| **Client** (`src/client`) | Angular 13, Angular Material, Apollo Angular (GraphQL), [`@ng-estate/store`](https://www.npmjs.com/package/@ng-estate/store) (state), ngx-translate, RxJS, SCSS |
| **Server** (`src/server`) | Node.js, TypeScript, Express, Apollo Server 3 (GraphQL), MongoDB via Mongoose 6, bcrypt, jsonwebtoken, dotenv |
| **Tooling** | ESLint, Prettier, Stylelint, Husky + lint-staged, Karma + Jasmine, Protractor, Postman collection |

## Project structure

```
linkuist/
├── postman/
│   └── Linkuist.postman_collection.json
└── src/
    ├── client/                           # Angular app
    │   ├── proxy.conf.json               # Proxies /graphql → http://localhost:4300
    │   └── src/
    │       ├── app/
    │       │   ├── modules/
    │       │   │   ├── home/
    │       │   │   ├── sign-in/  sign-up/
    │       │   │   ├── profile/          # Profile page + posts, comments, replies
    │       │   │   └── linkards/         # User's Linkards page
    │       │   ├── shared/components/    # Linkard card, chips, dialogs, elastic input,
    │       │   │                         #   length counter, navigation, ...
    │       │   ├── graphql/              # Queries & mutations per domain
    │       │   ├── services/             # Domain services
    │       │   ├── store/                # App state
    │       │   ├── guards/ resolvers/ interceptors/
    │       │   └── types/ utilities/ constants/
    │       └── assets/i18n/              # en / ru translations
    └── server/                           # GraphQL API
        └── src/
            ├── app.ts                    # Express + Apollo bootstrap, Mongo connection
            ├── environments/             # .env.dev / .env.prod
            ├── models/                   # Mongoose models
            ├── graphql/
            │   ├── schema.ts
            │   ├── schemas/              # One folder per domain
            │   └── scalars/
            ├── utilities/url-metadata.ts # Link preview scraper
            └── constants/ types/ utilities/
```

### Data models

`User`, `Profile`, `Linkard`, `Post`, `PostStats`, `PostComment`, `PostCommentStats`, `PostReply`, `PostReplyStats`

The `*Stats` collections store each user's like or dislike for a given item.

## Getting started

### Prerequisites

- **Node.js** 16+ and npm
- **MongoDB**, running locally by default

### 1. Server

```bash
cd src/server
npm install
```

The server reads its config from `src/environments/.env.<env>`. Pick the file with the `--env` flag: `dev` loads `.env.dev`, `prod` loads `.env.prod`.

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` / `production` |
| `APP_PORT` | API port (default `4300`) |
| `MONGODB_URI` | MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/linkuist` |
| `ACCESS_JWT_SECRET` | Access token signing secret |
| `REFRESH_JWT_SECRET_FRAGMENT` | Refresh token secret fragment. It's combined with the user's `accessKey`, so tokens can be revoked per user. |
| `ACCESS_JWT_EXPIRES_IN`, `REFRESH_JWT_EXPIRES_IN` | Token lifetimes, e.g. `1d`, `30d` |

Start the API:

```bash
npm run dev     # uses .env.dev, with hot reload
```

The GraphQL endpoint is at `http://localhost:4300/graphql`.

### 2. Client

```bash
cd src/client
npm install
npm run debug   # ng serve with /graphql proxied to the API
```

Open <http://localhost:4200>.

## Scripts

**Client** (`src/client`)

| Command | Description |
|---|---|
| `npm start` | Dev server |
| `npm run debug` | Dev server with the API proxy |
| `npm run build` | Production build |
| `npm test` | Unit tests (Karma + Jasmine) |
| `npm run e2e` | End-to-end tests (Protractor) |

**Server** (`src/server`)

| Command | Description |
|---|---|
| `npm run dev` | Run with `.env.dev` and hot reload |
| `npm run prod` | Run with `.env.prod` |
| `npm run build` | Compile TypeScript |

## API

The API is a single GraphQL endpoint at `/graphql`. Authenticated operations expect the header `Authorization: Bearer <accessToken>`.

| Area | Operations |
|---|---|
| Auth | `signIn`, `accessTokenByRefreshToken` |
| Users | `createUser`, `userEmailByEmail`, `userIdByUsername` |
| Profiles | `profileByUserId`, `profileByUsername`, `updateProfile` |
| Linkards | `linkardsByUserId`, `createLinkard` |
| Posts | `postsByUserId`, `createPost`, `deletePost`, `likePost`, `sharePost` |
| Comments | `postCommentsByPostId`, `createPostComment`, `deletePostComment`, `likePostComment` |
| Replies | `postRepliesByCommentId`, `createPostReply`, `deletePostReply`, `likePostReply` |
| Shared | `clientPreset` |

To try the API, import `postman/Linkuist.postman_collection.json` into Postman.

## Roadmap

- [x] Replies: create, delete, show/hide
- [x] Liking and sharing
- [ ] Connections / friends, and searching for them
- [ ] Message inbox
- [ ] Payment system (for paid Linkards)
- [ ] Dedicated post page
- [ ] Proper user input sanitization
- [ ] API rate limiting
- [ ] Tree-shake unused GraphQL types
- [ ] Upgrade `apollo-angular` and `graphql` on the client
- [ ] Replace ngx-translate with Transloco
- [ ] Move styles to utility classes
- [ ] Keep `.env` files out of version control
