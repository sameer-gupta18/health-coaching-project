let remove0s = (number)=>{
    let number1 = number.replace("+91","")
    return `+91${number1.replace(/^0+|0+$/g, "")}`;
}

export default remove0s