import { App, Modal, Notice, Plugin, PluginManifest, PluginSettingTab, MarkdownView, Setting } from 'obsidian';
import CodeRunner from './main'

export const DEFAULT_SETTINGS: CodeRunnerSettings = {
	path: process.cwd(),
    display: false,
    c_compiler: "gcc",
    cpp_compiler: "g++",
    python: "python"
}

export interface CodeRunnerSettings {
	path: string,
    display: boolean,
    c_compiler: string,
	cpp_compiler: string,
    python: string
}

const c_compilers = [
    "clang"
];

const cpp_compilers = [
    "clang"
];

const python_versions = [
    "python3"
];

export class CodeRunnerSettingTab extends PluginSettingTab {
	plugin: CodeRunner;

	constructor(app: App, plugin: CodeRunner) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void 
    {
		let {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Tmp files folder path')
			.setDesc('Here you can set where tmp files will be stored')
			.addText(text => {
                text.setPlaceholder('ex: X:/.../yourvalut/.obsidian/tmp')
                    .setValue(this.plugin.settings.path)
                    .onChange(async (value) => {
                        this.plugin.settings.path = value;
                        await this.plugin.saveSettings();
                    })
            });
        
        new Setting(this.containerEl)
            .setName("Output panel display state")
            .setDesc("Enable this to make the output panel always visible")
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.display);
                toggle.onChange(async (value) => {
                    this.plugin.settings.display = value;
                    await this.plugin.saveSettings();
                });
            });
        
            new Setting(this.containerEl)
            .setName("C compiler")
            .setDesc("Chose what compiler you want to use")
            .addDropdown((dropdown) => {
                dropdown.addOption("gcc", `Default compiler (gcc)`);
                c_compilers.forEach((compiler, i) => {
                    dropdown.addOption(c_compilers[i], compiler)
                });
                
                dropdown.setValue(this.plugin.settings.c_compiler);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.c_compiler = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(this.containerEl)
            .setName("C++ compiler")
            .setDesc("Chose what compiler you want to use")
            .addDropdown((dropdown) => {
                dropdown.addOption("g++", `Default compiler (g++)`);
                cpp_compilers.forEach((compiler, i) => {
                    dropdown.addOption(cpp_compilers[i], compiler)
                });

                dropdown.setValue(this.plugin.settings.cpp_compiler);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.cpp_compiler = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(this.containerEl)
            .setName("Python command")
            .setDesc("Chose the command that is specific for your system or python version")
            .addDropdown((dropdown) => {
                dropdown.addOption("python", `Default command (python)`);
                python_versions.forEach((compiler, i) => {
                    dropdown.addOption(python_versions[i], compiler)
                });
                dropdown.setValue(this.plugin.settings.python);
                dropdown.onChange(async (value) => {
                    this.plugin.settings.python = value;
                    await this.plugin.saveSettings();
                });
            });
	}
}
 