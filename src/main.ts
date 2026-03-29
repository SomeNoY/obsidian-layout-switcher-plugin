/* eslint-disable @typescript-eslint/no-misused-promises */
import { Plugin, Editor, Notice } from "obsidian";
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

	private replaceText(
		text: string,
		fromLang: string,
		toLang: string,
		editor: Editor,
	) {
		if (text) {
			editor.replaceSelection(this.convertLayout(text, fromLang, toLang));
		} else if (this.settings.allowText) {
			editor.setValue(
				this.convertLayout(editor.getValue(), fromLang, toLang),
			);
		} else if (!this.settings.allowText) {
			new Notice("Select the text to change the layout");
		}
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new TestSettingTab(this.app, this));

		this.addCommand({
			id: "convert-1-to-2",
			name: `Convert selection: ${this.settings.firstLanguage.toUpperCase()} → ${this.settings.secondLanguage.toUpperCase()}`,
			editorCallback: async (editor: Editor) => {
				const selection = editor.getSelection();

				this.replaceText(
					selection,
					this.settings.firstLanguage,
					this.settings.secondLanguage,
					editor,
				);
			},
		});

		this.addCommand({
			id: "convert-2-to-1",
			name: `Convert selection: ${this.settings.secondLanguage.toUpperCase()} → ${this.settings.firstLanguage.toUpperCase()}`,
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection();

				this.replaceText(
					selection,
					this.settings.secondLanguage,
					this.settings.firstLanguage,
					editor,
				);
			},
		});
	}

	async onunload() {}
}
