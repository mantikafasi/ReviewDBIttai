import { findByProps } from "ittai/webpack";

const openOAuth2Modal = findByProps("openOAuth2Modal"); 


export function Authorize() {
    
    var props = openOAuth2Modal.getOAuth2AuthorizeProps("https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&response_type=code&scope=identify")
    openOAuth2Modal.openOAuth2Modal(props,() => {
        if (tempOpen !== undefined) window.open = tempOpen;
    })

    var tempOpen = window.open;

    window.open = function (url?:string):void {
        if (url?.startsWith("https://manti.vendicated.dev")) {
            fetch(url).then(res => {res.json().then(res => {
                //TODO ADD TOKEN TO SETTINGS AND NOTIFY USER
            })})
            window.open = tempOpen;
        } else {
            tempOpen(url);
        }
    }


}