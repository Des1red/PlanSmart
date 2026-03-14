let shouldScrollToToday = false;

export function getShouldScrollToToday() {
    return shouldScrollToToday
}

export function setshouldScrollToToday(value = false) {
    shouldScrollToToday = value
}