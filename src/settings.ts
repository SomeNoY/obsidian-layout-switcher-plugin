import { App, PluginSettingTab, Setting } from "obsidian";
import SettingsPlugin from "./main";

export interface PluginSettings {
	firstLanguage: string;
	secondLanguage: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	firstLanguage: "en",
	secondLanguage: "ru",
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
	}
}
