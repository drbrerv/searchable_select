## Searchable Select Box For Bootswatch "Slate" Theme

This repository contains a JQuery plugin and plain JavaScript to support
a searchable select box that is compatible with the Bootswatch "Slate"
theme and its form inputs.  Compatibility could in theory be expanded to
cover other Bootswatch themes, but at the time of the creation of the
repo, Slate was preferred.

#### Dependencies

This plugin was developed with and tested against JQuery version 3.6.4.  It
requires a compatible version to function.  The following HTML can be added
to a document to include it:

    `<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>`

The searchable select box itself is styled with a Font Awesome icon.  Only
the free version of Font Awesome is required and can be included with the
following HTML:

    `<link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>`

#### JQuery Invocation

For an existing select box in an HTML document that looks like this:

    `
        <select id="my-select" class="form-control">
            <option value="opt1">Option 1</option>
            <option value="opt2">Option 2</option>
            <option value="opt3">Option 3</option>
        </select>
    `

The item can be transformed into a searchable select box with the
following:

    `$('#my-select').searchableSelect( options );`

The options passed in this invocation are optional, but can include the
following:

    button_text: The text string to put in the clickable "select"
                element.  Default is "Click to Select"
    placeholder: The text string to put in the search input field.
                Default is "Enter Search Term(s)"
    selected_callback: A callback function to receive the data when an
                item is selected by the user.  It will be called in the
                following manner:

                    functionName( data )

                where the "data" param is itself an object in the
                following form if "Option 1" was selected in the
                example above:

                    `{
                        text: "Option 1",
                        value: "opt1"
                     }`

#### Plain JavaScript Invocation for a Dynamically-Built Element

A seachable select box can be created dynamically by code with external
data consisting of a set of key-value pairs (option display label and
values) in the with the following code:

    `
        var ss = new SearchableSelect({
            parent_element: 'parent-div',
            search_placeholder: 'Enter Search',
            selected_callback: {
                func: functionName,
                data: {}
            }
        });

        ss.addOption( 'Option 1', 'opt1' );
        ss.addOption( 'Option 2', 'opt2' );
        ss.addOption( 'Option 3', 'opt3' );

        ss.render();
        // ss.selectedValue.text, ss.selectedValue.value
    `

The `parent_element` parameter is the ID of the element in the HTML that
should contain the searchable select box.  The `search_placeholder` is
the placeholder text for the search input.  The `selected_callback`
parameter contains a function to be called when an item is selected and
a data object to pass to that function as a parameter.

#### Class Definition: Some Crude Developer Notes

These are the outer components of a searchable select.  They are
defined in "ssObject.init_elements."  In alphabetical order, they
are:

     button -- The button to expand/contract the element
     container -- The container element for the search and
                  options showing/hiding it makes the list expand
                  or contract
     list -- The "options" themselves (really DIVs)
     search -- The search text element
     span: -- This item contains a little downward-pointing carat
              that makes the button (above) look more like a native
              select

In order to render the element, button and container get appended into
the page DIV with the id "parent-div."  That is the last step. Before
that, Span gets appended into button and search and list get appended
into container.

This is a rough HTML-ish approximation of a rendered button and container
element.  The "options" (really DIVs) elements are appended into the
"list-id" DIV:

     <div
         id="button-id"
         class="form-control"
         onclick="clickHandler();">
             Some Button Text
             <span class="caretClass"></span>
     </div>
     <div id="container-id">
         <input
             type="search"
             class="form-control form-control-lg"
             id="search-id"
             placeholder="Enter Your Search"
             onkeyup="filterFunction();"/>
         <div id="list-id">
         </div>
     </div>

  Finally, here is an approximation of an options DIV:

     <div
        class="form-control dropdown-item option-item"
        data-value="some-data"
        onclick="clickFunction()">
            Some Label for the Data
     </div>
