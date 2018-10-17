/*
 |  tail.select - A solution to make (multiple) selection fields beatiful again, written in vanillaJS!
 |  @author     SamBrishes@pytesNET
 |  @version    0.4.2 - Beta
 |  @website    https://www.github.com/pytesNET/tail.select
 |
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2014 - 2018 SamBrishes, pytesNET <pytes@gmx.net>
 */
;(function(){
    if(!window.tail || !window.tail.select){
        return false;
    }
    window.tail.select.strings = {
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
}());
