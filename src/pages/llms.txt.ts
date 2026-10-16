import type { APIRoute } from "astro";
import { person, profiles } from "../data/profile";

// Markdown summary of the site for LLMs and agents, following https://llmstxt.org
export const GET: APIRoute = ({ site }) => {
    const url = (path: string) => new URL(path, site).href;

    const body = `# ${person.name}

> ${person.title}. Personal homepage with contact and profile links.

The best way to get in touch is a message on LinkedIn.

## Profiles

${Object.values(profiles)
    .map((p) => `- [${p.label}](${p.href}): ${p.description}`)
    .join("\n")}

## Pages

- [Home](${url("/")}): name, title and profile links
- [Contact](${url("/contact/")}): how to get in touch
`;

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
