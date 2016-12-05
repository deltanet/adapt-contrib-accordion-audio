define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var AccordionAudio = ComponentView.extend({

        events: {
            'click .accordion-item-title': 'toggleItem'
        },

        toggleSpeed: 200,

        preRender: function() {
            // Checks to see if the accordion should be reset on revisit
            this.checkIfResetOnRevisit();

            // Listen for text change on audio extension
            this.listenTo(Adapt, "audio:changeText", this.replaceText);
        },

        postRender: function() {
            this.setReadyStatus();

            if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
                this.replaceText(Adapt.audio.textSize);
            }
        },

        // Used to check if the accordion should reset on revisit
        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }

            _.each(this.model.get('_items'), function(item) {
                item._isVisited = false;
            });
        },

        toggleItem: function(event) {
            event.preventDefault();

            var $toggleButton = $(event.currentTarget);
            var $accordionItem = $toggleButton.parent('.accordion-item');
            var isCurrentlyExpanded = $toggleButton.hasClass('selected');

            if (this.model.get('_shouldCollapseItems') === false) {
                // Close and reset the selected Accordion item only
                this.closeItem($accordionItem);
            } else {
                // Close and reset all Accordion items
                var allAccordionItems = this.$('.accordion-item');
                var count = allAccordionItems.length;
                for (var i = 0; i < count; i++) {
                    this.closeItem($(allAccordionItems[i]));
                }
            }

            if (!isCurrentlyExpanded) {
                this.openItem($accordionItem);
            }
        },

        closeItem: function($itemEl) {
            if (!$itemEl) {
                return false;
            }

            ///// Audio /////
            this.stopAudio();
            ///// End of Audio /////

            var $body = $('.accordion-item-body', $itemEl).first();
            var $button = $('button', $itemEl).first();
            var $icon = $('.accordion-item-title-icon', $itemEl).first();

            $body.stop(true, true).slideUp(this.toggleSpeed);
            $button.removeClass('selected');
            $button.attr('aria-expanded', false);
            $icon.addClass('icon-plus');
            $icon.removeClass('icon-minus');
        },

        openItem: function($itemEl) {
            if (!$itemEl) {
                return false;
            }

            var $body = $('.accordion-item-body', $itemEl).first();
            var $button = $('button', $itemEl).first();
            var $icon = $('.accordion-item-title-icon', $itemEl).first();

            $body = $body.stop(true, true).slideDown(this.toggleSpeed, function() {
                $body.a11y_focus();
            });

            $button.addClass('selected');
            $button.attr('aria-expanded', true);

            this.setVisited($itemEl.index());
            $button.addClass('visited');

            $icon.removeClass('icon-plus');
            $icon.addClass('icon-minus');
        },

        ///// Audio /////
        stopAudio: function() {
            if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._isEnabled && this.model.has('_audio') && this.model.get('_audio')._isEnabled) {
                Adapt.trigger('audio:pauseAudio', this.model.get("_audio")._channel);
            }
        },
        ///// End of Audio /////

        setVisited: function(index) {
            var item = this.model.get('_items')[index];
            item._isVisited = true;
            this.checkCompletionStatus();

            ///// Audio /////
            if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._isEnabled && this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
              // Reset onscreen id
              Adapt.audio.audioClip[this.model.get('_audio')._channel].onscreenID = "";
              // Trigger audio
              Adapt.trigger('audio:playAudio', item._audio.src, this.model.get('_id'), this.model.get('_audio')._channel);
            }
            ///// End of Audio /////
        },

        getVisitedItems: function() {
            return _.filter(this.model.get('_items'), function(item) {
                return item._isVisited;
            });
        },

        checkCompletionStatus: function() {
            if (this.getVisitedItems().length == this.model.get('_items').length) {
                this.setCompletionStatus();
            }
        },

        // Reduced text
        replaceText: function(value) {
            // If enabled
            if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
                // Change each items title and body
                for (var i = 0; i < this.model.get('_items').length; i++) {
                    if(value == 0) {
                        this.$('.accordion-item-title-text').eq(i).html(this.model.get('_items')[i].title);
                        this.$('.accordion-item-body-inner').eq(i).html(this.model.get('_items')[i].body).a11y_text();
                    } else {
                        this.$('.accordion-item-title-text').eq(i).html(this.model.get('_items')[i].titleReduced);
                        this.$('.accordion-item-body-inner').eq(i).html(this.model.get('_items')[i].bodyReduced).a11y_text();
                    }
                }
            }
        }
    });

    Adapt.register('accordion-audio', AccordionAudio);

    return AccordionAudio;

});
