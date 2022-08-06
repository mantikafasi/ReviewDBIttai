import { settings, toast } from "ittai";
import { findByProps } from "ittai/webpack";
import GenericToast from "ittai/toast/ToastWrapper";
import { getClientMod } from "ittai/utilities";
import React from "react";
const { getOAuth2AuthorizeProps } = findByProps("openOAuth2Modal"); 
const { OAuth2AuthorizeModal } = findByProps('OAuth2AuthorizeModal')
const { openModal } = findByProps('openModal', 'useModalsStore')


export function authorize(callback?:any) {
    
    var opts = getOAuth2AuthorizeProps("https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&response_type=code&scope=identify")
    
    openModal((props:any) =>
        React.createElement(OAuth2AuthorizeModal, {
        ...props,
        ...opts,
        responseType: 'code',
        cancelCompletesFlow: false,
        callback: (c:any) => {
            try {
                const url = new URL(c)
                fetch(url + "&returnType=json&clientMod=" + getClientMod()).then(res => {res.json().then(res => {
                    if (res.status === 0) {
                        settings.set("token", res.token);
                        showToast("Successfully logged in!")
                        callback?.()
                    } else if (res.status === 1) {
                        showToast("An Error Occured while logging in.")
                    }
                })})
            } catch (e) {
                console.log(e)
            }
        }
        })
    )
}

export function showToast(text:string) {
    toast.show(GenericToast({"children":text}));
}

export const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));
