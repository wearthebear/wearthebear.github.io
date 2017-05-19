(function ($) {
    "use strict";

    function awdMenu() {
        $(".menu-toggle").on('click', function (e) {
            $(this).toggleClass('opened');
            $("#awd-site-nav").toggleClass('active');
        });
    }

    ///** Background Animation **/

    var canvas = document.getElementById("awd-site-canvas");
    var ctx = canvas.getContext("2d");
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    var curves_array = [];
    var curve = function (abc1x, abc1y, abc2x, abc2y, x, y, abc1xvx, abc1xvy, abc1yvx, abc1yvy, abc2xvx, abc2xvy, abc2yvx, abc2yvy) {
        this.abc1x = abc1x;
        this.abc1y = abc1y;
        this.abc2x = abc2x;
        this.abc2y = abc2y;
        this.x = x;
        this.y = y;

        this.abc1xvx = abc1xvx;
        this.abc1xvy = abc1xvy;
        this.abc1yvx = abc1yvx;
        this.abc1yvy = abc1yvy;

        this.abc2xvx = abc2xvx;
        this.abc2xvy = abc2xvy;
        this.abc2yvx = abc2yvx;
        this.abc2yvy = abc2yvy;
    };


    function awdCanvasResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }


    function awdCanvasInit() {
        for (var i = 0; i < awd_bg_number_of_curves; i++) {
            var abc1x = Math.random() * canvas.width;
            var abc1y = Math.random() * canvas.height;
            var abc2x = Math.random() * canvas.width;
            var abc2y = Math.random() * canvas.height;
            var x = 0;
            var y = 0;

            var abc1xvx = Math.random() * 2 - 1;
            var abc1xvy = Math.random() * 2 - 1;

            var abc1yvx = Math.random() * 2 - 1;
            var abc1yvy = Math.random() * 2 - 1;

            var abc2xvx = Math.random() * 2 - 1;
            var abc2xvy = Math.random() * 2 - 1;

            var abc2yvx = Math.random() * 2 - 1;
            var abc2yvy = Math.random() * 2 - 1;


            curves_array.push(
                new curve(
                    abc1x, abc1y, abc2x, abc2y,
                    x, y,
                    abc1xvx, abc1xvy, abc1yvx, abc1yvy,
                    abc2xvx, abc2xvy, abc2yvx, abc2yvy
                )
            );
        }
    }


    function awdCanvasDraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = $("#awd-site-wrap").css('color');

        for (var i = 0; i < curves_array.length; i++) {

            ctx.beginPath();
            ctx.moveTo(-100, canvas.height + 100);
            ctx.bezierCurveTo(
                curves_array[i].abc1x, curves_array[i].abc1y,
                curves_array[i].abc2x, curves_array[i].abc2y,
                canvas.width + 100, curves_array[i].y - 100
            );
            ctx.stroke();

            if (curves_array[i].abc1x < 0 || curves_array[i].abc1x > canvas.width) {
                curves_array[i].abc1x -= curves_array[i].abc1xvx;
                curves_array[i].abc1xvx *= -1;
            }
            if (curves_array[i].abc1y < 0 || curves_array[i].abc1y > canvas.height) {
                curves_array[i].abc1y -= curves_array[i].abc1yvy;
                curves_array[i].abc1yvy *= -1;
            }

            if (curves_array[i].abc2x < 0 || curves_array[i].abc2x > canvas.width) {
                curves_array[i].abc2x -= curves_array[i].abc2xvx;
                curves_array[i].abc2xvx *= -1;
            }
            if (curves_array[i].abc2y < 0 || curves_array[i].abc2y > canvas.height) {
                curves_array[i].abc2y -= curves_array[i].abc2yvy;
                curves_array[i].abc2yvy *= -1;
            }

            curves_array[i].abc1y += curves_array[i].abc1yvy;
            curves_array[i].abc1x += curves_array[i].abc1xvx;
            curves_array[i].abc2x += curves_array[i].abc2xvx;
        }
        requestAnimFrame(awdCanvasDraw);
    }

    function awdCanvas() {
        awdCanvasResize();
        awdCanvasInit();
        awdCanvasDraw();
    }

    ///** ANIMATE ELEMENTS **/

    function awdAnimate(state) {
        if (!$('body').hasClass('mobile')) {

            var elements;

            if (state == "active") {
                elements = $('.start .active .animated');
            } else {
                elements = $('.start .animated');
            }

            elements.each(function () {
                var that = $(this);
                if (!that.hasClass('visible')) {
                    if (that.data('animation-delay')) {
                        setTimeout(function () {
                            that.addClass(that.data('animation') + " visible");
                        }, that.data('animation-delay'));
                    } else {
                        that.addClass(that.data('animation') + " visible");
                    }
                }
            });

        }
    }

    ///** CONTENT SLIDER **/

    function awdContentSlider() {
        $('.slide-item').first().addClass('active');

        var bg = $('#bg');
        var menu = $('#awd-site-nav');
        var menu_link = menu.find('a');

        menu_link.on('click', function (e) {
            e.preventDefault();
            
            var active_slide = $(this).data('slide');
            var active_bg = bg.find('.bg-' + active_slide);

            bg.find('.awd-site-bg').removeClass('active');
            $('#awd-site-wrap').removeClass('bg-' + menu.find('a.active').data('slide')).addClass("bg-" + active_slide);
            active_bg.css({
                "left": $(this).offset().left + ($(this).outerWidth() / 2) - 50,
                "top": $(this).offset().top + ($(this).outerHeight() / 2) - 50
            });
            active_bg.addClass('active');

            if ($(window).width() < 769) {
                menu.removeClass('active');
                $(".menu-toggle").removeClass('opened');
            }

            if (!$(this).hasClass('active')) {

                menu_link.removeClass('active');
                $(this).addClass('active');

                var active_slide_content = $('.slide-item[data-slide-id=' + active_slide + ']');
                if (active_slide_content) {
                    $('.slide-item').removeClass('active');
                    active_slide_content.addClass('active');

                    if (active_slide_content.hasClass('active')) {
                        awdAnimate('active');
                    }

                }
            }

        });

        //* go to current slide */

        $('a.go-slide').on('click', function (e) {
            e.preventDefault();
            var active_slide = $(this).data('slide');

            menu.find('a[data-slide=' + active_slide + ']').trigger("click");

        });

    }

    ///** COUNTDOWN **/

    function awdCountdown() {

        $('#clock').countdown(awd_countdown_date).on('update.countdown', function (event) {
            var $this = $(this).html(event.strftime(''
                + '<div class="counter-container"><div class="counter-date"><div class="counter-box first"><span>dia%!d</span><div class="number">%-D</div></div></div>'
                + '<div class="counter-time"><div class="counter-box"><div class="number">%H:%M</div></div>'
                + '<div class="counter-box last"><div class="number">%S</div><span>segundos</span></div></div></div>'
            ));
        });
    }

    ///** EMAIL VALIDATION **/

    function awdFormValidation(email_address) {
        var pattern = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        return pattern.test(email_address);
    }


    ///** SUBSCRIBE FORM **/

    function awdSubscribe() {
        if (awd_subscribe == 1 || awd_subscribe == 2) {
            awdSubscribeForm();
        } else if (awd_subscribe == 3) {
            awdMailchimp();
        }
    }

    //* mailchimp */

    function awdMailchimp() {

        var subscribe_form = $('#subscribe-form');
        var subscribe_email = $('#subscribe-email');

        function awdMailchimpStatus(resp) {

            if (resp.result === 'error') {
                subscribe_email.focus();
                $('.subscribe-notice').addClass('visible');
            }
            else if (resp.result === 'success') {
                subscribe_form[0].reset();
                subscribe_email.blur();
                $('.subscribe-notice').addClass('visible');
            }
        }

        subscribe_form.ajaxChimp({
            callback: awdMailchimpStatus,
            language: 'eng',
            type: 'POST',
            url: awd_mailchimp_url
        });
    }

    //* php */

    function awdSubscribeForm() {

        var subscribe_form = $('#subscribe-form');
        var subscribe_email = $('#subscribe-email');
        var subscribe_url;
        if (awd_subscribe == 1) {
            subscribe_url = 'assets/php/to-mail.php';
        } else if (awd_subscribe == 2) {
            subscribe_url = 'assets/php/to-file.php';
        }

        subscribe_email.prop('type', 'text');

        subscribe_form.on('submit', function (e) {

            var subscribe_email_val = subscribe_email.val();
            var subscribe_notice = $('.subscribe-notice');
            var subscribe_button = subscribe_form.find('button[type="submit"]');

            e.preventDefault();

            subscribe_button.prop('disabled', true);

            if (!awdFormValidation(subscribe_email_val)) {
                subscribe_notice.stop(true).hide().addClass('visible').html(awd_subscribe_error).fadeIn();
                subscribe_button.prop('disabled', false);
                subscribe_email.focus();
            }
            else {
                $.ajax({
                    type: 'POST',
                    url: subscribe_url,
                    data: {
                        email: subscribe_email_val,
                        emailAddress: awd_subscribe_email
                    },
                    success: function () {
                        subscribe_notice.stop(true).hide().addClass('visible').html(awd_subscribe_success).fadeIn();

                        subscribe_button.prop('disabled', false);
                        subscribe_form[0].reset();
                        subscribe_email.blur();

                    }
                });
            }
            return false;

        });

    }


    ///** CONTACT FORM **/

    function awdContactForm() {

        var contact_form = $('#contact-form');

        contact_form.on('submit', function (e) {

            var input = $(this).find('input, textarea');
            var required_fields = $(this).find('.required');
            var email_field = $('.contact-form-email');
            var contact_name_val = $('.contact-form-name').val();
            var contact_subject_val = $('.contact-form-subject').val();
            var contact_email_val = email_field.val();
            var contact_message_val = $('.contact-form-message').val();
            var contact_notice = $('.contact-notice');

            e.preventDefault();

            if (contact_name_val == '' || contact_email_val == '' || contact_message_val == '' || contact_subject_val == '') {
                contact_notice.stop(true).hide().html(awd_contact_input_error).fadeIn();
                required_fields.each(function () {
                    $(this).addClass("input-error");
                });

            } else if (!awdFormValidation(contact_email_val)) {
                contact_notice.stop(true).hide().html(awd_contact_email_error).fadeIn();
                email_field.addClass("input-error");
                $('#contact-email').focus();
            }
            else {
                $.ajax({
                    type: 'POST',
                    url: 'assets/php/contact.php',
                    data: {
                        name: contact_name_val,
                        email: contact_email_val,
                        message: contact_message_val,
                        subject: contact_subject_val,
                        emailAddress: awd_contact_email
                    },
                    success: function () {
                        contact_notice.stop(true).hide().html(awd_contact_success).fadeIn();
                        contact_form[0].reset();
                        input.blur();
                    }
                });
            }
            return false;

        });

    }

    ///** CUSTOM SCROLL **/

    function awdScrollbar() {

        $('.sections-block').perfectScrollbar({
            suppressScrollX: true
        });

    }


    ///** DOCUMENT READY **/

    $(document).on('ready', function () {

        if (awd_bordered === true) {
            $('body').addClass('bordered');
        }

        awdMenu();
        awdContentSlider();

        if (awd_countdown === true) {
            awdCountdown();
        }

        if (awd_animated === true) {
            $('body').addClass('start');
            awdAnimate();
        }
        awdSubscribe();
        awdContactForm();
        awdScrollbar();

        if (awd_bg_animated === true) {
            awdCanvas();
            $(window).resize(function () {
                awdCanvasResize();
            });
        }


    });


})(jQuery);