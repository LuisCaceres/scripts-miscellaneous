// The following piece of code converts a URL into an interactive link. For example, let's imagine that there's a paragraph and whithin that paragrapth there are URLS's. Those URL's aren't clickable, pressable or tappable. The following piece of code detects those URL's and makes them interactive links. 

{
    const selector = 'td';
    const elements = [...document.querySelectorAll(selector)];

    // For each element `element` in `elements`.
    for (const element of elements) {
        const link = document.createElement('a');
        link.textContent = element.textContent?.trim() || '';
        link.href = element.textContent?.trim() || '';

        element.textContent = '';
        element.append(link);
    }
}