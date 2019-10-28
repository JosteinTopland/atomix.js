/*
  Atomix JS
  jostein.topland@gmail.com
*/

var player = {
    x: 0,
    y: 0,
    toX: 0,
    toY: 0,
    selectedAtom: null,
    isMovingAtom: false
};

var atoms = [];

var levelAt;
var timer;

var levels = [{
    name: "Water",
    background: "darkred",
    time: 3 * 60,
    map: [
        0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x11, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xff,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x20, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x10, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01,
        0xff, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0xff, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
    ],
    width: 11,
    height: 10,
    solution: {
        map: [0x10, 0x20, 0x11],
        width: 3,
        height: 1
    }
}, {
    name: "Methane",
    background: "darkgreen",
    time: 2 * 60 + 30,
    map: [
        0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x00, 0x01, 0x30, 0x01, 0x00, 0x00, 0x13, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x10, 0x01, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x11, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x12, 0x01, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
    ],
    width: 14,
    height: 11,
    solution: {
        map: [
            0x00, 0x13, 0x00,
            0x10, 0x30, 0x11,
            0x00, 0x12, 0x00
        ],
        width: 3,
        height: 3
    }
}, {
    name: "Methanol",
    background: "darkblue",
    time: 2 * 60,
    map: [
        0x01, 0x01, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x13, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x30, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x10, 0x01, 0x01, 0x01, 0x20, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x12, 0x00, 0x01, 0x11, 0x00, 0x01, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01,
        0xff, 0xff, 0xff, 0xff, 0xff, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
    ],
    width: 13,
    height: 13,
    solution: {
        map: [
            0x00, 0x13, 0x00, 0x00,
            0x10, 0x30, 0x20, 0x11,
            0x00, 0x12, 0x00, 0x00
        ],
        width: 4,
        height: 3
    }
}, {
    name: "Ethen",
    background: "darkred",
    time: 3 * 60 + 30,
    map: [
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x01, 0x16, 0x01, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x32, 0x01, 0x01, 0x31, 0x00, 0x15, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x01, 0x00, 0x00, 0x01, 0x14, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x17, 0x01, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff
    ],
    width: 11,
    height: 13,
    solution: {
        map: [
            0x14, 0x00, 0x00, 0x15,
            0x00, 0x31, 0x32, 0x00,
            0x16, 0x00, 0x00, 0x17
        ],
        width: 4,
        height: 3
    }
}, {
    name: "Propen",
    background: "darkgreen",
    time: 4 * 60,
    map: [
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x15, 0x01, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0x01, 0x00, 0x00, 0x13, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0xff, 0xff, 0x01, 0x33, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0xff, 0xff, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x01, 0x01, 0x00, 0x32, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x10, 0x00, 0x01, 0x00, 0x00, 0x30, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x13, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x17, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x12, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
    ],
    width: 14,
    height: 13,
    solution: {
        map: [
            0x00, 0x13, 0x13, 0x00, 0x15,
            0x10, 0x30, 0x33, 0x32, 0x00,
            0x00, 0x12, 0x00, 0x00, 0x17
        ],
        width: 5,
        height: 3
    }
}, {
    name: "Ethanol",
    background: "darkred",
    time: 2 * 60 + 30,
    map: [
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x13, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xff, 0xff,
        0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x01, 0x00, 0x00, 0x01, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0xff, 0xff,
        0x01, 0x00, 0x01, 0x11, 0x01, 0x00, 0x00, 0x01, 0x30, 0x00, 0x01, 0xff, 0xff,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01,
        0xff, 0x01, 0x00, 0x00, 0x00, 0x20, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x10, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x13, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x12, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x12, 0x00, 0x01, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff
    ],
    width: 13,
    height: 13,
    solution: {
        map: [
            0x00, 0x13, 0x13, 0x00, 0x00,
            0x10, 0x30, 0x30, 0x20, 0x11,
            0x00, 0x12, 0x12, 0x00, 0x00
        ],
        width: 5,
        height: 3
    }
}, {
    name: "Propanol",
    background: "darkgreen",
    time: 2 * 60 + 30,
    map: [
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x13, 0x00, 0x01, 0xff,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0xff,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x21, 0x00, 0x00, 0x00, 0x01, 0xff,
        0x01, 0x00, 0x13, 0x01, 0x12, 0x01, 0x01, 0x01, 0x01, 0x00, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x12, 0x01, 0x30, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x13, 0x00, 0x01,
        0x01, 0x00, 0x30, 0x01, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x12, 0x00, 0x11, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x10, 0x01, 0x00, 0x00, 0x30, 0x00, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
    ],
    width: 12,
    height: 13,
    solution: {
        map: [
            0x00, 0x13, 0x13, 0x13, 0x00,
            0x10, 0x30, 0x30, 0x30, 0x11,
            0x00, 0x12, 0x21, 0x12, 0x00,
            0x00, 0x00, 0x12, 0x00, 0x00
        ],
        width: 5,
        height: 4
    }
}, {
    name: "Ethanal",
    background: "darkblue",
    time: 2 * 60 + 15,
    map: [
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x22, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x13, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x30, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x10, 0x00, 0x00, 0x12, 0x00, 0x01, 0x13, 0x01,
        0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x00, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x33, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff, 0xff, 0xff
    ],
    width: 10,
    height: 11,
    solution: {
        map: [
            0x00, 0x13, 0x13, 0x00,
            0x10, 0x30, 0x33, 0x22,
            0x00, 0x12, 0x00, 0x00
        ],
        width: 4,
        height: 3
    }
}, {
    name: "Propanon",
    background: "darkred",
    time: 3 * 60 + 30,
    map: [
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x12, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x11, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x12, 0x00, 0x00, 0x00, 0x13, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x01,
        0xff, 0xff, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x13, 0x30, 0x00, 0x01,
        0xff, 0xff, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x30, 0x00, 0x34, 0x00, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x23, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x10, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
    ],
    width: 13,
    height: 12,
    solution: {
        map: [
            0x00, 0x13, 0x00, 0x13, 0x00,
            0x10, 0x30, 0x34, 0x30, 0x11,
            0x00, 0x12, 0x23, 0x12, 0x00
        ],
        width: 5,
        height: 3
    }
}, {
    name: "Methan S",
    background: "darkblue",
    time: 1 * 60 + 30,
    map: [
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0x01, 0x01, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0xff, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x35, 0x10, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x24, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x20, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x11, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
    ],
    width: 13,
    height: 13,
    solution: {
        map: [
            0x00, 0x24, 0x00, 0x00,
            0x10, 0x35, 0x20, 0x11
        ],
        width: 4,
        height: 2
    }
}, {
    name: "Ethan S",
    background: "darkred",
    time: 2 * 60 + 30,
    map: [
        0xff, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0xff, 0xff,
        0xff, 0x01, 0x00, 0x00, 0x13, 0x00, 0x00, 0x01, 0x01, 0x01,
        0xff, 0x01, 0x00, 0x11, 0x01, 0x00, 0x24, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x30, 0x01, 0x01, 0x10, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x35, 0x00, 0x01,
        0x01, 0x00, 0x12, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x00, 0x00, 0x01, 0x20, 0x01, 0x00, 0x01,
        0xff, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x01,
        0xff, 0xff, 0xff, 0xff, 0xff, 0x01, 0x01, 0x01, 0x01, 0x01
    ],
    width: 10,
    height: 11,
    solution: {
        map: [
            0x00, 0x13, 0x24, 0x00, 0x00,
            0x10, 0x30, 0x35, 0x20, 0x11,
            0x00, 0x12, 0x00, 0x00, 0x00
        ],
        width: 5,
        height: 3
    }
}, {
    name: "Transbuten",
    background: "darkgreen",
    time: 4 * 60 + 30,
    map: [
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x14, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x01, 0x14, 0x01, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x17, 0x00, 0x00, 0x01, 0x36, 0x00, 0x17, 0x00, 0x00, 0x15, 0x01,
        0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01, 0x01, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x36, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x32, 0x00, 0x01,
        0x01, 0x16, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x17, 0x00, 0x14, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
    ],
    width: 14,
    height: 12,
    solution: {
        map: [
            0x00, 0x00, 0x00, 0x14, 0x00, 0x15,
            0x00, 0x14, 0x00, 0x00, 0x36, 0x00,
            0x14, 0x00, 0x31, 0x32, 0x00, 0x17,
            0x00, 0x36, 0x00, 0x00, 0x17, 0x00,
            0x16, 0x00, 0x17, 0x00, 0x00, 0x00
        ],
        width: 6,
        height: 5
    }
}, {
    name: "Cisbuten",
    background: "darkblue",
    time: 4 * 60 + 30,
    map: [
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x16, 0x00, 0x14, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x01, 0x31, 0x01, 0x01, 0x14, 0x00, 0x01,
        0x01, 0x00, 0x32, 0x01, 0x00, 0x00, 0x00, 0x00, 0x17, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x17, 0x01,
        0x01, 0x15, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x15, 0x01,
        0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x36, 0x00, 0x01,
        0x01, 0x36, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01
    ],
    width: 13,
    height: 12,
    solution: {
        map: [
            0x00, 0x14, 0x00, 0x00, 0x15, 0x00,
            0x14, 0x00, 0x31, 0x32, 0x00, 0x15,
            0x00, 0x36, 0x00, 0x00, 0x36, 0x00,
            0x16, 0x00, 0x17, 0x16, 0x00, 0x17
        ],
        width: 6,
        height: 4
    }
}];

var spriteSheet = {
    image: null,
    coords: {
        0x01: [0, 0, 16, 16],    // wall #1
        0x02: [16, 0, 16, 16],   // wall #2
        0x10: [0, 16, 16, 16],   // H right
        0x11: [16, 16, 16, 16],  // H left
        0x12: [32, 16, 16, 16],  // H up
        0x13: [48, 16, 16, 16],  // H down
        0x14: [64, 16, 16, 16],  // H down-right
        0x15: [80, 16, 16, 16],  // H down-left
        0x16: [96, 16, 16, 16],  // H up-right
        0x17: [112, 16, 16, 16], // H up-left
        0x20: [0, 32, 16, 16],   // O left-right
        0x21: [16, 32, 16, 16],  // O up-down
        0x22: [32, 32, 16, 16],  // O left
        0x23: [48, 32, 16, 16],  // O up
        0x24: [64, 32, 16, 16],  // O down
        0x30: [0, 48, 16, 16],   // C left-right-up-down
        0x31: [16, 48, 16, 16],  // C right,up-left,down-left
        0x32: [32, 48, 16, 16],  // C left,up-right,down-right
        0x33: [48, 48, 16, 16],  // C left-up-right
        0x34: [64, 48, 16, 16],  // C left-down-right
        0x35: [80, 48, 16, 16],  // C left-up-right
        0x36: [96, 48, 16, 16]   // C up-left,down-left,up-right,down-right
    },
    gridSize: 16
};

function setup() {
    createCanvas(windowWidth, windowHeight);

    noSmooth();
    frameRate(60);

    spriteSheet.image = loadImage('spritesheet_old.png');

    levelAt = 0;
    setLevel();

    var modPlayer = new Modplayer();
    modPlayer.load("oriental_blaster.mod");
    modPlayer.setamigamodel("500");
    modPlayer.setrepeat(true);
}

function setLevel() { 
    let level = levels[levelAt];

    timer = new Date((level.time + 1) * 1000 + Date.now());

    if (level.mapInit == null) {
        level.mapInit = level.map.slice();
    } else {
        level.map = level.mapInit.slice();
    }

    atoms = [];
    for (let i = 0; i < level.map.length; i++) {
        let spriteId = level.map[i];
        if (spriteId >= 0x10 && spriteId != 0xff) {
            let atom = {
                x: i % level.width,
                y: floor(i / level.width),
                spriteId: spriteId
            };
            atoms.push(atom);
        }
    }

    player.x = 0;
    player.y = 0;
    player.toX = 0;
    player.toY = 0;
    player.selectedAtom = null;
    player.isMovingAtom = false;
}

function draw() {
    scale(4);

    let time = new Date(timer - Date.now());
    if (time >= 0) {
        background('black');
        update();
        drawBackground();
        drawTimer();
        drawMap();
        drawSolution();
    } else {
        levelAt = 0;
        setLevel();
    }
}

function drawSolution() {
    let x = 7;
    let y = 110;
    let w = 50;
    let h = 50;
    stroke('white');
    strokeWeight(1);
    fill('black');
    rect(x, y, w, h);

    let level = levels[levelAt];

    textSize(7);
    noStroke();
    fill('white');
    textFont('Verdana');
    textAlign(CENTER);
    text(level.name, x + w / 2, y + 10);

    let gridSize = spriteSheet.gridSize;
    push();
    translate(x, y + 5);
    scale(0.5);
    for (let i = 0; i < level.solution.map.length; i++) {
        let spriteId = level.solution.map[i];
        if (spriteId == 0) continue;

        let x = (i % level.solution.width) * gridSize + w - level.solution.width / 2 * spriteSheet.gridSize;
        let y = floor(i / level.solution.width) * gridSize + h - level.solution.height / 2 * spriteSheet.gridSize;
        let spriteCoord = spriteSheet.coords[spriteId];
        image(spriteSheet.image, x, y, spriteCoord[2], spriteCoord[3], spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
    }
    pop();
}

function drawTimer() {
    textSize(8);
    noStroke();
    fill('white');
    textFont('Verdana');
    textAlign(LEFT);
    text("Level " + (levelAt + 1), 10, 75);

    let time = new Date(timer - Date.now());
    let timeStr = time.getMinutes() + ":" + (time.getSeconds() < 10 ? "0" : "") + time.getSeconds();
    textSize(20);
    stroke('white');
    fill('white');
    textFont('Verdana');
    textAlign(LEFT);
    text(timeStr, 10, 100);
}

function drawBackground() {
    let level = levels[levelAt];
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 20; j++) {
            let a = j / (2 + i) + millis() / 10000;
            var l = 2;
            var y = 8 * i + 2;
            let x2 = (j - cos(a) - sin(a) + l) * spriteSheet.gridSize;
            let x1 = (j + sin(a) + cos(a) - l) * spriteSheet.gridSize;
            let y1 = (y - sin(a) - cos(a) + l) * spriteSheet.gridSize;
            let y2 = (y + cos(a) + sin(a) - l) * spriteSheet.gridSize;
            stroke(level.background);
            strokeWeight(7);
            line(x1, y1, x2, y2);
            stroke(255, 100);
            strokeWeight(2);
            line(x1, y1 - 1, x2, y2 - 1);
        }
    }
}

function update() {
    let speed = 0.2;
    player.x = player.x < player.toX ? min(player.toX, player.x + speed) : max(player.toX, player.x - speed);
    player.y = player.y < player.toY ? min(player.toY, player.y + speed) : max(player.toY, player.y - speed);

    let level = levels[levelAt];
    if (player.selectedAtom != null) {
        let atom = atoms[player.selectedAtom];
        level.map[floor(atom.y) * level.width + floor(atom.x)] = 0x00;
        atom.x = player.x;
        atom.y = player.y;
        level.map[floor(atom.y) * level.width + floor(atom.x)] = atom.spriteId;
    }

    player.isMovingAtom = player.selectedAtom != null && (player.x != player.toX || player.y != player.toY);
    if (!player.isMovingAtom) {
        if (isLevelDone()) {
            levelAt = (levelAt + 1) % levels.length;
            setLevel();
        }
    }
}

// TODO check atoms x and y
function isLevelDone() {
    let level = levels[levelAt];

    let v1, x1, y1;
    for (let i = 0; i < level.solution.map.length; i++) {
        v1 = level.solution.map[i];
        if (v1 != 0) {
            x1 = i % level.solution.width;
            y1 = floor(i / level.solution.width);
            break;
        }
    }

    let v2, x2, y2;
    for (let i = 0; i < level.map.length; i++) {
        v2 = level.map[i];
        if (v1 == v2) {
            x2 = i % level.width;
            y2 = floor(i / level.width);
            break;
        }
    }

    x2 -= x1;
    y2 -= y1;
    for (let i = 0; i < level.solution.map.length; i++) {
        v1 = level.solution.map[i];
        if (v1 != 0) {
            x1 = i % level.solution.width;
            y1 = floor(i / level.solution.width);
            v2 = level.map[x1 + x2 + (y1 + y2) * level.width];
            if (v1 != v2) {
                return false;
            }
        }
    }

    return true;
}

function drawMap() {
    push();
    translate(4 * spriteSheet.gridSize, 1 * spriteSheet.gridSize);

    let level = levels[levelAt];
    let gridSize = spriteSheet.gridSize;

    // walls
    for (let i = 0; i < level.map.length; i++) {
        let x = (i % level.width) * gridSize;
        let y = floor(i / level.width) * gridSize;
        let spriteId = level.map[i];
        if (spriteId != 0xff) {
            noStroke();
            fill(70, 50, 0);
            rect(x, y, gridSize, gridSize);
        }
        if (spriteId > 0x00 && spriteId < 0x10) {
            let spriteCoord = spriteSheet.coords[spriteId];
            image(spriteSheet.image, x, y, spriteCoord[2], spriteCoord[3], spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
        }
    }

    // atoms
    for (i in atoms) {
        let x = atoms[i].x * gridSize;
        let y = atoms[i].y * gridSize;
        let spriteCoord = spriteSheet.coords[atoms[i].spriteId];
        image(spriteSheet.image, x, y, spriteCoord[2], spriteCoord[3], spriteCoord[0], spriteCoord[1], spriteCoord[2], spriteCoord[3]);
    }

    // player
    let x = player.x * gridSize;
    let y = player.y * gridSize;
    noFill();
    if (player.selectedAtom == null) {
        strokeWeight(2);
        stroke(220, 0, 0);
        rect(x + 1, y + 1, gridSize - 2, gridSize - 2, 1);
    } else {
        strokeWeight(1.2);
        stroke('white');
        rotatingDashedEllipse(x + gridSize / 2 - 1, y + gridSize / 2 - 1, gridSize * 0.3);
    }

    pop();
}

function stepsUntilBlock(direction) {
    let level = levels[levelAt];
    let steps = 0;
    let playerIdx = floor(player.y) * level.width + floor(player.x);
    switch (direction) {
        case "LEFT":
            while (level.map[playerIdx - steps - 1] == 0x00) steps++;
            break;
        case "RIGHT":
            while (level.map[playerIdx + steps + 1] == 0x00) steps++;
            break;
        case "UP":
            while (level.map[playerIdx - (steps + 1) * level.width] == 0x00) steps++;
            break;
        case "DOWN":
            while (level.map[playerIdx + (steps + 1) * level.width] == 0x00) steps++;
            break;
    }
    return steps;
}

function keyPressed() {
    let level = levels[levelAt];
    let steps = 1;
    if (!player.isMovingAtom) {
        switch (keyCode) {
            case LEFT_ARROW:
                if (player.selectedAtom != null) steps = stepsUntilBlock('LEFT');
                player.toX = max(0, player.toX - steps);
                break;
            case RIGHT_ARROW:
                if (player.selectedAtom != null) steps = stepsUntilBlock('RIGHT');
                player.toX = min(level.width - 1, player.toX + steps);
                break;
            case UP_ARROW:
                if (player.selectedAtom != null) steps = stepsUntilBlock('UP');
                player.toY = max(0, player.toY - steps);
                break;
            case DOWN_ARROW:
                if (player.selectedAtom != null) steps = stepsUntilBlock('DOWN');
                player.toY = min(level.height - 1, player.toY + steps);
                break;
            case 32: // SPACEBAR
	    case 13: // ENTER
                if (player.selectedAtom == null) {
                    for (i in atoms) {
                        let atom = atoms[i];
                        if (player.x == atom.x && player.y == atom.y) {
                            player.selectedAtom = i;
                            break;
                        }
                    }
                } else {
                    player.selectedAtom = null;
                }
                break;
        }
    }
}

function rotatingDashedEllipse(x, y, r) {
    push();
    translate(x, y);
    rotate(millis() * 0.005);
    let x1 = r;
    let y1 = 0;
    let detail = 16;
    for (let i = 0; i < detail; i++) {
        let a = (i + 1) * TWO_PI / detail;
        let x2 = r * cos(a);
        let y2 = r * sin(a);
        if (i % 2) line(x1, y1, x2, y2);
        x1 = x2;
        y1 = y2;
    }
    pop();
}
