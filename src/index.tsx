import { HappyCord, Plugin } from '../@types/HappyCord.js'; 
import { Webpack } from '../@types/Webpack.js'; 



let HappyCord: HappyCord = {
    patches: [
        /**{PATCHS}**/
    ],
    plugins: {},
    __subscribptions: [],
    SettigsStorage: {
        /** Save the changes that were made to the settings object */
        saveChanges() {
            HappyCord.localStorage.setItem("happycord_plugins_settings", JSON.stringify(HappyCord.settings));
        }
    },
    restartDiscord() {
        /** Restarts discord */
        location.reload();
    },
    OptionsTypes: Object.freeze({
        DROPDOWN: 1,
        BOOLEAN: 2,
        TEXT: 3,
        CUSTOM: 4
    }),
    injectCss(id, css) {
        const style = document.createElement('style');
        style.id = id;
        style.innerText = css;
        document.head.appendChild(style);
        return style;
    },
    webpackChunkdiscord_app: undefined,
    $$OriginalPush: undefined,
    handlePush: undefined,
    settings: undefined,
    localStorage: undefined,
    _mods: [],
    requiredPlugins: {
        SettingsTab: ''
    },
    _plugins: [],
    _themes: [],
    themes: [],
    chunks: [],
    Common: {
        FluxDispatcher: {
            dispatch: function (event: object): Promise<object> {
                throw new Error('Function not implemented.');
            },
            addInterceptor: function (interceptor: Function): void {
                throw new Error('Function not implemented.');
            },
            subscribe: function (event: string, handler: Function): void {
                throw new Error('Function not implemented.');
            },
            _interceptors: []
        },
        Stores: undefined,
        ReactHooks: undefined,
        ToastsApi: {
            ToastType: {
                CLIP: 0,
                CUSTOM: 0,
                FAILURE: 0,
                MESSAGE: 0,
                SUCCESS: 0
            },
            Toast: undefined,
            createToast: function (text: string, options: number): object {
                throw new Error('Function not implemented.');
            },
            showToast: function (createdToast: any): void {
                throw new Error('Function not implemented.');
            }
        },
        openModal: function (compomenet: any): string {
            throw new Error('Function not implemented.');
        },
        Componements: undefined,
        Fragement: undefined,
        murmurhash: {
            v2: function (text: string): number {
                throw new Error('Function not implemented.');
            },
            v3: function (text: string): number {
                throw new Error('Function not implemented.');
            }
        },
        SimpleMarkdown: undefined,
        Constants: undefined,
        ApiErrors: {
            V6OrEarlierAPIError: undefined,
            V8APIError: undefined
        },
        Clipboard: {
            SUPPORTS_COPY: false,
            copy: function (text: any): boolean {
                throw new Error('Function not implemented.');
            }
        },
        RestApi: {
            get: function (url: any, data: any): Promise<object> {
                throw new Error('Function not implemented.');
            },
            post: function (url: any, data: any): Promise<object> {
                throw new Error('Function not implemented.');
            },
            patch: function (url: any, data: any): Promise<object> {
                throw new Error('Function not implemented.');
            },
            put: function (url: any, data: any): Promise<object> {
                throw new Error('Function not implemented.');
            },
            delete: function (url: any, data: any): Promise<object> {
                throw new Error('Function not implemented.');
            },
            getAPIBaseURL: function (): string {
                throw new Error('Function not implemented.');
            },
            V6OrEarlierAPIError: undefined,
            V8APIError: undefined
        },
        jsx: function (Componement: Function, props: object) {
            throw new Error('Function not implemented.');
        },
        jsxs: function (Componement: Function, props: object) {
            throw new Error('Function not implemented.');
        }
    },
    definePlugin: function (Plugin: any): void {
        throw new Error('Function not implemented.');
    },
    wreq: function (id: string | number): object {
        throw new Error('Function not implemented.');
    },
    findByProps: function (...props: any[]) {
        throw new Error('Function not implemented.');
    },
    findByPropsAll: function (...props: any[]): any[] {
        throw new Error('Function not implemented.');
    },
    findByCode: function (...codes: any[]): Function {
        throw new Error('Function not implemented.');
    },
    findModuleId: function (...codes: any[]): string {
        throw new Error('Function not implemented.');
    },
    findStore: function (store: string) {
        throw new Error('Function not implemented.');
    },
    getAllStores: function (): object {
        throw new Error('Function not implemented.');
    },
    setThemes: function (themes: any[]): void {
        throw new Error('Function not implemented.');
    },
    loadAllThemes: function (): void {
        throw new Error('Function not implemented.');
    }
}
HappyCord.definePlugin = (plugin) => {
    if (!plugin.name){
        throw Error("No plugin name provided!")
    }
    plugin.enabled = typeof HappyCord.settings[plugin.name] === "object" && HappyCord.settings[plugin.name].enabled
    HappyCord.plugins[plugin.name] = plugin
    if (plugin.enabled || plugin.name === "SettingsTab"){
        for (let option in plugin.options){
            if (!Object.keys(HappyCord.settings[plugin.name]).includes(option)){
                let optionData = plugin.options[option]
                console.log(optionData)
                if (optionData.default && optionData.type !== HappyCord.OptionsTypes.DROPDOWN){
                    HappyCord.settings[plugin.name][option] = optionData.default
                }
                if (optionData.type === HappyCord.OptionsTypes.DROPDOWN){
                    let defaultOption = optionData.options.find(selectoption=>selectoption.default) 
                    if (defaultOption){
                        HappyCord.settings[plugin.name][option] = defaultOption.value
                    }
                }
            }
        }
        for (let patch of plugin?.patches ?? []){
            patch.plugin = plugin.name 
            HappyCord.patches.push(patch)
        }
        for (let subscribption in plugin?.subscribptions ?? []){
            const action = plugin?.subscribptions?.[subscribption]
            if (typeof action !== "function"){
                console.warn(`[HAPPYCORD] ${plugin.name} Added a flux dispatcher subscribption that doesnt have a function to call!`)
            }

            if (typeof action === "function"){
                HappyCord.__subscribptions.push({
                    type: subscribption,
                    action: action
                })
            }
           
        }
    }
    plugin.enable = () => {
        if (!HappyCord.settings[plugin.name]){
            HappyCord.settings[plugin.name] = {}
        }
        HappyCord.settings[plugin.name].enabled =  true
        for (let option in plugin.options){
            if (!Object.keys(HappyCord.settings[plugin.name]).includes(option)){
                let optionData = plugin.options[option]
                console.log(optionData)
                if (optionData.default && optionData.type !== HappyCord.OptionsTypes.DROPDOWN){
                    HappyCord.settings[plugin.name][option] = optionData.default
                }
                if (optionData.type === HappyCord.OptionsTypes.DROPDOWN){
                    let defaultOption = optionData.options.find(selectoption=>selectoption.default) 
                    if (defaultOption){
                        HappyCord.settings[plugin.name][option] = defaultOption.value
                    }
                }
            }
        }
        HappyCord.SettigsStorage.saveChanges()

        const ToastsApi = HappyCord.Common.ToastsApi
        ToastsApi.showToast(ToastsApi.createToast(`${plugin.name} Was enabled!`,ToastsApi.ToastType.SUCCESS))
        if (plugin.patches.length > 0){
            HappyCord.plugins.SettingsTab.showNeededRestartModal()
        }
        HappyCord.plugins[plugin.name].enabled = true 
        plugin.start()
    }
    plugin.disable = () => {
        const ToastsApi = HappyCord.Common.ToastsApi
        if (HappyCord.requiredPlugins[plugin.name]){
            ToastsApi.showToast(ToastsApi.createToast(`${plugin.name} can't be disabled!`,ToastsApi.ToastType.FAILURE))
            return
        }
        if (!HappyCord.settings[plugin.name]){
            HappyCord.settings[plugin.name] = {}
        }
        HappyCord.settings[plugin.name].enabled = false     
        HappyCord.SettigsStorage.saveChanges()
        ToastsApi.showToast(ToastsApi.createToast(`${plugin.name} Was disabled!`,ToastsApi.ToastType.SUCCESS))
        if (plugin.patches.length > 0){
            HappyCord.plugins.SettingsTab.showNeededRestartModal()
        }
        HappyCord.plugins[plugin.name].enabled = false
        plugin.stop()
    }
} 
HappyCord.localStorage = localStorage
 
if (!HappyCord.localStorage.getItem("happycord_plugins_settings")){
    HappyCord.localStorage.setItem("happycord_plugins_settings",JSON.stringify({}))
}

if (!HappyCord.localStorage.getItem("happycord_themes")){
    HappyCord.localStorage.setItem("happycord_themes",JSON.stringify([]))
}

HappyCord.settings = JSON.parse(HappyCord.localStorage.getItem("happycord_plugins_settings"))

/** {{PLUGINS}} **/


HappyCord.themes = JSON.parse(HappyCord.localStorage.getItem("happycord_themes"))

HappyCord.setThemes = (themes) => {
    HappyCord.localStorage.setItem("happycord_themes",JSON.stringify(themes))
    HappyCord.themes = themes
}


HappyCord.loadAllThemes = () => {
    document.querySelectorAll("[id^=happycord_theme_]").forEach(e=>e.remove())
    for (let theme of HappyCord.themes){
        const index = HappyCord.themes.indexOf(theme)
        fetch(theme).then(e=>e.text()).then(res=>{
            HappyCord.injectCss(`happycord_theme_${index}`,res)
        })
    }
}


HappyCord.loadAllThemes()
HappyCord.requiredPlugins = Object.freeze({
    SettingsTab: "SettingsTab"
})
for (let requiredPlugin in HappyCord.requiredPlugins){
    HappyCord.settings[requiredPlugin] = {
        enabled: true 
    } 
}



HappyCord.handlePush = (chunks,unkown) => {
    let addedChunks = chunks[1]
    for (let chunk in addedChunks){
        let code = addedChunks[chunk].toString()
        if (code.includes("call_ringing.mp3")){
            console.log(HappyCord.patches)
        }
        if (code.includes("delete window.localStorage")){
            console.log(HappyCord.patches)
        }        
        for (let patch of HappyCord.patches){
            if (code.includes(patch.find)){
                console.log(patch)
                let oldCode = String(code) 

                if (chunk === "419243"){
                    console.log(HappyCord.patches)
                }
                for (let replacement of patch.replacements){
                    const match = typeof replacement.match === "function" ? replacement.match() : replacement.match
                    const replace = typeof replacement.replace === "function" ? replacement.replace(code.match(match)[0]) : replacement.replace
                    code = code.replace(match,replace)
                    if (oldCode === code){
                        console.warn(`${patch.plugin} ${JSON.stringify(patch)} Didnt do anything!`)
                    }
                    eval(`addedChunks[chunk] = ${code}`)
                    console.log(addedChunks[chunk])
                }
            }
        }
    }
    
    HappyCord.$$OriginalPush([chunks[0],addedChunks,chunks[2]],unkown)
}

function waitThenRun() {
    var interval = setInterval(function() {
        
        if (window["webpackChunkdiscord_app"] !== undefined  && window["webpackChunkdiscord_app"].push !== Array.prototype.push) {
            clearInterval(interval);
            HappyCord.webpackChunkdiscord_app = window["webpackChunkdiscord_app"] as Webpack 
            HappyCord.$$OriginalPush = window["webpackChunkdiscord_app"].push 
            Object.defineProperty(window["webpackChunkdiscord_app"], "push", {
                get: () => HappyCord.handlePush,
                configurable: true
            });
        }
    })            
}
waitThenRun()

document.addEventListener("DOMContentLoaded",()=>{


    
    let wreq;
    window["webpackChunkdiscord_app"].push([
        ["wreq-"+Date.now()],
        {},
        (req)=>{
            wreq = req
        }
    ])
    HappyCord.wreq = wreq
    HappyCord._mods = Object.values(wreq.c)
    HappyCord.chunks = wreq.m 
    
    /** happycord stuff */
    HappyCord._plugins = []
    HappyCord._themes = []
        
    HappyCord.findByProps = (...props) => {
        for (let m of HappyCord._mods) {
            try {
                if (!m.exports || m.exports === window) continue;
                if (props.every((x) => m.exports?.[x])) return m.exports;
    
                for (let ex in m.exports) {
                    if (props.every((x) => m.exports?.[ex]?.[x])) return m.exports[ex];
                }
            } catch {}
        }
    }
    HappyCord.findByPropsAll = (...props) => {
            let result = []
            for (let m of HappyCord._mods) {
                try {
                    if (!m.exports || m.exports === window) continue;
                    if (props.every((x) => m.exports?.[x])) result.push(m.exports);
        
                    for (let ex in m.exports) {
                        if (props.every((x) => m.exports?.[ex]?.[x])) result.push(m.exports[ex]);
                    }
                } catch {}
            }
            return result
    }
    HappyCord.findModuleId = (...codes) => {
        return Object.keys(HappyCord.chunks).find(chunk=>codes.every(code=>wreq.m[chunk].toString().includes(code)))   
    }
    HappyCord.findByCode = (...codes) => {
        for (let m of HappyCord._mods){
            for (let ex in m?.exports){
                if (codes.every(code=>m?.exports?.[ex]?.toString()?.includes(code))){
                    return m?.exports?.[ex] 
                }
            }   
        }
    }
        
    HappyCord.findStore = (store) => {
        return HappyCord.Common.Stores[store];
    }
    HappyCord.getAllStores = () => {
        const stores = {}
        let tempStores = HappyCord.findByPropsAll("addChangeListener","_dispatcher")
        for (let store of tempStores.map(e=>e.constructor.displayName)){
            stores[store] = tempStores.find(e => e.constructor.displayName === store)
        }
        return stores 
    }


    HappyCord.Common = {
        FluxDispatcher: HappyCord.findByProps("_dispatch","addInterceptor") as HappyCord["Common"]["FluxDispatcher"],
        Stores: HappyCord.getAllStores(),
        ReactHooks: HappyCord.findByProps("useState"),
        openModal: HappyCord.findByProps("openModal").openModal,
        ToastsApi: Object.assign({
            ToastType: HappyCord.findByProps("ToastType").ToastType,
            showToast: HappyCord.findByProps("showToast").showToast
        },HappyCord.findByProps("Toast")),
        Componements: HappyCord.findByProps("Modal","Slider","Slide"),
        Fragement: HappyCord.findByProps("Fragment").Fragment,
        murmurhash: {
            v2: HappyCord.findByProps("v2").v2,
            v3: HappyCord.findByProps("v3").v3
        },
        SimpleMarkdown: HappyCord.findByProps("parseBlock", "parseInline", "defaultOutput"),
        Constants: HappyCord.findByProps("Routes","Endpoints","GuildFeatures"),
        ApiErrors: {
            V6OrEarlierAPIError: HappyCord.findByProps("V6OrEarlierAPIError").V6OrEarlierAPIError,
            V8APIError: HappyCord.findByProps("V8APIError").V8APIError
        },
        Clipboard: HappyCord.findByProps("SUPPORTS_COPY", "copy"),
        RestApi: HappyCord.findByProps("getAPIBaseURL"),
        jsx: HappyCord.findByProps("jsx").jsx,
        jsxs: HappyCord.findByProps("jsxs").jsxs
    }
       

    HappyCord.Common.FluxDispatcher.addInterceptor(event=>{
        /** HAPPYCORD INTERCEPTOR, DO NOT DELETE... WILL BREAK HAPPYCORD PLUGINS!!!!! */
        /** Add cancel function */
        event.$cancel$ = () => event.type = null 
        if (event.type === "CONNECTION_OPEN"){
            for (let plugin of Object.values<Plugin>(HappyCord.plugins)){
                
                if (plugin.enabled){
                    if (typeof plugin.start === "function"){
                        plugin?.start()
                    }
                }
            }
        }
        for (let subscribption of HappyCord.__subscribptions){
            if (subscribption.type === event.type){
                subscribption.action(event)
            }
        }
    })
    window["jsx"] = HappyCord.Common.jsx;
    window["jsxs"] = HappyCord.Common.jsxs;

})
window["HappyCord"] = HappyCord
