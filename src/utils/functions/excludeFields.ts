

export default function exclude<T>(
    obj: T,
    keys: (keyof T)[]
): Omit<T, keyof T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keys.includes(key as keyof T)),
    ) as T;
}