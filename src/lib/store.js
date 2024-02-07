const _localStorage = globalThis['window'].localStorage;

export function clear () {
    _localStorage.clear();
}

export function removeItem(key) {
    _localStorage.removeItem(key);
}

export function setItem (key, value) {
    _localStorage.setItem(key, JSON.stringify(value));
}

export function getItem (key) {
    return JSON.parse(_localStorage.getItem(key));
}

export function keys () {
    let arr = []
    for (let i = 0; i < _localStorage.length; i++) {
        arr.push(_localStorage.key(i));
    }

    return arr;
}

/**
 * Feature Toggles
 */
 export function enabled(toggle) {
    return _localStorage.getItem(`toggles:${toggle}`) || false;
}

export function setToggle(toggle, value) {
    _localStorage.setItem(`toggles:${toggle}`, !!value);
}

export function toggleExists(toggle) {
    return _localStorage.getItem(`toggles:${toggle}`) !== null;
}
