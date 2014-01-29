/**
 * Created by cosmin on 1/27/14.
 */
/**
 *
 * @param name
 * @param location
 * @param amount
 * @param virtual Is this a virtual (not saved) item?
  * @constructor
 */
function Item(name, location, amount, virtual) {
    virtual = virtual || false;
    var item = {
        key: "",
        name: "",
        location: "",
        amount: 1,
        isVirtual: false
    };
    if (typeof (amount) == "undefined") {
        amount = 1;
    }
    item.name = name;
    item.key = Storer()._getKey(name);
    item.location = location;
    item.amount = amount;
    item.isVirtual = virtual;
    return item;
}