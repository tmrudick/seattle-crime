// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll().then(function() {
                // Add appbar list button
                document.getElementById('show-list-button').addEventListener('click', function () {
                    document.getElementById('text-list').classList.toggle('hidden');

                    layoutCrimeListView();

                    document.getElementById('appbar').winControl.hide();
                });
            }));
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();

// TODO (tomrud): Move the map into a page control so this isn't super global
function layoutCrimeListView() {
    var crimeList = document.getElementById('crime-list');

    var parentContainer = crimeList.parentElement;
    var height = window.getComputedStyle(parentContainer).height;
    height = +(height.substring(0, height.length - 2));

    height -= parentContainer.offsetTop;

    crimeList.style.height = height + "px";
    crimeList.style.width = "280px"; // 320 - 40 padding

    // Force layout on the listview control so that it actually displays
    crimeList.winControl.forceLayout();
}