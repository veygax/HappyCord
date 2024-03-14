import { HappyCord, Plugin } from "../../@types/HappyCord.js"



let HappyCord: HappyCord = window["HappyCord"]
/* This tells to make the plugin the first */
let NoTrackPlugin: Plugin = {
    name: "NoTrack",
    description: "Disable Discord's tracking ('science'), metrics and Sentry crash reporting",
    authors: [HappyCord.Devs.HappyEnderman],
    required: true,
    patches: [
        {
            find: "AnalyticsActionHandlers.handle",
            replacement: {
                match: /^.+$/,
                replace: "()=>{}",
            },
        },
        {
            find: "window.DiscordSentry=",
            replacement: {
                match: /^.+$/,
                replace: "()=>{}",
            }
        },
        {
            find: ".METRICS,",
            replacements: [
                {
                    match: /this\._intervalId=/,
                    replace: "this._intervalId=undefined&&"
                },
                {
                    match: /(increment\(\i\){)/,
                    replace: "$1return;"
                }
            ]
        },
        {
            find: ".installedLogHooks)",
            replacement: {
                // if getDebugLogging() returns false, the hooks don't get installed.
                match: /getDebugLogging\(\)\{/,
                replace: "getDebugLogging(){return false;"
            }
        },
    ]
};

HappyCord.definePlugin(NoTrackPlugin)
