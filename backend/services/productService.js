//just to make things modular and organized (it can be improved)
export const findItemById = (itsmId, items) => {
    return items.find((item) => item.id === itsmId)
}
