export const fee = (is_member) => is_member ? (2) : (10);
export const beverage = (age) => age >= 21 ? 'beer' : 'juice';
export const main = () => {
    console.log(fee(true));
    console.log(fee(false));
    console.log(beverage(18));
    return console.log(beverage(40));
};
