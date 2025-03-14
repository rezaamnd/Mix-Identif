const colorDatabase = [
    { name: "Merah", hex: "#FF0000" },
    { name: "Hijau", hex: "#00FF00" },
    { name: "Biru", hex: "#0000FF" },
    { name: "Kuning", hex: "#FFFF00" },
    { name: "Cyan", hex: "#00FFFF" },
    { name: "Magenta", hex: "#FF00FF" },
    { name: "Hitam", hex: "#000000" },
    { name: "Putih", hex: "#FFFFFF" },
    { name: "Abu-abu", hex: "#808080" },
    { name: "Oranye", hex: "#FFA500" },
    { name: "Coklat", hex: "#A52A2A" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Ungu", hex: "#800080" }
];

function analyzeColor() {
    let hexColor = document.getElementById("colorInput").value;
    let totalWeight = parseFloat(document.getElementById("totalWeight").value);

    if (isNaN(totalWeight) || totalWeight < 0) {
        alert("Masukkan berat/volume yang valid!");
        return;
    }

    let labInput = rgbToLab(hexToRgb(hexColor));

    let closestColors = colorDatabase.map(color => {
        let labColor = rgbToLab(hexToRgb(color.hex));
        let distance = colorDistanceLab(labInput, labColor);
        return { name: color.name, hex: color.hex, distance };
    });

    closestColors.sort((a, b) => a.distance - b.distance);

    let totalDistance = closestColors.reduce((sum, color) => sum + (1 / (1 + color.distance)), 0);

    let resultHTML = "";
    closestColors.forEach(color => {
        let percentage = (1 / (1 + color.distance)) / totalDistance * 100;
        let weight = (percentage / 100) * totalWeight;
        resultHTML += `
            <tr>
                <td style="background-color:${color.hex};">${color.name}</td>
                <td>${percentage.toFixed(1)}%</td>
                <td>${weight.toFixed(1)} gr/ml</td>
            </tr>
        `;
    });

    document.getElementById("result-body").innerHTML = resultHTML;
}

function resetColor() {
    document.getElementById("colorInput").value = "#ffffff";
    document.getElementById("totalWeight").value = "0";
    document.getElementById("result-body").innerHTML = "";
    updateColorDisplay();
}

function updateColorDisplay() {
    document.getElementById("targetColorDisplay").style.backgroundColor = document.getElementById("colorInput").value;
}

function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return { 
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function rgbToLab(rgb) {
    let r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;

    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    let x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
    let y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750) / 1.00000;
    let z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) / 1.08883;

    return {
        l: (116 * y) - 16,
        a: 500 * (x - y),
        b: 200 * (y - z)
    };
}
 
function colorDistanceLab(c1, c2) {
    return Math.sqrt(
        Math.pow(c1.l - c2.l, 2) +
        Math.pow(c1.a - c2.a, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
}
