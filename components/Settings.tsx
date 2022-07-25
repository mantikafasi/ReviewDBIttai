import * as React from "react";
import { useState } from "react";
import { Button, Spinner, Switch, SwitchItem, Text, TextInput } from "ittai/components";
import * as settings from "ittai/settings"
import { authorize } from "../Utils/Utils";
import { findByProps } from "ittai/webpack";
const { FormDivider } = findByProps("FormDivider")

export default function ReviewDBSettings(): JSX.Element {
    const [switchValue, setSwitchValue] = useState(settings.get("notifyReviews", true))
    const [oauth2token, setOauth2token] = useState(settings.get("token", ""))
    return (<>

        <SwitchItem value={switchValue} onChange={(val) => {
            settings.set("notifyReviews", val);
            setSwitchValue(val);
        }} >Notify New Reviews</SwitchItem>

        <Text style={{ marginBottom: 4, marginLeft: 2 }}>OAUTH2 Token</Text>
        <TextInput style={{ marginBottom: 8 }} value={oauth2token} placeholder="Authorize to get token" onChange={(val) => {
            settings.set("token", val)
            setOauth2token(val)
            return true;
        }} />

        <Button onClick={() => authorize(() => setOauth2token(settings.get("token", "")))}>Authorize</Button>
        <FormDivider style={{ marginTop: 12 }} />

        <Text style={{ marginTop: 8, marginBottom: 4 }}>If Authorize Button is not working</Text>
        <Button onClick={() =>
            window.open("https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&response_type=code&scope=identify")
        }>Get OAUTH2 Token</Button>

    </>)
}