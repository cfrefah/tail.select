;(function(window){
    var w = window;
    if(!w.tail || !w.tail.select){
        return false;
    }
    w.tail.select.strings = {
        empty: "Keine Optionsn verfügbar",
        placeholder: "Wähle eine Option...",
        multiLimit: "Keine weiteren Optionen auswählbar",
        multiPlaceholder: "Wähle bis zu %d Optionen...",
        search: "Tippen zum suchen...",
        searchEmpty: "Keine Optionen gefunden"
    };
})(this);
