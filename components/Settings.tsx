import * as React from "react";
import { useState } from "react";
import { Button, Spinner, Switch } from "ittai/components";
import * as settings from "ittai/settings"
import { authorize } from "../Utils/Utils";

export default function ReviewDBSettings(): JSX.Element {
    const [switchValue, setSwitchValue] = useState(settings.get("funnySetting", false))
    return (<>
        <Button onClick={authorize}>Authorize</Button>
        Notify new reviews
        <Switch checked={switchValue} onChange={(val) => {
            settings.set("notifyReviews", val);
            setSwitchValue(val);
            console.log("funnySetting is now", val);
        }} />
    </>)
}