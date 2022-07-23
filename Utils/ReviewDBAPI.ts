import { settings, toast } from "ittai"
import GenericToast from "ittai/toast/ToastWrapper"
import { Review } from "../entities/Review"
import { authorize } from "./Utils"

const API_URL = "https://manti.vendicated.dev"

export const getReviews = async (discorid : number): Promise<Review[]> => {
    const res = await fetch("https://manti.vendicated.dev/getUserReviews?snowflakeFormat=string&discordid=" + discorid.toString())
    return await res.json() as Review[]
}

export const addReview = async (review : Review): Promise<void> => {
    var token = settings.get("token","")
    if (token === "") {
        authorize();
        toast.show(GenericToast({"children":"Please authorize to add a review."}))
        return
    }

    var data :any = {"token":token,"star":-1,"comment":review.comment}

    fetch(API_URL + "/addReview", data).then(
        res => {toast.show(GenericToast({"children":res.text()}))}
    )
}
