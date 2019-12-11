var oldOpen1 = 0;
function OpenClose1(CID) {
    if (document.getElementById('C1_' + CID).style.display == "none") {
        if (oldOpen1 != 0) {
            document.getElementById('C1_' + oldOpen1).style.display = "none";
            document.getElementById('CC1_' + oldOpen1).className = "hoverclose";
        }
        oldOpen1 = CID;
        document.getElementById('C1_' + CID).style.display = "";
        document.getElementById('CC1_' + CID).className = "hover";
    } else {
        document.getElementById('C1_' + CID).style.display = "none";
        document.getElementById('CC1_' + CID).className = "hoverclose";
        oldOpen1 = 0;
    }

}
var oldOpen2 = 0;
function OpenClose2(CID) {
    if (document.getElementById('C2_' + CID).style.display == "none") {
        if (oldOpen2 != 0) {
            document.getElementById('C2_' + oldOpen2).style.display = "none";
            document.getElementById('CC2_' + oldOpen2).className = "hoverclose";
        }
        oldOpen2 = CID;
        document.getElementById('C2_' + CID).style.display = "";
        document.getElementById('CC2_' + CID).className = "hover";

    } else {
        document.getElementById('C2_' + CID).style.display = "none";
        document.getElementById('CC2_' + CID).className = "hoverclose";
        oldOpen2 = 0;
    }

}

var oldOpen3 = 0;
function OpenClose3(CID) {
    if (document.getElementById('C3_' + CID).style.display == "none") {
        if (oldOpen3 != 0) {
            document.getElementById('C3_' + oldOpen3).style.display = "none";
            document.getElementById('CC3_' + oldOpen3).className = "hoverclose";
        }
        oldOpen3 = CID;
        document.getElementById('C3_' + CID).style.display = "";
        document.getElementById('CC3_' + CID).className = "hover";

    } else {
        document.getElementById('C3_' + CID).style.display = "none";
        document.getElementById('CC3_' + CID).className = "hoverclose";
        oldOpen3 = 0;
    }

}

var oldOpen4 = 0;
function OpenClose4(CID) {
    if (document.getElementById('C4_' + CID).style.display == "none") {
        if (oldOpen4 != 0) {
            document.getElementById('C4_' + oldOpen4).style.display = "none";
            document.getElementById('CC4_' + oldOpen4).className = "hoverclose";
        }
        oldOpen4 = CID;
        document.getElementById('C4_' + CID).style.display = "";
        document.getElementById('CC4_' + CID).className = "hover";

    } else {
        document.getElementById('C4_' + CID).style.display = "none";
        document.getElementById('CC4_' + CID).className = "hoverclose";
        oldOpen4 = 0;
    }

}

var oldOpen5 = 0;
function OpenClose5(CID) {
    if (document.getElementById('C5_' + CID).style.display == "none") {
        if (oldOpen5 != 0) {
            document.getElementById('C5_' + oldOpen5).style.display = "none";
            document.getElementById('CC5_' + oldOpen5).className = "hoverclose";
        }
        oldOpen5 = CID;
        document.getElementById('C5_' + CID).style.display = "";
        document.getElementById('CC5_' + CID).className = "hover";

    } else {
        document.getElementById('C5_' + CID).style.display = "none";
        document.getElementById('CC5_' + CID).className = "hoverclose";
        oldOpen5 = 0;
    }

}
// $(".local").on("click", function () {
//     parent.location.href = "index.jsp";
// });
