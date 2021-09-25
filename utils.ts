export function stringToUint(str: string) {
    const charList = btoa(unescape(encodeURIComponent(str))).split('')
    const uintArray: number[] = []

    for (var i = 0; i < charList.length; i++) {
        uintArray.push(charList[i].charCodeAt(0));
    }

    return new Uint8Array(uintArray);
}

export function UintToString(uint: Uint8Array): string {
    return atob(new TextDecoder().decode(uint))
}

export function getTemplateFilePath(templateName: string) {
    if(templateName.endsWith('.tpo')) {
        return `./templates/${templateName}`
    }

    return `./templates/${templateName}.tpo`
}