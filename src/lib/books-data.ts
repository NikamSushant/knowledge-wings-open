export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  language: string;
  category: string;
  categorySlug: string;
  pages: number;
  year: number;
  description: string;
  authorNote: string;
  coverGradient?: string;
  coverUrl?: string | null;
  hasPdf?: boolean;
  allowPdfDownload?: boolean;
  featured?: boolean;
  isChildren?: boolean;
  addedAt?: string;
  chapters: {
    id: string;
    title: string;
    content: string;
  }[];
};

const chapter = (title: string, body: string) => ({
  id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title,
  content: body,
});

const commonChapters = [
  chapter(
    "Preface",
    `<p>This book is written with a single intent — to place the ideas of Dr. B. R. Ambedkar in the hands of every reader, without cost and without gatekeeping. Babasaheb believed that education is the movement from darkness to light. Every page here is offered in that spirit.</p><blockquote>Educate, Agitate, Organize.</blockquote><p>Read slowly. Return often. Share widely.</p>`,
  ),
  chapter(
    "Chapter 1 — The Early Years",
    `<h2>A childhood shaped by injustice</h2><p>Bhimrao Ramji Ambedkar was born on 14 April 1891 in Mhow, in the Central Provinces. From his earliest years he encountered the wall of untouchability — denied water at school, made to sit apart, refused the ordinary dignities of a child.</p><p>Yet the same childhood that carried injury carried also a quiet, unshakeable resolve. His father, a subedar in the British Indian Army, insisted that his children read. Books became the first shelter, then the first weapon.</p><h3>A promise to himself</h3><p>Young Bhim decided early that the humiliations of caste would not decide his life. He would study, and through study he would open doors — not only for himself, but for millions who had been told there were no doors at all.</p>`,
  ),
  chapter(
    "Chapter 2 — Education as Liberation",
    `<h2>Books, scholarships, and the world beyond</h2><p>Ambedkar's academic journey took him from Elphinstone College to Columbia University in New York, and later to the London School of Economics. He returned with doctorates, but more importantly, with a framework — economics, law, sociology, philosophy — through which to name what caste had done to India.</p><p>Education for Babasaheb was never ornament. It was the ground on which a person could stand up straight.</p>`,
  ),
  chapter(
    "Chapter 3 — The Long Struggle",
    `<h2>Mahad, Kalaram, and the assertion of dignity</h2><p>At Mahad in 1927, Ambedkar led thousands to drink water from a public tank that caste custom had forbidden them. At the Kalaram Temple in Nashik, the demand was equally simple and equally revolutionary — the right to enter.</p><p>These were not requests. They were declarations that human beings are not to be ranked by birth.</p>`,
  ),
  chapter(
    "Chapter 4 — The Constitution",
    `<h2>A document for a republic of equals</h2><p>As Chairman of the Drafting Committee, Ambedkar shaped the Constitution of India into a charter of rights. Article 14 — equality before law. Article 15 — no discrimination. Article 17 — the abolition of untouchability.</p><p>He warned, in his final speech to the Constituent Assembly, that political democracy without social and economic democracy is a house built on sand.</p>`,
  ),
  chapter(
    "Chapter 5 — The Turn to the Buddha",
    `<h2>Dhamma, reason, and compassion</h2><p>In 1956, at Nagpur, Ambedkar embraced Buddhism with lakhs of followers. He chose a path that placed reason, morality, and human dignity at its centre — a homecoming to an Indian tradition that had never accepted caste.</p><blockquote>I was born a Hindu, but I will not die a Hindu.</blockquote>`,
  ),
  chapter(
    "Chapter 6 — What We Carry Forward",
    `<h2>The task is not finished</h2><p>Babasaheb's life ended on 6 December 1956, but the work he set for us has no end date. To educate — ourselves and our children. To agitate — against every fresh face of inequality. To organize — so that no one stands alone.</p><p>This book closes here. The reading continues in your life.</p>`,
  ),
];

export const books: Book[] = [
  {
    slug: "life-of-babasaheb",
    title: "The Life of Babasaheb",
    subtitle: "From Mhow to the making of a republic",
    author: "Sushant Nikam",
    language: "English",
    category: "Life of Ambedkar",
    categorySlug: "life-of-ambedkar",
    pages: 214,
    year: 2026,
    description:
      "A clear, respectful biography of Dr. B. R. Ambedkar written for young readers and lifelong learners — his childhood, his education abroad, the long social struggle, and the Constitution he gave India.",
    authorNote:
      "I wrote this book so that any student, in any village, can meet Babasaheb without a barrier of cost or language. Read it slowly. Share it freely.",
    coverGradient: "linear-gradient(140deg, #0B3D91 0%, #061B3A 100%)",
    featured: true,
    addedAt: "2026-06-15",
    chapters: commonChapters,
  },
  {
    slug: "constitution-for-all",
    title: "The Constitution for All",
    subtitle: "Reading our rights in plain language",
    author: "Sushant Nikam",
    language: "English",
    category: "Constitution",
    categorySlug: "constitution",
    pages: 178,
    year: 2026,
    description:
      "A chapter-by-chapter walk through the fundamental rights, directive principles, and duties — explained without jargon, with examples from everyday life.",
    authorNote:
      "The Constitution belongs to the citizen, not only to the courtroom. This book is written to keep it in your hands.",
    coverGradient: "linear-gradient(140deg, #061B3A 0%, #0B3D91 60%, #D4AF37 100%)",
    featured: true,
    addedAt: "2026-05-02",
    chapters: commonChapters,
  },
  {
    slug: "shiksha-hi-mukti-hai",
    title: "शिक्षा ही मुक्ति है",
    subtitle: "बाबासाहेब की शिक्षा-दृष्टि",
    author: "Sushant Nikam",
    language: "Hindi",
    category: "Education",
    categorySlug: "education",
    pages: 156,
    year: 2026,
    description:
      "बाबासाहेब के जीवन और लेखन में शिक्षा का स्थान — विद्यार्थियों, अभिभावकों और शिक्षकों के लिए एक सरल, प्रेरक पुस्तक।",
    authorNote:
      "यह पुस्तक हर उस बच्चे के लिए है जिसे किसी ने कहा है कि पढ़ाई उसके लिए नहीं है।",
    coverGradient: "linear-gradient(140deg, #D4AF37 0%, #0B3D91 100%)",
    featured: true,
    addedAt: "2026-04-14",
    chapters: commonChapters,
  },
  {
    slug: "samajik-nyay-ani-samta",
    title: "सामाजिक न्याय आणि समता",
    subtitle: "बाबासाहेबांच्या विचारांचा वारसा",
    author: "Sushant Nikam",
    language: "Marathi",
    category: "Social Justice",
    categorySlug: "social-justice",
    pages: 192,
    year: 2026,
    description:
      "जाती, वर्ग आणि समानता यांवर बाबासाहेबांचे विचार — मराठी वाचकांसाठी सुलभ भाषेत मांडलेले.",
    authorNote:
      "समता ही केवळ कायद्याची भाषा नाही, ती दैनंदिन आचरणाची भाषा आहे.",
    coverGradient: "linear-gradient(140deg, #0B3D91 0%, #D4AF37 100%)",
    addedAt: "2026-03-20",
    chapters: commonChapters,
  },
  {
    slug: "problem-of-the-rupee",
    title: "The Ambedkar Reader on Economics",
    subtitle: "Money, labour, and the poor",
    author: "Sushant Nikam",
    language: "English",
    category: "Economics",
    categorySlug: "economics",
    pages: 168,
    year: 2026,
    description:
      "An accessible introduction to Ambedkar's economic writings — his doctoral work on the Rupee, his thinking on land, labour and the small farmer.",
    authorNote:
      "Babasaheb was one of India's first modern economists. Reading him is reading India.",
    coverGradient: "linear-gradient(140deg, #061B3A 0%, #0B3D91 100%)",
    addedAt: "2026-02-11",
    chapters: commonChapters,
  },
  {
    slug: "buddha-and-his-dhamma",
    title: "The Path of the Buddha",
    subtitle: "Dhamma in Babasaheb's words",
    author: "Sushant Nikam",
    language: "English",
    category: "Buddhism",
    categorySlug: "buddhism",
    pages: 220,
    year: 2026,
    description:
      "A companion volume that introduces the core teachings of the Buddha as Ambedkar read them — reason, morality, and the dignity of the human being.",
    authorNote:
      "The Dhamma is not a religion of fear. It is a way of standing free.",
    coverGradient: "linear-gradient(140deg, #D4AF37 0%, #F26F21 100%)",
    featured: true,
    addedAt: "2026-01-28",
    chapters: commonChapters,
  },
  {
    slug: "little-bhim-big-dream",
    title: "Little Bhim, Big Dream",
    subtitle: "A picture-story for young readers",
    author: "Sushant Nikam",
    language: "English",
    category: "Children’s Books",
    categorySlug: "childrens-books",
    pages: 48,
    year: 2026,
    description:
      "The childhood of Babasaheb — told simply, warmly, and honestly — for readers aged 7 to 12.",
    authorNote:
      "Every child deserves to know that Babasaheb was once a child too, and that his courage began with one book.",
    coverGradient: "linear-gradient(140deg, #F26F21 0%, #D4AF37 100%)",
    isChildren: true,
    addedAt: "2026-06-01",
    chapters: commonChapters,
  },
  {
    slug: "bhim-ki-kahani",
    title: "भीम की कहानी",
    subtitle: "बच्चों के लिए बाबासाहेब",
    author: "Sushant Nikam",
    language: "Hindi",
    category: "Children’s Books",
    categorySlug: "childrens-books",
    pages: 40,
    year: 2026,
    description:
      "छोटे बच्चों के लिए बाबासाहेब के बचपन की कहानियाँ — सरल भाषा, बड़े अक्षर, और सच्ची प्रेरणा।",
    authorNote: "बच्चों को इतिहास कहानी की तरह मिले, तो वह जीवन भर याद रहता है।",
    coverGradient: "linear-gradient(140deg, #0B3D91 0%, #F26F21 100%)",
    isChildren: true,
    addedAt: "2026-05-18",
    chapters: commonChapters,
  },
];

export const categories = [
  { slug: "life-of-ambedkar", name: "Life of Ambedkar" },
  { slug: "education", name: "Education" },
  { slug: "constitution", name: "Constitution" },
  { slug: "social-justice", name: "Social Justice" },
  { slug: "economics", name: "Economics" },
  { slug: "buddhism", name: "Buddhism" },
  { slug: "childrens-books", name: "Children’s Books" },
];

export const languages = ["English", "Hindi", "Marathi"] as const;

export function getBookBySlug(slug: string) {
  return books.find((b) => b.slug === slug);
}

export function getBooksByCategory(slug: string) {
  return books.filter((b) => b.categorySlug === slug);
}

export const featuredBooks = books.filter((b) => b.featured);

export const latestBooks = [...books]
  .sort((a, b) => ((a.addedAt ?? "") < (b.addedAt ?? "") ? 1 : -1))
  .slice(0, 6);

export const COPYRIGHT_NOTE =
  "Copyright © 2026 Sushant Nikam. All rights reserved. This book is made available for free online reading. Reproduction, resale, modification, or republication without written permission from the author is not allowed.";