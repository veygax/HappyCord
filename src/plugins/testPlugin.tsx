import { HappyCord, Plugin } from "../../@types/HappyCord.js"


let HappyCord: HappyCord = window["HappyCord"]
/* This tells to make the plugin the first */
let TestPlugin: Plugin = {
    name:"TestPlugin",
    description: "A plugin that patches and has test stuff",
    authors: [HappyCord.Devs["Voxj."]],
    patches: [
        {
            find: "f6c7b8245d3a54cf98b2.png",
            replacements: [
                {   
                    match: /\w+\.p\+("|')f6c7b8245d3a54cf98b2\.png("|')/,
                    replace(str:string){
                        return `"${HappyCord.settings["TestPlugin"].AVATAR_PREVIEW_URL}"`
                    }
                }
            ]
        }
    ],
    testPatch(children,props){
        const { MenuItem } = HappyCord.Common.Componements

        console.log(children)
        children.push(<MenuItem 
            id="the-emoji-name"
            label={props[0].target.dataset.name}
            action={()=>{
            const ToastsApi = HappyCord.Common.ToastsApi
            ToastsApi.showToast(ToastsApi.createToast("patches work!",4))
        }}></MenuItem>)
    },
    start(){
        const ToastsApi = HappyCord.Common.ToastsApi
        ToastsApi.showToast(ToastsApi.createToast("hello friendz, this plugin is started!",4))
        HappyCord.plugins.BadgesApi.addBadge("1083437693347827764",{
            id: "bleh",
            description: "Bleh",
            icon: "https://cdn.discordapp.com/emojis/1103750853317374124.webp?size=128&quality=lossless"
        })
        HappyCord.plugins.ContextMenuAPI.addContextMenuPatch("expression-picker",this.testPatch)
    },
    stop(){
        const ToastsApi = HappyCord.Common.ToastsApi
        ToastsApi.showToast(ToastsApi.createToast("hello friendz, this plugin is stopped!",4))
        HappyCord.plugins.ContextMenuAPI.removeContextMenuPatch("expression-picker",this.testPatch)
    },
    options: {
        AVATAR_PREVIEW_URL: {
            type: HappyCord.OptionsTypes.TEXT,
            name: "Enter the image url",
            description:"The image that will be used on preview on collectibles shop.",
            default: "/assets/f6c7b8245d3a54cf98b2.png"
        },
        
    }
}
HappyCord.definePlugin(TestPlugin)
