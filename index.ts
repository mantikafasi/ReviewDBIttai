import { Plugin } from "ittai/entities";
import * as React from "react";
import ReviewDBSettings from "./components/Settings";
import { findAll, findAllByDisplayName, findByDisplayName, findByProps, ModalActions } from "ittai/webpack";
import { patcher, stores } from "ittai";
const { fetchProfile } = findByProps("fetchProfile");
import ReviewsView from "./components/ReviewsView";
import { openChangelogModal } from "ittai/changelog";
const getOnClick = findByProps("getOnClick","openURL")


export default class ReviewDB extends Plugin {

    start() {
        
        console.log("ReviewDB Started");
        
        this.setSettingsPanel(() => React.createElement(ReviewDBSettings));

        var popout = findAll(m => m.default?.displayName === "UserPopoutBody").filter(m => m.default?.toString().includes("ROLES_LIST"))[0]

        patcher.after("patchepic", popout, "default", ([{ user }], res) => {
            res.props.children.splice(res.props.children.length, 0, React.createElement(ReviewsView, { userid : user.id }))
        })

    }

    stop() {
    
        console.log("Stopping Plugin");
    }
}