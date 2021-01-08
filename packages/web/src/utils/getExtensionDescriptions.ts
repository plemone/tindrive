import { getAllExtensions } from '.';

export default function getExtensionDescriptions(extension: string): string[] {
    extension = extension
        .replace('.', '')
        .toUpperCase();
    const extensions = getAllExtensions();
    return extension in extensions
        ? extensions[extension].descriptions
        : [];
}
