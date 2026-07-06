import { tools_Brand } from "./brand.tools/index.js";
import { tools_Restaurant } from "./restaurant.tools/index.js";
import { tools_MenuItem } from "./dish/index.js";
export const tools = [
    {
        functionDeclarations: [
            // truyền all tools vào đây
            ...tools_Brand,
            ...tools_Restaurant,
            ...tools_MenuItem
        ]
    }
]