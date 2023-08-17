import {} from "colors";
import { onlyFirstCapital } from "../utils";

/**
 * Welcome user to Omnivox scraper
 * @async
 * @param {object} page
 */
export default async (page) => {
	// get user's name
	const selectName = "#headerNavbarProfileUserName";
	await page.waitForSelector(selectName);
	const username = await page.$eval(selectName, (name) => name.innerText);

	const firstName = onlyFirstCapital(username.split(" ")[0]);
	const lastName = onlyFirstCapital(username.split(" ")[1]);

	console.log(`Welcome ${firstName} ${lastName} to Omnivox scraper!`.magenta);

	// get school's name
	const selectSchoolName = "#headerNavbarProfileInstitution";
	await page.waitForSelector(selectSchoolName);
	const schoolName = await page.$eval(
		selectSchoolName,
		(schoolName) => schoolName.innerText
	);

	console.log(
		`Veuillez patienter pendant que nous scrappons ${schoolName} Omnivox`
			.magenta
	);
};
