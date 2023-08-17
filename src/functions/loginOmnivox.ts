import promptSync from "prompt-sync";

/**
 * Login to Omnivox
 * Redirects page to schoolname.omnivox.ca/intr/
 * @async
 * @param {object} page
 * @param {string} noDA
 * @param {string} password
 */
export default async (page, noDA: string, password: string) => {
	const prompt = promptSync({
		sigint: true,
	});

	console.log("Connexion en cours...".cyan);

	await page.goto(process.env.OMNIVOX_LOGIN_LINK, {
		waitUntil: "networkidle0",
	});

	// Set screen size
	await page.setViewport({ width: 1080, height: 1024 });

	// Login to omnivox
	await page.type("#Identifiant", noDA);
	await page.type("#Password", password);
	await page.click('button[type="submit"]');
	await page.waitForNetworkIdle(0);

	const errorLogin = await page.evaluate(() => {
		const el: HTMLElement = document.querySelector(".msg-erreur");
		return el?.innerText;
	});

	if (errorLogin) {
		console.log(errorLogin.red);
		process.exit(1);
	}

	// check for 2FA
	const is2FA = await page.evaluate(() => {
		const divs = Array.from(document.querySelectorAll("div.MuiBox-root"));
		return divs.filter((el) =>
			el.innerHTML.startsWith("Un code de sécurité à 6 chiffres a été envoyé")
		)[0]?.textContent;
	});

	if (is2FA) {
		console.log(is2FA.yellow);

		const plusDemander =
			prompt(
				"Tapez O pour ne plus me demander de valider mon identité sur cet appareil: "
			) === "O";

		if (plusDemander) await page.click('input[type="checkbox"]');

		const is2FAIncorrect = async () => {
			return await page.evaluate(() => {
				const ps = Array.from(document.querySelectorAll("p"));
				return ps.filter((el) =>
					el.innerHTML.startsWith("Le code saisi est invalide")
				)[0]?.textContent;
			});
		};

		let isCodeIncorrect;
		do {
			let code;
			do {
				code = prompt("Code de sécurité (6 chiffres): ");
				if (code.length != 6) {
					console.log("Code invalide. Veuillez réessayer".red);
				}
			} while (code.length != 6);

			// entrer le code 2fa
			await page.type('input[type="text"]', code);

			await page.click('button[tabindex="0"]');
			console.log("Veuillez patienter...".cyan);
			await page.waitForNetworkIdle(0);

			isCodeIncorrect = await is2FAIncorrect();
			if (isCodeIncorrect) console.log("Code 2FA incorrect".red);
		} while (isCodeIncorrect);

		console.log("Code 2FA correct!".green);
	} else {
		console.log("2FA non requis");
	}
};
