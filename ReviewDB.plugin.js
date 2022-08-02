/**
 * @name ReviewDB
 * @version 1.0.0
 * @main index.js
 * @description A plugin allows you to review people and see other peoples reviews
 * @license MIT
 * @source https://github.com/mantikafasi/ReviewDBIttai
 * @updateUrl https://github.com/mantikafasi/ReviewDBIttai/blob/builds/ReviewDB.plugin.js
 * @author mantikafasi
 */
(function () {
    'use strict';

    // Made with Ittai - https://git.catvibers.me/ittai/ittai
    let IttaiInternals = {};
    let ittaiPluginExport=(()=>{

    var manifest$1 = {
    	name: "ReviewDB",
    	version: "1.0.0",
    	license: "MIT",
    	source: "https://github.com/mantikafasi/ReviewDBIttai",
    	updateUrl: "https://github.com/mantikafasi/ReviewDBIttai/blob/builds/ReviewDB.plugin.js",
    	main: "index.js",
    	author: "mantikafasi",
    	description: "A plugin allows you to review people and see other peoples reviews"
    };
    var ittaiconfig = {
    	manifest: manifest$1
    };

    var config = /*#__PURE__*/Object.freeze({
        __proto__: null,
        manifest: manifest$1,
        'default': ittaiconfig
    });

    let clientWebpack = (() => {
        return globalThis.BdApi ?? (() => { try {
                return BdApi;
            }
            catch (e) { } })();
    })();
    function find(filter) {
        return clientWebpack.findModule(filter);
    }
    function findAll(filter) {
        return clientWebpack.findAllModules(filter);
    }
    function findByProps(...props) {
        return find(m => props.every(p => m?.[p] !== undefined));
    }
    function findByDisplayName(name, returnDefault = true) {
        let ret = find(m => m?.default?.displayName === name);
        if (returnDefault)
            return ret.default;
        return ret;
    }

    /**
     * {@link https://discord.com/acknowledgements/|Full list of libraries that Discord uses.}
     * @module webpack/common
     */
    const React = /*#__PURE__*/ findByProps("useState");
    const ReactDOM = /*#__PURE__*/ findByProps("render", "unmountComponentAtNode");
    const ReactSpring = /*#__PURE__*/ findByProps("useSpring", "useTransition");
    const Lodash = globalThis._;
    const ModalActions = /*#__PURE__*/ findByProps("openModal", "updateModal");

    IttaiInternals.React = React;
    IttaiInternals.ReactDOM = ReactDOM;
    IttaiInternals.ReactSpring = ReactSpring;
    IttaiInternals.Lodash = Lodash;

    const BdAPIInstance = globalThis.BdApi ?? (() => { try {
        return BdApi;
    }
    catch (e) { } })(); //topaz and other compat mods stuff
    class BDPlugin {
        constructor() {
            this.__ittaiInternals = {
                getAllSettings: () => {
                    return BdAPIInstance.loadData(manifest$1.name, "settings") ?? {};
                },
                getSetting: (key, defaultValue) => {
                    return (BdAPIInstance.loadData(manifest$1.name, "settings") ?? {})[key] ?? defaultValue;
                },
                setSettings: (newSettings) => {
                    if (typeof newSettings !== "object")
                        return;
                    BdAPIInstance.saveData(manifest$1.name, "settings", Object.assign(this.__ittaiInternals.getAllSettings(), newSettings));
                },
                setSetting: (key, value) => {
                    BdAPIInstance.saveData(manifest$1.name, "settings", Object.assign(this.__ittaiInternals.getAllSettings(), { [key]: value }));
                },
                removeSetting: (key) => {
                    let outputSetting = this.__ittaiInternals.getAllSettings();
                    delete outputSetting?.[key];
                    BdAPIInstance.saveData(manifest$1.name, "settings", outputSetting);
                },
                resetSettings: () => {
                    BdAPIInstance.saveData(manifest$1.name, "settings", {});
                },
                setSettingsPanel: (component) => {
                    this.getSettingsPanel = () => {
                        try {
                            if (typeof component === "function")
                                component = React.createElement(component);
                            return component;
                        }
                        catch (e) {
                            this.error("Failed to load settings panel.", e);
                        }
                        return null;
                    };
                },
                removeSettingsPanel: () => {
                    delete this.getSettingsPanel;
                }
            };
        }
        // smol test for topaz
        // getSettingsPanel = () => {
        // 	return null;
        // };
        log() {
            logger.log(...arguments);
        }
        debug() {
            logger.debug(...arguments);
        }
        warn() {
            logger.warn(...arguments);
        }
        error() {
            logger.error(...arguments);
        }
    }

    const get = (key, defaultValue) => {
        return settingsInstance.getSetting(key, defaultValue);
    };
    const set = (key, value) => {
        return settingsInstance.setSetting(key, value);
    };
    // HACK
    let settingsInstance;
    const setInstance = (i) => {
        settingsInstance = i;
    };
    // export default class SettingsAPI {
    //     constructor(pluginInstance: Plugin) {
    //         this.__pluginInstance = pluginInstance;
    //     }
    //     private __pluginInstance: Plugin
    //     get (key: string, defaultValue: any) : any {
    //         return this.__pluginInstance.__ittaiInternalPlugin.__ittaiInternals.getSetting(key, defaultValue); // Yes this is excessive. Too bad.
    //     }
    //     getAll () : Object {
    //         return this.__pluginInstance.__ittaiInternalPlugin.__ittaiInternals.getAllSettings();
    //     }
    //     set (key: string, value: any) : void {
    //         return this.__pluginInstance.__ittaiInternalPlugin.__ittaiInternals.setSetting(key, value);
    //     }
    //     setAll (settings: Object) : void {
    //         return this.__pluginInstance.__ittaiInternalPlugin.__ittaiInternals.setSettings(settings);
    //     }
    // }

    const Changelog = /*#__PURE__*/ findByProps("lead", "socialLink");
    const ChangelogModal = /*#__PURE__*/ findByProps("maxModalWidth", "content"); //i assume its related to the changelog modal

    /**
     * @module components
     */
    // Wrapper for Switch component to fix the switch box not being updatable. Check https://github.com/BetterDiscordBuilder/bdbuilder/blob/master/common/hooks/createUpdateWrapper.js
    const makeUpdateWrapper = (Component, checkPropName = "value", type = "switch") => {
        const typeSwitch = (v) => {
            switch (type) {
                case "switch": {
                    return v;
                }
                case "radio": {
                    return v.value;
                }
                default: {
                    return v;
                }
            }
        };
        return (props) => {
            const [value, setValue] = React.useState(props[checkPropName]);
            return React.createElement(Component, { ...{
                    ...props,
                    [checkPropName]: value,
                    onChange: (...args) => {
                        const value = args[0];
                        if (typeof props.onChange === "function")
                            props.onChange(value);
                        setValue(typeSwitch(value));
                    }
                } });
        };
    };
    const Button = /*#__PURE__*/ findByProps("Colors", "Looks", "DropdownSizes");
    const Spinner = /*#__PURE__*/ findByDisplayName("Spinner");
    const Text = /*#__PURE__*/ findByDisplayName("LegacyText");
    const TextInput = /*#__PURE__*/ findByDisplayName("TextInput");
    const Flex = /*#__PURE__*/ findByDisplayName("Flex");
    const Modal = /*#__PURE__*/ findByProps("ModalRoot");
    const Heading = /*#__PURE__*/ (() => findByProps("Heading").Heading)();
    const OriginalSwitchItem = /*#__PURE__*/ findByDisplayName("SwitchItem");
    const SwitchItem = makeUpdateWrapper(OriginalSwitchItem, "value");
    const Markdown = /*#__PURE__*/ (() => find(m => m?.default?.displayName == "Markdown" && m?.default?.rules)?.default)();
    const ContextMenu =  findByProps("MenuItem").default;
    Object.entries(findByProps("MenuItem")).forEach(([key, contents]) => {
        if (!ContextMenu[key]) {
            ContextMenu[key] = contents;
        }
    });

    // Know it will work on this client mod or it's detecting the wrong one?
    // Set this variable.
    /**
     * @memberof module:utilities
     * @returns {string} The name of the running client mod.
     */ function getClientMod() {
        return "betterdiscord";
    }

    function createArguments(...args) {
        return [
            "%cIttai",
            "color: #000; background-color: #42ffa7; font-family: default; padding-left: 3px; padding-right: 3px; border-radius: 2px; font-weight: bold;",
            ...args,
        ];
    }

    /**
     * @memberof module:logger
     * @param  {...any} args
     */ function log(...args) {
        consoleCopy.log(...createArguments(...args));
    }

    /**
     * @memberof module:logger
     * @param  {...any} args
     */ function debug(...args) {
        consoleCopy.debug(...createArguments(...args));
    }

    /**
     * @memberof module:logger
     * @param  {...any} args
     */ function warn(...args) {
        consoleCopy.warn(...createArguments(...args));
    }

    /**
     * @memberof module:logger
     * @param  {...any} args
     */ function error(...args) {
        consoleCopy.error(...createArguments(...args));
    }

    /**
     * @module logger
     */
    const consoleCopy = { ...console };

    /**
     * @param {number} min The minimum value of the returned number.
     * @param {number} mix The maximum value of the returned number.
     * @memberof module:utilities
     * @returns {number} A random number.
     */ function randomNumber(min, max) {
        return Math.random() * max - min;
    }

    /**
     * @param {number} length The length of the string.
     * @param {string|array} dontMatch A string or an array of strings that will cause a regeneration if any are matched.
     * @param {string|array} charset A list of the characters to use when generating the string.
     * @memberof module:utilities
     * @returns {string} A string of random characters.
     */ function randomString(length, dontMatch = "", charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") {
        if (typeof length !== "number" && length <= 0)
            return;
        if (typeof dontMatch !== "string" && !Array.isArray(dontMatch))
            return;
        if (typeof charset !== "string" && !Array.isArray(charset))
            return;
        let string = "";
        do {
            while (string.length < length) {
                string += charset[Math.round(randomNumber(0, charset.length - 1))];
            }
            string = string.slice(0, length);
        } while (dontMatch &&
            (string === dontMatch || dontMatch.some((m) => m === string)));
        return string;
    }

    var joinClasses = (...classes) => classes.filter(s => typeof s === 'string').join(" ");

    const renderChangelogContent = (content) => {
        return React.createElement(React.Fragment, null, Object.entries(content).map(([title, { type, items }]) => React.createElement("div", { className: ChangelogModal.content },
            React.createElement("h1", { className: joinClasses(Changelog[type], Changelog.marginTop) }, title),
            React.createElement("ul", null, items.map(item => React.createElement("li", null,
                React.createElement(Markdown, null, item)))))));
    };
    const openChangelogModal = (changelog = settingsChangelog) => {
        const { changelog: settingsChangelog, manifest } = config;
        ModalActions.openModal((props) => React.createElement(Modal.ModalRoot, { ...props, size: Modal.ModalSize.SMALL, className: ChangelogModal.modal },
            React.createElement(Modal.ModalHeader, { separator: false },
                React.createElement(Flex, null,
                    React.createElement(Flex.Child, { grow: 1, shrink: 1 },
                        React.createElement(Heading, { variant: "heading-lg/medium" },
                            manifest.name,
                            " - ",
                            manifest.version),
                        changelog.date && React.createElement(Text, { className: Changelog.date, size: Text.Sizes.SIZE_12 }, changelog.date)),
                    React.createElement(Modal.ModalCloseButton, { onClick: props.onClose }))),
            React.createElement(Modal.ModalContent, null,
                changelog.image && React.createElement("img", { className: Changelog.video, src: changelog.image, width: "451" }),
                renderChangelogContent(changelog.contents))));
    };
    const hasSeenChangelog = () => get(`__ittai_changelog_${manifest.version}`);
    const setSeenChangelog = (set$1) => set(`__ittai_changelog_${manifest.version}`, set$1);

    /**
     * The plugin class for the running client mod.
     * @name Plugin
     * @memberof module:entities
     */ class Plugin {
        constructor() {
            this.friendlyName = manifest$1.name;
        }
        start() { }
        stop() { }
        setSettingsPanel(component) {
            this.__ittaiInternalPlugin.setSettingsPanel(component);
        }
        removeSettingsPanel() {
            this.__ittaiInternalPlugin.removeSettingsPanel();
        }
        log(...args) {
            log(...args);
        }
        debug(...args) {
            debug(...args);
        }
        warn(...args) {
            warn(...args);
        }
        error(...args) {
            error(...args);
        }
    }

    var react = IttaiInternals.React;

    /**
     * @param {string} name The name of the patch. For debugging.
     * @param {any} object The object that the function is in.
     * @param {string} functionName The name of the function to patch.
     * @param {function} patchFunction The code to patch into the function.
     * @returns {object} {@link module:patcher.patch~patchData}
     * @memberof module:patcher
     * @tutorial patchingAfter
     */ function after(name, object, functionName, patchFunction) {
        return patch(name, object, functionName, "after", patchFunction);
    }

    /**
     * Unpatches all of the patches specified, or all of them if none are specified.
     * @memberof module:patcher
     * @param {string[]} [unpatches={@link module:patcher.patches}] An array patch names.
     */ function unpatchAll(unpatches) {
        if (!Array.isArray(unpatches))
            unpatches = patches;
        for (const object of Object.values(unpatches)) {
            for (const funct of Object.values(object)) {
                for (const patch of funct.patches) {
                    patch.unpatch();
                }
            }
        }
    }

    /**
     * @param {string} name The name of the patch. For debugging.
     * @param {any} object The object that the function is in.
     * @param {string} functionName The name of the function to patch.
     * @param {string} type The type of patch to apply. `before`, `instead`, `after`.
     * @param {function} patchFunction The code to patch into the function.
     * @returns {object} {@link module:utils/patcher.patch~patchData}
     * @memberof module:patcher
     * @tutorial patching
     */ function patch(name, object, functionName, type, patchFunction) {
        const id = object.__ittai__ ?? randomString(25, Object.keys(patches));
        object.__ittai__ = object.__ittai__ ?? id;
        if (!patches[id])
            patches[id] = {};
        /**
         * @memberof module:patcher
         * @prop {string} name The name of the function being patched.
         * @prop {string} type The type of the patch.
         * @prop {function} patchFunction The original function.
         * @prop {function} unpatch The function to call to unpatch.
         */
        const patchData = {
            name,
            type,
            patchFunction,
            unpatch: function () {
                try {
                    const patchIndex = patches[id][functionName].patches.indexOf(this);
                    if (patchIndex === -1)
                        throw "Couldn't find the patch. This probably happened because the object was tampered with. Don't do that.";
                    // Delete patch.
                    patches[id][functionName].patches.splice(patchIndex, 1);
                    // Clean up the object if there are no patches left.
                    if (patches[id][functionName].patches.length === 0) {
                        // Restore original function.
                        object[functionName] = patches[id][functionName].original;
                        delete patches[id][functionName];
                    }
                    if (!Object.keys(patches[id]).length) {
                        delete patches[id];
                    }
                }
                catch (e) {
                    error(`Failed to unpatch ${name}.`, e);
                }
            },
        };
        if (!patches[id][functionName]) {
            patches[id][functionName] = {
                original: object[functionName],
                patches: [],
            };
            const props = { ...object[functionName] };
            object[functionName] = function (...args) {
                const functionData = patches[id][functionName];
                const befores = functionData.patches.filter((p) => p.type === "before");
                const insteads = functionData.patches.filter((p) => p.type === "instead");
                const afters = functionData.patches.filter((p) => p.type === "after");
                // Before patches.
                for (const before of befores) {
                    try {
                        const callback = before.patchFunction(args, this);
                        if (callback)
                            args = callback;
                    }
                    catch (e) {
                        error(`Error running before patch ${name}.`, e);
                    }
                }
                // Instead patches.
                let res = {};
                let ranOnce = false;
                if (insteads.length === 0) {
                    (res = functionData.original.call(this, ...args)), (ranOnce = true);
                }
                else {
                    // Bad, fix later.
                    for (const instead of insteads) {
                        // Do trash merge with Lodash.
                        try {
                            (res = globalThis._.merge(res, instead.patchFunction(args, this, functionData.original) ?? {})),
                                (ranOnce = true);
                        }
                        catch (e) {
                            error(`Error running instead patch ${name}.`, e);
                        }
                    }
                }
                if (!ranOnce) {
                    res = functionData.original.call(this, ...args);
                }
                // After patches.
                for (const after of afters) {
                    try {
                        const callback = after.patchFunction(args, res, this);
                        if (callback)
                            res = callback;
                    }
                    catch (e) {
                        error(`Error running after patch ${name}.`, e);
                    }
                }
                return res;
            };
            Object.assign(object[functionName], props);
            object[functionName].toString = () => patches[id][functionName].original.toString();
        }
        patches[id][functionName].patches.push(patchData);
        return patchData;
    }

    /**
     * @module patcher
     */
    /**
     * A list of the currently patched components.
     */
    let patches = [];

    findByProps("createBotMessage");
    findByProps("receiveMessage");
    const AvatarDefaults = findByProps("BOT_AVATARS");
    ({
        state: "SENT",
        author: addBotAuthor({
            avatar: { avatarId: "ittai", imageUrl: "https://cdn.discordapp.com/avatars/264062457448759296/1f9b1743cf625ca2d51ee517b5efd8a7.webp" },
            author: { username: "Ittai" }
        }),
        content: "Hello! By the way, you forgot to add a `\"content\"` attribute to the message!"
    });
    function addBotAuthor({ avatar, author }) {
        const avatarId = avatar?.avatarId ?? randomString(10);
        if (AvatarDefaults?.BOT_AVATARS && !AvatarDefaults.BOT_AVATARS[avatarId]) {
            AvatarDefaults.BOT_AVATARS[avatarId] = avatar.imageUrl;
        }
        return {
            avatar: avatarId,
            id: author?.authorId ?? randomString(10),
            bot: true,
            discriminator: author?.discriminator ?? "0000",
            username: author?.username ?? "BotUser"
        };
    }

    /*#__PURE__*/ Object.assign({}, findByProps("ApplicationCommandType"), findByProps("ApplicationCommandPermissionType"));

    const Users = /*#__PURE__*/ findByProps('getUser', 'getCurrentUser');

    //@ts-ignore
    // import styles from "./ToastWrapper.css"
    function GenericToast({ children, }) {
        return React.createElement("div", { style: {
                background: "var(--background-secondary-alt)",
                borderRadius: "8px",
                padding: "12px",
                color: "var(--header-primary)",
                fontWeight: "600"
            } }, children);
    }

    /**
     * @module components
     */
    const { showToast: showToast$1, popToast } = findByProps("showToast");
    /**
     * Shows a toast using discord's own toast handler that was added on its 7th birthday for... achivements?
     * @param {Function<import('react').ReactElement<any>> | string} text Component to render
     * @param {object} options Options for the toast
     * @param {object} [options.id] The ID of the toast. If not given, it will be generated one randomly
     * @param {number} [options.duration] How long the toast should stay on screen
     * @param {number} [options.position = 1] Position of the toast. 0 is top, 1 is bottom
     * @returns {string} The ID of the toast
     */
    const show = (text, options) => {
        const toastID = options?.id ?? randomString(10);
        showToast$1({
            id: toastID,
            options: Object.assign({}, options, {
                position: POSITIONS.BOTTOM,
                component: typeof text !== "function" ? React.createElement(GenericToast, null, text) : text(),
            }),
        });
        return toastID;
    };
    const POSITIONS = {
        TOP: 0,
        BOTTOM: 1
    };

    const openOAuth2Modal = findByProps("openOAuth2Modal");
    function authorize(callback) {
      var props = openOAuth2Modal.getOAuth2AuthorizeProps("https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&response_type=code&scope=identify");
      openOAuth2Modal.openOAuth2Modal(props, () => {
        if (tempOpen !== void 0)
          window.open = tempOpen;
      });
      var tempOpen = window.open;
      window.open = function(url) {
        if (url?.startsWith("https://manti.vendicated.dev")) {
          fetch(url + "&returnType=json&clientMod=" + getClientMod()).then((res) => {
            res.json().then((res2) => {
              if (res2.status === 0) {
                set("token", res2.token);
                showToast("Successfully logged in!");
                callback?.();
              } else if (res2.status === 1) {
                showToast("An Error Occured while logging in.");
              }
            });
          });
          window.open = tempOpen;
        } else {
          tempOpen(url);
        }
      };
    }
    function showToast(text) {
      show(GenericToast({ "children": text }));
    }
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const { FormDivider } = findByProps("FormDivider");
    function ReviewDBSettings() {
      const [switchValue, setSwitchValue] = react.useState(get("notifyReviews", true));
      const [oauth2token, setOauth2token] = react.useState(get("token", ""));
      return /* @__PURE__ */ react.createElement(react.Fragment, null, /* @__PURE__ */ react.createElement(SwitchItem, {
        value: switchValue,
        onChange: (val) => {
          set("notifyReviews", val);
          setSwitchValue(val);
        }
      }, "Notify New Reviews"), /* @__PURE__ */ react.createElement(Text, {
        style: { marginBottom: 4, marginLeft: 2 }
      }, "OAUTH2 Token"), /* @__PURE__ */ react.createElement(TextInput, {
        style: { marginBottom: 8 },
        value: oauth2token,
        placeholder: "Login to get token",
        onChange: (val) => {
          set("token", val);
          setOauth2token(val);
          return true;
        }
      }), /* @__PURE__ */ react.createElement(Button, {
        onClick: () => authorize(() => setOauth2token(get("token", "")))
      }, "Login"), /* @__PURE__ */ react.createElement(FormDivider, {
        style: { marginTop: 12 }
      }), /* @__PURE__ */ react.createElement(Text, {
        style: { marginTop: 8, marginBottom: 4 }
      }, "If Login Button is not working"), /* @__PURE__ */ react.createElement(Button, {
        onClick: () => window.open("https://discord.com/api/oauth2/authorize?client_id=915703782174752809&redirect_uri=https%3A%2F%2Fmanti.vendicated.dev%2FURauth&response_type=code&scope=identify")
      }, "Get OAUTH2 Token"));
    }

    const API_URL = "https://manti.vendicated.dev";
    const getReviews = async (discorid) => {
      const res = await fetch("https://manti.vendicated.dev/getUserReviews?snowflakeFormat=string&discordid=" + discorid.toString());
      return await res.json();
    };
    const addReview = async (review) => {
      var token = get("token", "");
      if (token === "") {
        authorize();
        show(GenericToast({ "children": "Please authorize to add a review." }));
        return 2;
      }
      review["token"] = token;
      return await fetch(API_URL + "/addUserReview", { method: "POST", body: JSON.stringify(review) }).then((r) => r.text()).then(
        (res) => {
          show(GenericToast({ "children": res }));
          var responseCode = 0;
          if (res === "Added your review") {
            responseCode = 0;
          } else if (res === "Updated your review") {
            responseCode = 1;
          } else {
            responseCode = 2;
          }
          return responseCode;
        }
      );
    };
    const deleteReview = async (reviewid) => {
      var data = {
        "token": get("token", ""),
        "reviewid": reviewid
      };
      return await fetch(API_URL + "/deleteReview", { method: "POST", body: JSON.stringify(data) }).then((r) => r.json());
    };
    const reportReview = (reviewID) => {
      var data = {
        "reviewid": reviewID,
        "token": get("token", "")
      };
      fetch(API_URL + "/reportReview", { method: "POST", body: JSON.stringify(data) }).then((r) => r.text()).then((res) => showToast(res));
    };
    const getLastReviewID = async (userid) => {
      return await fetch(API_URL + "/getLastReviewID?discordid=" + userid).then((r) => r.text()).then((r) => Number.parseInt(r));
    };

    const { button, dangerous } = findByProps("button", "wrapper", "disabled");
    class MessageButton extends react.PureComponent {
      render() {
        return this.props.type === "delete" ? /* @__PURE__ */ react.createElement("div", {
          className: button + " " + dangerous,
          "aria-label": "Delete Review",
          onClick: () => this.props.callback()
        }, /* @__PURE__ */ react.createElement("svg", {
          "aria-hidden": "false",
          width: "16",
          height: "16",
          viewBox: "0 0 20 20"
        }, /* @__PURE__ */ react.createElement("path", {
          fill: "currentColor",
          d: "M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"
        }), /* @__PURE__ */ react.createElement("path", {
          fill: "currentColor",
          d: "M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"
        }))) : /* @__PURE__ */ react.createElement("div", {
          className: button,
          "aria-label": "Report Review",
          onClick: () => this.props.callback()
        }, /* @__PURE__ */ react.createElement("svg", {
          "aria-hidden": "false",
          width: "16",
          height: "16",
          viewBox: "0 0 20 20"
        }, /* @__PURE__ */ react.createElement("path", {
          fill: "currentColor",
          d: "M20,6.002H14V3.002C14,2.45 13.553,2.002 13,2.002H4C3.447,2.002 3,2.45 3,3.002V22.002H5V14.002H10.586L8.293,16.295C8.007,16.581 7.922,17.011 8.076,17.385C8.23,17.759 8.596,18.002 9,18.002H20C20.553,18.002 21,17.554 21,17.002V7.002C21,6.45 20.553,6.002 20,6.002Z"
        })));
      }
    }

    const { cozyMessage, buttons } = findByProps("cozyMessage");
    const { container, isHeader } = findByProps("container", "isHeader");
    const { avatar, clickable } = findByProps("avatar", "zalgo");
    const { username } = findByProps("header", "zalgo");
    const { messageContent } = findByProps("messageContent", "zalgo");
    const { message } = findByProps("message");
    const { groupStart } = findByProps("groupStart");
    const { wrapper } = findByProps("wrapper", "zalgo");
    const { cozy } = findByProps("cozy", "zalgo");
    const { contents } = findByProps("contents");
    const { getUserAvatarURL } = findByProps("getUserAvatarURL");
    const { getUser } = findByProps("getUser");
    const { openUserProfileModal } = findByProps("openUserProfileModal");
    const buttonClassNames = findByProps("button", "wrapper", "disabled");
    const usernameClickable = findByProps("clickable", "username").clickable;
    const ConfirmModal = findByDisplayName("ConfirmModal");
    const { markdown } = findByProps("markdown");
    class ReviewComponent extends react.Component {
      constructor(props) {
        super(props);
        this.openModal = () => {
          openUserProfileModal({ "userId": this.props.review.senderdiscordid });
        };
        this.modalProps = { "cancelText": "Nop", "confirmText": "Yop", "header": "ARE YOU SURE ABOUT THAT" };
        this.state = {
          profilePhoto: ""
        };
      }
      deleteReview() {
        this.modalProps["children"] = /* @__PURE__ */ react.createElement("h2", {
          className: markdown
        }, "DELETE THAT REVIEWW????");
        this.modalProps["onConfirm"] = () => {
          deleteReview(this.props.review.id).then((res) => {
            if (res.successful) {
              this.props.fetchReviews();
            }
            showToast(res.message);
          });
        };
        ModalActions.openModal((prop) => /* @__PURE__ */ react.createElement(ConfirmModal, {
          ...prop,
          ...this.modalProps
        }));
      }
      reportReview() {
        this.modalProps["children"] = /* @__PURE__ */ react.createElement("h2", {
          className: markdown
        }, "REPORT THAT REVIEWW????");
        this.modalProps["onConfirm"] = () => {
          reportReview(this.props.review.id);
        };
        ModalActions.openModal((prop) => /* @__PURE__ */ react.createElement(ConfirmModal, {
          ...prop,
          ...this.modalProps
        }));
      }
      fetchUser() {
        const review = this.props.review;
        var user = Users.getUser(review.senderdiscordid);
        if (user === void 0) {
          Queue.push(() => getUser(review.senderdiscordid).then((u) => {
            this.setState({});
            review.profile_photo = getUserAvatarURL(u);
          }).then((m) => sleep(400)));
        } else {
          review.profile_photo = getUserAvatarURL(user);
          this.setState({});
        }
      }
      componentDidMount() {
        const review = this.props.review;
        if (!review.profile_photo || review.profile_photo === "") {
          this.fetchUser();
        }
      }
      render() {
        const review = this.props.review;
        return /* @__PURE__ */ react.createElement("div", null, /* @__PURE__ */ react.createElement("div", {
          className: cozyMessage + " " + message + " " + groupStart + " " + wrapper + " " + cozy
        }, /* @__PURE__ */ react.createElement("div", {
          className: contents
        }, /* @__PURE__ */ react.createElement("img", {
          className: avatar + " " + clickable,
          onClick: () => {
            this.openModal();
          },
          onError: () => {
            this.fetchUser();
          },
          src: review.profile_photo === "" ? "/assets/1f0bfc0865d324c2587920a7d80c609b.png?size=128" : review.profile_photo
        }), /* @__PURE__ */ react.createElement("span", {
          className: username + " " + usernameClickable,
          style: { color: "var(--text-muted)" },
          onClick: () => this.openModal()
        }, review.username), /* @__PURE__ */ react.createElement("p", {
          className: messageContent,
          style: { fontSize: 15, marginTop: 4 }
        }, review.comment), /* @__PURE__ */ react.createElement("div", {
          className: container + " " + isHeader + " " + buttons
        }, /* @__PURE__ */ react.createElement("div", {
          className: buttonClassNames.wrapper
        }, /* @__PURE__ */ react.createElement(MessageButton, {
          type: "report",
          callback: () => this.reportReview()
        }), review.senderdiscordid === Users.getCurrentUser().id ? /* @__PURE__ */ react.createElement(MessageButton, {
          type: "delete",
          callback: () => this.deleteReview()
        }) : /* @__PURE__ */ react.createElement(react.Fragment, null))))));
      }
    }

    const { eyebrow } = findByProps("eyebrow");
    const { bodyTitle } = findByProps("bodyTitle");
    const Queue = {
      last: Promise.resolve(),
      push(func) {
        return this.last = this.last.then(func);
      }
    };
    class ReviewsView extends react.Component {
      constructor(props) {
        super(props);
        this.fetchReviews = () => {
          getReviews(this.props.userid).then((reviews) => {
            this.setState({ reviews });
          });
        };
        this.state = {
          reviews: void 0
        };
      }
      componentDidMount() {
        const reviews = this.state.reviews;
        if (reviews === void 0) {
          this.fetchReviews();
        }
      }
      onKeyPress(keyEvent) {
        if (keyEvent.key === "Enter") {
          addReview({
            "userid": this.props.userid,
            "comment": keyEvent.target.value,
            "star": -1
          }).then((response) => {
            if (response === 0 || response === 1) {
              keyEvent.target.value = "";
              this.fetchReviews();
            }
          });
        }
      }
      render() {
        const reviews = this.state.reviews;
        return /* @__PURE__ */ react.createElement("div", null, /* @__PURE__ */ react.createElement("h3", {
          className: eyebrow + " " + bodyTitle,
          style: { color: "var(--header-secondary)" }
        }, "User Reviews"), reviews ? reviews.map((review) => {
          return /* @__PURE__ */ react.createElement(ReviewComponent, {
            fetchReviews: this.fetchReviews,
            review
          });
        }) : /* @__PURE__ */ react.createElement("div", null, /* @__PURE__ */ react.createElement(Spinner, null), /* @__PURE__ */ react.createElement("br", null)), reviews?.length === 0 ? /* @__PURE__ */ react.createElement("h2", {
          style: { fontSize: 16, fontStyle: "italic", fontWeight: "bold", marginBottom: 16 }
        }, "Looks like nobody reviewed this user, you can be first") : /* @__PURE__ */ react.createElement(react.Fragment, null), /* @__PURE__ */ react.createElement(TextInput, {
          placeholder: "Enter a comment",
          onKeyPress: (e) => this.onKeyPress(e)
        }));
      }
    }

    class ReviewDB extends Plugin {
      start() {
        console.log("ReviewDB Started");
        getLastReviewID(Users.getCurrentUser().id).then((lastreviewid) => {
          const storedLastReviewID = get("lastreviewid", 0);
          if (get("notifyReviews", true) && storedLastReviewID < lastreviewid) {
            if (storedLastReviewID != 0) {
              showToast("You have new reviews on your profile");
            }
            set("lastreviewid", lastreviewid);
          }
        });
        this.setSettingsPanel(() => react.createElement(ReviewDBSettings));
        var popout = findAll((m) => m.default?.displayName === "UserPopoutBody").filter((m) => m.default?.toString().includes("ROLES_LIST"))[0];
        after("UserPopoutPatch", popout, "default", ([{ user }], res) => {
          res.props.children.splice(res.props.children.length, 0, react.createElement(ReviewsView, { userid: user.id }));
        });
      }
      stop() {
        unpatchAll("UserPopoutPatch");
        console.log("Stopping ReviewsDB");
      }
    }

    let IttaiPlugin = class IttaiPlugin extends (() => {
        // switch ("betterdiscord") {
        //     case "powercordv2":
        //         return PCv2Plugin
        //     case "betterdiscord":
        //         return BDPlugin
        //     case "goosemod":
        //         return GMPlugin
        //     default:
        //         return class Plugin {};
        // }
        return BDPlugin;
    })() {
        constructor(...args) {
            super(...args);
            this.hasSettingsPanel = false;
            this.cachedCss = [];
            setInstance(this.__ittaiInternals);
            this.instance = new ReviewDB();
            this.friendlyName = this.instance.friendlyName;
            this.instance.__ittaiInternalPlugin = this;
            // globalThis["ittai" + this.friendlyName.toLowerCase().replace(/ /g, "")] = ittai;
            // document.querySelectorAll(`style[ittai][plugin="${manifest.name.replace(/ /g, "")}"]`)?.forEach((e: HTMLStyleElement) => {
            //     this.cachedCss.push(e.innerText);
            //     e.remove();
            // });
        }
        start() {
            try {
                // this.cachedCss.forEach((e, k) => {
                //     const elem = Object.assign(document.createElement("style"), {
                //         innerText: e
                //     })
                //     elem.setAttribute("ittai", "true");
                //     elem.setAttribute("plugin", manifest.name.replace(/ /g, ""));
                //     document.head.appendChild(elem);
                //     delete this.cachedCss[k];
                // })
                if ("false" == "true" && Boolean(undefined) && !hasSeenChangelog()) ;
                return this.instance.start();
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        }
        stop() {
            try {
                const res = this.instance.stop();
                unpatchAll();
                if (this.hasSettingsPanel)
                    this.removeSettingsPanel();
                // document.querySelectorAll(`style[ittai][plugin="${manifest.name.replace(/ /g, "")}"]`)?.forEach(e => {
                //     this.cachedCss.push(e.innerText);
                //     e.remove();
                // });
                return res;
            }
            catch (err) {
                console.error(err);
                throw err;
            }
        }
        setSettingsPanel(component) {
            this.hasSettingsPanel = true;
            this.__ittaiInternals.setSettingsPanel(component);
        }
        removeSettingsPanel() {
            if (this.hasSettingsPanel) {
                this.hasSettingsPanel = false;
                this.__ittaiInternals.removeSettingsPanel();
            }
        }
    };

    return IttaiPlugin;

    })();
    if (typeof module !== "undefined") module.exports = ittaiPluginExport;
    return ittaiPluginExport;

})();
