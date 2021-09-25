export function stringToUint(str: string) {
    const charList = btoa(unescape(encodeURIComponent(str))).split('')
    const uintArray: number[] = []

    for (var i = 0; i < charList.length; i++) {
        uintArray.push(charList[i].charCodeAt(0));
    }

    return new Uint8Array(uintArray);
}