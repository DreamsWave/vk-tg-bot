import { loremIpsum } from "lorem-ipsum"

export const makeString = (size: number): string => {
    return loremIpsum({
        count: size,
        format: "plain",
        units: "words",
    }).substring(0, size)
}

export const makeID = (): number => Math.floor(Math.random() * 10000000)