// This file is part of Moodle - http://moodle.org/
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
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Tiny Replace translation hash.
 *
 * @module      tiny_translations/ui
 * @copyright   2023 Rajneel Totaram <rjnlfj@yahoo.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ContentTranslationsModal from 'tiny_translations/modal';
import ModalEvents from 'core/modal_events';
import {getUnusedHash} from './options';

export const handleAction = (editor) => {
    displayDialogue(editor);
};

/**
 * Get the template context for the dialogue.
 *
 * @param {Editor} editor
 * @param {object} data
 * @returns {object} data
 */
const getTemplateContext = (editor, data) => {
    return Object.assign({}, {
        elementid: editor.id,
    }, data);
};


const displayDialogue = async(editor, data = {}) => {
    const modal = await ContentTranslationsModal.create({
        templateContext: getTemplateContext(editor, data),
        large: true,
    });
    modal.show();

    const $root = modal.getRoot();
    $root.on(ModalEvents.save, (event, modal) => {
        handleOK(editor, modal, data);
    });
};

const handleOK = async(editor) => {
    replaceHash(editor);
};

const replaceHash = (editor) => {
    let initialcontent = editor.getContent();

    // Remove all translation span tags.
    initialcontent = removeTranslationHashElements(editor, initialcontent);

    editor.setContent(initialcontent);
    // Add the new translation span tag.
    insertTranslationHash(editor, getUnusedHash(editor));
};

/*
 * Create a translation span block, given a translation hash string.
 * The format is: <p class="translationhash"><span data-translationhash="xxxx"></span</p>
 */
const getTranslationHashBlock = (translationHash) => {
    const translationHashElement = document.createElement('span');
    translationHashElement.dataset.translationhash = translationHash;

    // Add a parent block with our own 'class' applied. Otherwise editor will add a <p> tag automatically.
    const parentBlock = document.createElement('p');
    parentBlock.setAttribute('class', 'translationhash');
    parentBlock.appendChild(translationHashElement);

    return parentBlock;
};

/*
 * Add the translation span block at the beginning of the content.
 */
export const insertTranslationHash = (editor, translationHash) => {
    const translationHashElement = getTranslationHashBlock(translationHash);
    editor.getBody().prepend(translationHashElement);

    return translationHashElement;
};

/*
 * Remove translation span tags.
 */
export const removeTranslationHashElements = (editor, content) => {
    const alltranslationhashregex =
        /(?:<p>|<p class="translationhash">)\s*<span\s*data-translationhash\s*=\s*['"]+([a-zA-Z0-9]+)['"]+\s*>\s*<\/span>\s*<\/p>/g;
    const emptyptagsregex = /<p\s*class="translationhash">\s*<\/p>/g;

    // Remove the translation span tags.
    content = content.replaceAll(alltranslationhashregex, "");

    // Remove any empty <p class="translationhash"> tags.
    content = content.replaceAll(emptyptagsregex, "");

    return content;
};

/*
 * Check if there is a translation span block in the content.
 */
export const findTranslationHashElements = (editor, content) => {
    const alltranslationhashregex =
        /(?:<p>|<p class="translationhash">)\s*<span\s*data-translationhash\s*=\s*['"]+([a-zA-Z0-9]+)['"]+\s*>\s*<\/span>\s*<\/p>/g;

    if (alltranslationhashregex.exec(content) !== null) {
        return true;
    }

    return false;
};

/*
 * Check if the editor content is "empty".
 *
 * Content is empty if it only contains a translation hash element and an empty <p> tags.
 */
export const isEmptyContent = (editor, content) => {
    const regex =
    /(?:<p>|<p class="translationhash">)\s*<span\s*data-translationhash\s*=\s*['"]+([a-zA-Z0-9]+)['"]+\s*>\s*<\/span>\s*<\/p>\s*<p><\/p>/;

    const match = regex.test(content);

    return match;
};

export const handleOnPaste = (editor, args) => {
    args.content = removeTranslationHashElements(editor, args.content);
};
