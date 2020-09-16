export function logInfo(text: string) {
    // tslint:disable-next-line: no-console
    console.log(`\x1b[32m[Info] \x1b[0m ${text}`)
}

export function logWarning(text: string) {
    // tslint:disable-next-line: no-console
    console.log(`\x1b[33m[Warn] \x1b[0m ${text}`)
}

export function logError(text: string) {
    // tslint:disable-next-line: no-console
    console.log(`\x1b[31m[Error] \x1b[0m ${text}`)
}

export function logCritical(text: string) {
    // tslint:disable-next-line: no-console
    console.log(`\x1b[4m\x1b[31m[Critical]\x1b[0m \x1b[4m ${text}\x1b[0m`)
}

export function logNotice (text: string) {
    // tslint:disable-next-line: no-console
    console.log(`\x1b[36m[Notice] \x1b[0m ${text}`)
}

export function logDebug(text: string) {
    // tslint:disable-next-line: no-console
    console.log(`\x1b[36m[DEBUG] \x1b[0m ${text}`)
}

export function logChat (text: string) {
    // tslint:disable-next-line: no-console
    console.log(`\x1b[35m[CHAT] \x1b[0m ${text}`)
}

