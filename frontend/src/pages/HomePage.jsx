import { CategoryBarComponent } from "../components/CategoryBarComponent"
import { RecommendationBarComponent } from "../components/RecommendationBarComponent"
import { SeachBarComponent } from "../components/SeachBarComponent"

export const HomePage = () => {
    return (
        <>
            <SeachBarComponent />
            <CategoryBarComponent />
            <RecommendationBarComponent />
        </>
    )
}
