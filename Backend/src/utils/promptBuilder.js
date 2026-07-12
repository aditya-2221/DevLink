const projectContext = (project) => `
Project Title:
${project.title}

Category:
${project.category || "Not specified"}

Description:
${project.description}

Tech Stack:
${Array.isArray(project.techStack)
        ? project.techStack.join(", ")
        : project.techStack}

GitHub Repository:
${project.githubLink || "Not provided"}

Live Demo:
${project.liveLink || "Not provided"}

Project Owner:
${project.owner?.fullName || "Unknown"}
`;

const buildDescriptionPrompt = (project) => `
You are an expert software engineer and technical writer.

${projectContext(project)}

Generate a professional project description suitable for:

- GitHub
- Resume
- Portfolio
- LinkedIn

Requirements:

- 200-300 words
- Professional tone
- Mention the technologies naturally
- Explain the problem solved
- Explain the solution
- Highlight the major capabilities
- Do not use markdown
`;

const buildReadmePrompt = (project) => `
You are an expert open-source maintainer.

${projectContext(project)}

Generate a complete GitHub README in Markdown.

Include the following sections:

# Project Title

## Overview

## Problem Statement

## Features

## Tech Stack

## Installation

## Usage

## Folder Structure

## Future Improvements

## Author

Do not wrap the response inside markdown code fences.
`;

const buildReportPrompt = (project) => `
You are a software engineering professor.

${projectContext(project)}

Generate a mini project report.

Include:

1. Abstract

2. Problem Statement

3. Objectives

4. Proposed Solution

5. Key Features

6. Technology Stack

7. Architecture Overview

8. Future Scope

9. Conclusion

Use professional academic language.

Do not use markdown.
`;

const buildReviewPrompt = (project) => `
You are a senior software architect.

${projectContext(project)}

Review this project.

Provide:

Overall Rating (out of 10)

Strengths

Weaknesses

Architecture Review

Code Quality Suggestions

Scalability Suggestions

Security Suggestions

Performance Suggestions

Future Improvements

Keep the review constructive.

Use markdown headings and bullet points.
`;

export {
    buildDescriptionPrompt,
    buildReadmePrompt,
    buildReportPrompt,
    buildReviewPrompt
};