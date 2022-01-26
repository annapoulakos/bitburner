const _localStorage = globalThis['window'].localStorage;


export function set (key, value) {
    _localStorage.setItem(key, JSON.stringify(value));
}

export function get (key) {
    return JSON.parse(_localStorage.getItem(key));
}
