import { HappyCord, Plugin } from "../../@types/HappyCord.js"


let HappyCord: HappyCord = window["HappyCord"]
/* This tells to make the plugin the first */
let TestPlugin: Plugin = {
    name:"TestPlugin",
    description: "A plugin that patches and has test stuff",
    authors: [1n],
    patches: [
        {
            find: "delete window.localStorage",
            replacements: [
                {   
                    match: /delete window.localStorage/,
                    replace: "console.log(\"blocked localstorage remover\")" 
                }
            ]
        }
    ],
    start(){
        const ToastsApi = HappyCord.Common.ToastsApi
        ToastsApi.showToast(ToastsApi.createToast("hello friendz, this plugin is started!",4))
    },
    stop(){
        const ToastsApi = HappyCord.Common.ToastsApi
        ToastsApi.showToast(ToastsApi.createToast("hello friendz, this plugin is stopped!",4))
    },
    subscribptions: {
        MESSAGE_CREATE: (event) => {
            let options_generated = ``
            for (let option in HappyCord.settings["TestPlugin"]){
                options_generated += `**${option}:** ${HappyCord.settings["TestPlugin"][option]}\n`
            }
            event.message.content = options_generated
        },
        MESSAGE_DELETE: (event) => {
            event.$cancel$()
        }
    },
    options: {
        TEST: {
            type: HappyCord.OptionsTypes.TEXT,
            name: "hi",
            description: "crazy",
            default: "lmao"
        },
        LMAO: {
            type: HappyCord.OptionsTypes.CUSTOM,
            compomenet: () => {
               return <button style={{color:"red"}}>test!!</button>
            }
        },
        MAN: {
            type: HappyCord.OptionsTypes.BOOLEAN,
            name: "is good?",
            description:"is it really good?",
            default: true
        },
        DROP: {
            type: HappyCord.OptionsTypes.DROPDOWN,
            name: "testing....",
            description:"crazy plugin",
            options: [
                { label: "Random Characters", value: "random", default: true },
                { label: "Consistent", value: "cons" },
                { label: "Timestamp", value: "timestamp" },
            ],
            placeholder: "Choose an option or you have skill issue"
        }
    }
}
HappyCord.definePlugin(TestPlugin)
