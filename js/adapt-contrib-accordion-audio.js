define([
  'core/js/adapt',
  './accordionModel',
  './accordionView'
], function(Adapt, AccordionAudioModel, AccordionAudioView) {

  return Adapt.register('accordion-audio', {
    model: AccordionAudioModel,
    view: AccordionAudioView
  });

});
