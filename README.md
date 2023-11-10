# my-trendingvids-webapp

![NextJS](https://img.shields.io/badge/NextJS-cyan)
![Next-Auth](https://img.shields.io/badge/NextAuth.js-yellow)
![MongoDB](https://img.shields.io/badge/MongoDB-green)
![Prisma](https://img.shields.io/badge/Prisma-green)
![TailwindCss](https://img.shields.io/badge/Tailwind--CSS-red)
![Responsive](https://img.shields.io/badge/Responsive-red)
![Github](https://img.shields.io/badge/Github-blue)
![Vercel](https://img.shields.io/badge/Vercel-black)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
![maintained](https://img.shields.io/badge/Maintained%3F-yes-green)
![ask](https://img.shields.io/badge/Ask_me-anything-green)
[![Preflight](https://github.com/thouel/my-trendingvids-webapp/actions/workflows/preflight.yml/badge.svg)](https://github.com/thouel/my-trendingvids-webapp/actions/workflows/preflight.yml)
[![Vercel Production Deployment](https://github.com/thouel/my-trendingvids-webapp/actions/workflows/deploy.yml/badge.svg)](https://github.com/thouel/my-trendingvids-webapp/actions/workflows/deploy.yml)

A responsive webapp to visualize the current TV shows and movies trends :

- Shows the trends sorted by genres
- Able to filter by popularity and keyword
- Save favorite shows in your own-crafted list

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Test](#test)
- [Usage](#usage)
- [Example](#example)
- [CI](#ci)
- [Maintainers](#maintainers)
- [License](#license)

## Background

App used to step in dev world. My main focuses were:

- understand the mechanics of a JS react framework : NextJs v13 with the App router does the trick
- have a responsive designed web application (for mobile and desktop)
- have an automatic deployment pipeline
- store data in a cloud database
- build a continuous integration & deployment pipeline

Using:

- [NextJs @13.4.19](https://nextjs.org/) to organize the app, using the [App Router](https://nextjs.org/docs/app)
- [The Movie DataBase API](https://developer.themoviedb.org/docs) to fetch trends when needed
- [Next-Auth](https://next-auth.js.org/getting-started/introduction) to easily setup a signin/signup/signout mechanism with Github provider
- [MongoDB](https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/) to store authentication and app data (user logged in and fav'ed shows currently)
- [Prisma](https://www.prisma.io/docs/concepts/database-connectors/mongodb) to connect to MongoDB
- [TailwindCSS](https://tailwindcss.com/docs/guides/nextjs) for pages styling
- [Github](https://github.com/thouel/my-trendingvids-webapp/tree/main) to host app sources
- [GitHub Actions](https://github.com/thouel/my-trendingvids-webapp/actions) to automate continuous integration & fire Vercel deployment
- [Vercel](https://vercel.com/) to deploy automatically (after each push on main) [@see here](https://my-trendingvids-webapp.vercel.app)
- ~~[Playwright](https://playwright.dev)~~ [Cypress](https://docs.cypress.io/guides/overview/why-cypress) to write UI and API tests. They are started in [Preflight](https://github.com/thouel/my-trendingvids-webapp/actions/workflows/preflight.yml/) (GitHub Action) before deploying to Vercel

## Install

```
$ npm i react@latest react-dom@latest next@13.4.19
```

## Test

We use [gmail-tester](https://www.npmjs.com/package/gmail-tester) to get signin mails.
To set it up or in case you see an `invalid_grant` error, please follow the steps 2. and 3. of the gmail-tester npm page.

You need to set the `credentials.json` and `token.json` files in the directory `mail-tester` at the root of the application. See mail-tester.example

## Usage

We use [TMDB API](https://developer.themoviedb.org/docs) to fetch live data of trending movies and tvshows. You need to get your own API_KEY in order to make it work.

We use [MongoDB Atlas](https://www.mongodb.com/atlas/database) as mongodb host. You can get your own and set up the uri.

We use a gmail account to send magic links to the users who want to signin. To set this up, you need to [create & use an app password](https://support.google.com/accounts/answer/185833?sjid=12187193246270210576-EU). Preferably, you will use a side-account to do that. Do not use your main. You also can use a custom smtp server.

```
$ npm run dev
```

## Example

[Latest deployment of main branch on Vercel](https://my-trendingvids-webapp.vercel.app/)

## CI

After each push on _main_ branch, we build, lint, run tests and then build. On success build, we deploy on prod env.

## Maintainers

[@https://github.com/thouel](https://github.com/thouel)

## License

MIT © 2023 Thibault Houel
