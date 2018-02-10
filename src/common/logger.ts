export const log = (str: string) => {
	const d = new Date();
	console.log(`[${d.toLocaleTimeString()}] ${str}`);
};
