function sanitizeBigInt(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sanitizeBigInt);
    }

    if (typeof obj === "object" && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key,
                typeof value === "bigint" ? value.toString() : value
            ])
        );
    }

    return obj;
}

module.exports = sanitizeBigInt;