import { HappyCord, Plugin } from "../../@types/HappyCord.js"



let HappyCord: HappyCord = window["HappyCord"]
/* This tells to make the plugin the first */
let ContextMenuApi: Plugin = {
    name: "ContextMenuAPI",
    description: "API for adding/removing items to/from context menus.",
    authors: [HappyCord.Devs.HappyEnderman],
    patches: [
        {
            find: "♫ (つ｡◕‿‿◕｡)つ ♪",
            replacement: {
                match: /function \w+\(\w+\){var \w+;let{navId/,
                replace(str){
                    let firstArguementName = str.replace("function ","").split(")")[0].split("(")[1]
                    return str.replace("let{navId",`${firstArguementName} = HappyCord.plugins.ContextMenuAPI._usePatchContextMenu(${firstArguementName});let{navId`)
                }
            }  
        },
        {
            find: ".Menu,{",
            replacement: {
                match: /Menu,{/g,
                replace(str){ 
                    return str + "\ncontextMenuApiArguments:typeof arguments!=='undefined'?arguments:[],"
                }
            }
        }
    ],
    start(){
        if (!HappyCord.settings.ContextMenuAPI.patches){
            HappyCord.settings.ContextMenuAPI.patches = []
            HappyCord.SettigsStorage.saveChanges()
        }
    },
    addContextMenuPatch(navId: string, handler: Function){
        HappyCord.settings.ContextMenuAPI.patches.push({
            navId: navId,
            handler: handler
        })
        HappyCord.SettigsStorage.saveChanges()
    },
    removeContextMenuPatch(navId: string, handler:Function){
        HappyCord.settings.ContextMenuAPI.patches = HappyCord.settings.ContextMenuAPI.patches.filter(patch=>patch.navId !== navId && patch.handler !== handler)
        HappyCord.SettigsStorage.saveChanges()
    },
    _usePatchContextMenu(props){
        function cloneMenuChildren(obj) {
            if (Array.isArray(obj)) {
                return obj.map(cloneMenuChildren);
            }

            const React = HappyCord.findByProps("isValidElement")

            const { MenuControlItem } = HappyCord.Common.Componements
        
            if (React.isValidElement(obj)) {
                obj = React.cloneElement(obj);
        
                if (
                    obj?.props?.children &&
                    (obj.type !== MenuControlItem || obj.type === MenuControlItem && obj.props.control != null)
                ) {
                    obj.props.children = cloneMenuChildren(obj.props.children);
                }
            }
        
            return obj;
        }
        props = {
            ...props,
            children: cloneMenuChildren(props.children)
        }

        if (!Array.isArray(props.children)) props.children = [props.children];


        for (let patch of HappyCord.settings.ContextMenuAPI.patches){
            if (patch.navId === props.navId){
                patch.handler(props.children, props.contextMenuApiArguments ?? [])
            }
        }
        return props 
    }
}

HappyCord.definePlugin(ContextMenuApi)
