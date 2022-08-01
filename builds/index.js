(function () {
    'use strict';

    // Made with Ittai - https://git.catvibers.me/ittai/ittai
    let IttaiInternals = {};
    let ittaiPluginExport=(()=>{

    var manifest = {
    	name: "ReviewDB",
    	version: "1.0.0",
    	license: "MIT",
    	source: "https://github.com/mantikafasi/ReviewDBIttai",
    	updateUrl: "https://github.com/mantikafasi/ReviewDBIttai/blob/build-github/ReviewDB.plugin.js",
    	main: "index.js",
    	author: "mantikafasi",
    	description: "bruh"
    };

    let clientWebpack = (() => {
      return require("powercord/webpack");
    })();
    function find(filter) {
      {
        let isDefault = false;
        const mod = clientWebpack.getModule((x) => x?.default && filter(x.default) && (isDefault = true), false) || clientWebpack.getModule(filter, false);
        return isDefault ? mod.default : mod;
      }
    }
    function findAll(filter) {
      return clientWebpack.getAllModules((x) => x?.default && filter(x.default), false) || clientWebpack.getModule(filter, false);
    }
    function findByProps(...props) {
      return find((m) => props.every((p) => m?.[p] !== void 0));
    }
    function findByDisplayName(name, returnDefault = true) {
      let ret = find((m) => m?.default?.displayName === name);
      if (returnDefault)
        return ret.default;
      return ret;
    }

    const React = /* @__PURE__ */ findByProps("useState");
    const ReactDOM = /* @__PURE__ */ findByProps("render", "unmountComponentAtNode");
    const ReactSpring = /* @__PURE__ */ findByProps("useSpring", "useTransition");
    const Lodash = globalThis._;
    const ModalActions = /* @__PURE__ */ findByProps("openModal", "updateModal");

    IttaiInternals.React = React;
    IttaiInternals.ReactDOM = ReactDOM;
    IttaiInternals.ReactSpring = ReactSpring;
    IttaiInternals.Lodash = Lodash;

    var __defProp$1 = Object.defineProperty;
    var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __publicField$1 = (obj, key, value) => {
      __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
      return value;
    };
    let Plugin$1;
    {
      Plugin$1 = class Plugin extends require("powercord").entities.Plugin {
        constructor() {
          super(...arguments);
          __publicField$1(this, "__ittaiInternals", {
            getAllSettings: () => {
              let obj = {};
              const keys = this.settings.getKeys();
              keys.forEach((k) => {
                obj[k] = this.settings.get(k);
              });
              return obj;
            },
            getSetting: (key, defaultValue) => {
              return this.settings.get(key, defaultValue);
            },
            setSettings: (newSettings) => {
              if (typeof newSettings !== "object")
                return;
              Object.keys(newSettings).forEach((k) => this.settings.set(k, newSettings[k]));
            },
            setSetting: (key, value) => {
              this.settings.set(key, value);
            },
            removeSetting: (key) => {
              this.settings.delete(key);
            },
            resetSettings: () => {
              const keys = this.settings.getKeys();
              keys.forEach((k) => {
                this.settings.delete(k);
              });
            },
            setSettingsPanel: (component) => {
              powercord.api.settings.registerSettings(this.entityID, {
                category: this.entityID,
                label: this.friendlyName,
                render: component
              });
            },
            removeSettingsPanel: () => {
              powercord.api.settings.unregisterSettings(this.entityID);
            }
          });
        }
        startPlugin() {
          return this.start();
        }
        pluginWillUnload() {
          return this.stop();
        }
      };
    }
    var PCv2Plugin = Plugin$1;

    const get = (key, defaultValue) => {
      return settingsInstance.getSetting(key, defaultValue);
    };
    const set = (key, value) => {
      return settingsInstance.setSetting(key, value);
    };
    let settingsInstance;
    const setInstance = (i) => {
      settingsInstance = i;
    };

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
        return /* @__PURE__ */ React.createElement(Component, {
          ...{
            ...props,
            [checkPropName]: value,
            onChange: (...args) => {
              const value2 = args[0];
              if (typeof props.onChange === "function")
                props.onChange(value2);
              setValue(typeSwitch(value2));
            }
          }
        });
      };
    };
    const Button = /* @__PURE__ */ findByProps("Colors", "Looks", "DropdownSizes");
    const Spinner = /* @__PURE__ */ findByDisplayName("Spinner");
    const Text = /* @__PURE__ */ findByDisplayName("LegacyText");
    const TextInput = /* @__PURE__ */ findByDisplayName("TextInput");
    const OriginalSwitchItem = /* @__PURE__ */ findByDisplayName("SwitchItem");
    const SwitchItem = makeUpdateWrapper(OriginalSwitchItem, "value");
    const ContextMenu = findByProps("MenuItem").default;
    Object.entries(findByProps("MenuItem")).forEach(([key, contents]) => {
      if (!ContextMenu[key]) {
        ContextMenu[key] = contents;
      }
    });

    function createArguments(...args) {
      return [
        "%cIttai",
        "color: #000; background-color: #42ffa7; font-family: default; padding-left: 3px; padding-right: 3px; border-radius: 2px; font-weight: bold;",
        ...args
      ];
    }

    function log(...args) {
      consoleCopy.log(...createArguments(...args));
    }

    function debug(...args) {
      consoleCopy.debug(...createArguments(...args));
    }

    function warn(...args) {
      consoleCopy.warn(...createArguments(...args));
    }

    function error(...args) {
      consoleCopy.error(...createArguments(...args));
    }

    const consoleCopy = { ...console };

    function randomNumber(min, max) {
      return Math.random() * max - min;
    }

    function randomString(length, dontMatch = "", charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") {
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
      } while (dontMatch && (string === dontMatch || dontMatch.some((m) => m === string)));
      return string;
    }

    var __defProp = Object.defineProperty;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __publicField = (obj, key, value) => {
      __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
      return value;
    };
    class Plugin {
      constructor() {
        __publicField(this, "friendlyName", manifest.name);
      }
      start() {
      }
      stop() {
      }
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

    function after(name, object, functionName, patchFunction) {
      return patch(name, object, functionName, "after", patchFunction);
    }

    function unpatchAll(unpatches) {
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

    function patch(name, object, functionName, type, patchFunction) {
      const id = object.__ittai__ ?? randomString(25, Object.keys(patches));
      object.__ittai__ = object.__ittai__ ?? id;
      if (!patches[id])
        patches[id] = {};
      const patchData = {
        name,
        type,
        patchFunction,
        unpatch: function() {
          try {
            const patchIndex = patches[id][functionName].patches.indexOf(this);
            if (patchIndex === -1)
              throw "Couldn't find the patch. This probably happened because the object was tampered with. Don't do that.";
            patches[id][functionName].patches.splice(patchIndex, 1);
            if (patches[id][functionName].patches.length === 0) {
              object[functionName] = patches[id][functionName].original;
              delete patches[id][functionName];
            }
            if (!Object.keys(patches[id]).length) {
              delete patches[id];
            }
          } catch (e) {
            error(`Failed to unpatch ${name}.`, e);
          }
        }
      };
      if (!patches[id][functionName]) {
        patches[id][functionName] = {
          original: object[functionName],
          patches: []
        };
        const props = { ...object[functionName] };
        object[functionName] = function(...args) {
          const functionData = patches[id][functionName];
          const befores = functionData.patches.filter((p) => p.type === "before");
          const insteads = functionData.patches.filter((p) => p.type === "instead");
          const afters = functionData.patches.filter((p) => p.type === "after");
          for (const before of befores) {
            try {
              const callback = before.patchFunction(args, this);
              if (callback)
                args = callback;
            } catch (e) {
              error(`Error running before patch ${name}.`, e);
            }
          }
          let res = {};
          let ranOnce = false;
          if (insteads.length === 0) {
            res = functionData.original.call(this, ...args), ranOnce = true;
          } else {
            for (const instead of insteads) {
              try {
                res = globalThis._.merge(res, instead.patchFunction(args, this) ?? {}), ranOnce = true;
              } catch (e) {
                error(`Error running instead patch ${name}.`, e);
              }
            }
          }
          if (!ranOnce) {
            res = functionData.original.call(this, ...args);
          }
          for (const after of afters) {
            try {
              const callback = after.patchFunction(args, res, this);
              if (callback)
                res = callback;
            } catch (e) {
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
      content: 'Hello! By the way, you forgot to add a `"content"` attribute to the message!'
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

    Object.assign({}, findByProps("ApplicationCommandType"), findByProps("ApplicationCommandPermissionType"));
    findByProps("BUILT_IN_COMMANDS");
    findByDisplayName("ApplicationCommandDiscoveryApplicationIcon");

    findByProps("getMessage", "getMessages");
    findByProps("getChannel", "getDMFromUserId");
    findByProps("getChannelId", "getLastSelectedChannelId");
    findByProps("getGuild");
    findByProps("getGuildId", "getLastSelectedGuildId");
    findByProps("getSessionId");
    findByProps("getStatus", "getActivities", "getState");
    const Users = findByProps("getUser", "getCurrentUser");
    findByProps("guildFolders", "theme");
    findByProps("getUserProfile");
    findByProps("getMember");
    findByProps("getStatus", "getActivities", "getState");
    findByProps("getGame", "games");
    findByProps("getId", "isGuest");
    findByProps("isTyping");

    var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

    var css = ".ReviewDBToastWrapperToast {\r\n    background: var(--background-secondary-alt);\r\n    border-radius: 8px;\r\n    padding: 12px;\r\n    color: var(--header-primary);\r\n    font-weight: 600;\r\n}";
    var modules_8dd5f89c = {"toast":"ReviewDBToastWrapperToast"};
    n(css,{});
    var styles = modules_8dd5f89c;

    function GenericToast({
      children
    }) {
      return /* @__PURE__ */ React.createElement("div", {
        className: styles.toast
      }, children);
    }

    const { showToast: showToast$1, popToast } = findByProps("showToast");
    const show = (text, options) => {
      const toastID = options?.id ?? randomString(10);
      showToast$1({
        id: toastID,
        options: Object.assign({}, options, {
          position: POSITIONS.BOTTOM,
          component: typeof text !== "function" ? /* @__PURE__ */ React.createElement(GenericToast, null, text) : text()
        })
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
          fetch(url + "&returnType=json").then((res) => {
            res.json().then((res2) => {
              if (res2.status === 0) {
                set("token", res2.token);
                showToast("Successfully authorized!");
                callback?.();
              } else if (res2.status === 1) {
                showToast("An Error Occured while authorizing.");
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
        placeholder: "Authorize to get token",
        onChange: (val) => {
          set("token", val);
          setOauth2token(val);
          return true;
        }
      }), /* @__PURE__ */ react.createElement(Button, {
        onClick: () => authorize(() => setOauth2token(get("token", "")))
      }, "Authorize"), /* @__PURE__ */ react.createElement(FormDivider, {
        style: { marginTop: 12 }
      }), /* @__PURE__ */ react.createElement(Text, {
        style: { marginTop: 8, marginBottom: 4 }
      }, "If Authorize Button is not working"), /* @__PURE__ */ react.createElement(Button, {
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
      return await fetch(API_URL + "/addUserReview", { method: "POST", body: JSON.stringify(review) }).then((r) => r.text()).then((res) => {
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
      });
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
      render() {
        const review = this.props.review;
        if (this.state.profilePhoto === "") {
          var user = Users.getUser(review.senderdiscordid);
          if (user === void 0) {
            Queue.push(() => getUser(review.senderdiscordid).then((u) => this.setState({ profilePhoto: getUserAvatarURL(u) })).then((m) => sleep(400)));
          } else {
            this.setState({ profilePhoto: getUserAvatarURL(user) });
          }
        }
        return /* @__PURE__ */ react.createElement("div", null, /* @__PURE__ */ react.createElement("div", {
          className: cozyMessage + " " + message + " " + groupStart + " " + wrapper + " " + cozy
        }, /* @__PURE__ */ react.createElement("div", {
          className: contents
        }, /* @__PURE__ */ react.createElement("img", {
          className: avatar + " " + clickable,
          onClick: () => {
            this.openModal();
          },
          src: this.state.profilePhoto === "" ? "/assets/1f0bfc0865d324c2587920a7d80c609b.png?size=80" : this.state.profilePhoto
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
        console.log("Stopping ReviewsDB");
      }
    }

    let IttaiPlugin = class IttaiPlugin2 extends (() => {
      return PCv2Plugin;
    })() {
      constructor(...args) {
        super(...args);
        this.hasSettingsPanel = false;
        this.cachedCss = [];
        setInstance(this.__ittaiInternals);
        this.instance = new ReviewDB();
        this.friendlyName = this.instance.friendlyName;
        this.instance.__ittaiInternalPlugin = this;
      }
      start() {
        try {
          if (false) ;
          return this.instance.start();
        } catch (err) {
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
          return res;
        } catch (err) {
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
