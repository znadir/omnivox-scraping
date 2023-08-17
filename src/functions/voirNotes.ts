import colors from "colors";

export default async (page) => {
	// go to lea page
	const selectLea = "#region-raccourcis-services-skytech > a.id-service_CVIE";
	await page.waitForSelector(selectLea);
	await page.click(selectLea);

	// fetch cours list
	const selectCoursList = ".materialize-wrapper > div";
	await page.waitForSelector(selectCoursList);
	const coursList = await page.$$(selectCoursList);

	const nbCours = coursList.length;
	console.log(("Vous suivez " + nbCours + " cours").cyan);

	let moyenneTotale = 0;
	let nbNotes = 0;

	// loop through courses
	for (let cours of coursList) {
		const titreCours = await cours.$eval(
			".card-panel-header > .card-panel-title",
			(el: any) => el.innerText
		);
		console.log(titreCours);

		try {
			const moyenneCours = await cours.$eval(".pourcentage", (el: any) =>
				parseInt(el.innerText.split("%")[0])
			);
			moyenneTotale += moyenneCours;
			nbNotes++;

			// Colorize grade corresponding to its value
			let noteColor;
			if (moyenneCours >= 60) {
				noteColor = colors.green;
			} else if (moyenneCours > 50) {
				noteColor = colors.yellow;
			} else {
				noteColor = colors.red;
			}

			console.log(noteColor(`Moyenne: ${moyenneCours}%`));
		} catch (err) {
			console.log("Pas de note pour ce cours".gray);
		}
	}

	const moyenneGenerale = Math.round(moyenneTotale / nbNotes);
	console.log(("Votre moyenne générale est de " + moyenneGenerale + "%").cyan);

	// go back to home page
	const selectMenu = "#headerOmnivoxLogo";
	await page.waitForSelector(selectMenu);
	await page.click(selectMenu);
};
