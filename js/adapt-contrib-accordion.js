define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var Accordion = ComponentView.extend({

        events: {
            'click .accordion-item-title': 'toggleItem'
        },

        preRender: function() {
            // Checks to see if the accordion should be reset on revisit
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.setReadyStatus();
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
            this.$('.accordion-item-body').stop(true, true).slideUp(200);

            if (!$(event.currentTarget).hasClass('selected')) {
                this.$('.accordion-item-title').removeClass('selected');
                var body = $(event.currentTarget).addClass('selected visited').siblings('.accordion-item-body').slideToggle(200, function() {
                    $(body).a11y_focus();
                });
                ///// Audio /////
                this.stopAudio();
                ///// End of Audio /////
                this.$('.accordion-item-title-icon').removeClass('icon-minus').addClass('icon-plus');
                $('.accordion-item-title-icon', event.currentTarget).removeClass('icon-plus').addClass('icon-minus');

                if ($(event.currentTarget).hasClass('accordion-item')) {
                    this.setVisited($(event.currentTarget).index());
                } else {
                    this.setVisited($(event.currentTarget).parent('.accordion-item').index());
                }
            } else {
                this.$('.accordion-item-title').removeClass('selected');
                $(event.currentTarget).removeClass('selected');
                $('.accordion-item-title-icon', event.currentTarget).removeClass('icon-minus').addClass('icon-plus');

                ///// Audio /////
                this.stopAudio();
                ///// End of Audio /////
            }
            // set aria-expanded value
            if ($(event.currentTarget).hasClass('selected')) {
                $('.accordion-item-title').attr('aria-expanded', false);
                $(event.currentTarget).attr('aria-expanded', true);
            } else {
                $(event.currentTarget).attr('aria-expanded', false);
            }
        },

        ///// Audio /////
        stopAudio: function() {
            if (this.model.get('_audio')) {
                Adapt.trigger('audio:pauseAudio', this.model.get("_audio")._channel);
            }
        },
        ///// End of Audio /////

        setVisited: function(index) {
            var item = this.model.get('_items')[index];
            item._isVisited = true;
            this.checkCompletionStatus();

            ///// Audio /////
            if (this.model.get('_audio')) {
                // Determine which file to play
                if (Adapt.audio.audioClip[this.model.get('_audio')._channel].canPlayType('audio/ogg')) this.audioFile = item._audio.ogg;
                if (Adapt.audio.audioClip[this.model.get('_audio')._channel].canPlayType('audio/mpeg')) this.audioFile = item._audio.mp3;
                // Trigger audio
                Adapt.trigger('audio:playAudio', this.audioFile, this.model.get('_id'), this.model.get('_audio')._channel);
            }
            ///// End of Audio /////
        },

        getVisitedItems: function() {
            return _.filter(this.model.get('_items'), function(item) {
                return item._isVisited;
            });
        },

        checkCompletionStatus: function() {
            if (!this.model.get('_isComplete')) {
                if (this.getVisitedItems().length == this.model.get('_items').length) {
                    this.setCompletionStatus();
                }
            }
        }

    });

    Adapt.register('accordion', Accordion);

    return Accordion;

});
