// Single source of truth for the personal details and links shown on the
// pages and in /llms.txt, so the HTML and Markdown versions never drift apart.

export const person = {
    name: "András Bögöly",
    title: "Java Backend Developer",
};

// Each description is used both as the page's <meta name="description"> and in /llms.txt.
export const pages = {
    home: {
        path: "/",
        title: "Home Page",
        description: `Personal homepage of ${person.name}, ${person.title}, with links to GitHub, LinkedIn and Credly.`,
    },
    contact: {
        path: "/contact/",
        title: "Contact",
        description: `Contact form for sending ${person.name} a message, answered by email.`,
    },
};

// Kept out of `pages` so it isn't listed in /llms.txt.
export const notFoundPage = {
    title: "Not found",
    description: `Page not found on ${person.name}'s personal homepage.`,
};

export const profiles = {
    github: {
        label: "GitHub",
        href: "https://github.com/bogolyandras",
        description: "source code and projects",
    },
    linkedin: {
        label: "LinkedIn",
        href: "https://linkedin.com/in/bogolyandras",
        description: "work history; the preferred contact channel",
    },
    credly: {
        label: "Credly",
        href: "https://www.credly.com/users/andras-bogoly/",
        description: "certifications and badges",
    },
};
