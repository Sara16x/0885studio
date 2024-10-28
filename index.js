// Disabilita il tasto destro del mouse
window.addEventListener('contextmenu', function (e) {
e.preventDefault();
}, false);

// Disabilita la selezione del testo
document.body.style.webkitUserSelect='none'; //Chrome, Opera
document.body.style.userSelect='none'; //Rest

// Sovrascrivi window.open per evitare l'apertura di nuove finestre
window.open = function() {
    console.log("L'apertura di nuove finestre è stata disabilitata.");
    return null; // Non apre nulla
};
