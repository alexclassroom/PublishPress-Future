import { FutureActionPanel } from "./";
import { select } from "&wp.data";

export const FutureActionPanelClassicEditor = (props) => {
    const browserTimezoneOffset = new Date().getTimezoneOffset();

    const getElementByName = (name) => {
        return document.getElementsByName(name)[0];
    }

    const onChangeData = (attribute, value) => {
        const store = select(props.storeName);

        getElementByName('future_action_enabled').value = store.getEnabled() ? 1 : 0;
        getElementByName('future_action_action').value = store.getAction();
        getElementByName('future_action_date').value = store.getDate();
        getElementByName('future_action_terms').value = store.getTerms().join(',');
        getElementByName('future_action_taxonomy').value = store.getTaxonomy();
    }

    const getTermsFromElementByName = (name) => {
        const element = getElementByName(name);
        if (!element) {
            return [];
        }

        let terms = element.value.split(',');

        if (terms.length === 1 && terms[0] === '') {
            terms = [];
        }

        return terms.map(term => parseInt(term));
    }

    const getElementValueByName = (name) => {
        const element = getElementByName(name);
        if (!element) {
            return '';
        }

        return element.value;
    }

    const data = {
        enabled: getElementValueByName('future_action_enabled') === '1',
        action: getElementValueByName('future_action_action'),
        date: getElementValueByName('future_action_date'),
        terms: getTermsFromElementByName('future_action_terms'),
        taxonomy: getElementValueByName('future_action_taxonomy'),
    };

    return (
        <div className={'post-expirator-panel'}>
            <FutureActionPanel
                context={'classic-editor'}
                postType={props.postType}
                isCleanNewPost={props.isNewPost}
                actionsSelectOptions={props.actionsSelectOptions}
                enabled={data.enabled}
                calendarIsVisible={true}
                action={data.action}
                date={data.date}
                terms={data.terms}
                taxonomy={data.taxonomy}
                taxonomyName={props.taxonomyName}
                onChangeData={onChangeData}
                is12Hour={props.is12Hour}
                timeFormat={props.timeFormat}
                startOfWeek={props.startOfWeek}
                storeName={props.storeName}
                strings={props.strings} />
        </div>
    );
};
