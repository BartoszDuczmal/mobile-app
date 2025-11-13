
const nameValid = (name: string) => {
    const messages: string[] = [];

    if (name.length < 3) messages.push("Nazwa nie może być krótsza niż 3 znaki");
    else if(name.length > 30) messages.push("Nazwa nie może być dłuższa niż 30 znaków");

    return { valid: messages.length === 0, messages };
}

export default nameValid;