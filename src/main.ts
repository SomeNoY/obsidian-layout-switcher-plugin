import { Plugin, Editor, Notice } from "obsidian";
import {
	PluginSettings,
	DEFAULT_SETTINGS,
	LayoutPluginSettingTab,
} from "settings";
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
				const converted = toMap[enKey] ?? enKey;

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

		this.addSettingTab(new LayoutPluginSettingTab(this.app, this));

		this.addCommand({
			id: "convert-en-to-lang",
			name: `Convert selection: EN → ${this.settings.language.toUpperCase()}`,
			editorCallback: async (editor: Editor) => {
				const selection = editor.getSelection();

				this.replaceText(
					selection,
					"en",
					this.settings.language,
					editor,
				);
			},
		});

		this.addCommand({
			id: "convert-lang-to-en",
			name: `Convert selection: ${this.settings.language.toUpperCase()} → EN`,
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection();

				this.replaceText(
					selection,
					this.settings.language,
					"en",
					editor,
				);
			},
		});
	}

	onunload() {}
}
