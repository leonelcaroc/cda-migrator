export default function randomPassword(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let pwd = "";
    for (let i = 0; i < length; i++) {
        pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return pwd;
}
//# sourceMappingURL=randomPassword.js.map