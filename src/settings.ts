import { App, PluginSettingTab, Setting } from "obsidian";
import SettingsPlugin from "./main";

export interface PluginSettings {
	firstLanguage: string;
	secondLanguage: string;
	allowText: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	firstLanguage: "en",
	secondLanguage: "ru",
	allowText: false,
};

export class TestSettingTab extends PluginSettingTab {
	plugin: SettingsPlugin;

	constructor(app: App, plugin: SettingsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setName("Languages").setHeading();

		new Setting(containerEl)
			.setName("Language #1")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("en", "English")
					.addOption("ru", "Русский")
					.setValue(this.plugin.settings.firstLanguage)
					.onChange(async (value) => {
						this.plugin.settings.firstLanguage = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Language #2")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("en", "English")
					.addOption("ru", "Русский")
					.setValue(this.plugin.settings.secondLanguage)
					.onChange(async (value) => {
						this.plugin.settings.secondLanguage = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl).setName("Additional").setHeading();

		new Setting(containerEl)
			.setName("Change the layout of the entire text").setDesc("If no text is selected, the layout will be changed for the entire file.")
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
