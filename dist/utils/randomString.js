export default function randomString(length = 6) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    for (let i = 0; i < length; i++) {
        str += nums[Math.floor(Math.random() * nums.length)];
    }
    return str;
}
//# sourceMappingURL=randomString.js.map