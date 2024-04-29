# Blog API

An API to manage blog content and serve it to users utilizing mongoDB and authentication with passport-jwt.

## Setup

1. Generate private and public keys by running the `generateKeypair` file
2. Set your dev or production URLs in the `.env` file.
3. Run the app by running `/bin/www`. Debug logs are available with the namespace `blog-api` via the [debug](https://www.npmjs.com/package/debug) package
