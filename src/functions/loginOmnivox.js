/**
 * Login to Omnivox
 * Redirects page to schoolname.omnivox.ca/intr/
 * @async
 * @param {object} page
 * @param {string} noDA
 * @param {string} password
 */
export default async (page, noDA, password) => {
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

	const errorLogin = await page.evaluate(
		() => document.querySelector(".msg-erreur")?.innerText
	);

	if (errorLogin) {
		console.log("Erreur d'authentification, veuillez réessayer".red);
		console.log(errorLogin.red);
		process.exit(1);
	}
};
