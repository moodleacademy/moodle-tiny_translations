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
 * Tiny tiny_translations for Moodle.
 *
 * @module      tiny_translations/configuration
 * @copyright   2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {component as buttonName} from './common';
import {addToolbarButton} from 'editor_tiny/utils';
import {handleOnPaste} from './ui';

// eslint-disable-next-line camelcase
const getValidElements = ({extended_valid_elements = ''}) => {
    // The span must have both attributes, otherwise TinyMCE will see it as empty, and will remove it.
    const ignoredValue = 'span[*]';
    // eslint-disable-next-line camelcase
    if (extended_valid_elements) {
        // eslint-disable-next-line camelcase
        return `${extended_valid_elements},${ignoredValue}`;
    }

    return ignoredValue;
};

export const configure = (instanceConfig) => {
    return {
        // eslint-disable-next-line camelcase
        extended_valid_elements: getValidElements(instanceConfig),
        toolbar: addToolbarButton(instanceConfig.toolbar, 'content', buttonName),
        // eslint-disable-next-line camelcase
        paste_preprocess: (editor, args) => {
            handleOnPaste(editor, args);
        }
    };
};
