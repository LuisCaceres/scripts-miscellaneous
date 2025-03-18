{
    const colour = 'red';

    const element = $0 as HTMLElement;
    const boundingClientRect = element.getBoundingClientRect();

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${windowWidth} ${windowHeight}`);
    svg.style.position = 'fixed';
    svg.style.left = '0';
    svg.style.right = '0';
    svg.style.top = '0';
    svg.style.bottom = '0';
    svg.style.zIndex = '99999999999999999999';

    const innerRectangle = `M ${boundingClientRect.x} ${boundingClientRect.y} h ${boundingClientRect.width} v ${boundingClientRect.height} h -${boundingClientRect.width} z`;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M 0 0 h ${windowWidth} v ${windowHeight} h -${windowWidth} z ${innerRectangle}`);

    path.style.fill = '#FFFFFF';
    path.style.fillOpacity = '0.75';
    path.style.fillRule = 'evenodd';
    path.style.stroke = colour;
    path.style.strokeWidth = '10';

    svg.append(path);
    document.body.prepend(svg);

    // Add event listener to remove svg with escape key
    // Add event listner to highlight element with a combination of keys. 
    // Write functionality to draw an arrow (what if there are more than 1 square)
    // Write functionanility to capture more than 1 square.
}