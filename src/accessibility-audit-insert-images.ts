{
    // For example, it matches `{{image-1}}` and `{{image-10}}.
    const regex = /{{(image-\d+)}}/;
    const path = 'images/';
    const extension = 'png';

    const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT);
    let currentNode = treeWalker.nextNode() as Text;
    const nodes: Text[] = [];

    while (currentNode) {
        const text = (currentNode.textContent || '').trim();
        const match = text.match(regex);

        if (match) {
            nodes.push(currentNode);
        }

        currentNode = treeWalker.nextNode() as Text;
    }


    // For each node 'node' in 'nodes'.
    for (const node of nodes) {
        const file = node?.textContent?.match(regex)?.[1];
        const link = document.createElement('a');
        link.href = `${path}/${file}.${extension}`;
        link.target = '_blank';
        link.textContent = `${file}.${extension}`;
        node.replaceWith(link);
    }



}