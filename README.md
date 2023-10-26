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
[![Playwright Tests](https://github.com/thouel/my-trendingvids-webapp/actions/workflows/playwright.yml/badge.svg)](https://github.com/thouel/my-trendingvids-webapp/actions/workflows/playwright.yml)

A responsive webapp to visualize the current TV shows and movies trends :

- Shows the trends sorted by genres
- Able to filter by popularity and keyword
- Save favorite shows in your own-crafted list

## Table of Contents

- [Background](#background)
- [Install](#install)
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
- build a ci pipeline

Using:

- [NextJs @13.4.19](https://nextjs.org/) to organize the app, using the [App Router](https://nextjs.org/docs/app)
- [The Movie DataBase API](https://developer.themoviedb.org/docs) to fetch trends when needed
- [Next-Auth](https://next-auth.js.org/getting-started/introduction) to easily setup a signin/signup/signout mechanism with Github provider
- [MongoDB](https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/) to store authentication and app data (user logged in and fav'ed shows currently)
- [Prisma](https://www.prisma.io/docs/concepts/database-connectors/mongodb) to connect to MongoDB
- [TailwindCSS](https://tailwindcss.com/docs/guides/nextjs) for pages styling
- [Github](https://github.com/thouel/my-trendingvids-webapp/tree/main) to host app sources
- [Vercel](https://vercel.com/) to deploy automatically (after each push on main) [@see here](https://my-trendingvids-webapp.vercel.app)
- [Playwright](https://playwright.dev) to write UI and API tests. They are started with a GitHub Action started after vercel fires the deployment event

## Install

```
$ npm i react@latest react-dom@latest next@13.4.19
```

## Usage

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
