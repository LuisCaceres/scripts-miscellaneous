// First copy the contents of `axe.min.js` and paste them into the developer console.

import { getAccessibilityNodes, toString } from "./accessibility-tree.js";

// Let `rules` be a list of accesibility rules.
const rules = [
    // {
    //     id: 'color-contrast',
    // },
    // // {
    //     id: 'heading-order'
    // },
    // {
    //     id: 'label'
    // },
    // {
    //     id: 'target-size'
    // },
    // Custom rules written by Vision Australia
    {
        id: 'no-offset-elements',
        run: function verifyRule(document: Document): HTMLElement[] {
            // Let `elements` be a list of all the elements on this web page.
            const elements = [...document.querySelectorAll('*')] as HTMLElement[];

            // Let `nonStaticElements` be an initially empty list of elements from `elements` whose `position` CSS property has a value that isn't `static`.
            const offsetElements = elements.filter(element => {
                const styles = element.computedStyleMap();
                const position = styles.get('position')?.toString() as string;
                const left = styles.get('left')?.toString() as string;
                const top = styles.get('top')?.toString() as string;
                const bottom = styles.get('bottom')?.toString() as string;
                const right = styles.get('right')?.toString() as string;

                const positions: number[] = [left, top, bottom, right]
                    .map(value => value === `auto` ? 0 : parseFloat(value));

                let isOffset;

                switch (true) {
                    case position === `relative` &&
                        positions.some(position => position !== 0):
                    case position !== 'static':
                        isOffset = true;
                        break;
                    default:
                        isOffset = false;
                        break;
                }

                return isOffset;
            });

            // To do: Change elements to static, measure their position and compare with their non static position.

            // Check z-index too.

            return offsetElements;
        }
    }
];

axe.configure({
    // Note: axe seems to have a list of rules internally in a specific order. Expecting rules to be executed in the specific order below isn't possible.
    rules,
    disableOtherRules: true,
});

async function* execute() {
    // Let `evaluation` be an accessibility evaluation of a web page.
    const evaluation = await axe.run();

    // For each rule `rule` in `rules`.
    for (const rule of rules) {

        // Let `violation` be the violation associated with `rule`, if any.
        const violation = evaluation.violations.find(violation =>
            violation.id === rule.id
        );

        const selectors = violation?.nodes.map(node => node.target).flat() as string[] || [];
        // Let `elements` be the elements of the web page that `violation` has identified as having issues.
        const elements = new Set([
            ...selectors.map(selector => document.querySelector(selector)),
            ...(rule.run ? rule.run(document) : [])
        ]);

        const detail = {
            elements,
            name: rule.id,
        };

        // Request to create an overlay so that the evaluator can highlight other elements with issues.
        const event = new CustomEvent('overlay requested', { detail });
        document.dispatchEvent(event);

        document.addEventListener('va-evaluation::change', ({ detail }) => {

            if (detail.id === rule.id) {
                const element = detail.element;
                const method = elements.has(element) ? 'delete' : 'add';
                elements[method](element);
            }
        });

        alert(rule.id);

        yield;
    }
}

const iterator = execute();
iterator.next();

/**
 * Creates an SVG <path> that draws a zigzag around the edges of a rectangle.
 *
 * @param {Array<{x:number,y:number}>} points - 4 points forming a rectangle; any order.
 * @param {Object} [opts]
 * @param {number} [opts.amplitude=6]   - Zigzag tooth height (perpendicular offset).
 * @param {number} [opts.wavelength=16] - Distance between successive peaks along the edge.
 * @param {string} [opts.stroke='#000'] - Path stroke color.
 * @param {number} [opts.strokeWidth=1] - Stroke width.
 * @param {string} [opts.fill='none']   - Fill color. Keep 'none' for a border.
 * @returns {SVGPathElement}
 */
function createZigZagRectPath(points, opts = {}) {
    const {
        amplitude = 6,
        wavelength = 16,
        stroke = 'red',
        strokeWidth = 2.5,
        fill = 'none',
    } = opts;

    // Build edges as segments P0->P1->P2->P3->P0
    const edges = [
        [points[0], points[1]],
        [points[1], points[2]],
        [points[2], points[3]],
        [points[3], points[0]],
    ];

    // Assemble path commands
    let d = '';
    let started = false;

    edges.forEach(([A, B], edgeIndex) => {
        const vx = B.x - A.x;
        const vy = B.y - A.y;
        const len = Math.hypot(vx, vy);
        if (len === 0) return;

        // Unit tangent and outward normal (perpendicular)
        const tx = vx / len;
        const ty = vy / len;
        const nx = -ty;
        const ny = tx;

        // Number of teeth along the edge
        const steps = Math.max(1, Math.floor(len / (wavelength / 2))); // half-wavelength segments

        // Start point for this edge
        if (!started) {
            d += `M ${A.x} ${A.y}`;
            started = true;
        } else {
            // Ensure continuity to the exact corner
            d += ` L ${A.x} ${A.y}`;
        }

        // March along the edge in half-wavelengths, alternating offset direction (+/- amplitude)
        for (let i = 1; i <= steps; i++) {
            const t = (i * (wavelength / 2)) / len;              // param along edge [0..1]
            const clampT = Math.min(t, 1);
            const px = A.x + tx * (clampT * len);
            const py = A.y + ty * (clampT * len);

            // Alternate normal direction: even i => +amplitude, odd i => -amplitude
            const flip = (i % 2 === 0) ? 1 : -1;
            const ox = px + nx * amplitude * flip;
            const oy = py + ny * amplitude * flip;

            d += ` L ${ox} ${oy}`;
        }

        // Ensure we land exactly on the end corner for this edge
        d += ` L ${B.x} ${B.y}`;
    });

    // Close path.
    d += ' Z';

    // Create the path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', fill);
    path.setAttribute('stroke', stroke);
    path.setAttribute('stroke-width', strokeWidth);

    return path;
}

/**
 *
 * @param element
 * @returns
 */
function getCoordinates(element: HTMLElement) {
    const inset = 10;

    const rectangle = element.getBoundingClientRect();
    const left = rectangle.left + window.scrollX - inset;
    const right = rectangle.right + window.scrollX + inset;
    const top = rectangle.top + window.scrollY - inset;
    const bottom = rectangle.bottom + window.scrollY + inset;

    const coordinates = [
        { x: left, y: top },
        { x: right, y: top },
        { x: right, y: bottom },
        { x: left, y: bottom },
    ];

    return coordinates;
}

{
    // Let `box` be that displays information about `currentHighlight`.
    const box = document.createElement('p');

    Object.assign(box.style, {
        inlineSize: 'fit-content',
        padding: `1rem`,
        background: 'black',
        border: 'white solid 10px',
        margin: 0,
        position: 'fixed',
        zIndex: 999999999999999999,
        color: 'white',
    });

    // Let `container` be an element that contains overlays.
    const container = document.createElement('div');
    container.id = 'va-overlay-container';

    // Add or remove `container` by pressing insert` or `escape` key respectively.
    window.addEventListener('keydown', event => {
        event.stopImmediatePropagation();

        if (event.key === 'Delete') {
            container.style.insetInlineStart = '-99999999px';
        }
        else if (event.key === 'Insert') {
            container.style.insetInlineStart = '0px';
        }
    });

    Object.assign(container.style, {
        // TO DO: Adjust `height` as size of web page grows or shrinks.
        height: `${document.documentElement.scrollHeight}px`,
        inset: 0,
        position: 'absolute',
        zIndex: '999999999999999',
    });

    // Let `overlays` be an initially empty list of overlays on which highlights exist. A highlight is an outline around an element that is believed to associated with an accessibility issue.
    const overlays: SVGElement[] = [];

    document.addEventListener('overlay requested', ((event: CustomEvent) => {
        // Let `overlay` be an element that covers the entire screen.
        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        overlay.setAttribute('viewBox', `0 0 ${document.documentElement.scrollWidth} ${document.documentElement.scrollHeight}`);
        overlay.id = event.detail.name;

        Object.assign(overlay.style, {
            inlineSize: '100%',
            blockSize: '100%',
            position: 'absolute',
            inset: '0',
        });

        container.append(overlay);
        container.focus();
        overlays.push(overlay);

        [...event.detail.elements].forEach(element => drawHighlight(element, overlay));
    }) as EventListener);

    container.append(box);
    document.body.append(container);

    const detail = {
        elements: [],
        name: 'foo',
    };

    // Request to create an overlay so that the evaluator can highlight other elements with issues.
    const event = new CustomEvent('overlay requested', { detail });
    document.dispatchEvent(event);

    // Let `element` be the last element the pointer was on.
    let element = document.body;
    // Let `accessibilityNode` be `element`'s closest accessibility node in the accessibility tree. It currently has a highlight while the cursor is over. This highlight gets removed once the cursor exits `element`.
    let accessibilityNode = document.body;
    // Let `highlights` be an initially empty list of accessibility nodes with a permanent hightlight.
    const highlights: Map<HTMLElement, SVGPathElement> = new Map();

    // While the pointer moves over the web page.
    window.addEventListener('pointermove', event => {
        // Let `currentElement` be the current element the pointer is on.
        const currentElement = document.elementsFromPoint(event.x, event.y)[2] as HTMLElement;

        // Do nothing if the pointer is over the same element as before.
        if (currentElement === element) {
            return;
        }

        // The cursor is over a different element.
        element = currentElement;

        // Remove highlight from `accessibilityNode`.
        highlights.get(accessibilityNode)?.remove();
        highlights.delete(accessibilityNode);

        // Add highlight to `currentElement`'s closest accessibility node.
        const accessibilityNodes = getAccessibilityNodes(currentElement);
        accessibilityNode = accessibilityNodes[0] || document.body;
        drawHighlight(accessibilityNode, overlays[0]);

        // Display information about `currentAccessibilityNode` on the page.
        box.textContent = toString(accessibilityNodes);
    });

    // When the pointer is pressed on `currentAccessibilityNode`.
    window.addEventListener('pointerdown', () => {
        highlights.has(accessibilityNode) ?
            highlights.delete(accessibilityNode) :
            drawHighlight(accessibilityNode, overlays[0]);
    });

    function drawHighlight(element: HTMLElement, overlay: SVGElement) {
        const coordinates = getCoordinates(element)
        const outline = createZigZagRectPath(coordinates);
        highlights.set(element, outline);
        overlay.append(outline);
    }
}