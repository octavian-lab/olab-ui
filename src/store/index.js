import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

export const store = () => {
    const pinia = createPinia()
    pinia.use(piniaPersist);

    return pinia
}