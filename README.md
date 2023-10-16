# my-trendingvids-webapp

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
TODO: Put more badges here.

A webapp to visualize the current TV shows and movies trends :

- Shows the trends sorted by genres
- Able to filter by popularity and keyword
- Save favorite shows in your own-crafted list

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [License](#license)

## Background

We use:

- [NextJs @13.4.19](https://nextjs.org/) to organize the app, using the [App Router](https://nextjs.org/docs/app)
- [The Movie DataBase API](https://developer.themoviedb.org/docs) to fetch trends when needed
- [Next-Auth](https://next-auth.js.org/getting-started/introduction) to easily setup a signin/signup/signout mechanism with Github provider
- [MongoDB](https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/) to store authentication and app data (user logged in and fav'ed shows currently)
- [TailwindCSS](https://tailwindcss.com/docs/guides/nextjs) for pages styling
- [Github](https://github.com/thouel/my-trendingvids-webapp/tree/main)
- [Vercel](https://vercel.com/) to deploy automatically (after each push on main) [@see here](https://my-trendingvids-webapp.vercel.app)

## Install

```
$ npm i react@latest react-dom@latest next@13.4.19
```

## Usage

```
$ npm run dev
```

## Maintainers

[@https://github.com/thouel](https://github.com/thouel)

## License

MIT © 2023 Thibault Houel
