import { App, PluginSettingTab, Setting } from "obsidian";
import SettingsPlugin from "./main";

export interface PluginSettings {
	language: string;
	allowText: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	language: "",
	allowText: false,
};

const languageDropdown: Record<string, string> = {
	ru: "Русский",
	ua: "Український",
	sr: "Српски (ћирилица)",
};

export class LayoutPluginSettingTab extends PluginSettingTab {
	plugin: SettingsPlugin;

	constructor(app: App, plugin: SettingsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setName("Language").addDropdown((dropdown) =>
			dropdown
				.addOptions(languageDropdown)
				.setValue(this.plugin.settings.language)
				.onChange(async (value) => {
					this.plugin.settings.language = value;
					await this.plugin.saveSettings();
				}),
		);

		new Setting(containerEl)
			.setName("Change the layout of the entire text")
			.setDesc(
				"If no text is selected, the layout will be changed for the entire file.",
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.allowText)
					.onChange(async (value) => {
						this.plugin.settings.allowText = value;
						await this.plugin.saveSettings();
						this.display();
					}),
			);
	}
}
