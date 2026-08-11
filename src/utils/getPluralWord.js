export const getPluralWord = (forms, count) => {
    const n = Math.abs(count) % 100;
    const n1 = n % 10;
    
    if (n > 10 && n < 20) return forms[2]; // 11-14
    if (n1 > 1 && n1 < 5) return forms[1];  // 2-4
    if (n1 === 1) return forms[0];          // 1
    
    return forms[2]; // 0, 5-9
}