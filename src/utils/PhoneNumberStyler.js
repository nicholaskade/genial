export function phoneNumberStyler(phoneNumber) {
    let areaCode = phoneNumber.slice(0, 3);
    let firstThree = phoneNumber.slice(3, 6);
    let lastFour = phoneNumber.slice(6);

    return `(${areaCode}) ${firstThree}-${lastFour}`;
};