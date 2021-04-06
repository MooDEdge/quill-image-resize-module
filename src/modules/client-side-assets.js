const pathPrefix = import.meta.url.replace(/\/esm\/.*/, "/esm/");

function embed(src) {
    const fetching = fetch(src).then(x => x.text());
    return container => fetching.then(x => {
        container.innerHTML = x;
    });
}

export const IconAlignLeft = embed(`${pathPrefix}icons/align-left.svg`);
export const IconAlignCenter = embed(`${pathPrefix}icons/align-center.svg`);
export const IconAlignRight = embed(`${pathPrefix}icons/align-right.svg`);