if (typeof browser === "undefined") {
    var browser = chrome;
}

const script = document.createElement("script");
script.src = browser.runtime.getURL("index.js");
script.id = "happycord-script";
Object.assign(script.dataset, {
    extensionBaseUrl: browser.runtime.getURL(""),
    version: browser.runtime.getManifest().version
});


document.documentElement.append(script);
