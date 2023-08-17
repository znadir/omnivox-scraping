import * as dotenv from "dotenv";
dotenv.config();

import puppeteer from "puppeteer-extra";
import loginPrompt from "./functions/loginPrompt";
import loginOmnivox from "./functions/loginOmnivox";
import welcome from "./functions/welcome";
import promptSync from "prompt-sync";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import voirNotes from "./functions/voirNotes";

puppeteer.use(StealthPlugin());

(async () => {
	const { noDA, password } = loginPrompt();

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await loginOmnivox(page, noDA, password);
	await welcome(page);

	let choice;

	do {
		console.log("Quel outil voulez-vous utiliser?".cyan);
		console.log("1. Remplir Google Agenda".cyan);
		console.log("0. Quitter".red);

		const prompt = promptSync({
			sigint: true,
		});

		choice = prompt("Votre choix: ");

		switch (choice) {
			case "1":
				console.log("Sélection: Voir vos notes");
				await voirNotes(page);
				break;
			case "0":
				console.log("Bye".cyan);
				break;
			default:
				console.log("Choix invalide".red);
				break;
		}
	} while (choice !== "0");

	await browser.close();
})();
