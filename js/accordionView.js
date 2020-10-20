define([
  'core/js/adapt',
  'core/js/views/componentView'
], function(Adapt, ComponentView) {

  class AccordionView extends ComponentView {

    events() {
      return {
        'click .js-toggle-item': 'onClick'
      };
    }

    preRender() {

      this.checkIfResetOnRevisit();

      this.model.resetActiveItems();

      this.listenTo(this.model.get('_children'), {
        'change:_isActive': this.onItemsActiveChange,
        'change:_isVisited': this.onItemsVisitedChange
      });

      // Listen for text change on audio extension
      this.listenTo(Adapt, "audio:changeText", this.replaceText);
    }

    postRender() {
      this.setReadyStatus();

      if (this.model.get('_setCompletionOn') === 'inview') {
        this.setupInviewCompletion();
      }

      if (Adapt.audio && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
        this.replaceText(Adapt.audio.textSize);
      }
    }

    checkIfResetOnRevisit() {
      const isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }

    onClick(event) {
      this.model.toggleItemsState($(event.currentTarget).parent().data('index'));
    }

    onItemsActiveChange(item, isActive) {
      this.toggleItem(item, isActive);
    }

    onItemsVisitedChange(item, isVisited) {
      if (!isVisited) return;

      const $item = this.getItemElement(item);

      $item.children('.accordion__item-btn').addClass('is-visited');
    }

    toggleItem(item, shouldExpand) {
      const $item = this.getItemElement(item);
      const $body = $item.children('.accordion__item-content').stop(true, true);

      $item.children('.accordion__item-btn')
        .toggleClass('is-selected is-open', shouldExpand)
        .toggleClass('is-closed', !shouldExpand)
        .attr('aria-expanded', shouldExpand);

      if (!shouldExpand) {
        $body.slideUp(this.model.get('_toggleSpeed'));
        this.stopAudio();
        return;
      }

      $body.slideDown(this.model.get('_toggleSpeed'));
      this.playAudio(item);
    }

    getItemElement(item) {
      const index = item.get('_index');

      return this.$('.accordion__item').filter(`[data-index="${index}"]`);
    }

    playAudio(item) {
      if (Adapt.audio && this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
          // Reset onscreen id
          Adapt.audio.audioClip[this.model.get('_audio')._channel].onscreenID = "";
          // Trigger audio
          Adapt.trigger('audio:playAudio', item.get('_audio').src, this.model.get('_id'), this.model.get('_audio')._channel);
        }
    }

    stopAudio() {
        if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._isEnabled && this.model.has('_audio') && this.model.get('_audio')._isEnabled) {
            Adapt.trigger('audio:pauseAudio', this.model.get("_audio")._channel);
        }
    }

    // Reduced text
    replaceText(value) {
        // If enabled
        if (Adapt.audio && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
            // Change each items title and body
            for (var i = 0; i < this.model.get('_items').length; i++) {
                if (value == 0) {
                    this.$('.accordion__item-title-inner').eq(i).html(this.model.get('_items')[i].title);
                    this.$('.accordion__item-body-inner').eq(i).html(this.model.get('_items')[i].body);
                } else {
                    this.$('.accordion__item-title-inner').eq(i).html(this.model.get('_items')[i].titleReduced);
                    this.$('.accordion__item-body-inner').eq(i).html(this.model.get('_items')[i].bodyReduced);
                }
            }
        }
    }
  }

  AccordionView.template = 'accordion-audio';

  return AccordionView;

});
