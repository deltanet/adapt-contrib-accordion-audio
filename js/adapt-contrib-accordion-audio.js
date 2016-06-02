define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var AccordionAudio = ComponentView.extend({

        events: {
            'click .accordion-item-title': 'toggleItem'
        },

        preRender: function() {
            // Checks to see if the accordion should be reset on revisit
            this.checkIfResetOnRevisit();

            // Listen for text change on audio extension
            this.listenTo(Adapt, "audio:changeText", this.replaceText);
        },

        postRender: function() {
            this.setReadyStatus();

            if (Adapt.config.get('_audio') && Adapt.config.get('_audio')._isReducedTextEnabled && this.model.get('_reducedText') && this.model.get('_reducedText')._isEnabled) {
                this.replaceText(Adapt.audio.textSize);
            }
<<<<<<< HEAD:js/adapt-contrib-accordion.js
=======

            // Check if completion is required, if not then set status to completed
            if (!this.model.get('_isCompletionRequired')) {
                this.setCompletionStatus();
            }
>>>>>>> refs/remotes/origin/issue/#2:js/adapt-contrib-accordion-audio.js
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
            _.delay(_.bind(function() {
                Adapt.trigger('device:resize');
            }, this), 300);
        },

        ///// Audio /////
        stopAudio: function() {
            if (this.model.has('_audio') && this.model.get('_audio')._isEnabled) {
                Adapt.trigger('audio:pauseAudio', this.model.get("_audio")._channel);
            }
        },
        ///// End of Audio /////

        setVisited: function(index) {
            var item = this.model.get('_items')[index];
            item._isVisited = true;
            this.checkCompletionStatus();

            ///// Audio /////
            if (this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
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
            if (Adapt.config.get('_audio') && Adapt.config.get('_audio')._isReducedTextEnabled && this.model.get('_reducedText') && this.model.get('_reducedText')._isEnabled) {
                // Change component title and body
                if(value == 0) {
                    if (this.model.get('displayTitle')) {
                        this.$('.component-title-inner').html(this.model.get('displayTitle')).a11y_text();
                    }
                    if (this.model.get('body')) {
                        this.$('.component-body-inner').html(this.model.get('body')).a11y_text();
                    }
                } else {
                    if (this.model.get('displayTitleReduced')) {
                        this.$('.component-title-inner').html(this.model.get('displayTitleReduced')).a11y_text();
                    }
                    if (this.model.get('bodyReduced')) {
                        this.$('.component-body-inner').html(this.model.get('bodyReduced')).a11y_text();
                    }
                }
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
