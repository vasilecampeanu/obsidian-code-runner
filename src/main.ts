import { App, Modal, Notice, Plugin, PluginManifest, PluginSettingTab, MarkdownView, Setting } from 'obsidian';
import {CodeRunnerSettingTab, CodeRunnerSettings, DEFAULT_SETTINGS} from './settings'

const supported_language = [ 
    "c",
    "cpp",
    "python"
];

const exclude_languages = [ 
    "todoist"
];

export default class CodeRunner extends Plugin {

	settings: CodeRunnerSettings;

	constructor(app: App, pluginManifest: PluginManifest) 
    {
		super(app, pluginManifest);
	}

	async onload()
    {
        console.log('load obsidian-code-runner');
		await this.loadSettings();
        this.addSettingTab(new CodeRunnerSettingTab(this.app, this));
		this.registerInterval(window.setInterval(this.update.bind(this), 1000));
	}

	async loadSettings() 
    {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        console.log(this.settings.path);
    }

    async saveSettings() 
    {
		await this.saveData(this.settings);
	}
    
    update()
    {
        var tempFolderPath = this.settings.path;
        var outputPanelDisplay = this.settings.display;
        var c_compiler = this.settings.c_compiler;
        var cpp_compiler = this.settings.cpp_compiler;

		document.querySelectorAll('pre > code').forEach(function (codeBlock:any) {
            const { exec } = require('child_process');

            var pre = codeBlock.parentNode;
            
            for (let language of supported_language) {
                if (pre.classList.contains('language-'+ language)) {

                    var button = document.createElement('button');
                    var span   = document.createElement('span');

                    var opanel  = document.createElement('div');
                    var opanel_content  = document.createElement('span');

                    for (let language of exclude_languages) {
                        if (pre.classList.contains('language-'+ language)) {
                            return;
                        }
                    }
        
                    if (pre.parentNode.classList.contains('has-output-panel')) {
                        return;
                    }
                    
                    pre.parentNode.classList.add('has-output-panel');
        
                    
                    opanel.className = "output-panel";
                    opanel.id = "outpanel";

                    if (outputPanelDisplay == false) {
                        opanel.style.display = "none";
                    } else {
                        opanel.style.display = "block";
                    }


                    if (pre.parentNode.classList.contains('has-run-button')) {
                        return;
                    }
        
                    pre.parentNode.classList.add('has-run-button');
        
                    button.className = 'run-code-button';
                    button.type = 'button';
                    
                    
                    button.addEventListener('click', function () {
                        
                        var fs = require('fs');

                        opanel.style.display = "block";

                        if (process.platform === "win32") {
                            if (pre.classList.contains(`language-c`)) {

                                fs.writeFileSync(tempFolderPath + '\\coderunnertmp.c', codeBlock.innerText);
    
                                exec(c_compiler + ' ' + tempFolderPath + '\\coderunnertmp.c -o coderunnertmp && coderunnertmp.exe', (error, stdout, stderr) => {
                                    if (error) {
                                        opanel_content.innerText = `${error.message}`;
                                        return;
                                    }
                                    
                                    if (stderr) {
                                        opanel_content.innerText = `${stderr}`;
                                        return;
                                    }
            
                                    opanel_content.innerText = `${stdout}`;
                                });
                            }

                            if (pre.classList.contains(`language-cpp`)) {
                                
                                fs.writeFileSync(tempFolderPath + '\\coderunnertmp.cpp', codeBlock.innerText);
    
                                exec(cpp_compiler + ' ' + tempFolderPath + '\\coderunnertmp.cpp -o coderunnertmp && coderunnertmp.exe', (error, stdout, stderr) => {
                                    if (error) {
                                        opanel_content.innerText = `${error.message}`;
                                        return;
                                    }
                                    
                                    if (stderr) {
                                        opanel_content.innerText = `${stderr}`;
                                        return;
                                    }
                                    
                                    opanel_content.innerText = `${stdout}`;
                                });
                            }
            
                            if (pre.classList.contains(`language-python`)) {
                                
                                fs.writeFileSync(tempFolderPath + '\\coderunnertmp.py', codeBlock.innerText);
    
                                exec('python ' + tempFolderPath + '\\coderunnertmp.py', (error, stdout, stderr) => {
                                    if (error) {
                                        opanel_content.innerText = `${error.message}`;
                                        return;
                                    }
                                    
                                    if (stderr) {
                                        opanel_content.innerText = `${stderr}`;
                                        return;
                                    }
            
                                    opanel_content.innerText = `${stdout}`;
                                });
                            }
                            
                        } else if(process.platform === "linux") {
                            
                        } else if(process.platform === "darwin") {

                        } else {
                            console.log('ERROR: This platform is not supported!');
                        }
                    });

                    pre.appendChild(opanel);
                    opanel.appendChild(opanel_content);
                    pre.appendChild(button);
                    span.innerText = 'run';
                    button.appendChild(span);
                }
            }
		});
    }

}