( function($){

    class DynamicSearchableSelect {

        constructor( options = {}, superCall = false )
        {
            if( superCall === false ){
                this.namespace = options.namespace || null;
                this.parentElement = null;
                this.savedButtonElement = null;
                this.selectedCallback = {};
                this.selectedValue = this._setSelectedValue();

                this.olStr = this.namespaceId('options-list');
                this.sbStr = this.namespaceId('select-button');
                this.slcStr = this.namespaceId('select-list-container');
                this.slsStr = this.namespaceId('select-list-search');

                this.clickEvent();
                this.escapeEvent();
            }

            if( Object.keys( options ).length > 0 ){
                this.buttonText = options.button_text || 'Click to Select';
                this.parentElement = options.parent_element || $this.slcStr;
                this.placeholder = options.search_placeholder ||
                    "Enter Search Term(s)";
                this.selectedCallback = this.setSelectedCallback(
                    options.selected_callback
                );
                this.ssObject = {
                    init_elements: {
                        button: null,
                        container: null,
                        list: null,
                        search: null,
                        span: null
                    },
                    options: []
                };
                this.initializeSearchable();
            }
        }

        _resetSelectedValue()
        {
            return this._setSelectedValue();
        }

        _setSelectedValue()
        {
            return({
                text: null,
                value: null
            });
        }

        setSelectedCallback( cb ){
            var returnVal = null;

            if([undefined, null, false].includes(cb))
                return {};

            return cb;
        }

        namespaceId( str )
        {
            if( ! [undefined, null].includes( this.namespace  ) )
                if( typeof this.namespace == 'string' )
                    if( this.namespace.length > 0 )
                        return `${this.namespace}-${str}`;
            return `${str}`;
        }

        flattenString( ins )
        {
            return(
                new String( ins )
                    .replaceAll(/^\s+/g, '')
                    .replaceAll(/\s+$/g, '')
                    .replaceAll(/\s{2,}/g, ' ')
            );
        }

        hideClearReset()
        {
            var ols = `#${this.olStr}`;

            $(`#${this.slcStr}`).hide();
            $(`#${this.slsStr}`).val('');

            $(ols).children().each( (z, e) => {
                $( e ).css('display', 'block');
            });

            this.selectedValue = this._resetSelectedValue();
        }

        clickEvent()
        {
            var inst = this;

            $(window).click( (e) => {
                var displayValue = $(`#${inst.slcStr}`).css('display'),
                    hideTarget = (id) => {
                        var skipList = [inst.slcStr, inst.slsStr, inst.sbStr];
                        return ! skipList.includes( id );
                    };

                if( hideTarget(e.target.id) === true )
                    if( displayValue === 'block' )
                        inst.hideClearReset();
            });
        }

        escapeEvent()
        {
            var inst = this;

            $(window).on('keyup', (e) => {
                if( e.code === 'Escape' )
                    inst.hideClearReset();
            });
        }

        clickHandler( clickEvent )
        {
            var inst = this,
                slc = `#${clickEvent.data.element}`;
            $(slc).css('display') === 'block' ? $(slc).hide() : $(slc).show();
        }


        searchFilter( e )
        {
            var inst = e.data !== undefined ? e.data.context : this,
                sls = `#${inst.slsStr}`,
                ols = `#${inst.olStr}`,
                typedIn = new String(
                        inst.flattenString(
                            $(sls).val()
                        )
                    )
                    .toLowerCase();

            $(ols).children().each( (z, e) => {
                var el = new String(
                        inst.flattenString(
                            $( e ).text()
                        )
                    )
                    .toLowerCase();

                if( $( e ).prop('nodeName') !== 'DIV' )
                        return;

                if( el.indexOf( typedIn ) === -1 )
                        $( e ).css('display', 'none');
                else
                        $( e ).css('display', 'block');
            });
        }

        optionClick( e )
        {
            var inst = e.data.context || null,
                element = e.data.element,
                newClick = () => {
                    element.off('click');
                    inst.ssObject.init_elements.button = inst.savedButtonElement;
                    inst.savedButtonElement = null;
                    inst.clickEvent();
                    inst.escapeEvent();
                    inst.initializeSearchable( false );
                    inst.refreshOptions();
                    inst.render();
                    console.log('clicking...');
                    setTimeout( () => {
                        inst.ssObject.init_elements.button.click();
                    }, 20);
                },
                elementEventsOff = () => {
                    element.off('click');
                    element.off('mouseenter');
                    element.off('mouseleave');
                    element.css('background-color', '#fff');
                };

            if( inst === null ){
                console.log(`optionClick inst is null`);
                return;
            }

            inst.selectedValue.value = $( element ).data('value');
            inst.selectedValue.text = inst.flattenString(
                $( element ).text()
            );

            /*
            console.log(
                inst.flattenString(`
                    oC() selected ${JSON.stringify(inst.selectedValue)},
                    element is ${$(element).data('value')}
                `)
            );
            */

            elementEventsOff();
            inst.savedButtonElement = inst.ssObject.init_elements.button;
            inst.ssObject.init_elements.button.replaceWith( element );
            element.on('click', newClick);

            if( Object.keys( inst.selectedCallback ).length > 0 ){
                inst.selectedCallback.data.selected_value = inst.selectedValue;
                return inst.selectedCallback.func(
                    inst.selectedCallback.data
                );
            }

        }

        initializeSearchable( firstRun = true )
        {
            var caretClasses = ['fa', 'fa-caret-down', 'select-control-caret'],
                ie = this.ssObject.init_elements,
                pe = `#${this.parentElement}`;

            ie.button = $('<div />');
            ie.container = $('<div />');
            ie.list = $('<div />');
            ie.search = $('<input />');
            ie.span = $('<span />');

            ie.button.attr('id', this.sbStr);
            ie.button.addClass('form-control');
            ie.button.text(this.buttonText);
            if( firstRun === false )
                ie.button.off('click');
            ie.button.on(
                'click',
                null,
                {element: this.slcStr},
                this.clickHandler
            );

            ie.container.attr('id', this.slcStr);
            ie.container.css('max-height', '500px');
            ie.container.css('overflow-y', 'auto');
            if( firstRun === true )
                ie.container.hide();

            ie.list.attr('id', this.olStr);

            ie.search.addClass('form-control');
            ie.search.addClass('form-control-lg');
            ie.search.attr('id', this.slsStr);
            ie.search.attr('placeholder', this.placeholder);
            ie.search.on('keyup', null, {context: this}, this.searchFilter);

            caretClasses.forEach( (c) => { ie.span.addClass(c); });
            ie.span.css('position', 'inherit');
            ie.span.css('float', 'right');
            ie.span.css('line-height', '1.5em');

        }

        addOption( value, label )
        {
            var classes = ['form-control', 'dropdown-item', 'option-item'],
                div = $('<div />'),
                styleDiv = () => {
                    div.css('background-color', '#fff');
                    div.css('color', '#52575c');
                    div.css('padding', '0.75rem 1rem');
                    div.on('mouseenter', function(){
                        div.css('background-color', '#89b3c0');
                    });
                    div.on('mouseleave', function(){
                        div.css('background-color', '#fff');
                    });
                };

            classes.forEach( (c) => { div.addClass(c); });
            div.attr('data-value', value);
            div.off('click');
            div.on(
                'click',
                null,
                // {context: this, name: label, value: value},
                {context: this, element: div},
                this.optionClick
            );
            styleDiv();
            div.text( label );

            this.ssObject.options.push( div );

        }

        refreshOptions()
        {
            var inst = this;

            this.ssObject.options.forEach( (div) => {
                var setMouseEvents = () => {
                    div.on('mouseenter', function(){
                        div.css('background-color', '#89b3c0');
                    });
                    div.on('mouseleave', function(){
                        div.css('background-color', '#fff');
                    });
                };

                div.off('click');
                div.on(
                    'click',
                    null,
                    // {context: this, name: label, value: value},
                    {context: inst, element: div},
                    inst.optionClick
                );
                setMouseEvents();
            });
        }

        render()
        {
            var ie = this.ssObject.init_elements,
                op = this.ssObject.options,
                pe = `#${this.parentElement}`;

            ie.button.append( ie.span );

            ie.container.append( ie.search );
            op.forEach( (option) => { ie.list.append( option ) });
            ie.container.append( ie.list );

            $(pe).text('');
            $(pe).append( ie.button );
            $(pe).append( ie.container );

        }

    }

    class StaticSearchableSelect extends DynamicSearchableSelect {

        constructor( element, opt = {} )
        {
            var inst = null;

            super({}, true);
            inst = this;

            this.buttonText = opt.button_text || 'Click to Select';
            this.element = element;
            this.parentElement = element.parent();
            this.placeholder = opt.placeholder || 'Enter Search Term(s)';
            this.selectedCallback = {};
            this.selectedValue = this._setSelectedValue();
            if( typeof opt.selected_callback === 'function' ){
                this.selectedCallback.func = opt.selected_callback;
                this.selectedCallback.data = this.selectedValue;
            }

            this.olStr = this.namespaceId('options-list');
            this.sbStr = this.namespaceId('select-button');
            this.slcStr = this.namespaceId('select-list-container');
            this.slsStr = this.namespaceId('select-list-search');
            this.ssObject = {
                init_elements: {
                    button: null,
                    container: null,
                    list: null,
                    search: null,
                    span: null
                },
                options: []
            };

            this.clickEvent();
            this.escapeEvent();

            this.initializeSearchable();
            $(element).children().each( (z, e) => {
                inst.addOption( $(e).val(), $(e).text() );
            });
            this.render();
        }

        render()
        {
            var ie = this.ssObject.init_elements,
                op = this.ssObject.options,
                pe = this.parentElement;

            ie.button.append( ie.span );

            ie.container.append( ie.search );
            op.forEach( (option) => { ie.list.append( option ) });
            ie.container.append( ie.list );

            pe.text('');
            $(pe).append( ie.button );
            $(pe).append( ie.container );

        }

    }

    class SearchableSelect {
        constructor( options = {} )
        {
            return new DynamicSearchableSelect( options );
        }
    }

    this.SearchableSelect = SearchableSelect;
    this.StaticSearchableSelect = StaticSearchableSelect;
    $.fn.searchableSelect = function( opt ){
        return new StaticSearchableSelect( this, opt );
    };

}( jQuery ));
