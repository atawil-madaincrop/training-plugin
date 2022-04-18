
import Introductions from "../common/repository/Introductions.js";

export const carouselManagement = {
    load: async () => {
        let carouselData = await Introductions.get();
        if (carouselData.data.imageCarousel) {
            return carouselData.data.imageCarousel
        } else {
            return []
        }
    }
}