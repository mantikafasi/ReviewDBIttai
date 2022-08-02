import { settings, toast } from "ittai";
import { findByProps } from "ittai/webpack";
import GenericToast from "ittai/toast/ToastWrapper";
import { getClientMod } from "ittai/utilities";
const openOAuth2Modal = findByProps("openOAuth2Modal"); 


export function authorize(callback?:any) {
    
    var props = openOAuth2Modal.getOAuth2AuthorizeProps("https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&response_type=code&scope=identify")
    openOAuth2Modal.openOAuth2Modal(props,() => {
        if (tempOpen !== undefined) window.open = tempOpen;
    })

    // for some reason patching doesnt work so I temporarily override the function
    var tempOpen = window.open;
    window.open = function (url?:string):void {
        if (url?.startsWith("https://manti.vendicated.dev")) {
            
            fetch(url + "&returnType=json&clientMod=" + getClientMod()).then(res => {res.json().then(res => {
                if (res.status === 0) {
                    settings.set("token", res.token);
                    showToast("Successfully logged in!")
                    callback?.()
                } else if (res.status === 1) {
                    showToast("An Error Occured while logging in.")
                }
            })})
            window.open = tempOpen;
        } else {
            tempOpen(url);
        }
    }
}

export function showToast(text:string) {
    toast.show(GenericToast({"children":text}));
}

export const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));
