import { FutureActionPanelQuickEdit } from './components';
import { createStore } from './data';
import { getFieldValueByName, getFieldValueByNameAsBool } from './utils';
import { createRoot } from '@wp/element';
import { select, dispatch } from '@wp/data';
import { inlineEditPost } from "@window";
import {
    postType,
    isNewPost,
    actionsSelectOptions,
    is12Hour,
    startOfWeek,
    strings,
    taxonomyName,
    nonce
} from "@config/quick-edit";

const storeName = 'publishpress-future/future-action-quick-edit';
const delayToUnmountAfterSaving = 1000;

// We create a copy of the WP inline edit post function
const wpInlineEdit = inlineEditPost.edit;
const wpInlineEditRevert = inlineEditPost.revert;

const getPostId = (id) => {
    // If id is a string or a number, return it directly
    if (typeof id === 'string' || typeof id === 'number') {
        return id;
    }

    // Otherwise, assume it's an HTML element and extract the post ID
    const trElement = id.closest('tr');
    const trId = trElement.id;
    const postId = trId.split('-')[1];

    return postId;
}

/**
 * We override the function with our own code so we can detect when
 * the inline edit row is displayed to recreate the React component.
 */
inlineEditPost.edit = function (id) {
    // Call the original WP edit function.
    wpInlineEdit.apply(this, arguments);

    const postId = getPostId(id);
    const enabled = getFieldValueByNameAsBool('enabled', postId);
    const action = getFieldValueByName('action', postId);
    const date = getFieldValueByName('date', postId);
    const terms = getFieldValueByName('terms', postId);
    const taxonomy = getFieldValueByName('taxonomy', postId);

    const termsList = terms.split(',');

    // if store exists, update the state. Otherwise, create it.
    if (select(storeName)) {
        dispatch(storeName).setEnabled(enabled);
        dispatch(storeName).setAction(action);
        dispatch(storeName).setDate(date);
        dispatch(storeName).setTaxonomy(taxonomy);
        dispatch(storeName).setTerms(termsList);
    } else {
        createStore({
            name: storeName,
            defaultState: {
                autoEnable: enabled,
                action: action,
                date: date,
                taxonomy: taxonomy,
                terms: termsList,
            }
        });
    }

    const saveButton = document.querySelector('.inline-edit-save .save');
    if (saveButton) {
        saveButton.onclick = function() {
            setTimeout(() => {
                root.unmount();
            }, delayToUnmountAfterSaving);
        };
    }

    const container = document.getElementById("publishpress-future-quick-edit");
    const root = createRoot(container);

    root.render(
        <FutureActionPanelQuickEdit
            storeName={storeName}
            postType={postType}
            isNewPost={isNewPost}
            actionsSelectOptions={actionsSelectOptions}
            is12Hour={is12Hour}
            startOfWeek={startOfWeek}
            strings={strings}
            taxonomyName={taxonomyName}
            nonce={nonce}
        />
    );

    inlineEditPost.revert = function () {
        root.unmount();

        // Call the original WP revert function.
        wpInlineEditRevert.apply(this, arguments);
    };
};
