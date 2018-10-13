;(function(window){
    var w = window;
    if(!w.tail || !w.tail.select){
        return false;
    }
    w.tail.select.strings = {
        all: "Alle",
        none: "Keine",
        actionAll: "Alle auswählen",
        actionNone: "Keine auswählen",
        empty: "Keine Optionen verfügbar",
        emptySearch: "Keine Optionen gefunden",
        limit: "Keine weiteren Optionen auswählbar",
        placeholder: "Wähle eine Option...",
        placeholderMulti: "Wähle bis zu :limit Optionen...",
        search: "Tippen zum suchen..."
    };
})(this);
