const LOREM_WORDS = [
	"lorem",
	"ipsum",
	"dolor",
	"sit",
	"amet",
	"consectetur",
	"adipiscing",
	"elit",
	"sed",
	"eiusmod",
	"tempor",
	"incididunt",
	"labore",
	"dolore",
	"magna",
	"aliqua",
	"enim",
	"minim",
	"veniam",
	"quis",
	"nostrud",
	"exercitation",
	"ullamco",
	"laboris",
	"nisi",
	"aliquip",
	"commodo",
	"consequat",
	"duis",
	"aute",
	"irure",
	"reprehenderit",
	"voluptate",
	"velit",
	"esse",
	"cillum",
	"fugiat",
	"nulla",
	"pariatur",
	"excepteur",
	"sint",
	"occaecat",
	"cupidatat",
	"proident",
	"culpa",
	"officia",
	"deserunt",
	"mollit",
	"anim",
	"laborum",
	"perspiciatis",
	"unde",
	"omnis",
	"iste",
	"natus",
	"voluptatem",
	"accusantium",
	"doloremque",
	"laudantium",
	"totam",
	"aperiam",
	"eaque",
	"illo",
	"inventore",
	"veritatis",
	"quasi",
	"architecto",
	"beatae",
	"vitae",
	"dicta",
	"explicabo",
	"ipsam",
	"voluptas",
	"aspernatur",
	"odit",
	"consequuntur",
	"magni",
	"dolores",
	"ratione",
	"sequi",
	"nesciunt",
	"neque",
	"porro",
	"quisquam",
	"blanditiis",
	"praesentium",
	"voluptatum",
	"deleniti",
	"corrupti",
	"mollitia",
	"provident",
	"similique",
	"possimus",
	"assumenda",
	"repellendus",
	"temporibus",
	"quibusdam",
	"officiis",
	"debitis",
	"rerum",
	"necessitatibus",
	"saepe",
	"eveniet",
	"voluptatibus",
	"repudiandae",
	"recusandae",
	"itaque",
	"earum",
	"facilis",
	"expedita",
	"distinctio",
];

const LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";

function randomLoremWord(): string {
	return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function buildSentence(words: string[]): string {
	const text = words.join(" ");
	return `${text.charAt(0).toUpperCase() + text.slice(1)}.`;
}

export function generateLoremWords(
	count: number,
	startWithLorem: boolean,
): string {
	if (startWithLorem) {
		const startWords = LOREM_START.replace(",", "").toLowerCase().split(" ");
		const extra = Array.from(
			{ length: Math.max(0, count - startWords.length) },
			randomLoremWord,
		);
		return [...startWords, ...extra].slice(0, count).join(" ");
	}
	return Array.from({ length: count }, randomLoremWord).join(" ");
}

export function generateLoremSentences(
	count: number,
	startWithLorem: boolean,
): string {
	return Array.from({ length: count }, (_, i) => {
		if (i === 0 && startWithLorem) return `${LOREM_START}.`;
		const wordCount = Math.floor(Math.random() * 8) + 6;
		return buildSentence(Array.from({ length: wordCount }, randomLoremWord));
	}).join(" ");
}

export function generateLoremParagraphs(
	count: number,
	startWithLorem: boolean,
): string {
	return Array.from({ length: count }, (_, pIndex) => {
		const sentenceCount = Math.floor(Math.random() * 3) + 3;
		return Array.from({ length: sentenceCount }, (__, sIndex) => {
			if (pIndex === 0 && sIndex === 0 && startWithLorem)
				return `${LOREM_START}.`;
			const wordCount = Math.floor(Math.random() * 8) + 6;
			return buildSentence(Array.from({ length: wordCount }, randomLoremWord));
		}).join(" ");
	}).join("\n\n");
}
