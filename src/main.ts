import { App, Modal, Notice, Plugin, PluginManifest, PluginSettingTab, MarkdownView, Setting } from 'obsidian';

const supported_language = [ 
    "c",
    "cpp",
    "python"
];

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

    update()
    {
		document.querySelectorAll('pre > code').forEach(function (codeBlock:any) {
            const { exec } = require('child_process');
			
            var pre = codeBlock.parentNode;

            for (let language of supported_language) {
                if (pre.classList.contains('language-'+ language)) {

                    var button = document.createElement('button');
                    var span   = document.createElement('span');
                    var panel  = document.createElement('div');
                    
                    for (let language of exclude_languages) {
                        if (pre.classList.contains('language-'+ language)) {
                            return;
                        }
                    }
        
                    if (pre.parentNode.classList.contains('has-output-panel')) {
                        return;
                    }
                    
                    pre.parentNode.classList.add('has-output-panel');
        
                    panel.className = "output-panel";
                    panel.id = "outpanel";

                    if (pre.parentNode.classList.contains('has-run-button')) {
                        return;
                    }
        
                    pre.parentNode.classList.add('has-run-button');
        
                    button.className = 'run-code-button';
                    button.type = 'button';
                    
                    
                    button.addEventListener('click', function () {
                        
                        var fs = require('fs');
                        panel.style.display = "block";

                        if (process.platform === "win32") {
                            if (pre.classList.contains(`language-c`)) {

                                fs.writeFileSync(process.cwd() + '\\coderunnertmp.c', codeBlock.innerText);
    
                                exec('gcc ' + process.cwd() + '\\coderunnertmp.c -o coderunnertmp && coderunnertmp.exe', (error, stdout, stderr) => {
                                    if (error) {
                                        panel.innerText = `${error.message}`;
                                        return;
                                    }
                                    
                                    if (stderr) {
                                        panel.innerText = `${stderr}`;
                                        return;
                                    }
            
                                    panel.innerText = `${stdout}`;
                                });
                            }

                            if (pre.classList.contains(`language-cpp`)) {
                                fs.writeFileSync(process.cwd() + '\\coderunnertmp.cpp', codeBlock.innerText);
    
                                exec('g++ ' + process.cwd() + '\\coderunnertmp.cpp -o coderunnertmp && coderunnertmp.exe', (error, stdout, stderr) => {
                                    
                                    if (error) {
                                        panel.innerText = `${error.message}`;
                                        return;
                                    }
                                    
                                    if (stderr) {
                                        panel.innerText = `${stderr}`;
                                        return;
                                    }
                                    
                                    panel.innerText = `${stdout}`;
                                });
                            }
            
                            if (pre.classList.contains(`language-python`)) {
                                fs.writeFileSync(process.cwd() + '\\coderunnertmp.py', codeBlock.innerText);
    
                                exec('python ' + process.cwd() + '\\coderunnertmp.py', (error, stdout, stderr) => {
                                    if (error) {
                                        panel.innerText = `${error.message}`;
                                        return;
                                    }
                                    
                                    if (stderr) {
                                        panel.innerText = `${stderr}`;
                                        return;
                                    }
            
                                    panel.innerText = `${stdout}`;
                                });
                            }
                        } else if(process.platform === "linux") {
                            
                        } else if(process.platform === "darwin") {

                        } else {
                            console.log('ERROR: This platform is not supported!');
                        }
                    });
        
                    span.innerText = 'run';
                    
                    pre.appendChild(panel);
                    pre.appendChild(button);
                    button.appendChild(span);
                }
            }
		});
    }

}