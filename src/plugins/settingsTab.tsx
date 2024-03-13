import { HappyCord, Plugin } from "../../@types/HappyCord.js";
import React from "react";

let HappyCord: HappyCord = window["HappyCord"];

let settingsTabPlugin: Plugin = {
  name: "SettingsTab",
  description: "Settings tab for happycord",
  authors: [1083437693347827764n],
  patches: [
    /** add happycord banner to version hash*/
    {
      find: ".COPY_VERSION",
      replacements: [
        {
          match:
            /\(0,\w+\.jsx\)\(\w+\.Text,{tag:"span",className:\w+\.line,variant:"text-xs\/normal",color:"text-muted",children:\w+}\):null/g,
          replace: function (str) {
            return str + ",HappyCord.plugins.SettingsTab.getBanner()";
          },
        },
      ],
      plugin: undefined,
    },

    {
      find: "PlatformTypes.ROBLOX",
      replacements: [
        {
          match: /enabled: !1/g,
          replace: "enabled: !0",
        },
      ],
      plugin: undefined,
    },
    {
      find: "Messages.ACTIVITY_SETTINGS",
      replacements: [
        {
          match:
            /,label:\w+\.default\.Messages\.ACTIVITY_PRIVACY,element:\w+\.default},/g,
          replace: function (str) {
            console.log(str);
            return str + "...HappyCord.plugins.SettingsTab.getSettings(),";
          },
        },
      ],
      plugin: undefined,
    },
  ],
  openSettingsForPlugin(plugin){
    let { ModalRoot,ModalHeader,ModalCloseButton,ModalContent, ModalFooter,ModalSize,Select, FormTitle, FormText, FormSection, FormSwitch, Text, TextArea, TextInput, Button } =
        HappyCord.Common.Componements;
    const SettingsModal = props => {
        const { useState } = HappyCord.Common.ReactHooks 
        const [ state, setState ] = useState(HappyCord.settings[plugin.name])
        return <ModalRoot {...props} size={ModalSize.MEDIUM}>
            <ModalHeader>
                <Text color="header-primary" variant="heading-lg/semibold" tag="h1" style={{ flexGrow: 1 }}>{plugin.name} - Settings:</Text>
                <ModalCloseButton onClick={props.onClose}></ModalCloseButton>
            </ModalHeader>
            <ModalContent>
                <br />

                {Object.keys(plugin.options).map(key=>{
                    const option = plugin.options[key]
                    if (option.type === HappyCord.OptionsTypes.TEXT){
                        let option_formatted = {}
                        option_formatted[key] = HappyCord.settings[plugin.name][key] ?? option.default
                        return (<><FormSection key={key} title={option.name}>
                        <FormText type="description">
                            {option.description}
                        </FormText>
                        <TextInput
                            placeholder=""
                            value={state[key]}
                            onChange={(text) => { 
                                setState({
                                    ...state,
                                    [key]: text 
                                });    
                            } }
                        />
                    </FormSection><br/></>) 
                    }
                    /** custom option */
                    if (option.type === HappyCord.OptionsTypes.CUSTOM){
                        return <><option.compomenet></option.compomenet><br/></>
                    }
                    /** boolean option */
                    if (option.type === HappyCord.OptionsTypes.BOOLEAN){
                        let option_formatted = {}
                        option_formatted[key] = HappyCord.settings[plugin.name][key] ?? option.default
                        return (
                            <>    
                                <FormSwitch 
                                    value={state[key]}
                                    note={option.name}
                                    key={key}
                                    onChange={(value) => { 
                                        setState({
                                            ...state,
                                            [key]: value 
                                        });
                                    } }
                                >{option.description}</FormSwitch>
                                <br />
                            </>
                        )
                    }
                    if (option.type === HappyCord.OptionsTypes.DROPDOWN){
                      console.log(option)  
                      return (
                            <>
                            <FormSection key={key} title={option.name}>
                                <FormTitle>{option.description}</FormTitle>
                                <Select
                                    isDisabled={false}
                                    options={option.options}
                                    placeholder={option.placeholder ?? "Select an option"}
                                    maxVisibleItems={5}
                                    closeOnSelect={true}
                                    select={(value) => {
                                        console.log(value)
                                        setState({
                                            ...state, 
                                            [key]: value
                                        })
                                    }}
                                    isSelected={v => v === state[key]}
                                    serialize={v => String(v)}
                                    {...option.componentProps}
                                />
                               
                            </FormSection>
                            <br />
                            </>
                        )
                    }
                })}
                
                <br />
                
            </ModalContent>
            <ModalFooter>
                <Button
                    onClick={() => {
                        HappyCord.settings[plugin.name] = state 
                        HappyCord.SettigsStorage.saveChanges()
                        props.onClose()
                    }}
                    disabled={false}
                >
                    Save & close 
                </Button>
                <Button
                    onClick={props.onClose}
                    color={Button.Colors.PRIMARY}
                    look={Button.Looks.LINK}
                >
                    Cancel
                </Button>
            </ModalFooter>
        </ModalRoot>;
    }
    HappyCord.Common.openModal(props=><SettingsModal {...props}></SettingsModal>)
  },
  getSettings() {
    let { FormSection, FormSwitch, Text, TextArea, TextInput, Button } =
      HappyCord.Common.Componements;
    let { useState } = HappyCord.Common.ReactHooks;

    const [search_string, setSearchString] = useState("");
    const [PluginsList, setPlugins] = useState(
      Object.values(HappyCord.plugins)
    );

    function search(text) {
      setSearchString(text);

      setPlugins(
        Object.values<Plugin>(HappyCord.plugins).filter(
          (plugin) =>
            plugin.name.toLowerCase().includes(text.toLowerCase()) ||
            plugin.description.toLowerCase().includes(text.toLowerCase())
        )
      );
    }

    const Plugins = () => (
      <FormSection
        tag="h1"
        title="Plugins"
        className={HappyCord.findByProps("marginBottom40").marginBottom40}
      >
        <TextInput
          value={search_string}
          autoFocus={true}
          placeholder="Search for a plugin."
          onChange={(e) => {
            search(e);
          }}
        ></TextInput>
        <br />
        <Text varient="text-xl/bold">
          Showing: {PluginsList.length} plugin(s)!
        </Text>
        <br />
        {PluginsList.map((plugin) => (
          <>
            <div
              key={plugin.name}
              className={`plugin-card ${
                plugin.name === "SettingsTab" ? "plugin-disabled" : ""
              }`}
            >
              <div className="plugin-card-header">
                <Text className="plugin-card-name" varient="text-md/bold">
                  {plugin.name}
                </Text>
                <Button
                  color={Button.Colors.BRAND}
                  disabled={!plugin.enabled}
                  onClick={() => {
                    HappyCord.plugins.SettingsTab.openSettingsForPlugin(plugin)
                  } }
                >
                  ⚙️
                </Button>
                <Button
                  color={Button.Colors.BRAND_NEW}
                  disabled={plugin.enabled || plugin.name === "SettingsTab"}
                  onClick={() => {
                    HappyCord.plugins[plugin.name].enable();
                    if (search_string) {
                      search(search_string);
                      return;
                    }
                    setPlugins(Object.values(HappyCord.plugins));
                  }}
                >
                  Enable
                </Button>
                <Button
                  color={Button.Colors.BRAND_NEW}
                  disabled={!plugin.enabled || plugin.name === "SettingsTab"}
                  onClick={() => {
                    console.log(plugin);
                    HappyCord.plugins[plugin.name].disable();
                    if (search_string) {
                      search(search_string);
                    }
                    setPlugins(Object.values(HappyCord.plugins));
                  }}
                >
                  Disable
                </Button>
              </div>
              <Text className="plugin-card-desc" varient="text-xs/small">
                {plugin.description}
              </Text>
            </div>
            <br />
          </>
        ))}
      </FormSection>
    );
    const [themes, setThemes] = useState(HappyCord.themes.join("\n"));
    function addTheme(themes) {
      HappyCord.setThemes(themes.split("\n"));
      HappyCord.loadAllThemes();
      setThemes(themes);
    }
    const Themes = () => (
      <FormSection
        tag="h1"
        title="Themes"
        className={HappyCord.findByProps("marginBottom40").marginBottom40}
      >
        <Text>Add themes:</Text>
        <br />
        <TextArea
          value={themes}
          allowNewLines={true}
          spellcheckEnabled={false}
          useSlate={false}
          textValue={true}
          richValue={false}
          rows={10}
          autoFocus={true}
          onChange={addTheme}
          placeholder={
            "Themes urls....\nhttps://raw.githubusercontent.com/Comfy-Themes/Discord/master/betterdiscord/better-spotify.css\nhttps://pastebin.com/raw/abc"
          }
        ></TextArea>
      </FormSection>
    );
    return [
      {
        section: "DIVIDER",
      },
      {
        section: "HEADER",
        label: "HappyCord",
      },
      {
        section: "PLUGINS",
        label: "Plugins",
        element: () => <Plugins></Plugins>,
      },
      {
        section: "THEMES",
        label: "Themes",
        element: () => <Themes></Themes>,
      },
    ];
  },
  getBanner() {
    let { Text } = HappyCord.Common.Componements;
    let line = HappyCord.wreq(
      HappyCord.findModuleId(`line:`, "info:", "versionHash:")
    ).line;
    return (
      <Text
        tag="span"
        varient="text-xs/normal"
        color="text-muted"
        className={line}
      >
        HappyCord (Nightly)
      </Text>
    );
  },
  showNeededRestartModal() {
    HappyCord.Common.openModal((props, close) => {
      let { ConfirmModal, Text } = HappyCord.Common.Componements;
      return (
        <ConfirmModal
          {...props}
          header="HappyCord — Restart required"
          cancelText="Later"
          confirmText="Restart now"
          onConfirm={HappyCord.restartDiscord}
        >
          <Text variant="text-md/normal" style={{ flexGrow: 1 }}>
            Restart to see changes!
          </Text>
        </ConfirmModal>
      );
    });
  },
};
HappyCord.definePlugin(settingsTabPlugin);
