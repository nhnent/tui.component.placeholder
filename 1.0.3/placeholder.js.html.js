tui.util.defineNamespace("fedoc.content", {});
fedoc.content["placeholder.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Generate the virtual placeholder on browsers isn't supported placeholder feature\n * @author NHN Ent. FE dev team.&lt;dl_javascript@nhnent.com>\n */\n'use strict';\n\nvar util = require('./util.js');\n\nvar browser = tui.util.browser;\nvar Placeholder, sharedInstance, isSupportPlaceholder;\n\nvar KEYCODE_BACK = 8;\nvar KEYCODE_TAB = 9;\nvar INPUT_TYPES = [\n    'text',\n    'password',\n    'email',\n    'tel',\n    'number',\n    'url',\n    'search'\n];\n\n/**\n * Placeholder Object\n * @constructor\n */\nPlaceholder = tui.util.defineClass(/** @lends Placeholder.prototype */{\n    init: function() {\n        /**\n         * Array pushed 'input' elements in the current page\n         * @type {Array}\n         * @private\n         */\n        this._inputElems = [];\n    },\n\n    /**\n     * Get all 'input' elements\n     * @returns {HTMLElements} All 'input' elements\n     */\n    getAllInputElems: function() {\n        return this._inputElems;\n    },\n\n    /**\n     * Add elements in array\n     * @param {HTMLElements} inputElems - Selected 'input' elements for generating placeholder\n     */\n    generatePlaceholders: function(inputElems) {\n        this._inputElems = this._inputElems.concat(inputElems);\n\n        tui.util.forEach(inputElems, this._attachPlaceholder, this);\n    },\n\n    /**\n     * Hide placeholder on 'input' element that has already value\n     * @param {HTMLElements} inputElems - Selected 'input' elements for hiding placeholder\n     */\n    hidePlaceholders: function(inputElems) {\n        tui.util.forEach(inputElems, function(elem) {\n            var placeholder = elem.parentNode.getElementsByTagName('span')[0];\n\n            placeholder.style.display = 'none';\n        });\n    },\n\n    /**\n     * Returns element's style value defined at css file\n     * @param {HTMLElement} target - 'input' element\n     * @returns {Object} Style info of 'input' element\n     * @private\n     */\n    _getInitStyle: function(target) {\n        var computedObj;\n        var styleInfo;\n\n        if (window.getComputedStyle) {\n            computedObj = window.getComputedStyle(target, null);\n\n            styleInfo = {\n                fontSize: computedObj.getPropertyValue('font-size'),\n                paddingLeft: computedObj.getPropertyValue('padding-left')\n            };\n        } else {\n            computedObj = target.currentStyle;\n\n            styleInfo = {\n                fontSize: computedObj.fontSize,\n                paddingLeft: computedObj.paddingLeft\n            };\n        }\n\n        return styleInfo;\n    },\n\n    /**\n     * Attach a new virtual placeholder after a selected 'input' element and wrap this element\n     * @param {HTMLElement} target - The 'input' element\n     * @param {Number} index - Current item index\n     * @private\n     */\n    _attachPlaceholder: function(target, index) {\n        var initStyle = this._getInitStyle(target);\n        var wrapTag = document.createElement('span');\n        var placeholder = target.getAttribute('placeholder');\n        var parentNode = target.parentNode;\n        var cloneNode = target.cloneNode();\n        var hasValue = target.value !== '';\n\n        wrapTag.innerHTML = this._generateSpanTag(initStyle.paddingLeft, initStyle.fontSize, placeholder, hasValue);\n        wrapTag.appendChild(cloneNode);\n\n        parentNode.insertBefore(wrapTag, target.nextSibling);\n        parentNode.removeChild(target);\n\n        wrapTag.style.cssText = 'position:relative;line-height:1;';\n\n        this._inputElems[index] = cloneNode;\n\n        this._bindEvent(wrapTag);\n    },\n\n    /**\n     * Bind events on the element\n     * @param {HTMLElement} target - The wrapper tag of the 'input' element\n     * @private\n     */\n    _bindEvent: function(target) {\n        var inputElem = target.getElementsByTagName('input')[0];\n        var spanElem = target.getElementsByTagName('span')[0];\n        var spanStyle = spanElem.style;\n\n        /**\n         * Event handler\n         */\n        function onKeyup() {\n            if (inputElem.value === '') {\n                spanStyle.display = 'inline-block';\n            }\n        }\n\n        util.bindEvent(spanElem, 'click', function() {\n            inputElem.focus();\n        });\n\n        util.bindEvent(inputElem, 'keydown', function(e) {\n            var keyCode = e.which || e.keyCode;\n\n            if (!(keyCode === KEYCODE_BACK || keyCode === KEYCODE_TAB ||\n                (e.shiftKey &amp;&amp; keyCode === KEYCODE_TAB))) {\n                spanStyle.display = 'none';\n            }\n        });\n\n        util.bindEvent(inputElem, 'keyup', onKeyup);\n        util.bindEvent(inputElem, 'blur', onKeyup);\n    },\n\n    /**\n     * Generate the virtual placeholder element\n     * @param {Number} paddingLeft - Current 'input' element's left padding size\n     * @param {Number} fontSize - Current 'input' element's 'font-size' property value\n     * @param {String} placeholderText - Current 'input' element value of placeholder property\n     * @param {Boolena} hasValue - State of current 'input' element that has value\n     * @returns {String} String of virtual placeholder tag\n     * @private\n     */\n    _generateSpanTag: function(paddingLeft, fontSize, placeholderText, hasValue) {\n        var html = '&lt;span style=\"position:absolute;left:0;top:50%;width:90%;';\n\n        html += 'padding-left:' + paddingLeft + ';margin-top:' + (-(parseFloat(fontSize, 10) / 2) - 1) + 'px;';\n        html += 'overflow:hidden;white-space:nowrap;text-overflow:ellipsis;*display:inline;zoom:1;';\n        html += 'display:' + (hasValue ? 'none' : 'inline-block') + ';';\n        html += 'color:#aaa;line-height:1.2;z-index:0;';\n        html += 'font-size:' + fontSize + ';\" UNSELECTABLE=\"on\">' + placeholderText + '&lt;/span>';\n\n        return html;\n    }\n});\n\nif (browser.msie &amp;&amp; (browser.version > 9 &amp;&amp; browser.version &lt;= 11)) {\n    util.addCssRule({\n        selector: ':-ms-input-placeholder',\n        css: 'color:#fff !important;text-indent:-9999px;'\n    });\n}\n\nisSupportPlaceholder = 'placeholder' in document.createElement('input') &amp;&amp; !(browser.msie &amp;&amp; browser.version &lt;= 11);\n\nsharedInstance = new Placeholder();\n\nmodule.exports = {\n    /**\n     * Generate virtual placeholders\n     * @param {HTMLElements|Undefined} inputElems - created 'input' elements\n     * @api\n     * @example\n     * tui.component.placeholder.generate();\n     * tui.component.placeholder.generate(document.getElementsByTagName('input'));\n     */\n    generate: function(inputElems) {\n        var selectedElems;\n\n        if (isSupportPlaceholder) {\n            return;\n        }\n\n        selectedElems = tui.util.toArray(inputElems || document.getElementsByTagName('input'));\n\n        sharedInstance.generatePlaceholders(tui.util.filter(selectedElems, function(elem) {\n            var type = elem.type.toLowerCase();\n            var diableState = elem.disabled;\n            var readonlyState = elem.readOnly;\n\n            return (tui.util.inArray(type, INPUT_TYPES) > -1 &amp;&amp;\n                    elem.getAttribute('placeholder') &amp;&amp;\n                    !(diableState || readonlyState));\n        }));\n    },\n\n    /**\n     * When 'input' element already has value, hide the virtual placeholder\n     * @api\n     * @example\n     * tui.component.placeholder.hideOnInputHavingValue();\n     */\n    hideOnInputHavingValue: function() {\n        var inputElems;\n\n        if (isSupportPlaceholder) {\n            return;\n        }\n\n        inputElems = sharedInstance.getAllInputElems();\n\n        sharedInstance.hidePlaceholders(tui.util.filter(inputElems, function(elem) {\n            return (elem.value !== '' &amp;&amp; elem.type !== INPUT_TYPES[1]);\n        }));\n    },\n\n    /**\n     * Reset 'input' elements array (method for testcase)\n     * @api\n     * @example\n     * tui.component.placeholder.reset();\n     */\n    reset: function() {\n        if (isSupportPlaceholder) {\n            return;\n        }\n\n        sharedInstance.getAllInputElems().length = 0;\n    }\n};\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"