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
 * Commands helper for the Moodle tiny_translations plugin.
 *
 * @module      tiny_translations/commands
 * @copyright   2023 Andrew Lyons <andrew@nicols.co.uk>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {get_string as getString} from 'core/str';
import {handleAction, insertTranslationHash, findTranslationHashElements} from './ui';
import {
    component,
    buttonName,
    icon,
} from './common';
import {getUnusedHash} from './options';

/**
 * Get the setup function for the buttons.
 *
 * This is performed in an async function which ultimately returns the registration function as the
 * Tiny.AddOnManager.Add() function does not support async functions.
 *
 * @returns {function} The registration function to call within the Plugin.add function.
 */
export const getSetup = async() => {
    const [
        buttonText,
        buttonImage,
    ] = await Promise.all([
        getString('buttontitle', component),
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        // Translations editor should not add translation spans.
        if (editor.getElement().id === 'id_substitutetext_editor') {
            return;
        }

        // Register the Icon.
        editor.ui.registry.addIcon(icon, buttonImage.html);

        // Register the Menu Button.
        editor.ui.registry.addToggleButton(buttonName, {
            icon,
            tooltip: buttonText,
            onAction: () => handleAction(editor),
        });

        let translationHash;
        let translationHashElement;

        // Add a handler to set up the translation hash when the content is initialised.
        editor.on('init', () => {
            const newTranslationHash = getUnusedHash(editor);

            if (!newTranslationHash) {
                // There is no translation hash to use for this field.
                return;
            }

            let translationHashSpan;

            translationHashSpan = editor.getBody().querySelector('[data-translationhash]');

            if (translationHashSpan) {
                // Ensure that the hash span element is wrapped in a <p> tag, with appropriate 'class' applied.
                if (!translationHashSpan.parentElement.classList.contains('translationhash')) {
                    // The translation span tag is on its own.
                    // This is old syntax and we should convert it.
                    translationHash = translationHashSpan?.dataset.translationhash;

                    // Strip out the old translation span element.
                    translationHashSpan.remove();

                    // Add the translation span within a <p> tag.
                    translationHashElement = insertTranslationHash(editor, translationHash);
                }

                translationHashElement = translationHashSpan.parentElement;
                translationHash = translationHashSpan?.dataset.translationhash;
            } else {
                // No translation span tag found, so add one.
                translationHashElement = insertTranslationHash(editor, newTranslationHash);
                translationHash = translationHashElement?.firstElementChild.dataset.translationhash;
            }
        });

        // Add a handler to unset the content if it only contains the translation hash.
        editor.on('submit', () => {
            // Before saving, check that content has a translation span tag.
            // If one doesn't exit:
            //     Add back the one that was originally there, OR
            //     Add a new translation span tag.
            if (!findTranslationHashElements(editor, editor.getContent())) {
                // No translation span tag found, so add one.
                translationHashElement = insertTranslationHash(editor, translationHash);
            }

            if (editor.getContent() === translationHashElement.outerHTML) {
                editor.setContent('');
            }

            // We must call save here to ensure that the most recent content is saved to the textarea.
            editor.save();
        });
    };
};
