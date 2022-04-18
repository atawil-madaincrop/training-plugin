
import Introduction from "../../../widget/common/entities/Introduction.js";
import Introductions from "../../../widget/common/repository/Introductions.js";


export const carouselManagement = {
    load: async () => {
        let data = await Introductions.get();
        if (data.data.imageCarousel == undefined) {
            let newIntroduction = new Introduction();
            Introductions.save(newIntroduction);
        } else if (data.data.imageCarousel == null) {
            return []
        } else {
            return (data.data.imageCarousel)
        }
    },
    pushItems: async (items) => {
        Introductions.save({ imageCarousel: items })
    },
    removeItem: async (items) => {
        Introductions.save({ imageCarousel: items })
    }
}

