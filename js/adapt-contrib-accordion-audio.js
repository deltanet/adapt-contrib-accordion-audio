define([
    'core/js/adapt',
    './accordionModel',
    './accordionView'
], function(Adapt, AccordionModel, AccordionView) {

    return Adapt.register('accordion-audio', {
        model: AccordionModel,
        view: AccordionView
    });

});
