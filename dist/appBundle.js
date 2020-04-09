var APP_com_metrological_app_myawesomeapp = (function () {
	'use strict';

	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value)
			&& !isSpecial(value)
	};

	function isNonNullObject(value) {
		return !!value && typeof value === 'object'
	}

	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);

		return stringValue === '[object RegExp]'
			|| stringValue === '[object Date]'
			|| isReactElement(value)
	}

	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE
	}

	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {}
	}

	function cloneUnlessOtherwiseSpecified(value, options) {
		return (options.clone !== false && options.isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, options)
			: value
	}

	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options)
		})
	}

	function getMergeFunction(key, options) {
		if (!options.customMerge) {
			return deepmerge
		}
		var customMerge = options.customMerge(key);
		return typeof customMerge === 'function' ? customMerge : deepmerge
	}

	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols
			? Object.getOwnPropertySymbols(target).filter(function(symbol) {
				return target.propertyIsEnumerable(symbol)
			})
			: []
	}

	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
	}

	function propertyIsOnObject(object, property) {
		try {
			return property in object
		} catch(_) {
			return false
		}
	}

	// Protects from prototype poisoning and unexpected merging up the prototype chain.
	function propertyIsUnsafe(target, key) {
		return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
			&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
				&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
	}

	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) {
			getKeys(target).forEach(function(key) {
				destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
			});
		}
		getKeys(source).forEach(function(key) {
			if (propertyIsUnsafe(target, key)) {
				return
			}

			if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
				destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			} else {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
			}
		});
		return destination
	}

	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;
		// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
		// implementations can use it. The caller may not replace it.
		options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

		var sourceIsArray = Array.isArray(source);
		var targetIsArray = Array.isArray(target);
		var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

		if (!sourceAndTargetTypesMatch) {
			return cloneUnlessOtherwiseSpecified(source, options)
		} else if (sourceIsArray) {
			return options.arrayMerge(target, source, options)
		} else {
			return mergeObject(target, source, options)
		}
	}

	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) {
			throw new Error('first argument should be an array')
		}

		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options)
		}, {})
	};

	var deepmerge_1 = deepmerge;

	var cjs = deepmerge_1;

	var Lightning = window.lng;

	/**
	 * Simple module for localization of strings.
	 *
	 * How to use:
	 * 1. Create localization file with following JSON format:
	 * {
	 *   "en" :{
	 *     "how": "How do you want your egg today?",
	 *     "boiledEgg": "Boiled egg",
	 *     "softBoiledEgg": "Soft-boiled egg",
	 *     "choice": "How to choose the egg",
	 *     "buyQuestion": "I'd like to buy {0} eggs, {1} dollars each."
	 *   },
	 *
	 *   "it": {
	 *     "how": "Come vuoi il tuo uovo oggi?",
	 *     "boiledEgg": "Uovo sodo",
	 *     "softBoiledEgg": "Uovo alla coque",
	 *     "choice": "Come scegliere l'uovo",
	 *     "buyQuestion": "Mi piacerebbe comprare {0} uova, {1} dollari ciascuna."
	 *   }
	 * }
	 *
	 * 2. Use Locale's module load method, specifying path to your localization file and set chosen language, e.g.:
	 *    > Locale.load('static/locale/locale.json');
	 *    > Locale.setLanguage('en');
	 *
	 * 3. Use localization strings:
	 *    > console.log(Locale.tr.how);
	 *    How do you want your egg today?
	 *    > console.log(Locale.tr.boiledEgg);
	 *    Boiled egg
	 *
	 * 4. String formatting
	 *    > console.log(Locale.tr.buyQuestion.format(10, 0.5));
	 *    I'd like to buy 10 eggs, 0.5 dollars each.
	 */

	class Locale {
	  constructor() {
	    this.__enabled = false;
	  }

	  /**
	   * Loads translation object from external json file.
	   *
	   * @param {String} path Path to resource.
	   * @return {Promise}
	   */
	  async load(path) {
	    if (!this.__enabled) {
	      return
	    }

	    await fetch(path)
	      .then(resp => resp.json())
	      .then(resp => {
	        this.loadFromObject(resp);
	      });
	  }

	  /**
	   * Sets language used by module.
	   *
	   * @param {String} lang
	   */
	  setLanguage(lang) {
	    this.__enabled = true;
	    this.language = lang;
	  }

	  /**
	   * Returns reference to translation object for current language.
	   *
	   * @return {Object}
	   */
	  get tr() {
	    return this.__trObj[this.language]
	  }

	  /**
	   * Loads translation object from existing object (binds existing object).
	   *
	   * @param {Object} trObj
	   */
	  loadFromObject(trObj) {
	    this.__trObj = trObj;
	    for (const lang of Object.values(this.__trObj)) {
	      for (const str of Object.keys(lang)) {
	        lang[str] = new LocalizedString(lang[str]);
	      }
	    }
	  }
	}

	/**
	 * Extended string class used for localization.
	 */
	class LocalizedString extends String {
	  /**
	   * Returns formatted LocalizedString.
	   * Replaces each placeholder value (e.g. {0}, {1}) with corresponding argument.
	   *
	   * E.g.:
	   * > new LocalizedString('{0} and {1} and {0}').format('A', 'B');
	   * A and B and A
	   *
	   * @param  {...any} args List of arguments for placeholders.
	   */
	  format(...args) {
	    const sub = args.reduce((string, arg, index) => string.split(`{${index}}`).join(arg), this);
	    return new LocalizedString(sub)
	  }
	}

	var Locale$1 = new Locale();

	const settings = {};

	const initSettings = (appSettings, platformSettings) => {
	  settings['app'] = appSettings;
	  settings['platform'] = platformSettings;
	};

	// todo: support key for nested settings with dot notation? e.g. stage.useImageworker from 'app' settings
	var Settings = {
	  get(type, key) {
	    return settings[type] && settings[type][key]
	  },
	  has(type, key) {
	    return settings[type] && key in settings[type]
	  },
	};

	const prepLog = (type, args) => {
	  const colors = {
	    Info: 'green',
	    Debug: 'gray',
	    Warn: 'orange',
	    Error: 'red',
	  };

	  args = Array.from(args);
	  return [
	    '%c' + (args.length > 1 && typeof args[0] === 'string' ? args.shift() : type),
	    'background-color: ' + colors[type] + '; color: white; padding: 2px 4px; border-radius: 2px',
	    args,
	  ]
	};

	var Log = {
	  info() {
	    Settings.get('platform', 'log') && console.log.apply(console, prepLog('Info', arguments));
	  },
	  debug() {
	    Settings.get('platform', 'log') && console.debug.apply(console, prepLog('Debug', arguments));
	  },
	  error() {
	    Settings.get('platform', 'log') && console.error.apply(console, prepLog('Error', arguments));
	  },
	  warn() {
	    Settings.get('platform', 'log') && console.warn.apply(console, prepLog('Warn', arguments));
	  },
	};

	let sendMetric = (type, event, params) => {
	  Log.info('Sending metric', type, event, params);
	};

	const initMetrics = config => {
	  sendMetric = config.sendMetric;
	};

	// available metric per category
	const metrics = {
	  app: ['launch', 'loaded', 'ready', 'close'],
	  page: ['view', 'leave'],
	  user: ['click', 'input'],
	  media: [
	    'abort',
	    'canplay',
	    'ended',
	    'pause',
	    'play',
	    'suspend',
	    'volumechange',
	    'waiting',
	    'seeking',
	    'seeked',
	  ],
	};

	// error metric function (added to each category)
	const errorMetric = (type, message, code, visible, params = {}) => {
	  params = { params, ...{ message, code, visible } };
	  sendMetric(type, 'error', params);
	};

	const Metric = (type, events, options = {}) => {
	  return events.reduce(
	    (obj, event) => {
	      obj[event] = (name, params = {}) => {
	        params = { ...options, ...(name ? { name } : {}), ...params };
	        sendMetric(type, event, params);
	      };
	      return obj
	    },
	    {
	      error(message, code, params) {
	        errorMetric(type, message, code, params);
	      },
	      event(name, params) {
	        sendMetric(type, name, params);
	      },
	    }
	  )
	};

	const Metrics = types => {
	  return Object.keys(types).reduce(
	    (obj, type) => {
	      // media metric works a bit different!
	      // it's a function that accepts a url and returns an object with the available metrics
	      // url is automatically passed as a param in every metric
	      type === 'media'
	        ? (obj[type] = url => Metric(type, types[type], { url }))
	        : (obj[type] = Metric(type, types[type]));
	      return obj
	    },
	    { error: errorMetric, event: sendMetric }
	  )
	};

	var Metrics$1 = Metrics(metrics);

	class VersionLabel extends Lightning.Component {
	  static _template() {
	    return {
	      rect: true,
	      color: 0xbb0078ac,
	      h: 40,
	      w: 100,
	      x: w => w - 50,
	      y: h => h - 50,
	      mount: 1,
	      Text: {
	        w: w => w,
	        h: h => h,
	        y: 5,
	        text: {
	          fontSize: 22,
	          textAlign: 'center',
	        },
	      },
	    }
	  }

	  set version(version) {
	    this.tag('Text').text = `v${version}`;
	    this.tag('Text').loadTexture();
	    this.w = this.tag('Text').renderWidth + 40;
	  }
	}

	const defaultOptions = {
	  stage: { w: 1920, h: 1080, clearColor: 0x00000000, canvas2d: false },
	  debug: false,
	  defaultFontFace: 'RobotoRegular',
	  keys: {
	    8: 'Back',
	    13: 'Enter',
	    27: 'Menu',
	    37: 'Left',
	    38: 'Up',
	    39: 'Right',
	    40: 'Down',
	    174: 'ChannelDown',
	    175: 'ChannelUp',
	    178: 'Stop',
	    250: 'PlayPause',
	    191: 'Search', // Use "/" for keyboard
	    409: 'Search',
	  },
	};

	if (window.innerHeight === 720) {
	  defaultOptions.stage['w'] = 1280;
	  defaultOptions.stage['h'] = 720;
	  defaultOptions.stage['precision'] = 0.6666666667;
	}

	function Application(App, appData, platformSettings) {
	  Metrics$1.app.launch();
	  return class Application extends Lightning.Application {
	    constructor(options) {
	      const config = cjs(defaultOptions, options);
	      super(config);
	      this.config = config;
	    }

	    static _template() {
	      return {
	        w: 1920,
	        h: 1080,
	        rect: true,
	        color: 0x00000000,
	      }
	    }

	    _setup() {
	      Promise.all([
	        this.loadFonts((App.config && App.config.fonts) || (App.getFonts && App.getFonts()) || []),
	        Locale$1.load((App.config && App.config.locale) || (App.getLocale && App.getLocale())),
	      ])
	        .then(() => {
	          Metrics$1.app.loaded();
	          this.childList.a({
	            ref: 'App',
	            type: App,
	            appData,
	            forceZIndexContext: !!platformSettings.showVersion,
	          });

	          if (platformSettings.showVersion) {
	            this.childList.a({
	              ref: 'VersionLabel',
	              type: VersionLabel,
	              version: this.config.version,
	            });
	          }

	          super._setup();
	        })
	        .catch(console.error);
	    }

	    _handleBack() {
	      this.closeApp();
	    }

	    _handleExit() {
	      this.closeApp();
	    }

	    closeApp() {
	      Log.info('Closing App');
	      if (platformSettings.onClose && typeof platformSettings.onClose === 'function') {
	        Metrics$1.app.close();
	        platformSettings.onClose();
	      }
	      this.childList.remove(this.tag('App'));

	      // force texture garbage collect
	      this.stage.gc();
	    }

	    loadFonts(fonts) {
	      return new Promise((resolve, reject) => {
	        fonts
	          .map(({ family, url, descriptors }) => () => {
	            const fontFace = new FontFace(family, 'url(' + url + ')', descriptors || {});
	            document.fonts.add(fontFace);
	            return fontFace.load()
	          })
	          .reduce((promise, method) => {
	            return promise.then(() => method())
	          }, Promise.resolve(null))
	          .then(resolve)
	          .catch(reject);
	      })
	    }

	    _getFocused() {
	      return this.tag('App')
	    }
	  }
	}

	let basePath;
	let proxyUrl;

	const initUtils = config => {
	  if (config.path) {
	    basePath = ensureUrlWithProtocol(makeFullStaticPath(document.location.pathname, config.path));
	  }

	  if (config.proxyUrl) {
	    proxyUrl = ensureUrlWithProtocol(config.proxyUrl);
	  }
	};

	var Utils = {
	  asset(relPath) {
	    return basePath + '/' + relPath
	  },
	  proxyUrl(url, options = {}) {
	    return proxyUrl ? proxyUrl + '?' + makeQueryString(url, options) : url
	  },
	  makeQueryString() {
	    return makeQueryString(...arguments)
	  },
	  // since imageworkers don't work without protocol
	  ensureUrlWithProtocol() {
	    return ensureUrlWithProtocol(...arguments)
	  },
	};

	const ensureUrlWithProtocol = url => {
	  if (/^\/\//.test(url)) {
	    return window.location.protocol + url
	  }
	  if (!/^(?:https?:)/i.test(url)) {
	    return window.location.origin + url
	  }
	  return url
	};

	const makeFullStaticPath = (pathname = '/', path) => {
	  // if path is URL, we assume it's already the full static path, so we just return it
	  if (/^(?:https?:)?(?:\/\/)/.test(path)) {
	    return path
	  }
	  // cleanup the pathname
	  pathname = /(.*)\//.exec(pathname)[1];

	  // remove possible leading dot from path
	  path = path.charAt(0) === '.' ? path.substr(1) : path;
	  // ensure path has leading slash
	  path = path.charAt(0) !== '/' ? '/' + path : path;

	  return pathname + path
	};

	const makeQueryString = (url, options = {}, type = 'url') => {
	  // add operator as an option
	  options.operator = 'metrological'; // Todo: make this configurable (via url?)
	  // add type (= url or qr) as an option, with url as the value
	  options[type] = url;

	  return Object.keys(options)
	    .map(key => {
	      return encodeURIComponent(key) + '=' + encodeURIComponent('' + options[key])
	    })
	    .join('&')
	};

	class ScaledImageTexture extends Lightning.textures.ImageTexture {
	  constructor(stage) {
	    super(stage);
	    this._scalingOptions = undefined;
	  }

	  set options(options) {
	    this.resizeMode = this._scalingOptions = options;
	  }

	  _getLookupId() {
	    return `${this._src}-${this._scalingOptions.type}-${this._scalingOptions.w}-${this._scalingOptions.h}`
	  }

	  getNonDefaults() {
	    const obj = super.getNonDefaults();
	    if (this._src) {
	      obj.src = this._src;
	    }
	    return obj
	  }
	}

	let getInfo = () => Promise.resolve();
	let setInfo = () => Promise.resolve();

	const initProfile = config => {
	  getInfo = config.getInfo;
	  setInfo = config.setInfo;
	};

	const events = [
	  'timeupdate',
	  'error',
	  'ended',
	  'loadeddata',
	  'canplay',
	  'play',
	  'playing',
	  'pause',
	  'loadstart',
	  'seeking',
	  'seeked',
	  'encrypted',
	];

	let mediaUrl = url => url;

	const initMediaPlayer = config => {
	  if (config.mediaUrl) {
	    mediaUrl = config.mediaUrl;
	  }
	};

	class Mediaplayer extends Lightning.Component {
	  _construct() {
	    this._skipRenderToTexture = false;
	    this._metrics = null;
	    this._textureMode = Settings.get('platform', 'textureMode') || false;
	    Log.info('Texture mode: ' + this._textureMode);
	  }

	  static _template() {
	    return {
	      Video: {
	        VideoWrap: {
	          VideoTexture: {
	            visible: false,
	            pivot: 0.5,
	            texture: { type: Lightning.textures.StaticTexture, options: {} },
	          },
	        },
	      },
	    }
	  }

	  set skipRenderToTexture(v) {
	    this._skipRenderToTexture = v;
	  }

	  get textureMode() {
	    return this._textureMode
	  }

	  get videoView() {
	    return this.tag('Video')
	  }

	  _init() {
	    //re-use videotag if already there
	    const videoEls = document.getElementsByTagName('video');
	    if (videoEls && videoEls.length > 0) this.videoEl = videoEls[0];
	    else {
	      this.videoEl = document.createElement('video');
	      this.videoEl.setAttribute('id', 'video-player');
	      this.videoEl.style.position = 'absolute';
	      this.videoEl.style.zIndex = '1';
	      this.videoEl.style.display = 'none';
	      this.videoEl.setAttribute('width', '100%');
	      this.videoEl.setAttribute('height', '100%');

	      this.videoEl.style.visibility = this.textureMode ? 'hidden' : 'visible';
	      document.body.appendChild(this.videoEl);
	    }
	    if (this.textureMode && !this._skipRenderToTexture) {
	      this._createVideoTexture();
	    }

	    this.eventHandlers = [];
	  }

	  _registerListeners() {
	    events.forEach(event => {
	      const handler = e => {
	        if (this._metrics[event] && typeof this._metrics[event] === 'function') {
	          this._metrics[event]({ currentTime: this.videoEl.currentTime });
	        }
	        this.fire(event, { videoElement: this.videoEl, event: e });
	      };
	      this.eventHandlers.push(handler);
	      this.videoEl.addEventListener(event, handler);
	    });
	  }

	  _deregisterListeners() {
	    Log.info('Deregistering event listeners MediaPlayer');
	    events.forEach((event, index) => {
	      this.videoEl.removeEventListener(event, this.eventHandlers[index]);
	    });
	    this.eventHandlers = [];
	  }

	  _attach() {
	    this._registerListeners();
	  }

	  _detach() {
	    this._deregisterListeners();
	    this.close();
	  }

	  _createVideoTexture() {
	    const stage = this.stage;

	    const gl = stage.gl;
	    const glTexture = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, glTexture);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	    this.videoTexture.options = { source: glTexture, w: this.videoEl.width, h: this.videoEl.height };
	  }

	  _startUpdatingVideoTexture() {
	    if (this.textureMode && !this._skipRenderToTexture) {
	      const stage = this.stage;
	      if (!this._updateVideoTexture) {
	        this._updateVideoTexture = () => {
	          if (this.videoTexture.options.source && this.videoEl.videoWidth && this.active) {
	            const gl = stage.gl;

	            const currentTime = new Date().getTime();

	            // When BR2_PACKAGE_GST1_PLUGINS_BAD_PLUGIN_DEBUGUTILS is not set in WPE, webkitDecodedFrameCount will not be available.
	            // We'll fallback to fixed 30fps in this case.
	            const frameCount = this.videoEl.webkitDecodedFrameCount;

	            const mustUpdate = frameCount
	              ? this._lastFrame !== frameCount
	              : this._lastTime < currentTime - 30;

	            if (mustUpdate) {
	              this._lastTime = currentTime;
	              this._lastFrame = frameCount;
	              try {
	                gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
	                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoEl);
	                this._lastFrame = this.videoEl.webkitDecodedFrameCount;
	                this.videoTextureView.visible = true;

	                this.videoTexture.options.w = this.videoEl.videoWidth;
	                this.videoTexture.options.h = this.videoEl.videoHeight;
	                const expectedAspectRatio = this.videoTextureView.w / this.videoTextureView.h;
	                const realAspectRatio = this.videoEl.videoWidth / this.videoEl.videoHeight;
	                if (expectedAspectRatio > realAspectRatio) {
	                  this.videoTextureView.scaleX = realAspectRatio / expectedAspectRatio;
	                  this.videoTextureView.scaleY = 1;
	                } else {
	                  this.videoTextureView.scaleY = expectedAspectRatio / realAspectRatio;
	                  this.videoTextureView.scaleX = 1;
	                }
	              } catch (e) {
	                Log.error('texImage2d video', e);
	                this._stopUpdatingVideoTexture();
	                this.videoTextureView.visible = false;
	              }
	              this.videoTexture.source.forceRenderUpdate();
	            }
	          }
	        };
	      }
	      if (!this._updatingVideoTexture) {
	        stage.on('frameStart', this._updateVideoTexture);
	        this._updatingVideoTexture = true;
	      }
	    }
	  }

	  _stopUpdatingVideoTexture() {
	    if (this.textureMode) {
	      const stage = this.stage;
	      stage.removeListener('frameStart', this._updateVideoTexture);
	      this._updatingVideoTexture = false;
	      this.videoTextureView.visible = false;

	      if (this.videoTexture.options.source) {
	        const gl = stage.gl;
	        gl.bindTexture(gl.TEXTURE_2D, this.videoTexture.options.source);
	        gl.clearColor(0, 0, 0, 1);
	        gl.clear(gl.COLOR_BUFFER_BIT);
	      }
	    }
	  }

	  updateSettings(settings = {}) {
	    // The Component that 'consumes' the media player.
	    this._consumer = settings.consumer;

	    if (this._consumer && this._consumer.getMediaplayerSettings) {
	      // Allow consumer to add settings.
	      settings = Object.assign(settings, this._consumer.getMediaplayerSettings());
	    }

	    if (!Lightning.Utils.equalValues(this._stream, settings.stream)) {
	      if (settings.stream && settings.stream.keySystem) {
	        navigator
	          .requestMediaKeySystemAccess(
	            settings.stream.keySystem.id,
	            settings.stream.keySystem.config
	          )
	          .then(keySystemAccess => {
	            return keySystemAccess.createMediaKeys()
	          })
	          .then(createdMediaKeys => {
	            return this.videoEl.setMediaKeys(createdMediaKeys)
	          })
	          .then(() => {
	            if (settings.stream && settings.stream.src) this.open(settings.stream.src);
	          })
	          .catch(() => {
	            console.error('Failed to set up MediaKeys');
	          });
	      } else if (settings.stream && settings.stream.src) {
	        // This is here to be backwards compatible, will be removed
	        // in future sdk release
	        if (Settings.get('app', 'hls')) {
	          if (!window.Hls) {
	            window.Hls = class Hls {
	              static isSupported() {
	                console.warn('hls-light not included');
	                return false
	              }
	            };
	          }
	          if (window.Hls.isSupported()) {
	            if (!this._hls) this._hls = new window.Hls({ liveDurationInfinity: true });
	            this._hls.loadSource(settings.stream.src);
	            this._hls.attachMedia(this.videoEl);
	            this.videoEl.style.display = 'block';
	          }
	        } else {
	          this.open(settings.stream.src);
	        }
	      } else {
	        this.close();
	      }
	      this._stream = settings.stream;
	    }

	    this._setHide(settings.hide);
	    this._setVideoArea(settings.videoPos);
	  }

	  _setHide(hide) {
	    if (this.textureMode) {
	      this.tag('Video').setSmooth('alpha', hide ? 0 : 1);
	    } else {
	      this.videoEl.style.visibility = hide ? 'hidden' : 'visible';
	    }
	  }

	  open(url, settings = { hide: false, videoPosition: null }) {
	    // prep the media url to play depending on platform (mediaPlayerplugin)
	    url = mediaUrl(url);
	    this._metrics = Metrics$1.media(url);
	    Log.info('Playing stream', url);
	    if (this.application.noVideo) {
	      Log.info('noVideo option set, so ignoring: ' + url);
	      return
	    }
	    if (this.videoEl.getAttribute('src') === url) return this.reload()
	    this.videoEl.setAttribute('src', url);

	    this.videoEl.style.display = 'block';

	    this._setHide(settings.hide);
	    this._setVideoArea(settings.videoPosition || [0, 0, 1920, 1080]);
	  }

	  close() {
	    // We need to pause first in order to stop sound.
	    this.videoEl.pause();
	    this.videoEl.removeAttribute('src');

	    // force load to reset everything without errors
	    this.videoEl.load();

	    this._clearSrc();

	    this.videoEl.style.display = 'none';
	  }

	  playPause() {
	    if (this.isPlaying()) {
	      this.doPause();
	    } else {
	      this.doPlay();
	    }
	  }

	  get muted() {
	    return this.videoEl.muted
	  }

	  set muted(v) {
	    this.videoEl.muted = v;
	  }

	  get loop() {
	    return this.videoEl.loop
	  }

	  set loop(v) {
	    this.videoEl.loop = v;
	  }

	  isPlaying() {
	    return this._getState() === 'Playing'
	  }

	  doPlay() {
	    this.videoEl.play();
	  }

	  doPause() {
	    this.videoEl.pause();
	  }

	  reload() {
	    var url = this.videoEl.getAttribute('src');
	    this.close();
	    this.videoEl.src = url;
	  }

	  getPosition() {
	    return Promise.resolve(this.videoEl.currentTime)
	  }

	  setPosition(pos) {
	    this.videoEl.currentTime = pos;
	  }

	  getDuration() {
	    return Promise.resolve(this.videoEl.duration)
	  }

	  seek(time, absolute = false) {
	    if (absolute) {
	      this.videoEl.currentTime = time;
	    } else {
	      this.videoEl.currentTime += time;
	    }
	  }

	  get videoTextureView() {
	    return this.tag('Video').tag('VideoTexture')
	  }

	  get videoTexture() {
	    return this.videoTextureView.texture
	  }

	  _setVideoArea(videoPos) {
	    if (Lightning.Utils.equalValues(this._videoPos, videoPos)) {
	      return
	    }

	    this._videoPos = videoPos;

	    if (this.textureMode) {
	      this.videoTextureView.patch({
	        smooth: {
	          x: videoPos[0],
	          y: videoPos[1],
	          w: videoPos[2] - videoPos[0],
	          h: videoPos[3] - videoPos[1],
	        },
	      });
	    } else {
	      const precision = this.stage.getRenderPrecision();
	      this.videoEl.style.left = Math.round(videoPos[0] * precision) + 'px';
	      this.videoEl.style.top = Math.round(videoPos[1] * precision) + 'px';
	      this.videoEl.style.width = Math.round((videoPos[2] - videoPos[0]) * precision) + 'px';
	      this.videoEl.style.height = Math.round((videoPos[3] - videoPos[1]) * precision) + 'px';
	    }
	  }

	  _fireConsumer(event, args) {
	    if (this._consumer) {
	      this._consumer.fire(event, args);
	    }
	  }

	  _equalInitData(buf1, buf2) {
	    if (!buf1 || !buf2) return false
	    if (buf1.byteLength != buf2.byteLength) return false
	    const dv1 = new Int8Array(buf1);
	    const dv2 = new Int8Array(buf2);
	    for (let i = 0; i != buf1.byteLength; i++) if (dv1[i] != dv2[i]) return false
	    return true
	  }

	  error(args) {
	    this._fireConsumer('$mediaplayerError', args);
	    this._setState('');
	    return ''
	  }

	  loadeddata(args) {
	    this._fireConsumer('$mediaplayerLoadedData', args);
	  }

	  play(args) {
	    this._fireConsumer('$mediaplayerPlay', args);
	  }

	  playing(args) {
	    this._fireConsumer('$mediaplayerPlaying', args);
	    this._setState('Playing');
	  }

	  canplay(args) {
	    this.videoEl.play();
	    this._fireConsumer('$mediaplayerStart', args);
	  }

	  loadstart(args) {
	    this._fireConsumer('$mediaplayerLoad', args);
	  }

	  seeked() {
	    this._fireConsumer('$mediaplayerSeeked', {
	      currentTime: this.videoEl.currentTime,
	      duration: this.videoEl.duration || 1,
	    });
	  }

	  seeking() {
	    this._fireConsumer('$mediaplayerSeeking', {
	      currentTime: this.videoEl.currentTime,
	      duration: this.videoEl.duration || 1,
	    });
	  }

	  durationchange(args) {
	    this._fireConsumer('$mediaplayerDurationChange', args);
	  }

	  encrypted(args) {
	    const video = args.videoElement;
	    const event = args.event;
	    // FIXME: Double encrypted events need to be properly filtered by Gstreamer
	    if (video.mediaKeys && !this._equalInitData(this._previousInitData, event.initData)) {
	      this._previousInitData = event.initData;
	      this._fireConsumer('$mediaplayerEncrypted', args);
	    }
	  }

	  static _states() {
	    return [
	      class Playing extends this {
	        $enter() {
	          this._startUpdatingVideoTexture();
	        }
	        $exit() {
	          this._stopUpdatingVideoTexture();
	        }
	        timeupdate() {
	          this._fireConsumer('$mediaplayerProgress', {
	            currentTime: this.videoEl.currentTime,
	            duration: this.videoEl.duration || 1,
	          });
	        }
	        ended(args) {
	          this._fireConsumer('$mediaplayerEnded', args);
	          this._setState('');
	        }
	        pause(args) {
	          this._fireConsumer('$mediaplayerPause', args);
	          this._setState('Playing.Paused');
	        }
	        _clearSrc() {
	          this._fireConsumer('$mediaplayerStop', {});
	          this._setState('');
	        }
	        static _states() {
	          return [class Paused extends this {}]
	        }
	      },
	    ]
	  }
	}

	class localCookie{constructor(e){return e=e||{},this.forceCookies=e.forceCookies||!1,!0===this._checkIfLocalStorageWorks()&&!0!==e.forceCookies?{getItem:this._getItemLocalStorage,setItem:this._setItemLocalStorage,removeItem:this._removeItemLocalStorage,clear:this._clearLocalStorage,keys:this._getLocalStorageKeys}:{getItem:this._getItemCookie,setItem:this._setItemCookie,removeItem:this._removeItemCookie,clear:this._clearCookies,keys:this._getCookieKeys}}_checkIfLocalStorageWorks(){if("undefined"==typeof localStorage)return !1;try{return localStorage.setItem("feature_test","yes"),"yes"===localStorage.getItem("feature_test")&&(localStorage.removeItem("feature_test"),!0)}catch(e){return !1}}_getItemLocalStorage(e){return window.localStorage.getItem(e)}_setItemLocalStorage(e,t){return window.localStorage.setItem(e,t)}_removeItemLocalStorage(e){return window.localStorage.removeItem(e)}_clearLocalStorage(){return window.localStorage.clear()}_getLocalStorageKeys(){return Object.keys(window.localStorage)}_getItemCookie(e){var t=document.cookie.match(RegExp("(?:^|;\\s*)"+function(e){return e.replace(/([.*+?\^${}()|\[\]\/\\])/g,"\\$1")}(e)+"=([^;]*)"));return t&&""===t[1]&&(t[1]=null),t?t[1]:null}_setItemCookie(e,t){document.cookie=`${e}=${t}`;}_removeItemCookie(e){document.cookie=`${e}=;Max-Age=-99999999;`;}_clearCookies(){document.cookie.split(";").forEach(e=>{document.cookie=e.replace(/^ +/,"").replace(/=.*/,"=;expires=Max-Age=-99999999");});}_getCookieKeys(){return document.cookie.split(";").map(e=>{const t=e.split("=");return ""!==t[1]&&t[0].trim()}).filter(e=>e)}}

	let namespace;
	let lc;

	const initStorage = () => {
	  namespace = Settings.get('platform', 'appId');
	  // todo: pass options (for example to force the use of cookies)
	  lc = new localCookie();
	};

	var Launch = (App, appSettings, platformSettings, appData) => {
	  initSettings(appSettings, platformSettings);

	  initUtils(platformSettings);
	  initStorage();

	  // Initialize plugins
	  if (platformSettings.plugins) {
	    platformSettings.plugins.profile && initProfile(platformSettings.plugins.profile);
	    platformSettings.plugins.metrics && initMetrics(platformSettings.plugins.metrics);
	    platformSettings.plugins.mediaPlayer && initMediaPlayer(platformSettings.plugins.mediaPlayer);
	  }

	  const app = Application(App, appData, platformSettings);
	  return new app(appSettings)
	};

	class ListItem extends Lightning.Component {
	  static _template() {
	    return {}
	  }

	  _init() {
	    this.patch({
	      rect: true,
	      w: this.argument.ListItem.width,
	      h: this.argument.ListItem.height,
	      color: this.argument.ListItem.color,
	      alpha: 0.8,
	      Label: {
	        x: this.argument.ListItem.Label_x,
	        y: this.argument.ListItem.Label_y,
	        text: { text: this.item.label, fontSize: 30 }
	      }
	    });
	  }
	  _focus() {
	    this.patch({ smooth: { alpha: 1, scale: 1.1 } });
	  }
	  _unfocus() {
	    this.patch({ smooth: { alpha: 0.8, scale: 1 } });
	  }
	}

	//This ListItem show image.
	class ImageListItem extends ListItem {
	  static _template() {
	    return {}
	  }

	  _init() {
	    this.patch({
	      rect: true,
	      w: this.argument.ListItem.width,
	      h: this.argument.ListItem.height,
	      color: this.argument.ListItem.color,
	      alpha: 0.8,
	      Img: {
	        x: this.argument.ListItem.img_x,
	        y: this.argument.ListItem.img_y,
	        w: this.argument.ListItem.img_width,
	        h: this.argument.ListItem.img_height,
	        texture: { type: Lightning.textures.ImageTexture, src: './img/default-poster.jpg' }
	      },
	      Label: {
	        x: this.argument.ListItem.Label_x,
	        y: this.argument.ListItem.Label_y
	      }
	    });
	  }
	}

	//VoD ListItem .
	class VodListItem extends ListItem {
	  static _template() {
	    return {}
	  }

	  _init() {
	    this.patch({
	      rect: true,
	      w: this.argument.ListItem.width,
	      h: this.argument.ListItem.height,
	      color: this.argument.ListItem.color,
	      alpha: 0.8,
	      Label: {
	        x: this.argument.ListItem.Label_x,
	        y: this.argument.ListItem.Label_y,
	        text: { text: this.item.label, fontSize: 30 }
	      },
	      LabelTitle: {
	        x: this.argument.ListItem.Title_Label_x,
	        y: this.argument.ListItem.Title_Label_y,
	        text: { text: this.item.data.refId, fontSize: 50 }
	      }
	    });
	  }
	}

	class List extends Lightning.Component {
	  static _template() {
	    return {}
	  }

	  _init() {
	    this.index = 0;
	  }

	  getPosition(startX, startY, xspace, yspace, index, w) {
	    return startX + w * index + xspace * index
	  }

	  set items(items) {
	    let startX = 0,
	      startY = 0;
	    let xspace = this.argument.ListItem.xspace,
	      yspace = this.argument.ListItem.yspace;
	    let width = this.argument.ListItem.width;

	    this.children = items.map((item, index) => {
	      return {
	        ref: 'ListItem-' + index,
	        type: this.ListItemsComponend,
	        x: this.getPosition(startX, startY, xspace, yspace, index, width),
	        item, //passing the item as an attribute
	        argument: this.argument
	      }
	    });
	  }
	  _getFocused() {
	    return this.children[this.index]
	  }
	  _handleLeft() {
	    if (this.index > 0) {
	      this.index--;
	    }
	  }
	  _handleRight() {
	    if (this.index < this.children.length - 1) {
	      this.index++;
	    }
	  }
	  _handleEnter() {
	    this.signal('select', { item: this.children[this.index].item, ref: this.ref });
	  }
	}

	class model {
	  getMenu() {
	    return fetch('./cache/menu.json')
	      .then(response => {
	        return response.json()
	      })
	      .then(data => {
	        return data
	      })
	  }
	}

	let MenuConfig = {
	  MAINMENU_x: 150,
	  MAINMENU_y: 730,
	  MAINMENU_ITEM_WIDTH: 200,
	  MAINMENU_ITEM_HEIGHT: 40,
	  MAINMENU_ITEM_XSPACE: 400,
	  MAINMENU_ITEM_YSPACE: 0,
	  MAINMENU_ITEM_TXT_X: 0,
	  MAINMENU_ITEM_TXT_Y: 0,
	  MAINMENU_ITEM_COLOR: 0xff0000ff,
	  MAINMENU_LIST_TYPE: 'vertical',
	  SUBMENU_LIST_X: 0,
	  SUBMENU_LIST_Y: 0,
	  LIST_BACKGROUND_WIDTH: 1920,
	  LIST_BACKGROUND_HEIGHT: 70,
	  MAINMENU_LISTITEM_LABEL_X: 20,
	  MAINMENU_LISTITEM_LABEL_Y: 0,
	  MAINMENU_LISTITEM_IMG_X: 0,
	  MAINMENU_LISTITEM_IMG_Y: 0,
	  MAINMENU_LISTITEM_IMG_WIDTH: 200,
	  MAINMENU_LISTITEM_IMG_HEIGHT: 200
	};

	function getBackground() {
	  return {
	    x: 0,
	    y: 0,
	    rect: false,
	    color: 0xffffffff,
	    w: MenuConfig.LIST_BACKGROUND_WIDTH,
	    h: MenuConfig.LIST_BACKGROUND_HEIGHT
	  }
	}

	function getMainList() {
	  let argument = {
	    ListItem: {
	      width: MenuConfig.MAINMENU_ITEM_WIDTH,
	      height: MenuConfig.MAINMENU_ITEM_HEIGHT,
	      color: MenuConfig.MAINMENU_ITEM_COLOR,
	      Label_x: MenuConfig.MAINMENU_LISTITEM_LABEL_X,
	      Label_y: MenuConfig.MAINMENU_LISTITEM_LABEL_Y,
	      xspace: 400,
	      yspace: 0
	    }
	  };
	  return {
	    x: MenuConfig.MAINMENU_x,
	    y: MenuConfig.MAINMENU_y,
	    type: List,
	    signals: { select: true },
	    argument: argument
	  }
	}

	function getSubMenuList() {
	  let argument = {
	    ListItem: {
	      width: MenuConfig.MAINMENU_ITEM_WIDTH,
	      height: MenuConfig.MAINMENU_ITEM_HEIGHT,
	      color: MenuConfig.MAINMENU_ITEM_COLOR,
	      Label_x: MenuConfig.MAINMENU_LISTITEM_LABEL_X,
	      Label_y: MenuConfig.MAINMENU_LISTITEM_LABEL_Y,
	      img_x: MenuConfig.MAINMENU_LISTITEM_IMG_X,
	      img_y: MenuConfig.MAINMENU_LISTITEM_IMG_Y,
	      img_width: MenuConfig.MAINMENU_LISTITEM_IMG_HEIGHT,
	      img_height: MenuConfig.MAINMENU_LISTITEM_IMG_WIDTH,
	      xspace: 20,
	      yspace: 0
	    }
	  };
	  return {
	    y: MenuConfig.SUBMENU_LIST_Y,
	    type: List,
	    signals: { select: true },
	    argument: argument
	  }
	}

	class Menu extends Lightning.Component {
	  static _template() {
	    return {
	      x: 0,
	      y: 0,
	      BackGround: getBackground(),
	      MainList: getMainList(),
	      SubMenuList: getSubMenuList()
	    }
	  }

	  _construct() {
	    this.model = new model();
	    this.model.data = {};
	  }

	  _init() {
	    this.model.getMenu().then(data => {
	      this.model.data = data;
	      this.tag('MainList').ListItemsComponend = ListItem;
	      this.tag('SubMenuList').ListItemsComponend = ImageListItem;
	      this.tag('MainList').items = data.map(i => ({ label: i.title }));
	      this.tag('SubMenuList').items = data[0].submenu.map(i => ({ label: i }));
	      this._setState('MainList');
	    });
	  }

	  _handleUp() {
	    this._setState('MainList');
	  }

	  _handleDown() {
	    this._setState('SubMenuList');
	  }

	  _handleBack() {}

	  static _states() {
	    return [
	      class SubMenuList extends this {
	        _getFocused() {
	          return this.tag('SubMenuList')
	        }
	        select({ item }) {}
	      },
	      class MainList extends this {
	        _getFocused() {
	          return this.tag('MainList')
	        }
	        select({ item }) {
	          this.signal('select', { item: { label: 'menu', target: item.label } });
	        }
	      }
	    ]
	  }
	}

	class OnDemand extends Lightning.Component {
	  static _template() {
	    return {}
	  }

	  _construct() {}

	  _init() {
	    this.patch({
	      Txt: { x: 600, y: 520, text: { text: this.argument, fontSize: 30 } }
	    });
	  }

	  _handleUp() {}
	  _handleBack() {}
	  _handleEnter() {
	    this.signal('select', { item: { label: 'OnDemand', target: 'Menu' } });
	  }
	}

	class model$1 {
	  constructor() {
	    this.init();
	    this.data = {};
	    this.currrentChannel = '';
	  }

	  init() {
	    fetch('./cache/demo/channelsV2.json')
	      .then(response => {
	        return response.json()
	      })
	      .then(data => {
	        this.data = data;
	      });
	  }

	  nextChannel() {
	    let params = {
	      openRequest: {
	        type: 'main',
	        locator: 'tune://pgmno=-1&frequency=302000000&modulation=16&symbol_rate=6875',
	        refId: 'channel2'
	      }
	    };
	    this.currrentChannel = 'channel 2';
	    return params
	  }

	  previousChannel() {
	    let params = {
	      openRequest: {
	        type: 'main',
	        locator: 'tune://pgmno=-1&frequency=301000000&modulation=16&symbol_rate=6875',
	        refId: 'channel1'
	      }
	    };
	    this.currrentChannel = 'channel 1';
	    return params
	  }
	}

	let currentPlaying = {};

	function startPlayback(params) {
	  var requestOptions = {
	    method: 'PUT',
	    headers: {
	      'Content-Type': 'application/json',
	      Connection: 'keep-alive'
	    },
	    body: JSON.stringify(params)
	  };

	  currentPlaying = {
	    closeRequest: {
	      type: 'main',
	      locator: params.openRequest.locator,
	      refId: params.openRequest.refId,
	      sessionId: ''
	    }
	  };

	  return fetch('http://localhost:8080/vldms/sessionmgr/open', requestOptions)
	    .then(response => {
	      return response.json()
	    })
	    .then(data => {
	      currentPlaying.closeRequest.sessionId = data.openStatus.sessionId;
	      console.log(currentPlaying);
	      return data
	    })
	}

	let Config = {
	  CHANNELBAR_X: 700,
	  CHANNELBAR_Y: 900,
	  CHANNELBAR_WIDTH: 500,
	  CHANNELBAR_HEIGHT: 100,
	  CHANNELBAR_LABEL_X: 150,
	  CHANNELBAR_LABEL_Y: 30,
	  CHANNELBAR_COLOR: 0xffff0000,
	  FONT_SIZE: 30
	};

	class channelbar extends Lightning.Component {
	  static _template() {
	    return {
	      Channelbar: {
	        rect: true,
	        x: Config.CHANNELBAR_X,
	        y: Config.CHANNELBAR_Y,
	        w: Config.CHANNELBAR_WIDTH,
	        h: Config.CHANNELBAR_HEIGHT,
	        color: Config.CHANNELBAR_COLOR,
	        Ch: {
	          x: Config.CHANNELBAR_LABEL_X,
	          y: Config.CHANNELBAR_LABEL_Y,
	          text: { text: 'Channel 1', fontSize: Config.FONT_SIZE }
	        }
	      }
	    }
	  }

	  _construct() {
	    this.model = new model$1();
	  }

	  _init() {
	    this.patch({
	      Txt: { x: 600, y: 520, text: { text: this.argument, fontSize: 30 } }
	    });
	    startPlayback(this.model.previousChannel());
	  }

	  _captureKey(evt) {
	    if (evt.code === 'ArrowDown') {
	      startPlayback(this.model.previousChannel());
	      this.tag('Ch').text = this.model.currrentChannel;
	    }
	    if (evt.code === 'ArrowUp') {
	      startPlayback(this.model.nextChannel());
	      this.tag('Ch').text = this.model.currrentChannel;
	    }
	    if (evt.code === 'Enter') {
	      this.signal('select', { item: { label: 'OnDemand', target: 'Menu' } });
	    }
	    return true
	  }
	}

	class model$2 {
	  getMenu() {
	    return fetch('./cache/demo/movies.json')
	      .then(response => {
	        return response.json()
	      })
	      .then(data => {
	        return data
	      })
	  }
	}

	let MenuConfig$1 = {
	  LIST_X: 50,
	  LIST_Y: 500,
	  LIST_ITEM_WIDTH: 300,
	  LIST_ITEM_HEIGHT: 160,
	  LIST_ITEM_XSPACE: 20,
	  LIST_ITEM_YSPACE: 0,
	  LIST_ITEM_COLOR: 0xff0000ff,
	  MAINMENU_LIST_TYPE: 'vertical',
	  LIST_BACKGROUND_WIDTH: 1920,
	  LIST_BACKGROUND_HEIGHT: 230,
	  LIST_BACKGROUND_Y: 470,
	  LIST_BACKGROUND_X: 0,
	  LIST_BACKGROUND_COLOR: 0x22f00000,
	  LISTITEM_LABEL_X: 80,
	  LISTITEM_LABEL_Y: 100,
	  LISTITEM_TITLE_LABEL_X: 80,
	  LISTITEM_TITLE_LABEL_Y: 20,
	  LIST_TITLE: 'All Movies',
	  LIST_TITLE_X: 50,
	  LIST_TITLE_Y: 430
	};

	function getBackground$1() {
	  return {
	    x: MenuConfig$1.LIST_BACKGROUND_X,
	    y: MenuConfig$1.LIST_BACKGROUND_Y,
	    rect: true,
	    color: MenuConfig$1.LIST_BACKGROUND_COLOR,
	    w: MenuConfig$1.LIST_BACKGROUND_WIDTH,
	    h: MenuConfig$1.LIST_BACKGROUND_HEIGHT
	  }
	}

	function getMainList$1() {
	  let argument = {
	    ListItem: {
	      width: MenuConfig$1.LIST_ITEM_WIDTH,
	      height: MenuConfig$1.LIST_ITEM_HEIGHT,
	      color: MenuConfig$1.LIST_ITEM_COLOR,
	      Label_x: MenuConfig$1.LISTITEM_LABEL_X,
	      Label_y: MenuConfig$1.LISTITEM_LABEL_Y,
	      xspace: MenuConfig$1.LIST_ITEM_XSPACE,
	      yspace: MenuConfig$1.LIST_ITEM_YSPACE,
	      Title_Label_x: MenuConfig$1.LISTITEM_TITLE_LABEL_X,
	      Title_Label_y: MenuConfig$1.LISTITEM_TITLE_LABEL_Y
	    }
	  };
	  return {
	    x: MenuConfig$1.LIST_X,
	    y: MenuConfig$1.LIST_Y,
	    type: List,

	    signals: { select: true },
	    argument: argument
	  }
	}

	class Movie extends Lightning.Component {
	  static _template() {
	    return {
	      x: 0,
	      y: 0,
	      BackGround: getBackground$1(),
	      MainList: getMainList$1(),
	      Txt: {
	        x: MenuConfig$1.LIST_TITLE_X,
	        y: MenuConfig$1.LIST_TITLE_Y,
	        text: { text: MenuConfig$1.LIST_TITLE, fontSize: 30 }
	      }
	    }
	  }

	  _construct(cont) {
	    this.model = new model$2();
	    this.model.data = {};
	  }

	  _init() {
	    this.model.getMenu().then(data => {
	      this.model.data = data;
	      this.tag('MainList').ListItemsComponend = VodListItem;
	      this.tag('MainList').items = this.model.data.map(i => ({ label: i.title, data: i }));
	      this._setState('MainList');
	    });
	  }

	  _handleUp() {}
	  _handleDown() {}
	  _handleBack() {
	    console.log('movie js');
	  }

	  static _states() {
	    return [
	      class MainList extends this {
	        _getFocused() {
	          return this.tag('MainList')
	        }
	        select(item) {
	          console.log(item.item.data);
	          var body = {
	            openRequest: {
	              type: 'main',
	              locator: item.item.data.locator,
	              refId: item.item.data.refId
	            }
	          };
	          startPlayback(body);
	        }
	      }
	    ]
	  }
	}

	class App extends Lightning.Component {
	  static getFonts() {
	    return [{ family: 'pixel', url: Utils.asset('../fonts/DejaVuSerif.ttf'), descriptor: {} }]
	  }

	  static _template() {
	    return {
	      Menu: { type: Menu, alpha: 0, signals: { select: true } },
	      App: {
	        type: OnDemand,
	        alpha: 0,
	        signals: { select: true },
	        argument: 'App Page Under Construction. Please Press Enter key.'
	      },
	      Movie: {
	        type: Movie,
	        alpha: 0,
	        signals: { select: true },
	        argument: 'Movie Page Under Construction. Please Press Enter key.'
	      },
	      Setting: {
	        type: OnDemand,
	        alpha: 0,
	        signals: { select: true },
	        argument: 'Setting Under Construction. Please Press Enter key.'
	      },
	      ChannelBar: {
	        type: channelbar,
	        alpha: 0,
	        signals: { select: true },
	        argument:
	          'Please Press Up/Down arrow key for channel navigation.Press Enter ,The main menu will appear'
	      }
	    }
	  }

	  _setup() {
	    this._setState('Menu');
	  }

	  _captureKey(evt) {
	    if (evt.code === 'ArrowDown' || evt.code === 'ArrowUp') {
	      this._setState('ChannelBar');
	    }
	    return false
	  }

	  static _states() {
	    return [
	      class Menu extends this {
	        $enter() {
	          this.tag('Menu').setSmooth('alpha', 1);
	        }
	        $exit() {
	          this.tag('Menu').setSmooth('alpha', 0);
	        }
	        _getFocused() {
	          return this.tag('Menu')
	        }
	        select({ item }) {
	          this._setState(item.target);
	        }
	      },
	      class App extends this {
	        $enter() {
	          this.tag('App').setSmooth('alpha', 1);
	        }
	        $exit() {
	          this.tag('App').setSmooth('alpha', 0);
	        }
	        _getFocused() {
	          return this.tag('App')
	        }
	        select({ item }) {
	          console.log('App');
	          this._setState(item.target);
	        }
	      },
	      class Movie extends this {
	        $enter() {
	          this.tag('Movie').setSmooth('alpha', 1);
	        }
	        $exit() {
	          this.tag('Movie').setSmooth('alpha', 0);
	        }
	        _getFocused() {
	          return this.tag('Movie')
	        }
	        select({ item }) {
	          this._setState(item.target);
	        }
	      },
	      class Setting extends this {
	        $enter() {
	          this.tag('Setting').setSmooth('alpha', 1);
	        }
	        $exit() {
	          this.tag('Setting').setSmooth('alpha', 0);
	        }
	        _getFocused() {
	          return this.tag('Setting')
	        }
	        select({ item }) {
	          console.log('Setting');
	          this._setState(item.target);
	        }
	      },
	      class ChannelBar extends this {
	        $enter() {
	          this.tag('ChannelBar').setSmooth('alpha', 1);
	        }
	        $exit() {
	          this.tag('ChannelBar').setSmooth('alpha', 0);
	        }
	        _getFocused() {
	          return this.tag('ChannelBar')
	        }
	        select({ item }) {
	          this._setState(item.target);
	        }
	      }
	    ]
	  }
	}

	function index() {
	  return Launch(App, ...arguments)
	}

	return index;

}());
//# sourceMappingURL=appBundle.js.map
