import { loremIpsum } from "lorem-ipsum"

export const makeString = (size: number): string => {
    return loremIpsum({
        count: size,
        format: "plain",
        units: "words",
    }).substring(0, size)
}