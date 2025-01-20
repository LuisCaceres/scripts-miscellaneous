{
    // For example, it matches `{{image-1}}` and `{{image-10}}.
    const regex = /{{(image-\d+)}}/;
    const path = 'images/';
    const extension = 'png';

    const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT);
    let currentNode = treeWalker.nextNode() as Text;

    while (currentNode) {
        const text = (currentNode.textContent || '').trim();
        const match = text.match(regex);

        if (match) {
            const file = match[1];

            const link = document.createElement('a');
            link.href = `${path}/${file}.${extension}`;
            link.target = '_blank';
            link.textContent = `${file}.${extension}`;

            currentNode.replaceWith(link);
        }

        currentNode = treeWalker.nextNode() as Text;
    }
}