## Obsidian Code Runner Plugin

This is a simple plugin for [Obsidian](https://obsidian.md) that enables you to run code from inside obsidian pages.

This project uses Typescript to provide type checking and documentation. \
The repo depends on the latest plugin API (obsidian.d.ts)

### Supported languages
- C
- CPP
- Python

### To Do
- Add a setting tab
    - Add the ability to change between multiple compilers ex. C/C++ - MinGW/clang
    - Add the ability to set a directory where code-runner will put its temporary files
    - Add the ability to make the output table visible/hidden by default
- Add a copy/clear/stop button in the output-panel
- Add a command/button that kills the current executable that is running
- Solve the errors for programs that have an infinite loop
- Add support for more languages

### How to use

- Clone this repo.
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.