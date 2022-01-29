const _localStorage = globalThis['window'].localStorage;


export function setItem (key, value) {
    _localStorage.setItem(key, JSON.stringify(value));
}

export function getItem (key) {
    return JSON.parse(_localStorage.getItem(key));
}
