document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary DOM elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const previewArea = document.getElementById('preview-area');
    const imagePreview = document.getElementById('image-preview');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const compressBtn = document.getElementById('compress-btn');
    const resultArea = document.getElementById('result-area');
    const originalSizeEl = document.getElementById('original-size');
    const compressedSizeEl = document.getElementById('compressed-size');
    const reductionPercentEl = document.getElementById('reduction-percent');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const loader = document.getElementById('loader');

    let originalFile = null;
    let compressedBlobUrl = null;

    // --- Event Listeners ---

    // Trigger file input click when the upload area is clicked
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // Drag and Drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // Update quality value display when slider changes
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
    });

    // Compression logic on button click
    compressBtn.addEventListener('click', compressImage);
    
    // Reset functionality
    resetBtn.addEventListener('click', resetUI);


    // --- Core Functions ---

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        originalFile = file;

        // Use FileReader to show a preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            showUI('preview');
        };
        reader.readAsDataURL(file);
    }

    function compressImage() {
        if (!originalFile) return;

        showUI('loader');

        const quality = parseInt(qualitySlider.value) / 100;
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Get the compressed image as a Blob
                canvas.toBlob((blob) => {
                    displayResults(originalFile.size, blob.size);

                    // Revoke previous blob URL to prevent memory leaks
                    if (compressedBlobUrl) {
                        URL.revokeObjectURL(compressedBlobUrl);
                    }

                    compressedBlobUrl = URL.createObjectURL(blob);
                    downloadBtn.href = compressedBlobUrl;
                    downloadBtn.download = `compressed-${originalFile.name}`;

                    showUI('result');
                }, 'image/jpeg', quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(originalFile);
    }

    function displayResults(originalSize, compressedSize) {
        const reduction = ((originalSize - compressedSize) / originalSize) * 100;
        
        originalSizeEl.textContent = formatBytes(originalSize);
        compressedSizeEl.textContent = formatBytes(compressedSize);
        reductionPercentEl.textContent = `${reduction.toFixed(1)}%`;
    }

    function resetUI() {
        showUI('upload');
        originalFile = null;
        fileInput.value = ''; // Important to allow re-uploading the same file
        if (compressedBlobUrl) {
            URL.revokeObjectURL(compressedBlobUrl);
            compressedBlobUrl = null;
        }
    }

    // --- Helper Functions ---
    
    function showUI(state) {
        uploadArea.style.display = 'none';
        previewArea.style.display = 'none';
        resultArea.style.display = 'none';
        loader.style.display = 'none';

        switch(state) {
            case 'upload':
                uploadArea.style.display = 'flex';
                break;
            case 'preview':
                previewArea.style.display = 'flex';
                break;
            case 'result':
                resultArea.style.display = 'block';
                break;
            case 'loader':
                loader.style.display = 'block';
                break;
        }
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
});
