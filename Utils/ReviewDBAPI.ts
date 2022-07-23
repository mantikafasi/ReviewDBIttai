import { settings, toast } from "ittai"
import GenericToast from "ittai/toast/ToastWrapper"
import { Review } from "../entities/Review"
import { authorize } from "./Utils"

const API_URL = "https://manti.vendicated.dev"

export const getReviews = async (discorid : number): Promise<Review[]> => {
    const res = await fetch("https://manti.vendicated.dev/getUserReviews?snowflakeFormat=string&discordid=" + discorid.toString())
    return await res.json() as Review[]
}

export const addReview = async (review : any): Promise<number> => {
    var token = settings.get("token","")
    if (token === "") {
        authorize();
        toast.show(GenericToast({"children":"Please authorize to add a review."}))
        return 2
    }
    review["token"] = token

    return await fetch(API_URL + "/addUserReview", {method:"POST",body:JSON.stringify(review)}).then(r =>r.text()).then(
        res => {
            toast.show(GenericToast({"children":res}))
            var responseCode = 0 
            // 0 means added ,1 means edited, 2 means error
            if (res === "Added your review") {
                responseCode = 0 
            } else if (res === "Updated your review") {
                responseCode = 1
            } else {
                responseCode = 2
            }
            return responseCode
        }
    )
}

export const deleteReview = async ()=>{

}

export const reportReview = async ()=>{

}

export const getLastReviewID = async ()=>{

}

