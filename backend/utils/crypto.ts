import crypto from "crypto"

export function randomUrl(): string {
    return crypto.randomBytes(4).toString('hex');
}