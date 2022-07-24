import { Plugin } from "ittai/entities";
import * as React from "react";
import ReviewDBSettings from "./components/Settings";
import { findAll } from "ittai/webpack";
import { patcher, settings, stores, toast } from "ittai";
import ReviewsView from "./components/ReviewsView";
import { getLastReviewID } from "./Utils/ReviewDBAPI";
import { showToast } from "./Utils/Utils";

export default class ReviewDB extends Plugin {

    start() {
        console.log("ReviewDB Started");

        getLastReviewID(stores.Users.getCurrentUser().id).then(lastreviewid=>{
            const storedLastReviewID:number = settings.get("lastreviewid",0) 
            if (settings.get("notifyReviews",true) && storedLastReviewID < lastreviewid) {
                if (storedLastReviewID != 0 ) {
                    showToast("You have new reviews on your profile")
                }
                settings.set("lastreviewid",lastreviewid)
            }
        })

        this.setSettingsPanel(() => React.createElement(ReviewDBSettings));

        var popout = findAll(m => m.default?.displayName === "UserPopoutBody").filter(m => m.default?.toString().includes("ROLES_LIST"))[0]

        patcher.after("patchepic", popout, "default", ([{ user }], res) => {
            res.props.children.splice(res.props.children.length, 0, React.createElement(ReviewsView, { userid : user.id }))
        })

    }

    stop() {
    
        console.log("Stopping ReviewsDB");
    }
}

