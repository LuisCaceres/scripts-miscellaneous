function parseRgb(rgb: string): [number, number, number] {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) {
        throw new Error(`Invalid RGB format: ${rgb}`);
    }

    return match.map(Number) as [number, number, number];
}

function getColorDistance(colour1: string, colour2: string): number {
    const [r1, g1, b1] = parseRgb(colour1);
    const [r2, g2, b2] = parseRgb(colour2);

    // Euclidean distance in RGB space
    const distance = Math.sqrt(
        Math.pow(r1 - r2, 2) +
        Math.pow(g1 - g2, 2) +
        Math.pow(b1 - b2, 2)
    );

    // Maximum possible distance in RGB space
    const maxDistance = Math.sqrt(
        Math.pow(255, 2) +
        Math.pow(255, 2) +
        Math.pow(255, 2)
    );

    // Convert distance to similarity (invert and normalize)
    const similarity = 1 - (distance / maxDistance);

    // Clamp just in case of floating point quirks
    return Math.max(0, Math.min(1, similarity));
}


function getColorByDistance(color: string, colors: string[], distance: number) {
    const distances = colors.map(colour1 => getColorDistance(color, colour1));
    distances.sort((distanceA, distanceB) =>
        distanceB - distanceA
    );

}

function getClosestColor(color: string, colors: string[]) {

    if (!colors.length) {
        throw new Error(`The length of parameter \`colors\` must be greater than zero.`);
    }

    const distances = colors.map(color2 => {

        return [color2, getColorDistance(color, color2)];
    }) as [string, number][];

    distances.sort(([, distance1], [, distance2]) => distance2 - distance1);

    const closestColor = distances.at(0)![0];

    return closestColor;
}

function getColor(property: string, declarations: string[][]) {
    const index = declarations.findLastIndex(declaration =>
        declaration[0].startsWith(property)
    );

    if (index === -1) {
        return null;
    }

    const value = declarations[index][1];
    const colour = value.match(regexes.rgb)?.[0];

    return colour ? colour : null;
}

const regexes = {
    // Matches a CSS declaration. For example, it matches `width: 100%;` in `.system { width: 100%; }`. IMPORTANT: The browser formats CSS declarations in memory to programmatically expose them consistently. For example, immediately after a property name there's a colon followed by a white-space character.
    declaration: /\b([^\s]+?):\s([\w\W]+?);\s/g,
    // Matches the red, green, blue and alpha components of the rgb or rgba CSS function. For example, it matches `0, 0, 0` in `100px solid rgba(0, 0, 0)` or `255, 255, 255, 0.` in `dashed rgba(255, 255, 255, 0.5)`
    rgb: /(?<=rgba?\(\s*)\d+(\.\d+)?,\s*\d+(\.\d+)?,\s*\d+(\.\d+)?(,\s*\d+(\.\d+)?)?(?=\s*\))/g
};

export {
    getClosestColor,
    getColor as getColour,
    getColorDistance as getColourDistance,
    regexes,
}



