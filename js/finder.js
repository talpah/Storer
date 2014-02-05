/**
 * Created by cosmin on 1/27/14.
 */
/**
 *
 * @param container container #id
 * @param listTemplate template #id
 * @param createButtonTemplate template #id
 * @param updateButtonTemplate template #id
 * @returns Finder
 * @constructor
 */
function Finder(container, listTemplate, createButtonTemplate, updateButtonTemplate) {
    /** Singleton */
    if (arguments.callee._singletonInstance) return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    this._results = [];
    this._container = $(container);
    this._listTemplate = listTemplate;
    this._updateButtonsTemplate = updateButtonTemplate;
    this._createButtonsTemplate = createButtonTemplate;

    this._lastSearchQuery = '';

    this.setResults = function (results) {
        this._results = results;
    };

    this.render = function () {
        var $this = this;
        this._container.empty();
        if (this._results.length == 0) {
            this._container.prepend($('<span>Nothing found.</span>'));
            return;
        }
        for (var resultIndex in this._results) {
            if (!this._results.hasOwnProperty(resultIndex)) {
                continue;
            }
            var result = this._results[resultIndex];
            var listTemplate = this.createNodesFromTemplate('list');
            listTemplate.find('.item-name').text(result.name);
            listTemplate.find('.item-location').text(result.location ? result.location : '...');
            listTemplate.find('.amount').text(result.amount);

            if (result.isVirtual) {
                var createButton = this.createNodesFromTemplate('create');
                createButton.find('button').attr('id', 'create-item-' + result.key);
                createButton.find('button').attr('data', JSON.stringify(result));
                listTemplate.find('.amount').attr('id', 'amount-' + result.key);
                listTemplate.find('.actions').empty().append(createButton);
                listTemplate.find('#create-item-' + result.key).on('click', this.clickCreate);
            } else {
                var buttons = this.createNodesFromTemplate('update');
                buttons.find('.inc').attr('id', 'inc-' + result.key + '-' + result.location);
                buttons.find('.dec').attr('id', 'dec-' + result.key + '-' + result.location);
                buttons.find('.inc').attr('data', JSON.stringify(result));
                buttons.find('.dec').attr('data', JSON.stringify(result));
                listTemplate.find('.amount').attr('id', 'amount-' + result.key + '-' + result.location);
                listTemplate.find('.actions').empty().append(buttons);
                listTemplate.find('#inc-' + result.key + '-' + result.location)
                    .on('click', this.clickInc)
                ;
                listTemplate.find('#dec-' + result.key + '-' + result.location)
                    .on('click', this.clickDec)
                    .on('mouseup',function () {
                        clearTimeout($(this).data('pressTimer'));
                        // Clear timeout
                        return false;
                    }).on('mousedown', function () {
                        // Set timeout
                        $(this).data('pressTimer', window.setTimeout($this.clickRemove, 1000));
                        return false;
                    });
            }
            this._container.append(listTemplate);
        }

    };

    this.updateAmount = function (data) {
        var amountElement = $('#amount-' + data.key + '-' + data.location);
        if (amountElement) {
            var updatatableElements = $(
                '#amount-' + data.key + '-' + data.location +
                    ', #inc-' + data.key + '-' + data.location +
                    ', #dec-' + data.key + '-' + data.location);
            updatatableElements.attr('data', JSON.stringify(data));
            amountElement.text(data.amount);
        }
    };

    this.search = function (searchQuery) {
        searchQuery = searchQuery || this._lastSearchQuery;
        if (searchQuery == '') {
            return;
        }
        this._lastSearchQuery = searchQuery;
        /* Split into words and remove empty elements */
        var words = $.grep(searchQuery.split(' '), function (e) {
            return e != '';
        });
        var location = false;

        /* Initial full search */
        var searchResults = store.find(words.join(' '));

        /* When word count > 1, the last word is location */
        if (words.length > 1) {
            location = words.pop();
        }
        /* Reassemble search query, w/out location */
        var searchedItem = words.join(' ');

        /* If no matches found for full search, try without last word (location) */
        if (searchResults.length === 0) {
            /* Search assuming the last word is a location, display below proposed creation */
            var searchResultsWithLocation = store.find(searchedItem);
            var locationsFound = [];
            var fullMatchFound = false;
            if (searchResultsWithLocation.length > 0) {
                for (var srwl in searchResultsWithLocation) {
                    if (!searchResultsWithLocation.hasOwnProperty(srwl)) {
                        continue;
                    }
                    if (location
                        && searchResultsWithLocation[srwl].location == location
                        && searchedItem == searchResultsWithLocation[srwl].name
                        ) {
                        /* everything matches, put it first */
                        searchResults.unshift(searchResultsWithLocation[srwl]);
                        fullMatchFound = true;
                    } else if (
                        (location && searchResultsWithLocation[srwl].location == location)
                            || searchedItem == searchResultsWithLocation[srwl].name
                        ) {
                        /* Location matches OR item name matches, put it firstish */
                        if (!fullMatchFound) {
                            searchResults.unshift(searchResultsWithLocation[srwl]);
                        } else {
                            var fullMatch = searchResults.shift();
                            searchResults.unshift(searchResultsWithLocation[srwl]);
                            searchResults.unshift(fullMatch);
                        }
                        locationsFound.push(searchResultsWithLocation[srwl].location);
                    } else {
                        /* just item matches, add it to the bottom */
                        searchResults.push(searchResultsWithLocation[srwl]);
                        locationsFound.push(searchResultsWithLocation[srwl].location);
                    }
                }
            }
            /* Nothing found matching all the words, propose to create item named after the full query */
            var proposeAdd;
            if (location) {
                /* If there's a location specified and the rest of the query
                 didn't match an item in a known location, suggest adding it  */
                if (!fullMatchFound) {
                    /* Propose item in location */
                    proposeAdd = new Item(searchedItem, location, 'Create 1', true);
                }
            } else {
                proposeAdd = new Item(searchQuery, false, 'Create 1', true);
            }
            if (proposeAdd) {
                /* Prepend the proposition on top of the list */
                searchResults.unshift(proposeAdd);
            }
        }
        this.setResults(searchResults);
        this.render();
    };

    /**
     *
     * @param template
     * @returns {jQuery}
     */
    this.createNodesFromTemplate = function (template) {
        var currentTemplate = null;
        switch (template) {
            case 'create':
                currentTemplate = $(this._createButtonsTemplate);
                break;
            case 'update':
                currentTemplate = $(this._updateButtonsTemplate);
                break;
            case 'list':
                currentTemplate = $(this._listTemplate);
                break;
            default:
                return false;
        }
        return $('<div/>').append(currentTemplate.get(0).content.cloneNode(true)).contents();
    };

    this.clickCreate = function () {
        /**
         * @this {Element}
         */
        var data = JSON.parse($(this).attr('data'));
        if (!data.location) {
            $(this)
                .addClass('btn-danger')
                .parents('.list-item')
                .children('.item-location')
                .addClass('text-danger')
                .addClass('bg-warning')
                .html('Type a location above...');
            return true;
        }
        data.amount = 1;
        Storer().add(data);
        Finder().search();
    };
    this.clickInc = function () {
        /**
         * @this {Element}
         */
        var data = JSON.parse($(this).attr('data'));
        data.amount += 1;
        if (Storer().add(data)) {
            Finder().updateAmount(data);
        }
    };
    this.clickDec = function () {
        /**
         * @this {Element}
         */
        var data = JSON.parse($(this).attr('data'));
        // Decrement only down to 0;
        data.amount -= data.amount > 0 ? 1 : 0;
        if (Storer().add(data)) {
            Finder().updateAmount(data);
        }
    };

    this.clickRemove = function () {

        alert('Remove from storage: todo');
    };

    return this;
}
