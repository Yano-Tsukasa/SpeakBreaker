class AudioDelayEngine {
    constructor(delayTime = 1.0) {
        this.audioContext = null;
        this.microphone = null;
        this.processor = null;
        this.delayNode = null;
        this.gainNode = null;
        this.dryGain = null;
        this.wetGain = null;
        this.isRunning = false;
        this.delayTime = delayTime; // デフォルト値を設定可能
    }

    setDelayTime(seconds) {
        this.delayTime = parseFloat(seconds);
        console.log(`遅延時間を ${this.delayTime} 秒に設定`);
    }

    getDelayTime() {
        return this.delayTime;
    }

    async initialize() {
        try {
            // AudioContextの作成
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // マイク入力の取得
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });
            
            // マイクのソースを作成
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            
            // ScriptProcessorNodeまたはAudioWorkletNodeを作成（遅延処理用）
            const bufferSize = this.audioContext.sampleRate * this.delayTime;
            this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
            
            // 遅延バッファ
            this.delayBuffer = new Float32Array(bufferSize);
            this.delayBufferIndex = 0;
            
            // ゲインノード（音量制御用）
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = 1.0;
            
            // ドライ（直接入力）とウェット（遅延）の音量制御
            this.dryGain = this.audioContext.createGain();
            this.wetGain = this.audioContext.createGain();
            this.dryGain.gain.value = 0; // 直接入力は無音（遅延版のみを聞く）
            this.wetGain.gain.value = 1.0;
            
            // ノード接続
            this.microphone.connect(this.processor);
            this.processor.connect(this.dryGain);
            this.processor.connect(this.wetGain);
            this.dryGain.connect(this.gainNode);
            this.wetGain.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            
            // オーディオ処理コールバック
            this.processor.onaudioprocess = (event) => this.processAudio(event);
            
            // 情報表示
            this.updateTechInfo();
            
            return true;
        } catch (error) {
            console.error('初期化エラー:', error);
            throw error;
        }
    }

    processAudio(event) {
        const input = event.inputBuffer.getChannelData(0);
        const output = event.outputBuffer.getChannelData(0);
        
        // 遅延バッファに入力を書き込み、出力する
        for (let i = 0; i < input.length; i++) {
            // バッファに入力を格納
            this.delayBuffer[this.delayBufferIndex] = input[i];
            
            // バッファから遅延した出力を読み込み
            output[i] = this.delayBuffer[this.delayBufferIndex];
            
            // インデックスを進める（リングバッファ）
            this.delayBufferIndex = (this.delayBufferIndex + 1) % this.delayBuffer.length;
        }
    }

    start() {
        if (this.audioContext && !this.isRunning) {
            this.audioContext.resume().then(() => {
                this.isRunning = true;
                console.log('オーディオ処理開始');
            });
        }
    }

    stop() {
        this.isRunning = false;
        if (this.processor) {
            this.processor.disconnect();
        }
        console.log('オーディオ処理停止');
    }

    updateTechInfo() {
        if (this.audioContext) {
            const sampleRate = this.audioContext.sampleRate;
            const bufferSize = sampleRate * this.delayTime;
            
            document.getElementById('sampleRate').textContent = sampleRate.toLocaleString();
            document.getElementById('channels').textContent = 'モノラル (1)';
            document.getElementById('delayTime').textContent = this.delayTime;
            document.getElementById('bufferSize').textContent = Math.floor(bufferSize).toLocaleString();
        }
    }

    getAudioContext() {
        return this.audioContext;
    }

    isInitialized() {
        return this.audioContext !== null;
    }
}

// グローバルエンジンインスタンス
let audioEngine = null;

// UI制御
const toggleBtn = document.getElementById('toggleBtn');
const statusText = document.getElementById('status');
const errorBox = document.getElementById('errorBox');
const errorMessage = document.getElementById('errorMessage');
const delaySelect = document.getElementById('delaySelect');
const selectedDelayDisplay = document.getElementById('selectedDelay');

// 遅延秒数選択イベント
delaySelect.addEventListener('change', async (e) => {
    const newDelay = e.target.value;
    selectedDelayDisplay.textContent = newDelay;
    
    if (audioEngine) {
        const wasRunning = audioEngine.isRunning;
        
        if (wasRunning) {
            // 実行中の場合、一度停止して遅延秒数を変更してから再開
            audioEngine.stop();
            statusText.textContent = '遅延秒数を変更中...';
        }
        
        // 遅延秒数を設定
        audioEngine.setDelayTime(newDelay);
        audioEngine.updateTechInfo();
        
        if (wasRunning) {
            // 再開
            await new Promise(resolve => setTimeout(resolve, 100));
            audioEngine = new AudioDelayEngine(parseFloat(newDelay));
            
            try {
                await audioEngine.initialize();
                audioEngine.start();
                statusText.textContent = '実行中';
                statusText.classList.add('running');
                errorBox.style.display = 'none';
            } catch (error) {
                console.error('再開エラー:', error);
                statusText.textContent = '停止中';
                statusText.classList.remove('running');
                toggleBtn.textContent = '開始';
                toggleBtn.classList.remove('running');
                errorBox.style.display = 'block';
                errorMessage.textContent = '遅延秒数の変更に失敗しました';
            }
        }
    }
});

toggleBtn.addEventListener('click', async () => {
    try {
        if (!audioEngine) {
            const delaySeconds = parseFloat(delaySelect.value);
            audioEngine = new AudioDelayEngine(delaySeconds);
            await audioEngine.initialize();
        }

        if (audioEngine.isRunning) {
            audioEngine.stop();
            statusText.textContent = '停止中';
            statusText.classList.remove('running');
            toggleBtn.textContent = '開始';
            toggleBtn.classList.remove('running');
            errorBox.style.display = 'none';
        } else {
            audioEngine.start();
            statusText.textContent = '実行中';
            statusText.classList.add('running');
            toggleBtn.textContent = '停止';
            toggleBtn.classList.add('running');
            errorBox.style.display = 'none';
        }
    } catch (error) {
        console.error('エラー:', error);
        errorBox.style.display = 'block';
        
        if (error.name === 'NotAllowedError') {
            errorMessage.textContent = 'マイクへのアクセスが許可されていません。ブラウザの設定でマイクアクセスを許可してください。';
        } else if (error.name === 'NotFoundError') {
            errorMessage.textContent = 'マイクが見つかりません。デバイスにマイクが接続されていることを確認してください。';
        } else {
            errorMessage.textContent = `エラーが発生しました: ${error.message}`;
        }
        
        // ボタン状態をリセット
        if (audioEngine) {
            audioEngine.stop();
        }
        statusText.textContent = '停止中';
        statusText.classList.remove('running');
        toggleBtn.textContent = '開始';
        toggleBtn.classList.remove('running');
    }
});

// ページを離れるときにリソースをクリーンアップ
window.addEventListener('beforeunload', () => {
    if (audioEngine) {
        audioEngine.stop();
    }
});

// AudioContextが一時停止状態の場合に再開
document.addEventListener('click', () => {
    if (audioEngine && audioEngine.getAudioContext()) {
        audioEngine.getAudioContext().resume();
    }
});
