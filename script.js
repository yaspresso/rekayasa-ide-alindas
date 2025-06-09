let currentSarrusStep = 0; // Melacak langkah Sarrus saat ini
let sarrusSteps = []; // Menyimpan elemen-elemen yang divisualisasikan per langkah

function calculateMatrix() {
    // Ambil nilai dari input matriks
    const a = parseFloat(document.getElementById('a11').value);
    const b = parseFloat(document.getElementById('a12').value);
    const c = parseFloat(document.getElementById('a13').value);
    const d = parseFloat(document.getElementById('a21').value);
    const e = parseFloat(document.getElementById('a22').value);
    const f = parseFloat(document.getElementById('a23').value);
    const g = parseFloat(document.getElementById('a31').value);
    const h = parseFloat(document.getElementById('a32').value);
    const i = parseFloat(document.getElementById('a33').value);

    // Pastikan semua input terisi angka
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f) || isNaN(g) || isNaN(h) || isNaN(i)) {
        alert("Mohon masukkan semua angka pada matriks.");
        return;
    }

    const matrix = [
        [a, b, c],
        [d, e, f],
        [g, h, i]
    ];

    // --- Persiapan Visualisasi Sarrus ---
    const extendedMatrixData = [
        [a, b, c, a, b],
        [d, e, f, d, e],
        [g, h, i, g, h]
    ];
    displayExtendedMatrix(extendedMatrixData, 'extendedMatrixDisplay');

    // Kosongkan langkah-langkah sebelumnya
    sarrusSteps = [];
    currentSarrusStep = 0;

    // Dapatkan kontainer matriks diperluas setelah dirender
    const extendedMatrixContainer = document.getElementById('extendedMatrixDisplay');
    const cells = extendedMatrixContainer.querySelectorAll('.cell');

    // Hapus panah lama jika ada
    document.querySelectorAll('.sarrus-line').forEach(line => line.remove());

    // Fungsi untuk membuat dan menambahkan elemen panah
    function createArrow(startCellIndex, endCellIndex, type) {
        const startCell = cells[startCellIndex];
        const endCell = cells[endCellIndex];

        if (!startCell || !endCell) {
            console.error('Sel tidak ditemukan untuk indeks:', startCellIndex, endCellIndex);
            return null; // Mengembalikan null jika sel tidak ditemukan
        }

        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
        const containerRect = extendedMatrixContainer.getBoundingClientRect();

        const startX = Math.round(((startRect.left + startRect.right) / 2) - containerRect.left);
        const startY = Math.round(((startRect.top + startRect.bottom) / 2) - containerRect.top);
        const endX = Math.round(((endRect.left + endRect.right) / 2) - containerRect.left);
        const endY = Math.round(((endRect.top + endRect.bottom) / 2) - containerRect.top);

        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

        const line = document.createElement('div');
        line.classList.add('sarrus-line', type);
        line.style.width = `${length}px`;
        line.style.left = `${startX}px`;
        line.style.top = `${startY}px`;
        line.style.transform = `rotate(${angle}deg)`;

        extendedMatrixContainer.appendChild(line);
        return line; // Mengembalikan elemen panah
    }

    // --- Perhitungan Determinan (Metode Sarrus) ---
    const product1_pos = a * e * i;
    const product2_pos = b * f * g;
    const product3_pos = c * d * h;
    const sumPositive = product1_pos + product2_pos + product3_pos;

    const product1_neg = c * e * g;
    const product2_neg = a * f * h;
    const product3_neg = b * d * i;
    const sumNegative = product1_neg + product2_neg + product3_neg;

    const determinant = sumPositive - sumNegative;

    // Reset konten produk
    document.getElementById('sarrusPositiveProducts').innerHTML = '';
    document.getElementById('sarrusNegativeProducts').innerHTML = '';

    // --- Definisi Langkah-Langkah Sarrus ---
    // Pastikan elemen h3 dan p yang relevan ada di DOM saat ini
    const h3Positif = document.querySelector('.sarrus-explanation h3:nth-of-type(1)');
    const h3Negatif = document.querySelector('.sarrus-explanation h3:nth-of-type(2)');
    const pDeterminanFormula = document.querySelector('.sarrus-explanation p:nth-of-type(3)');
    const pMatriksDiperluas = document.querySelector('.sarrus-explanation p:nth-of-type(1)'); // "Matriks diperluas..."

    // Langkah 0: Matriks diperluas
    sarrusSteps.push({
        visibleElements: [extendedMatrixContainer, pMatriksDiperluas],
        hideElements: [
            document.getElementById('sarrusPositiveProducts'),
            document.getElementById('sarrusNegativeProducts'),
            document.getElementById('sarrusPositiveSum'),
            document.getElementById('sarrusNegativeSum'),
            document.getElementById('determinantResult'),
            h3Positif, h3Negatif, pDeterminanFormula
        ],
        message: 'Matriks 3x3 diperluas dengan menyalin dua kolom pertama ke sisi kanan.'
    });

    // Langkah 1: Panah Positif 1
    const arrowPos1 = createArrow(0 * 5 + 0, 2 * 5 + 2, 'positive');
    const prodPos1Div = createProductItem(`${a} &times; ${e} &times; ${i} = ${product1_pos}`, 'positive');
    document.getElementById('sarrusPositiveProducts').appendChild(prodPos1Div);
    sarrusSteps.push({
        visibleElements: [extendedMatrixContainer, pMatriksDiperluas, arrowPos1, prodPos1Div],
        hideElements: [document.getElementById('sarrusPositiveSum'), document.getElementById('sarrusNegativeProducts'), document.getElementById('sarrusNegativeSum'), document.getElementById('determinantResult'), h3Positif, h3Negatif, pDeterminanFormula],
        message: `Produk diagonal positif pertama: (${a}) &times; (${e}) &times; (${i}) = ${product1_pos}`
    });

    // Langkah 2: Panah Positif 2
    const arrowPos2 = createArrow(0 * 5 + 1, 2 * 5 + 3, 'positive');
    const prodPos2Div = createProductItem(`${b} &times; ${f} &times; ${g} = ${product2_pos}`, 'positive');
    document.getElementById('sarrusPositiveProducts').appendChild(prodPos2Div);
    sarrusSteps.push({
        visibleElements: [extendedMatrixContainer, pMatriksDiperluas, arrowPos1, arrowPos2, prodPos1Div, prodPos2Div],
        hideElements: [document.getElementById('sarrusPositiveSum'), document.getElementById('sarrusNegativeProducts'), document.getElementById('sarrusNegativeSum'), document.getElementById('determinantResult'), h3Positif, h3Negatif, pDeterminanFormula],
        message: `Produk diagonal positif kedua: (${b}) &times; (${f}) &times; (${g}) = ${product2_pos}`
    });

    // Langkah 3: Panah Positif 3 + Total Positif
    const arrowPos3 = createArrow(0 * 5 + 2, 2 * 5 + 4, 'positive');
    const prodPos3Div = createProductItem(`${c} &times; ${d} &times; ${h} = ${product3_pos}`, 'positive');
    document.getElementById('sarrusPositiveProducts').appendChild(prodPos3Div);
    document.getElementById('sarrusPositiveSum').innerText = sumPositive;
    sarrusSteps.push({
        visibleElements: [extendedMatrixContainer, pMatriksDiperluas, arrowPos1, arrowPos2, arrowPos3, prodPos1Div, prodPos2Div, prodPos3Div, h3Positif, document.getElementById('sarrusPositiveSum')],
        hideElements: [document.getElementById('sarrusNegativeProducts'), document.getElementById('sarrusNegativeSum'), document.getElementById('determinantResult'), h3Negatif, pDeterminanFormula],
        message: `Produk diagonal positif ketiga: (${c}) &times; (${d}) &times; (${h}) = ${product3_pos}. Total semua produk positif adalah ${sumPositive}.`
    });

    // Langkah 4: Panah Negatif 1
    const arrowNeg1 = createArrow(0 * 5 + 2, 2 * 5 + 0, 'negative');
    const prodNeg1Div = createProductItem(`${c} &times; ${e} &times; ${g} = ${product1_neg}`, 'negative');
    document.getElementById('sarrusNegativeProducts').appendChild(prodNeg1Div);
    sarrusSteps.push({
        visibleElements: [extendedMatrixContainer, pMatriksDiperluas, arrowPos1, arrowPos2, arrowPos3, arrowNeg1, prodPos1Div, prodPos2Div, prodPos3Div, h3Positif, document.getElementById('sarrusPositiveSum'), h3Negatif, prodNeg1Div],
        hideElements: [document.getElementById('sarrusNegativeSum'), document.getElementById('determinantResult'), pDeterminanFormula],
        message: `Sekarang untuk produk diagonal negatif. Pertama: (${c}) &times; (${e}) &times; (${g}) = ${product1_neg}.`
    });

    // Langkah 5: Panah Negatif 2
    const arrowNeg2 = createArrow(0 * 5 + 3, 2 * 5 + 1, 'negative');
    const prodNeg2Div = createProductItem(`${a} &times; ${f} &times; ${h} = ${product2_neg}`, 'negative');
    document.getElementById('sarrusNegativeProducts').appendChild(prodNeg2Div);
    sarrusSteps.push({
        visibleElements: [extendedMatrixContainer, pMatriksDiperluas, arrowPos1, arrowPos2, arrowPos3, arrowNeg1, arrowNeg2, prodPos1Div, prodPos2Div, prodPos3Div, h3Positif, document.getElementById('sarrusPositiveSum'), h3Negatif, prodNeg1Div, prodNeg2Div],
        hideElements: [document.getElementById('sarrusNegativeSum'), document.getElementById('determinantResult'), pDeterminanFormula],
        message: `Produk diagonal negatif kedua: (${a}) &times; (${f}) &times; (${h}) = ${product2_neg}.`
    });

    // Langkah 6: Panah Negatif 3 + Total Negatif + Final Determinan
    const arrowNeg3 = createArrow(0 * 5 + 4, 2 * 5 + 2, 'negative');
    const prodNeg3Div = createProductItem(`${b} &times; ${d} &times; ${i} = ${product3_neg}`, 'negative');
    document.getElementById('sarrusNegativeProducts').appendChild(prodNeg3Div);
    document.getElementById('sarrusNegativeSum').innerText = sumNegative;
    document.getElementById('determinantResult').innerText = determinant;
    sarrusSteps.push({
        visibleElements: [extendedMatrixContainer, pMatriksDiperluas, arrowPos1, arrowPos2, arrowPos3, arrowNeg1, arrowNeg2, arrowNeg3, prodPos1Div, prodPos2Div, prodPos3Div, h3Positif, document.getElementById('sarrusPositiveSum'), h3Negatif, prodNeg1Div, prodNeg2Div, prodNeg3Div, document.getElementById('sarrusNegativeSum'), document.getElementById('determinantResult'), pDeterminanFormula],
        hideElements: [],
        message: `Produk diagonal negatif ketiga: (${b}) &times; (${d}) &times; (${i}) = ${product3_neg}. Total semua produk negatif adalah ${sumNegative}. Determinan akhir adalah ${sumPositive} - ${sumNegative} = ${determinant}.`
    });

    // Initial state setup for Sarrus (display first step)
    // Beri sedikit delay agar DOM punya waktu untuk dirender sepenuhnya sebelum menghitung posisi panah
    setTimeout(() => {
        showSarrusStep(currentSarrusStep);
        updateSarrusNavButtons();
    }, 100);


    // --- Fungsi untuk menghitung determinan matriks 2x2 ---
    function det2x2(m) {
        return (m[0][0] * m[1][1]) - (m[0][1] * m[1][0]);
    }

    // --- Fungsi untuk mendapatkan sub-matriks (untuk minor) ---
    function getSubmatrix(mat, r, c) {
        const sub = [];
        for (let i = 0; i < 3; i++) {
            if (i === r) continue;
            let row = [];
            for (let j = 0; j < 3; j++) {
                if (j === c) continue;
                row.push(mat[i][j]);
            }
            sub.push(row);
        }
        return sub;
    }

    // --- Perhitungan Matriks Minor & Penjelasan ---
    let minorExplanationHtml = '<p>Untuk menghitung elemen minor M<sub>ij</sub>, kita menghilangkan baris ke-i dan kolom ke-j, lalu menghitung determinan dari sub-matriks 2 &times; 2 yang tersisa.</p>';
    let minorMatrixValues = [];

    for (let r = 0; r < 3; r++) {
        minorExplanationHtml += `<h3 class="minor-step" id="minor-step-${r+1}-row-title">Minor Baris ${r + 1}</h3>`;
        let row = [];
        for (let c = 0; c < 3; c++) {
            const sub = getSubmatrix(matrix, r, c);
            const minorValue = det2x2(sub);
            row.push(minorValue);

            minorExplanationHtml += `
                <div class="minor-step" id="minor-step-${r+1}-${c+1}">
                    <p>M<sub>${r + 1}${c + 1}</sub> (elemen di baris ${r + 1}, kolom ${c + 1}):</p>
                    <div class="submatrix-display">
                        <span>|</span>
                        <div class="submatrix-grid">
                            <div class="cell">${sub[0][0]}</div>
                            <div class="cell">${sub[0][1]}</div>
                            <div class="cell">${sub[1][0]}</div>
                            <div class="cell">${sub[1][1]}</div>
                        </div>
                        <span>|</span>
                    </div>
                    <div class="calculation-step">
                        (${sub[0][0]} &times; ${sub[1][1]}) - (${sub[0][1]} &times; ${sub[1][0]}) = ${minorValue}
                    </div>
                    <hr>
                </div>
            `;
        }
        minorMatrixValues.push(row);
    }
    document.getElementById('minorExplanation').innerHTML = minorExplanationHtml;
    displayMatrix(minorMatrixValues, 'minorMatrixResult');


    // --- Perhitungan Matriks Kofaktor & Penjelasan ---
    let cofactorMatrix = [];
    let cofactorExplanationHtml = '<p>Untuk menghitung elemen kofaktor C<sub>ij</sub>, kita menggunakan rumus C<sub>ij</sub> = (-1)<sup>i+j</sup> &times; M<sub>ij</sub>, di mana M<sub>ij</sub> adalah minor yang sesuai.</p>';
    cofactorExplanationHtml += '<p>Tanda ditentukan oleh posisi: (+, -, +), (-, +, -), (+, -, +)</p>';


    for (let r = 0; r < 3; r++) {
        cofactorExplanationHtml += `<h3 class="minor-step" id="cofactor-step-${r+1}-row-title">Kofaktor Baris ${r + 1}</h3>`;
        let row = [];
        for (let c = 0; c < 3; c++) {
            const sign = ((r + c) % 2 === 0) ? 1 : -1;
            const cofactorValue = sign * minorMatrixValues[r][c];
            row.push(cofactorValue);

            const signSymbol = (sign === 1) ? '+' : '-';
            const termSign = (sign === 1) ? '' : '-';

            cofactorExplanationHtml += `
                <div class="minor-step" id="cofactor-step-${r + 1}-${c + 1}">
                    <p>C<sub>${r + 1}${c + 1}</sub> = <span class="cofactor-sign">(${signSymbol}1)</span> &times; M<sub>${r + 1}${c + 1}</sub></p>
                    <div class="calculation-step">
                        C<sub>${r + 1}${c + 1}</sub> = ${termSign}${Math.abs(minorMatrixValues[r][c])} = ${cofactorValue}
                    </div>
                    <hr>
                </div>
            `;
        }
        cofactorMatrix.push(row);
    }
    document.getElementById('cofactorExplanation').innerHTML = cofactorExplanationHtml;
    displayMatrix(cofactorMatrix, 'cofactorMatrixResult');

    // Visualisasi minor/kofaktor juga dimulai dari langkah pertama
    showMinorCofactorStep(0); // Menampilkan hanya instruksi awal
}

// Fungsi untuk membuat elemen produk Sarrus
function createProductItem(text, type) {
    const div = document.createElement('div');
    div.classList.add('sarrus-product-item'); // Hapus class sarrus-${type}-products dari sini
    div.innerHTML = text;
    return div;
}


// --- Fungsi Navigasi Langkah Sarrus ---
function navigateSarrus(direction) {
    currentSarrusStep += direction;

    if (currentSarrusStep < 0) {
        currentSarrusStep = 0;
    } else if (currentSarrusStep >= sarrusSteps.length) {
        currentSarrusStep = sarrusSteps.length - 1;
    }

    showSarrusStep(currentSarrusStep);
    updateSarrusNavButtons();
}

function showSarrusStep(stepIndex) {
    // Sembunyikan semua elemen yang mungkin aktif dari langkah sebelumnya
    document.querySelectorAll('.sarrus-line').forEach(line => line.classList.remove('active'));
    document.querySelectorAll('.sarrus-product-item').forEach(item => item.classList.remove('active'));

    const allSarrusExplanationElements = document.querySelectorAll('.sarrus-explanation h3, .sarrus-explanation p, .sarrus-product-row p.sarrus-sum, .sarrus-explanation p.final-determinant');
    allSarrusExplanationElements.forEach(el => {
        el.style.opacity = 0;
        el.style.display = 'none';
    });

    // Pastikan kontainer produk disembunyikan sepenuhnya
    document.getElementById('sarrusPositiveProducts').style.opacity = 0;
    document.getElementById('sarrusPositiveProducts').style.display = 'none';
    document.getElementById('sarrusNegativeProducts').style.opacity = 0;
    document.getElementById('sarrusNegativeProducts').style.display = 'none';


    const extendedMatrixContainer = document.getElementById('extendedMatrixDisplay');
    extendedMatrixContainer.style.opacity = 0;
    extendedMatrixContainer.style.display = 'grid'; // Pastikan display tetap grid, hanya opacity yang berubah

    // Tampilkan elemen sesuai langkah saat ini
    const step = sarrusSteps[stepIndex];
    if (step) {
        // Tampilkan elemen yang seharusnya terlihat pada langkah ini
        step.visibleElements.forEach(el => {
            if (el) {
                el.classList.add('active'); // Tambahkan active class untuk transisi opacity CSS
                el.style.opacity = 1;
                el.style.display = ''; // Kembalikan display default
            }
        });

        // Khusus untuk kontainer produk, atur display flex
        if (step.visibleElements.includes(document.getElementById('sarrusPositiveProducts'))) {
            document.getElementById('sarrusPositiveProducts').style.display = 'flex';
        }
        if (step.visibleElements.includes(document.getElementById('sarrusNegativeProducts'))) {
            document.getElementById('sarrusNegativeProducts').style.display = 'flex';
        }
    }
}


function updateSarrusNavButtons() {
    document.getElementById('prevSarrusStep').disabled = (currentSarrusStep === 0);
    document.getElementById('nextSarrusStep').disabled = (currentSarrusStep === sarrusSteps.length - 1);
}

// --- Fungsi Navigasi Langkah Minor/Kofaktor (contoh awal) ---
// Ini masih manual, bisa dikembangkan lebih lanjut menjadi navigasi per elemen jika diperlukan
function showMinorCofactorStep(stepIndex) {
    // Sembunyikan semua elemen langkah minor/kofaktor
    document.querySelectorAll('#minorExplanation .minor-step, #cofactorExplanation .minor-step').forEach(el => {
        el.style.opacity = 0;
        el.style.display = 'none';
    });

    // Tampilkan paragraf penjelasan awal untuk minor dan kofaktor
    const minorIntroP = document.querySelector('#minorExplanation > p:first-of-type');
    const cofactorIntroP1 = document.querySelector('#cofactorExplanation > p:first-of-type');
    const cofactorIntroP2 = document.querySelector('#cofactorExplanation > p:nth-of-type(2)');

    if (minorIntroP) { minorIntroP.style.opacity = 1; minorIntroP.style.display = ''; }
    if (cofactorIntroP1) { cofactorIntroP1.style.opacity = 1; cofactorIntroP1.style.display = ''; }
    if (cofactorIntroP2) { cofactorIntroP2.style.opacity = 1; cofactorIntroP2.style.display = ''; }


    // Tampilkan langkah awal (judul dan elemen pertama)
    // Minor
    const minorH3_1 = document.getElementById('minor-step-1-row-title');
    const minorDiv_1_1 = document.getElementById('minor-step-1-1');
    if (minorH3_1) { minorH3_1.style.opacity = 1; minorH3_1.style.display = ''; }
    if (minorDiv_1_1) { minorDiv_1_1.style.opacity = 1; minorDiv_1_1.style.display = ''; }

    // Kofaktor
    const cofactorH3_1 = document.getElementById('cofactor-step-1-row-title');
    const cofactorDiv_1_1 = document.getElementById('cofactor-step-1-1');
    if (cofactorH3_1) { cofactorH3_1.style.opacity = 1; cofactorH3_1.style.display = ''; }
    if (cofactorDiv_1_1) { cofactorDiv_1_1.style.opacity = 1; cofactorDiv_1_1.style.display = ''; }

    // Catatan: Untuk minor dan kofaktor, ini baru menampilkan elemen pertama dari setiap bagian.
    // Jika neng ingin visualisasi langkah demi langkah yang serupa dengan Sarrus,
    // perlu dibuat array `minorSteps` dan `cofactorSteps` terpisah
    // dengan fungsi `MapsMinor()` dan `MapsCofactor()` yang serupa.
    // Ini bisa jadi pengembangan di Projek nanti!
}


// --- Fungsi untuk menampilkan matriks 3x3 di HTML ---
function displayMatrix(mat, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const div = document.createElement('div');
            div.innerText = mat[r][c];
            container.appendChild(div);
        }
    }
}

// --- Fungsi untuk menampilkan matriks diperluas (Sarrus) di HTML ---
function displayExtendedMatrix(mat, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
            const div = document.createElement('div');
            div.innerText = mat[r][c];
            if (c >= 3) {
                div.classList.add('copy-col');
            }
            div.classList.add('cell');
            container.appendChild(div);
        }
    }
}

// Set nilai default saat halaman dimuat dan panggil calculateMatrix
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('a11').value = 2;
    document.getElementById('a12').value = -1;
    document.getElementById('a13').value = 3;
    document.getElementById('a21').value = 4;
    document.getElementById('a22').value = -2;
    document.getElementById('a23').value = -4;
    document.getElementById('a31').value = 1;
    document.getElementById('a32').value = 5;
    document.getElementById('a33').value = -3;

    // Panggil fungsi hitung saat DOMContentLoaded agar langsung tampil hasilnya
    calculateMatrix();
});