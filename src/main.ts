import { App, Modal, Notice, Plugin, PluginManifest, PluginSettingTab, MarkdownView, Setting } from 'obsidian';

const exclude_languages = [ 
	"todoist"
];

interface CodeRunnerSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CodeRunnerSettings = {
	mySetting: 'default'
}

export default class CodeRunner extends Plugin {

	settings: CodeRunnerSettings;

	constructor(app: App, pluginManifest: PluginManifest) 
    {
		super(app, pluginManifest);
	}

	async onload()
    {
		await this.loadSettings();
		this.registerInterval(window.setInterval(this.update.bind(this), 1000));
	}

	async loadSettings() 
    {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	injectButtons() 
    {
		document.querySelectorAll('pre > code').forEach(function (codeBlock:any) {
            
			var pre = codeBlock.parentNode;
			var button = document.createElement('button');
            var span   = document.createElement('span');

			for (let language of exclude_languages) {
                if (pre.classList.contains('language-'+ language)) {
                    return;
                }
            }

			if (pre.parentNode.classList.contains('has-run-button')) {
				return;
			}

			pre.parentNode.classList.add('has-run-button');

			button.className = 'run-code-button';
			button.type = 'button';

			button.addEventListener('click', function () {
				
    			var fs = require('fs');

				if (pre.classList.contains(`language-cpp`)) {
					fs.writeFileSync(process.cwd() + '\\coderunnertmp.cpp', codeBlock.innerText);
				}

				if (pre.classList.contains(`language-c`)) {
					fs.writeFileSync(process.cwd() + '\\coderunnertmp.c', codeBlock.innerText);
				}

				if (pre.classList.contains(`language-python`)) {
					fs.writeFileSync(process.cwd() + '\\coderunnertmp.py', codeBlock.innerText);
				}

                const cp = require('child_process');

                const exec_options = {
                    cwd: null,
                    env: null,
                    encoding: 'utf8',
                    timeout: 0,
                    maxBuffer: 200 * 1024,
                    killSignal: 'SIGTERM'
                };
				
				if (pre.classList.contains(`language-cpp`)) {
					cp.exec('g++ ' + process.cwd() + '\\coderunnertmp.cpp -o coderunnertmp && START cmd /k coderunnertmp.exe & pause & exit', exec_options, (err, stdout, stderr) => {
					});
				}

				if (pre.classList.contains(`language-c`)) {
					cp.exec('gcc ' + process.cwd() + '\\coderunnertmp.c -o coderunnertmp && START cmd /k coderunnertmp.exe & pause & exit', exec_options, (err, stdout, stderr) => {
					});
				}
				
                if (pre.classList.contains(`language-python`)) {
					cp.exec('START cmd /k python ' + process.cwd() + '\\coderunnertmp.py & pause & exit', exec_options, (err, stdout, stderr) => {
					});
				}
			
            });

			pre.appendChild(button);
            span.innerText = 'run';
			button.appendChild(span);
		});

	}

    update()
    {
        this.injectButtons();
    }

}