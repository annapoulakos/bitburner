export const __VERSION__ = "2.0.0";

export const FLAGS = [
    ['verbose', false],
    ['region', '']
];

export const Help = {
    Name: `AWS-CLI (Anna Web Services-CLI) v${__VERSION__}`,
    Description: 'A collection of tooling for interacting with various components in BitBurner. Primarily focused around building and configuring servers (both executable and hacknet).',
    Text: 'file:/aws-core/help.txt'
};

export function noop() {}
