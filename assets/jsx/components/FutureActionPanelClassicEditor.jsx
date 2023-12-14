import { FutureActionPanel } from "./";

export const FutureActionPanelClassicEditor = (props) => {
    const { select } = wp.data;
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

    const data = {
        enabled: getElementByName('future_action_enabled').value === '1',
        action: getElementByName('future_action_action').value,
        date: getElementByName('future_action_date').value,
        terms: getElementByName('future_action_terms').value.split(',').map(term => parseInt(term)),
        taxonomy: getElementByName('future_action_taxonomy').value,
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
                startOfWeek={props.startOfWeek}
                storeName={props.storeName}
                strings={props.strings} />
        </div>
    );
};
