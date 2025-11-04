
const passValid = (pass: string) => {
    const messages: string[] = [];

    if (pass.length < 8) messages.push("● Minimum 8 znaków");
    else if (pass.length > 30) messages.push("● Maksymalnie 30 znaków");
    else if (!/[a-z]/.test(pass)) messages.push("● Przynajmniej jedna mała litera");
    else if (!/[A-Z]/.test(pass)) messages.push("● Przynajmniej jedna duża litera");
    else if (!/\d/.test(pass)) messages.push("● Przynajmniej jedna cyfra");
    else if (!/[^a-zA-Z0-9]/.test(pass)) messages.push("● Przynajmniej jeden znak specjalny");

    return { valid: messages.length === 0, messages };
}

export default passValid;