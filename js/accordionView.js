define([
    'core/js/adapt',
    'core/js/views/componentView'
], function(Adapt, ComponentView) {

    var AccordionView = ComponentView.extend({

        events: {
            'click .accordion-item-title': 'onClick'
        },

        preRender: function() {
            this.checkIfResetOnRevisit();

            this.model.resetActiveItems();

            this.listenTo(this.model.get('_children'), {
                'change:_isActive': this.onItemsActiveChange,
                'change:_isVisited': this.onItemsVisitedChange
            });

            // Listen for text change on audio extension
            this.listenTo(Adapt, "audio:changeText", this.replaceText);
        },

        postRender: function() {
            this.setReadyStatus();

            if (this.model.get('_setCompletionOn') === 'inview') {
                this.setupInviewCompletion();
            }

            if (Adapt.audio && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
                this.replaceText(Adapt.audio.textSize);
            }
        },

        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        onClick: function(event) {
            event.preventDefault();

            this.model.toggleItemsState($(event.currentTarget).parent().data('index'));
        },

        onItemsActiveChange: function(item, isActive) {
            this.toggleItem(item, isActive);
        },

        onItemsVisitedChange: function(item, isVisited) {
            if (!isVisited) return;

            var $item = this.getItemElement(item);

            $item.children('.accordion-item-title').addClass('visited');
        },

        toggleItem: function(item, shouldExpand) {
            var $item = this.getItemElement(item);
            var $body = $item.children('.accordion-item-body').stop(true, true);

            $item.children('.accordion-item-title')
                .toggleClass('selected', shouldExpand)
                .attr('aria-expanded', shouldExpand);
            $item.find('.accordion-item-title-icon')
                .toggleClass('icon-plus', !shouldExpand)
                .toggleClass('icon-minus', shouldExpand);

            if (!shouldExpand) {
                $body.slideUp(this.model.get('_toggleSpeed'));
                this.stopAudio();
                return;
            }

            $body.slideDown(this.model.get('_toggleSpeed'));

            this.playAudio(item);
        },

        getItemElement: function(item) {
            var index = item.get('_index');

            return this.$('.accordion-item').filter('[data-index="' + index +'"]');
        },

        playAudio: function(item) {
          if (Adapt.audio && this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
              // Reset onscreen id
              Adapt.audio.audioClip[this.model.get('_audio')._channel].onscreenID = "";
              // Trigger audio
              Adapt.trigger('audio:playAudio', item.get('_audio').src, this.model.get('_id'), this.model.get('_audio')._channel);
            }
        },

        stopAudio: function() {
            if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._isEnabled && this.model.has('_audio') && this.model.get('_audio')._isEnabled) {
                Adapt.trigger('audio:pauseAudio', this.model.get("_audio")._channel);
            }
        },

        // Reduced text
        replaceText: function(value) {
            // If enabled
            if (Adapt.audio && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
                // Change each items title and body
                for (var i = 0; i < this.model.get('_items').length; i++) {
                    if (value == 0) {
                        this.$('.accordion-item-title-text').eq(i).html(this.model.get('_items')[i].title);
                        this.$('.accordion-item-body-inner').eq(i).html(this.model.get('_items')[i].body);
                    } else {
                        this.$('.accordion-item-title-text').eq(i).html(this.model.get('_items')[i].titleReduced);
                        this.$('.accordion-item-body-inner').eq(i).html(this.model.get('_items')[i].bodyReduced);
                    }
                }
            }
        }

    });

    return AccordionView;

});
