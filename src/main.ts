/* eslint-disable obsidianmd/ui/sentence-case */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Plugin, Editor } from "obsidian";
import { PluginSettings, DEFAULT_SETTINGS, TestSettingTab } from "settings";
import { EN_TO_RU } from "layouts";

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

	private convertLayout(text: string, map: Record<string, string>): string {
		return text
			.split("")
			.map((ch) => map[ch] ?? ch)
			.join("");
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new TestSettingTab(this.app, this));

		// this.addCommand({
		// 	id: "paste-text",
		// 	name: "Paste text",
		// 	editorCallback: (editor: Editor) => {
		// 		const cursor = editor.getCursor();
		// 		editor.replaceRange(this.settings.pasteSetting, cursor);
		// 	},
		// });

		this.addCommand({
			id: "convert-en-to-ru",
			name: "Convert selection: EN → RU",
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection();

				editor.replaceSelection(
					this.convertLayout(selection, EN_TO_RU),
				);
			},
		});
	}

	async onunload() {}
}
