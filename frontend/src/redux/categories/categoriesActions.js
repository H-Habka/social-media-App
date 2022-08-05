import { categoriesTypes } from "./categoriesTypes";

export const setCategoriesNames = (categories) => ({
    type: categoriesTypes.FETCH_CATEGORIES,
    payload : categories
})

