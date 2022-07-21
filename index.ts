import { Plugin } from "ittai/entities";
import * as React from "react";
import ExampleSettingsPage from "./components/Settings";
import { find, findAll, findAllByDisplayName, findByDisplayName, findByProps } from "ittai/webpack";
import { patch } from "ittai/patcher";
import { patcher } from "ittai";
import { UserProfile } from "ittai/stores";
import { Text } from "ittai/components";
import "./components/UserReviews.css";

import ReviewsView from "./components/ReviewsView";
import ReviewComponent from "./components/ReviewComponent";
export default class EpicMantiPlugin extends Plugin {

    async fetchReviews(userid: number) {
        const res = await fetch("https://manti.vendicated.dev/getUserReviews?discordid=" + userid.toString())
        const json = await res.json()
        return json
    }

    start() {
        this.setSettingsPanel(() => React.createElement(ExampleSettingsPage));
        console.log("hello (after a hot reload)!");
        console.log(this);

        //var Popout = findByDisplayName("UserPopoutBody",false)
        var popout = findAll(m => m.default?.displayName === "UserPopoutBody").filter(m => m.default?.toString().includes("ROLES_LIST"))[0]


        const cache: any = {}

        patcher.after("patchepic", popout, "default", ([{ user }], res) => {
            if (!cache[user.id]) {
                this.fetchReviews(user.id).then(reviews => {
                    cache[user.id.toString()] = reviews
                })
            } else {
                res.props.children.splice(res.props.children.length, 0, React.createElement(ReviewsView, { reviews: cache[user.id.toString()] }))
                console.log("got called")
                console.log(res.props.children)
            }
        })
    }

    stop() {
        console.log("bye");
    }
}