import { Plugin } from "ittai/entities";
import * as React from "react";
import ReviewDBSettings from "./components/Settings";
import { findAll } from "ittai/webpack";
import { patcher, settings, stores } from "ittai";
import ReviewsView from "./components/ReviewsView";
import { getLastReviewID } from "./Utils/ReviewDBAPI";
import { showToast, sleep } from "./Utils/Utils";

export default class ReviewDB extends Plugin {
    async start() {
        console.log("ReviewDB Started");
        do { //powercord will explode
            var currentUser = stores.Users.getCurrentUser();
            if (!currentUser) await sleep(3000);
        } while (!currentUser);

        getLastReviewID(stores.Users.getCurrentUser().id).then(lastreviewid => {
            const storedLastReviewID: number = settings.get("lastreviewid", 0)
            if (settings.get("notifyReviews", true) && storedLastReviewID < lastreviewid) {
                if (storedLastReviewID != 0) {
                    showToast("You have new reviews on your profile")
                }
                settings.set("lastreviewid", lastreviewid)
            }
        })

        this.setSettingsPanel(() => React.createElement(ReviewDBSettings));

        var popout = findAll(m => m.default?.displayName === "UserPopoutBody").filter(m => m.default?.toString().includes("ROLES_LIST"))[0]
        patcher.after("UserPopoutPatch", popout, "default", ([{ user }], res) => {
            res.props.children.splice(res.props.children.length, 0, React.createElement(ReviewsView, { userid: user.id }))
        })

    }

    stop() {
        patcher.unpatchAll();
        this.removeSettingsPanel();
        console.log("Stopping ReviewsDB");
    }
}

