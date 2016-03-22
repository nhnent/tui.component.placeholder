'use strict';

var Placeholder = tui.util.defineClass({
    /**
     * Init setting
     * @param  {HTMLElement} elements - selected 'input' tags
     */
    init: function(elements) {
        var isSupportPlaceholder = 'placeholder' in document.createElement('input');

        /**
         * All 'input' elements in current page
         * @type  {Array}
         */
        this._inputElems = tui.util.toArray(elements || document.getElementsByTagName('input'));

        if (!isSupportPlaceholder && this._inputElems.length > 0) {
            this._generatePlaceholder();
        }
    },

    /**
     * Return style info of imported style sheet
     * @param  {HTMLElement} elem - first 'input' tag
     * @returns {Object}
     * @private
     */
    _getInitStyle: function(elem) {
        var computedObj,
            hasFunc = false;

        if (window.getComputedStyle) {
            computedObj = window.getComputedStyle(elem, null);
            hasFunc = true;
        } else {
            computedObj = elem.currentStyle;
        }

        return {
            fontSize: hasFunc ? computedObj.getPropertyValue('font-size') : computedObj.fontSize,
            fixedHeight: hasFunc ? computedObj.getPropertyValue('line-height') : computedObj.lineHeight,
            fixedWidth: hasFunc ? computedObj.getPropertyValue('width') : computedObj.width
        };
    },

    /**
     * Generator virtual placeholders for browser not supported 'placeholder' property
     * @private
     */
    _generatePlaceholder: function() {
        var self = this,
            type;

        tui.util.forEach(this._inputElems, function(elem) {
            type = elem.type;

            if (type === 'text' || type === 'password' || type === 'email') {
                self._attachCustomPlaceholderTag(elem);
            }
        });
    },

    /**
     * Attach a new custom placehoder tag after a selected 'input' tag and wrap 'input' tag
     * @param  {HTMLElement} target - input tag
     * @private
     */
    _attachCustomPlaceholderTag: function(target) {
        var initStyle = this._getInitStyle(target),
            fontSize = initStyle.fontSize,
            fixedHeight = initStyle.fixedHeight,
            wrapTag = document.createElement('span');

        target.style.cssText = this._getInputStyle(fontSize, fixedHeight);

        wrapTag.innerHTML = this._generateSpanTag(fontSize, target.placeholder);
        wrapTag.appendChild(target.cloneNode());

        target.parentNode.insertBefore(wrapTag, target.nextSibling);
        target.parentNode.removeChild(target);

        wrapTag.style.cssText = this._getWrapperStyle(initStyle.fixedWidth);

        this._bindEvent(wrapTag, 'click', tui.util.bind(function() {
            this.lastChild.focus();
        }, wrapTag));

        this._bindEvent(wrapTag, 'keyup', tui.util.bind(this._onToggleState, wrapTag));
    },

    /**
     * Get style of input tag's parent tag
     * @param  {Number} fixedWidth - input tag's 'width' property value
     * @returns {String}
     * @private
     */
    _getWrapperStyle: function(fixedWidth) {
        return 'position:relative;display:inline-block;*display:inline;zoom:1;width:' + fixedWidth + ';';
    },

    /**
     * Get style of input tag
     * @param  {Number} fontSize - input tag's 'font-size' property value
     * @param  {Number} fixedHeight - input tag's 'line-height' property value
     * @returns {String}
     * @private
     */
    _getInputStyle: function(fontSize, fixedHeight) {
        return 'font-size:' + fontSize + ';height:' + fixedHeight + ';line-height:' + fixedHeight + ';';
    },

    /**
     * [function description]
     * @param  {Number} fontSize - current input tag's 'font-size' property value
     * @param  {String} placehoderText - current input tag's value
     * @returns {String}
     * @private
     */
    _generateSpanTag: function(fontSize, placehoderText) {
        var html = '<span style="position:absolute;padding-left:2px;left:0;top:50%;color:#aaa;';

        html += 'display:inline-block;margin-top:' + (-(parseFloat(fontSize, 10) / 2)) + 'px;';
        html += 'font-size:' + fontSize + '">' + placehoderText + '</span>';

        return html;
    },

    /**
     * Change 'span' tag's display state by 'input' tag's value
     * @private
     */
    _onToggleState: function() {
        var inputTag = this.getElementsByTagName('input')[0],
            spanTag = this.getElementsByTagName('span')[0];

        spanTag.style.display = (inputTag.value !== '') ? 'none' : 'inline-block';
    },

    /**
     * Bind event to element
     * @param  {HTMLElement} target - tag for binding
     * @param  {String} eventType - event type
     * @param  {Function} callback - event handler function
     * @private
     */
    _bindEvent: function(target, eventType, callback) {
        if (target.addEventListener) {
            target.addEventListener(eventType, callback, false);
        } else if (target.attachEvent) {
            target.attachEvent('on' + eventType, callback);
        } else {
            target['on' + eventType] = callback;
        }
    }
});

module.exports = Placeholder;
