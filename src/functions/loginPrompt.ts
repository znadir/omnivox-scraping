import {} from "colors";
import promptSync from "prompt-sync";

/**
 * Prompt user for login info
 * @returns {object} { noDA, password } - login info
 */
export default () => {
	const prompt = promptSync({
		sigint: true,
	});

	console.log("Connexion à votre compte Omnivox...".cyan);
	const noDA = prompt("No de DA: ");
	const password = prompt.hide("Mot de passe: ");

	return { noDA, password };
};
