;(function(window){
    var w = window;
    if(!w.tail || !w.tail.select){
        return false;
    }
    w.tail.select.strings = {
        empty: "Keine Optionen verfügbar",
        limit: "Keine weiteren Optionen auswählbar",
        selectLimit: "Wähle bis zu %d Optionen...",
        placeholder: "Wähle eine Option...",
        searchField: "Tippen zum suchen...",
        searchEmpty: "Keine Ergebnisse gefunden...."
    };
})(this);
