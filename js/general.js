/**
 * Created by Cosmin on 30.01.2014.
 */
function filterArray(arr, deleteValue) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == deleteValue) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}