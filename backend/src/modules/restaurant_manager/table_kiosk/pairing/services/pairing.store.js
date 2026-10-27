// In-memory store for Table Device Pairing PIN codes with 5-minute TTL
export const pairingCodesMap = new Map();

setInterval(() => {
    const now = Date.now();
    for (const [code, data] of pairingCodesMap.entries()) {
        if (data.expiresAt < now) {
            pairingCodesMap.delete(code);
        }
    }
}, 60 * 1000);
