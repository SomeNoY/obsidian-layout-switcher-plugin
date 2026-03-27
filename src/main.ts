/* eslint-disable obsidianmd/ui/sentence-case */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Plugin, Editor } from "obsidian";
import { PluginSettings, DEFAULT_SETTINGS, TestSettingTab } from "settings";
import { LAYOUTS } from "layouts";

export default class SettingsPlugin extends Plugin {
	settings: PluginSettings;

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<PluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private convertLayout(
		text: string,
		fromLang: string,
		toLang: string,
	): string {
		const fromMap = LAYOUTS[fromLang] ?? {};
		const toMap = LAYOUTS[toLang] ?? {};

		const toEn = Object.fromEntries(
			Object.entries(fromMap).map(([en, ch]) => [ch, en]),
		);

		return text
			.split("")
			.map((ch) => {
				const lower = ch.toLowerCase();
				const isUpper = ch !== lower;

				const enKey = toEn[lower] ?? lower;
				const converted = toMap[lower] ?? enKey;

				return isUpper ? converted.toUpperCase() : converted;
			})
			.join("");
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new TestSettingTab(this.app, this));

		this.addCommand({
			id: "convert-en-to-ru",
			name: "Convert selection: EN → RU",
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection();

				editor.replaceSelection(
					this.convertLayout(selection, "en", "ru"),
				);
			},
		});
	}

	async onunload() {}
}
