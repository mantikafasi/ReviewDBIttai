import { Plugin } from "ittai/entities";
import * as React from "react";
import ExampleSettingsPage from "./components/Settings";
import { findAll, findAllByDisplayName, findByDisplayName, findByProps } from "ittai/webpack";
import { patcher, stores } from "ittai";
const { fetchProfile } = findByProps("fetchProfile");

import ReviewsView from "./components/ReviewsView";
export default class ReviewDB extends Plugin {

    start() {
        
        console.log("ReviewDB Started");

        this.setSettingsPanel(() => React.createElement(ExampleSettingsPage));

        var popout = findAll(m => m.default?.displayName === "UserPopoutBody").filter(m => m.default?.toString().includes("ROLES_LIST"))[0]
        var TabBar = findByDisplayName("TabBar",false)

        patcher.after("Tabbar",TabBar,"default",([...args],res)=>{
            console.log(args)
        })

        patcher.after("patchepic", popout, "default", ([{ user }], res) => {

            res.props.children.splice(res.props.children.length, 0, React.createElement(ReviewsView, { userid : user.id }))
            console.log("got called")
            console.log(res.props.children)
            
        })
    }

    stop() {
        console.log("bye");
    }
}