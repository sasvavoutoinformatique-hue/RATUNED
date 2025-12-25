// Configuration globale
const CONFIG = {
    ratio: 432 / 440, // Ratio de conversion
    quality: 'medium',
    bitrate: 256,
    method: 'pitch'
};

// État de l'application
let appState = {
    audioFile: null,
    audioBuffer: null,
    audioContext: null,
    audioSource: null,
    convertedBuffer: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Éléments DOM
    const elements = {
        dropZone: document.getElementById('dropZone'),
        fileInput: document.getElementById('fileInput'),
        selectFileBtn: document.getElementById('selectFileBtn'),
        selectedFileName: document.getElementById('selectedFileName'),
        audioControls: document.getElementById('audioControls'),
        conversionSettings: document.getElementById('conversionSettings'),
        actionButtons: document.getElementById('actionButtons'),
        resultsSection: document.getElementById('resultsSection'),
        playBtn: document.getElementById('playBtn'),
        pauseBtn: document.getElementById('pauseBtn'),
        stopBtn: document.getElementById('stopBtn'),
        volumeSlider: document.getElementById('volumeSlider'),
        progressSlider: document.getElementById('progressSlider'),
        progressBar: document.getElementById('progressBar'),
        convertBtn: document.getElementById('convertBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        resetBtn: document.getElementById('resetBtn'),
        convertedAudio: document.getElementById('convertedAudio')
    };

    // Gestionnaires d'événements
    setupEventListeners(elements);
    
    // Initialiser l'audio context
    appState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Mettre à jour l'interface
    updateUI();
}

function setupEventListeners(elements) {
    // Drag and drop
    elements.dropZone.addEventListener('dragover', handleDragOver);
    elements.dropZone.addEventListener('dragleave', handleDragLeave);
    elements.dropZone.addEventListener('drop', handleDrop);
    
    // Clic sur la zone de dépôt
    elements.dropZone.addEventListener('click', () => elements.fileInput.click());
    
    // Bouton de sélection de fichier
    elements.selectFileBtn.addEventListener('click', () => elements.fileInput.click());
    
    // Changement de fichier
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Contrôles audio
    elements.playBtn.addEventListener('click', playAudio);
    elements.pauseBtn.addEventListener('click', pauseAudio);
    elements.stopBtn.addEventListener('click', stopAudio);
    elements.volumeSlider.addEventListener('input', updateVolume);
    elements.progressSlider.addEventListener('input', seekAudio);
    
    // Conversion
    elements.convertBtn.addEventListener('click', convertAudio);
    elements.downloadBtn.addEventListener('click', downloadConvertedAudio);
    elements.resetBtn.addEventListener('click', resetApp);
    
    // Paramètres
    document.getElementById('qualitySelect').addEventListener('change', updateConfig);
    document.getElementById('bitrateSelect').addEventListener('change', updateConfig);
    document.getElementById('methodSelect').addEventListener('change', updateConfig);
}

// Gestion des fichiers
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropZone').classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropZone').classList.remove('drag-over');
}

async function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropZone').classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        await processFile(files[0]);
    }
}

async function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        await processFile(files[0]);
    }
}

async function processFile(file) {
    try {
        showLoading();
        
        // Vérifier la taille du fichier (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            throw new Error('Le fichier est trop volumineux (max 50MB)');
        }
        
        // Vérifier le type de fichier
        if (!file.type.startsWith('audio/')) {
            throw new Error('Veuillez sélectionner un fichier audio');
        }
        
        appState.audioFile = file;
        
        // Mettre à jour l'interface
        document.getElementById('selectedFileName').textContent = file.name;
        document.getElementById('trackTitle').textContent = file.name;
        document.getElementById('trackSize').textContent = formatFileSize(file.size);
        
        // Charger le buffer audio
        const arrayBuffer = await file.arrayBuffer();
        appState.audioBuffer = await appState.audioContext.decodeAudioData(arrayBuffer);
        
        // Mettre à jour la durée
        appState.duration = appState.audioBuffer.duration;
        document.getElementById('trackDuration').textContent = formatTime(appState.duration);
        
        // Afficher les contrôles
        showControls();
        
        hideLoading();
        
    } catch (error) {
        console.error('Erreur lors du traitement du fichier:', error);
        alert('Erreur: ' + error.message);
        hideLoading();
    }
}

// Contrôles audio
function playAudio() {
    if (!appState.audioBuffer) return;
    
    if (appState.audioSource) {
        appState.audioSource.stop();
    }
    
    appState.audioSource = appState.audioContext.createBufferSource();
    appState.audioSource.buffer = appState.audioBuffer;
    
    const gainNode = appState.audioContext.createGain();
    gainNode.gain.value = document.getElementById('volumeSlider').value / 100;
    
    appState.audioSource.connect(gainNode);
    gainNode.connect(appState.audioContext.destination);
    
    appState.audioSource.start(0, appState.currentTime);
    appState.isPlaying = true;
    
    // Mettre à jour la progression
    updateProgress();
}

function pauseAudio() {
    if (appState.audioSource && appState.isPlaying) {
        appState.audioSource.stop();
        appState.currentTime = appState.audioContext.currentTime;
        appState.isPlaying = false;
    }
}

function stopAudio() {
    if (appState.audioSource) {
        appState.audioSource.stop();
        appState.currentTime = 0;
        appState.isPlaying = false;
        updateProgressBar(0);
    }
}

function updateVolume() {
    const volume = document.getElementById('volumeSlider').value;
    // Mettre à jour le volume en temps réel si l'audio joue
}

function seekAudio(e) {
    const progress = e.target.value;
    appState.currentTime = (progress / 100) * appState.duration;
    updateProgressBar(progress);
    
    if (appState.isPlaying) {
        playAudio();
    }
}

function updateProgress() {
    if (appState.isPlaying && appState.audioBuffer) {
        const elapsed = appState.audioContext.currentTime - appState.startTime;
        const progress = (elapsed / appState.duration) * 100;
        
        if (progress <= 100) {
            updateProgressBar(progress);
            requestAnimationFrame(updateProgress);
        } else {
            stopAudio();
        }
    }
}

function updateProgressBar(percent) {
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('progressSlider').value = percent;
}

// Conversion audio
async function convertAudio() {
    try {
        showLoading();
        
        if (!appState.audioBuffer) {
            throw new Error('Veuillez d\'abord charger un fichier audio');
        }
        
        // Afficher l'état de conversion
        document.getElementById('convertBtn').innerHTML = '<div class="loading"></div> Conversion en cours...';
        document.getElementById('convertBtn').disabled = true;
        
        // Convertir l'audio
        const convertedBuffer = await convertFrequency(
            appState.audioBuffer,
            CONFIG.ratio,
            CONFIG.method
        );
        
        appState.convertedBuffer = convertedBuffer;
        
        // Créer un blob audio
        const audioBlob = await createAudioBlob(convertedBuffer);
        const url = URL.createObjectURL(audioBlob);
        
        // Mettre à jour le lecteur audio
        document.getElementById('convertedAudio').src = url;
        
        // Mettre à jour les informations
        document.getElementById('resultTitle').textContent = appState.audioFile.name.replace(/\.[^/.]+$/, "") + '_432Hz.mp3';
        document.getElementById('resultDuration').textContent = formatTime(convertedBuffer.duration);
        document.getElementById('resultSize').textContent = formatFileSize(audioBlob.size);
        document.getElementById('resultFormat').textContent = 'MP3';
        
        // Afficher les résultats
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('actionButtons').style.display = 'none';
        document.getElementById('conversionSettings').style.display = 'none';
        
        // Scroller vers les résultats
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
        
        hideLoading();
        
    } catch (error) {
        console.error('Erreur lors de la conversion:', error);
        alert('Erreur lors de la conversion: ' + error.message);
        hideLoading();
    } finally {
        document.getElementById('convertBtn').innerHTML = '<i class="fas fa-magic"></i> Convertir en 432Hz';
        document.getElementById('convertBtn').disabled = false;
    }
}

// Utilitaires
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showLoading() {
    // Ajouter un indicateur de chargement
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loadingOverlay';
    loadingIndicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    loadingIndicator.innerHTML = `
        <div style="text-align: center;">
            <div class="loading" style="width: 50px; height: 50px; margin: 0 auto 20px;"></div>
            <p style="color: #667eea; font-size: 1.2rem;">Traitement en cours...</p>
        </div>
    `;
    document.body.appendChild(loadingIndicator);
}

function hideLoading() {
    const loadingIndicator = document.getElementById('loadingOverlay');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

function showControls() {
    document.getElementById('audioControls').style.display = 'block';
    document.getElementById('conversionSettings').style.display = 'block';
    document.getElementById('actionButtons').style.display = 'flex';
}

function updateConfig() {
    CONFIG.quality = document.getElementById('qualitySelect').value;
    CONFIG.bitrate = parseInt(document.getElementById('bitrateSelect').value);
    CONFIG.method = document.getElementById('methodSelect').value;
}

function resetApp() {
    // Réinitialiser l'état
    appState = {
        audioFile: null,
        audioBuffer: null,
        audioContext: null,
        audioSource: null,
        convertedBuffer: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0
    };
    
    // Réinitialiser l'interface
    document.getElementById('selectedFileName').textContent = 'Aucun fichier sélectionné';
    document.getElementById('audioControls').style.display = 'none';
    document.getElementById('conversionSettings').style.display = 'none';
    document.getElementById('actionButtons').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('fileInput').value = '';
    
    // Réinitialiser le lecteur audio
    if (appState.audioSource) {
        appState.audioSource.stop();
    }
    
    // Réinitialiser le contexte audio
    if (appState.audioContext) {
        appState.audioContext.close();
        appState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Fonctions pour l'interface utilisateur
function updateUI() {
    // Initialiser les valeurs par défaut
    document.getElementById('qualitySelect').value = CONFIG.quality;
    document.getElementById('bitrateSelect').value = CONFIG.bitrate;
    document.getElementById('methodSelect').value = CONFIG.method;
}