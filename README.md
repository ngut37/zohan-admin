# ZOHAN - admin

This repository is used for versioning ZOHAN administration interface.

Main stack:

- [React.js](https://reactjs.org/) - JavaScript library for building user interfaces
- [Next.js](https://nextjs.org/) - React.js framework for production
- [Typescript](https://www.typescriptlang.org/) - typed superset of JavaScript
- [Chakra UI v1.x](https://chakra-ui.com/) - component library
- [React hook form](https://react-hook-form.com/) - form management with validation

## Table of contents

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment variables](#environment-variables)
- [Usage](#usage)
- [Available scripts](#available-scripts)
- [Delivery flow](#contributing)
- [Contact](#contact)

# Getting started

Follow these steps to install necessary packages and to run the application.

## Prerequisites

- [yarn](https://yarnpkg.com/)
- [git](https://git-scm.com/)
- [git-cz](https://www.npmjs.com/package/git-cz) - optional, but recommended for commit messages

## Installation

0. (optional) cloning the repository run (alternatively download from GitHub repository)

```bash
# clone the repository
$ git clone https://github.com/ngut37/zohan-admin
```

1. installing dependencies

```bash
# install dependencies
$ yarn install
```

2. running the application

```bash
# to run in watched development mode
$ yarn dev

# to run in build mode
$ yarn build
$ yarn start
```

## Environment variables

Can be found in `src/config/config.ts`.

- `APP_ENV` - application environment (`development`, `production`)
- `PORT` - port number on which the application will run
- `API_URL` - URL of the API (make sure end with a `/`)
- `APP_URL` - URL of the application (make sure end with a `/`)
- `ACCESS_TOKEN_SECRET` - secret used for signing JWT tokens on the API
- `MIN_NAME_LENGTH` - minimum length of the staff and company names (number should be lower or equal to `MAX_NAME_LENGTH`)
- `MAX_NAME_LENGTH` - maximum length of the staff and company names (number should be higher or equal to `MIN_NAME_LENGTH`)
- `MIN_PASSWORD_LENGTH` - minimum length of the password
- `MAX_PASSWORD_LENGTH` - maximum length of the password
- `SERVICE_LENGTH_CHUNK_SIZE_IN_MINUTES` - chunk size in minutes for the service length

# Usage

Make sure have running API server. In case you need to use production API server locally, change `API_URL` in `src/config/config.ts` to `https://zohan-services.oa.r.appspot.com/`.

_📌 note: API / backend repository can be found on [Github - ngut37/zohan-services](https://github.com/ngut37/zohan-services)_

# Available scripts

Refer to `package.json` for content of the scripts.

- `yarn dev` - runs the application in watched development mode
- `yarn build` - builds the application for production usage (artifact is stored in `src/.next` directory)
- `yarn start` - runs the application in production mode from the `src/.next` directory
- `yarn lint` - runs eslint on the `src` directory
- `yarn lint-fix` - runs eslint on the `src` directory and fixes auto-fixable the errors

# Delivery flow

Project's kanban board is available on [Jira - ZOH project](https://zohan-app.atlassian.net/jira/software/projects/ZOH/boards/1).

1. create an issue in Jira with `Administration` tag
2. create a branch from `master` branch with name `ZOH-<issue number>/<short description>` (e.g. `ZOH-12/fixing-login-page`)
3. move Jira task to `In progress` column
4. create a pull request to `master` branch
5. assign the pull request to someone for review
6. make sure to follow [conventional commit specifications](https://www.conventionalcommits.org/en/v1.0.0/) when naming the first commit
7. after the PR approval, (squash and) merge the pull request to `master` branch
8. make sure only one commit is merged to `master` branch
9. move Jira task to `Done` column

_📌 note: try not to push or force-push directly to `master` branch as changes details can get lost_

# Contact

In case of any questions or suggestions, feel free to contact me:

- VŠE email: [ngut37@vse.cz](mailto:ngut37@vse.cz)
- private email: [denisvn3@gmail.com](mailto:denisvn3@gmail.com)
