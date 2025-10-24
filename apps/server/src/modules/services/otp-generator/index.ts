const otpGenerator = (otpLength: number = 4) => {
    const chars = "0123456789";
    let otp = "";
    for (let i = 0; i < otpLength; i++) {
        otp += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }
    return otp;
};

export default otpGenerator;
