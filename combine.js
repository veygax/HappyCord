import fs_promises from 'fs/promises';

async function main(){
    let content = await fs_promises.readFile("./dist/index.js",{encoding:"utf-8"})
    let plugins = ""

    for (let plugin of await fs_promises.readdir("./dist/plugins")){
        let plugin_content = await fs_promises.readFile("./dist/plugins/".concat(plugin),{encoding:"utf-8"}) + "\n\n"
        let plugin_css;
        try { 
            plugin_css =  await fs_promises.readFile(`./src/styles/${plugin.replace(".js",".css")}`,{encoding:"utf-8"}) 
        } catch {/*skip not found file*/}

        let cssLoadCode = plugin_css ? `\nHappyCord.injectCss("${plugin}",\`${plugin_css}\`)` : ""
        
        plugin_content = plugin_content.replaceAll(`import { jsx as _jsx } from "react/jsx-runtime";`,"") // make it use discord jsx runtime
        plugin_content = plugin_content.replaceAll(`import { jsxs as _jsxs } from "react/jsx-runtime";`,"") // make it use discord jsx runtime
        plugin_content = plugin_content.replaceAll(`import { Fragment as _Fragment } from "react/jsx-runtime";`,"")
        plugin_content = plugin_content.replaceAll(`import { Fragment as _Fragment } from "react/jsx-runtime";`,"")
        plugin_content = plugin_content.replaceAll(`import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";`,"")
        plugin_content = plugin_content.replaceAll(`import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";`,"")
        plugin_content = plugin_content.replaceAll("_jsx(","jsx(")
        plugin_content = plugin_content.replaceAll("_jsxs(","jsxs(")
        plugin_content = plugin_content.replaceAll("_Fragment, {", "HappyCord.Common.Fragement, {")
        plugins += `/** ${plugin} */`+ plugin_content + cssLoadCode + "\n\n"    
    }

    content = content.replaceAll(`import { jsxs as _jsxs } from "react/jsx-runtime";`,"") // make it use discord jsx runtime
    content = content.replaceAll(`import { jsx as _jsx } from "react/jsx-runtime";`,"") // make it use discord jsx runtime
    content = content.replaceAll(`import { Fragment as _Fragment } from "react/jsx-runtime";`,"")
    content = content.replaceAll(`import { Fragment as _Fragment } from "react/jsx-runtime";`,"")
    content = content.replaceAll(`import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";`,"")
    content = content.replaceAll(`import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";`,"")
    content = content.replace("HappyCord.loadAllThemes();",`HappyCord.loadAllThemes();\n${plugins}`)
    content = content.replaceAll(`let HappyCord = window["HappyCord"];`,"")
    content = content.replaceAll("export {};","")


    try {
        await fs_promises.mkdir("dist-chromium")
    } catch {}
    try {
        await fs_promises.mkdir("dist-fox")
    } catch {}

    await fs_promises.writeFile("./dist/index.js",content,{encoding:"utf-8"})
    console.log("[BUILDER] Combined plugins and their css into one file. (index.js)")

    /** FOR CHROMIUM BASED BROWSERS */
    await fs_promises.copyFile("./dist/index.js","./dist-chromium/index.js")
    await fs_promises.copyFile("./chrome-extension/manifest.json","./dist-chromium/manifest.json")
    await fs_promises.copyFile("./chrome-extension/modifyResponseHeaders.json","./dist-chromium/modifyResponseHeaders.json")
    await fs_promises.copyFile("./chrome-extension/content.js","./dist-chromium/content.js")
    console.log("[BUILDER] Builded for chromium based browsers. (./dist-chromium)")
    
    /** FOR FOX BASED BROWSERS */
    await fs_promises.copyFile("./dist/index.js","./dist-fox/index.js")
    await fs_promises.copyFile("./firefox-extension/manifest.json","./dist-fox/manifest.json")
    await fs_promises.copyFile("./firefox-extension/background.js","./dist-fox/background.js")
    await fs_promises.copyFile("./firefox-extension/content.js","./dist-fox/content.js")
    console.log("[BUILDER] Builded for fox based browsers. (./dist-fox)")

    
}
main()
