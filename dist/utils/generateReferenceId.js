export function generateReferenceId() {
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, ""); // yymmdd
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase(); // 8 chars
    return `${datePart}${randomPart}`;
}
//# sourceMappingURL=generateReferenceId.js.map