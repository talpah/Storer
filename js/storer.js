/**
 * Created by cosmin on 1/27/14.
 */

/**
 *
 * @returns Storer
 * @constructor
 */
function Storer() {
    /** Singleton */
    if (arguments.callee._singletonInstance) return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    /** Localstorage data structure */
    this._data_structure = {
        locations: {
            location_key: "location name"
        },
        items: {
            item_key: "item name"
        },
        item2location: {
            item_key: {
                location: "location_key",
                amount: 1
            }
        }
    };


    this._load = function (what) {
        var data = localStorage.getItem('storer.' + what);
        return data ? JSON.parse(data) : {};
    };

    this._save = function (where, what) {
        return localStorage.setItem('storer.' + where, JSON.stringify(what));
    };

    this._getKey = function (name) {
        return name.replace(/\W/g, '-');
    };


    this._item2location = this._load('item2location');
    this._items = this._load('items');
    this._locations = this._load('locations');

    /** Can we use storage? */
    this.isCapable = function () {
        return typeof (Storage) !== "undefined";
    };

    this.add = function (item) {
        return this._insert(item);
    };

    this.find = function (name, strict) {
        name = name.trim();
        var results = [];
        var key = this._getKey(name);

        if (this._items.hasOwnProperty(key)) {
            results.push(
                new Item(
                    this._items[key],
                    this._locations[this._item2location[key].location],
                    this._item2location[key].amount));
        }

        /* If we have one by key and strict was requested, return here */
        if (strict === true) {
            return results.length === 0 ? false : results[0];
        }

        /* Find item by name */
        for (var nsr in this._items) {
            if (this._items.hasOwnProperty(nsr)) {
                if (this._items[nsr].indexOf(name) > -1 && nsr != key) {
                    results.push(
                        new Item(
                            this._items[nsr],
                            this._locations[this._item2location[nsr].location],
                            this._item2location[nsr].amount,
                            false
                        ));
                }
            }
        }

        /* Find location by name */

        return results;
    };

    /**
     *
     * @returns {Array}
     */
    this.findAll = function () {
        var results = [];
        for (var nsr in this._items) {
            if (this._items.hasOwnProperty(nsr)) {
                results.push(
                    new Item(
                        this._items[nsr],
                        this._locations[this._item2location[nsr].location],
                        this._item2location[nsr].amount,
                        false
                    ));
            }
        }
        return results;
    };

    this._insert = function (item) {
        if (!this._items.hasOwnProperty(this._getKey(item.name))) {
            this._items[this._getKey(item.name)] = item.name;
            this._save('items', this._items);
        }

        if (!this._locations.hasOwnProperty(this._getKey(item.location))) {
            this._locations[this._getKey(item.location)] = item.location;
            this._save('locations', this._locations);
        }

        this._item2location[this._getKey(item.name)] = {
            location: this._getKey(item.location),
            amount: item.amount
        };
        this._save('item2location', this._item2location);

        return true;
    };

    return this;

}
