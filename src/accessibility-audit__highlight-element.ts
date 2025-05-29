{
    customElements.define('ms-element-highlighter',
        class extends HTMLElement {
            constructor() {
                super();

                const host = this;
                const shadowRoot = host.attachShadow({ mode: 'closed' });

                const template = new DOMParser().parseFromString(`
                <template>
                    <svg></svg>
                </template>    
                `, 'text/html').querySelector('template')?.content as DocumentFragment;

                const style = document.createElement('style');
                style.textContent = `
                    svg {
                        position: fixed;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                    }
                `;
            }
        }
    );

    const element = document.createElement('')

    // const colour = 'red';

    // const element = $0 as HTMLElement;
    // const boundingClientRect = element.getBoundingClientRect();

    // const windowWidth = window.innerWidth;
    // const windowHeight = window.innerHeight;

    // const svg = document.createElement('ms-element-highlighter');
    // svg.setAttribute('viewBox', `0 0 ${windowWidth} ${windowHeight}`);
    // svg.style.position = 'fixed';
    // svg.style.left = '0';
    // svg.style.right = '0';
    // svg.style.top = '0';
    // svg.style.bottom = '0';
    // svg.style.zIndex = '99999999999999999999';

    // const innerRectangle = `M ${boundingClientRect.x} ${boundingClientRect.y} h ${boundingClientRect.width} v ${boundingClientRect.height} h -${boundingClientRect.width} z`;

    // const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // path.setAttribute('d', `M 0 0 h ${windowWidth} v ${windowHeight} h -${windowWidth} z ${innerRectangle}`);

    // path.style.fill = '#FFFFFF';
    // path.style.fillOpacity = '0.75';
    // path.style.fillRule = 'evenodd';
    // path.style.stroke = colour;
    // path.style.strokeWidth = '10';

    // svg.append(path);
    // document.body.prepend(svg);

    // Convert to a web component so there are no clashes with styles!
    // Add event listener to remove svg with escape key
    // Add event listner to highlight element with a combination of keys. 
    // Write functionality to draw an arrow (what if there are more than 1 square)
    // Write functionanility to capture more than 1 square.
}