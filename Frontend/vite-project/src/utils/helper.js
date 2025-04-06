export const validateEmail = (email)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);

}
export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";
  
    const [integerPart, fractionalPart] = num.toString().split(".");
  
    // If number is less than or equal to 3 digits, no formatting needed
    if (integerPart.length <= 3) {
      return fractionalPart
        ? `${integerPart}.${fractionalPart}`
        : integerPart;
    }
  
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);
  
    const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  
    const formattedInteger = `${formattedOtherNumbers},${lastThree}`;
  
    return fractionalPart
      ? `${formattedInteger}.${fractionalPart}`
      : formattedInteger;
  };
  