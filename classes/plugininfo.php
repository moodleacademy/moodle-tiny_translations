<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Tiny Translations plugin for Moodle.
 *
 * @package     tiny_translations
 * @copyright   2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_translations;

use context;
use editor_tiny\plugin;
use editor_tiny\plugin_with_configuration;

/**
 * Tiny Translations plugin.
 *
 * @package     tiny_translations
 * @copyright   2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class plugininfo extends plugin implements plugin_with_configuration {
    public static function get_plugin_configuration_for_context(
        context $context,
        array $options,
        array $fpoptions,
        ?\editor_tiny\editor $editor = null
    ): array {
        $unusedhash = md5(random_string(32));

        return [
            'unusedHash' => $unusedhash,
        ];
    }

    /**
     * Whether the plugin is enabled
     *
     * @param context $context The context that the editor is used within
     * @param array $options The options passed in when requesting the editor
     * @param array $fpoptions The filepicker options passed in when requesting the editor
     * @param editor $editor The editor instance in which the plugin is initialised
     * @return boolean
     */
    public static function is_enabled(
        context $context,
        array $options,
        array $fpoptions,
        ?\editor_tiny\editor $editor = null
    ): bool {
        // Users must have permission to replace translation hash.
        return has_capability('tiny/translations:replacehash', $context);
    }
}
