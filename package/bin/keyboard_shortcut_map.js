// Generated by CoffeeScript 1.4.0
(function() {
  "use strict";
  var KeyboardShortcutMap, exports,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  var exports = window;

  /*
   * Maps keyboard shortcuts to commands and their arguments.
  */


  KeyboardShortcutMap = (function() {
    /*
       * Returns the stringified name for the given keyboard shortcut.
       * @param {KeyboardEvent} e
    */

    KeyboardShortcutMap.getKeyCombination = function(e) {
      var name;
      name = [];
      if (e.ctrlKey) {
        name.push('Ctrl');
      }
      if (e.metaKey) {
        name.push('Meta');
      }
      if (e.altKey) {
        name.push('Alt');
      }
      if (e.shiftKey) {
        name.push('Shift');
      }
      name.push(e.which);
      return name.join('-');
    };

    /*
       * These keys can be mapped to hotkeys without needing a modifier key to be
       * down.
    */


    KeyboardShortcutMap.NO_MODIFIER_HOTKEYS = keyCodes.toKeyCode('PAGEUP', 'PAGEDOWN', 'CAPSLOCK', 'INSERT', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12');

    /*
       * These keys can be mapped to hotkeys without needing a modifier key to be
       * down, but only if there is no input entered.
    */


    KeyboardShortcutMap.NO_INPUT_HOTKEYS = [keyCodes.toKeyCode('TAB')];

    function KeyboardShortcutMap() {
      this._hotkeyMap = {};
      this._mapHotkeys();
    }

    /*
       * Returns the mapping of hotkeys to commands.
       * @param {Object.<string: {description: string, group: string,
       *     readableName: string, command: string, args: Array<Object>}>} hotkeys
    */


    KeyboardShortcutMap.prototype.getMap = function() {
      return this._hotkeyMap;
    };

    /*
       * Get the command for the given shortcut if it is valid.
       * @param {KeyboardEvent} shortcut
       * @param {boolean} hasInput True if the input DOM element has text.
       * @return {[string, Array.<Object>]} Returns the name of the command with its
       *     arguments
    */


    KeyboardShortcutMap.prototype.getMappedCommand = function(shortcut, hasInput) {
      var args, command, keyCombination;
      if (!this._isValidShortcut(shortcut, hasInput)) {
        return [];
      }
      keyCombination = KeyboardShortcutMap.getKeyCombination(shortcut);
      if (!this._isMapped(keyCombination)) {
        return [];
      }
      command = this._hotkeyMap[keyCombination].command;
      args = this._hotkeyMap[keyCombination].args;
      return [command, args];
    };

    /*
       * Returns true if the given keyboard input event is a valid keyboard shortcut.
       * @param {KeyboardEvent} shortcut
       * @param {boolean} hasInput True if the input DOM element has text.
       * @return {boolean}
    */


    KeyboardShortcutMap.prototype._isValidShortcut = function(keyEvent, hasInput) {
      var _ref, _ref1;
      if (keyEvent.metaKey || keyEvent.ctrlKey || keyEvent.altKey) {
        return true;
      } else if (_ref = keyEvent.which, __indexOf.call(KeyboardShortcutMap.NO_MODIFIER_HOTKEYS, _ref) >= 0) {
        return true;
      } else {
        return !hasInput && (_ref1 = keyEvent.which, __indexOf.call(KeyboardShortcutMap.NO_INPUT_HOTKEYS, _ref1) >= 0);
      }
    };

    /*
       * Returns true if the given shortcut has a command mapped to it.
       * @param {string} shortcutName
       * @return {boolean}
    */


    KeyboardShortcutMap.prototype._isMapped = function(keyCombination) {
      return keyCombination in this._hotkeyMap;
    };

    /*
       * Maps hotkeys to commands and their arguments.
       * Note: The modifier key order is important and must be consistant with
       * getKeyCombination().
       * * command: What command the hotkey maps to.
       * * group: What group of hotkeys the hotkey belongs to.
       * * description: A quick description of the command. The command name is used by default.
       *##
       * * args: What args should be passed in to the command.
       *##
    */


    KeyboardShortcutMap.prototype._mapHotkeys = function() {
      var windowNumber, _i;
      for (windowNumber = _i = 1; _i <= 9; windowNumber = ++_i) {
        this._addHotkey("Ctrl-" + windowNumber, {
          command: 'win',
          group: 'Ctrl-#',
          description: 'switch channels',
          args: [windowNumber]
        });
      }
      this._addHotkey('Ctrl-W', {
        command: 'part',
        description: 'close current channel/private chat'
      });
      this._addHotkey('Alt-S', {
        command: 'next-server'
      });
      this._addHotkey('Alt-DOWN', {
        command: 'next-room'
      });
      this._addHotkey('Alt-UP', {
        command: 'previous-room'
      });
      this._addHotkey('Alt-PAGEDOWN', {
        command: 'next-room'
      });
      this._addHotkey('Alt-PAGEUP', {
        command: 'previous-room'
      });
      return this._addHotkey('TAB', {
        command: 'reply',
        description: 'autocomplete or reply to last mention'
      });
    };

    /*
       * TODO: Implement the following commands:
       *
       *    @_addHotkey 'PAGEUP',
       *      command: 'pageup'
       *
       *    @_addHotkey 'PAGEDOWN',
       *      command: 'pageup'
       *
       *   @_addHotkey 'Ctrl-F',
       *     command: 'search'
       *
       *   @_addHotkey 'Ctrl-HOME',
       *     command: 'scroll-to-top'
       *
       *   @_addHotkey 'Ctrl-END',
       *     command: 'scroll-to-bottom'
    */


    KeyboardShortcutMap.prototype._addHotkey = function(keyCombination, description) {
      var hotkeyCode, _ref;
      hotkeyCode = this._getHotkeyCode(keyCombination);
      if ((_ref = description.args) == null) {
        description.args = [];
      }
      this._hotkeyMap[hotkeyCode] = description;
      this._hotkeyMap[hotkeyCode].readableName = keyCombination;
      if (description.description) {
        return this._hotkeyMap[hotkeyCode].description = description.description;
      } else {
        return this._hotkeyMap[hotkeyCode].description = description.command.replace(/-/g, ' ');
      }
    };

    /*
       * Convert a readable key combination into its key code value.
       * (e.g. 'Alt-S' becomes 'Alt-115').
    */


    KeyboardShortcutMap.prototype._getHotkeyCode = function(keyCombination) {
      var char, parts;
      parts = keyCombination.split('-');
      char = parts[parts.length - 1];
      parts[parts.length - 1] = keyCodes.toKeyCode(char);
      return parts.join('-');
    };

    return KeyboardShortcutMap;

  })();

  exports.KeyboardShortcutMap = KeyboardShortcutMap;

}).call(this);
