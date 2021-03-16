## Obsidian Code Runner Plugin

This is a simple plugin for [Obsidian](https://obsidian.md) that enables you to run code from inside obsidian pages.

This project uses Typescript to provide type checking and documentation. \
The repo depends on the latest plugin API (obsidian.d.ts)

### Supported languages
- C
- CPP
- Python

### How to use

- Clone this repo.
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.