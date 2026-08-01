import React, { useState, useRef } from 'react';
import { 
  Send, 
  Mic, 
  Square, 
  Image as ImageIcon, 
  Upload, 
  Volume2, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink, 
  PhoneCall, 
  Info, 
  RotateCcw, 
  Bookmark, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  FileText,
  ArrowRight,
  Shield,
  Camera,
  MessageSquareText,
  CreditCard,
  Smartphone,
  Clock,
  Globe
} from 'lucide-react';
import { InputMode, QueryResponse, SavedItem } from '../types';
import { FREQUENT_SCENARIOS } from '../data/legalCorpus';
import heroIllustration from '../assets/images/hablape_hero_flat_illustration_1785604720032.jpg';

interface QueryModuleProps {
  onSaveItem: (item: SavedItem) => void;
  onOpenAudit: () => void;
  initialQueryResult?: QueryResponse | null;
}

export const QueryModule: React.FC<QueryModuleProps> = ({ onSaveItem, onOpenAudit, initialQueryResult }) => {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // Ref for smooth scrolling to query form
  const inputAreaRef = useRef<HTMLDivElement>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);

  // API Call state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('Analizando la consulta...');
  const [queryResult, setQueryResult] = useState<QueryResponse | null>(initialQueryResult || null);
  const [showPipelineTrace, setShowPipelineTrace] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [playingPhraseIndex, setPlayingPhraseIndex] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quickPrompts = [
    'Me pararon en la calle y no llevo mi DNI físico',
    'El policía me exige desbloquear el celular para ver mi WhatsApp',
    'Me están llevando a la comisaría por control de identidad. ¿Cuánto tiempo pueden retenerme?',
    '¿Qué debo decir si el oficial no me da su nombre ni el motivo de la intervención?',
    'Soy ciudadano extranjero con Carnet CPP y me hicieron un control de identidad'
  ];

  // Start recording voice input
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(audioBlob);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setAudioBase64(base64String);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      setErrorMessage('No se pudo acceder al micrófono. Por favor permite los permisos en tu navegador.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (textToSubmit?: string) => {
    const textQuery = textToSubmit || inputText;
    if (!textQuery.trim() && !audioBase64 && !filePreview) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setQueryResult(null);
    setIsSaved(false);

    // Simulate pipeline steps visual
    const steps = [
      'Clasificando escenario de intervención...',
      'Extrayendo hechos e identificando información faltante...',
      'Consultando RAG en Corpus Oficial (D.S. N° 012-2025-IN y CPP Art. 205)...',
      'Validando motor determinístico de vigencia legal...',
      'Sintetizando explicación y frases recomendadas...'
    ];

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
      }
    }, 900);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textQuery,
          mode: inputMode,
          audioBase64: audioBase64,
          imageBase64: filePreview,
          fileName: selectedFile?.name
        })
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error('Error al procesar la consulta con el servidor');
      }

      const data: QueryResponse = await response.json();
      setQueryResult(data);
    } catch (err: any) {
      console.error('Query error:', err);
      clearInterval(stepInterval);
      setErrorMessage('Ocurrió un error al procesar tu consulta. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPhrase = (phrase: string, index: number) => {
    navigator.clipboard.writeText(phrase);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeakPhrase = async (phrase: string, index: number) => {
    try {
      setPlayingPhraseIndex(index);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'es-PE';
        utterance.rate = 0.95;
        utterance.onend = () => setPlayingPhraseIndex(null);
        utterance.onerror = () => setPlayingPhraseIndex(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setPlayingPhraseIndex(null), 3000);
      }
    } catch (err) {
      setPlayingPhraseIndex(null);
    }
  };

  const handleSaveToHistory = () => {
    if (!queryResult) return;
    onSaveItem({
      id: queryResult.id,
      type: 'query',
      title: queryResult.queryInput.text || 'Consulta de Intervención Policial',
      timestamp: new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      data: queryResult
    });
    setIsSaved(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Section: 🏠 Inicio -> Turquesa (#15B6A6) & Azul Petróleo (#0F3D56) Theme */}
      <div id="hero-banner" className="bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 md:p-10 shadow-xs overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Title & Subtitle */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#15B6A6]/10 text-[#15B6A6] border border-[#15B6A6]/20 text-xs font-bold px-3 py-1 rounded-full">
                <Shield className="w-3.5 h-3.5 text-[#15B6A6]" />
                Inicio • Asistente Ciudadano PE
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#2EB67D]/10 text-[#2EB67D] border border-[#2EB67D]/20 text-xs font-semibold px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2EB67D]" />
                Normativa Oficial Peruana
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F3D56] leading-tight">
              ¿Cómo podemos ayudarte hoy?
            </h1>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              Describe lo sucedido y recibirás orientación basada únicamente en normativa oficial peruana.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  inputAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="px-6 py-3.5 rounded-[18px] bg-[#15B6A6] hover:bg-[#11988A] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-teal-900/10 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>Comenzar consulta</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAudit}
                className="px-5 py-3.5 rounded-[18px] bg-slate-100 hover:bg-slate-200 text-[#0F3D56] font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200/80"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>¿Cómo funciona?</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Flat Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-sm rounded-[22px] overflow-hidden bg-slate-50 border border-slate-200/80 p-3 shadow-2xs">
              <img 
                src={heroIllustration} 
                alt="HablaPE Asistente Ciudadano Perú"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover rounded-[18px] transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Métodos de Consulta: Turquesa Theme (#15B6A6) */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#15B6A6] px-1">
          Métodos de Consulta
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Hablar por voz */}
          <div
            onClick={() => {
              setInputMode('audio');
              inputAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className={`group relative text-left p-6 rounded-[22px] border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
              inputMode === 'audio'
                ? 'bg-white border-[#15B6A6] shadow-md ring-2 ring-[#15B6A6]/20'
                : 'bg-white border-slate-200/90 hover:border-[#15B6A6]/50 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-[18px] bg-[#15B6A6]/10 text-[#15B6A6] border border-[#15B6A6]/20 flex items-center justify-center group-hover:bg-[#15B6A6] group-hover:text-white transition-all duration-300 shadow-2xs">
                  <Mic className="w-6 h-6" />
                </div>
                {inputMode === 'audio' && (
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#15B6A6] text-white uppercase tracking-wider shadow-2xs">
                    Activo
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-[#0F3D56] text-base group-hover:text-[#15B6A6] transition-colors">
                  Hablar por voz
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Explica tu situación hablando naturalmente.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-[14px] bg-[#15B6A6] hover:bg-[#11988A] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Grabar audio</span>
              </button>
            </div>
          </div>

          {/* Card 2: Escribir consulta */}
          <div
            onClick={() => {
              setInputMode('text');
              inputAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className={`group relative text-left p-6 rounded-[22px] border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
              inputMode === 'text'
                ? 'bg-white border-[#0F3D56] shadow-md ring-2 ring-[#0F3D56]/20'
                : 'bg-white border-slate-200/90 hover:border-[#0F3D56]/50 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-[18px] bg-[#0F3D56]/10 text-[#0F3D56] border border-[#0F3D56]/20 flex items-center justify-center group-hover:bg-[#0F3D56] group-hover:text-white transition-all duration-300 shadow-2xs">
                  <MessageSquareText className="w-6 h-6" />
                </div>
                {inputMode === 'text' && (
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#0F3D56] text-white uppercase tracking-wider shadow-2xs">
                    Activo
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-[#0F3D56] text-base group-hover:text-[#0F3D56] transition-colors">
                  Escribir consulta
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Describe lo ocurrido paso a paso.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-[14px] bg-[#0F3D56] hover:bg-[#092B3E] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <MessageSquareText className="w-4 h-4" />
                <span>Escribir mensaje</span>
              </button>
            </div>
          </div>

          {/* Card 3: Tomar una fotografía */}
          <div
            onClick={() => {
              setInputMode('image');
              inputAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className={`group relative text-left p-6 rounded-[22px] border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
              inputMode === 'image'
                ? 'bg-white border-[#15B6A6] shadow-md ring-2 ring-[#15B6A6]/20'
                : 'bg-white border-slate-200/90 hover:border-[#15B6A6]/50 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-[18px] bg-sky-50 text-[#0F3D56] border border-sky-200 flex items-center justify-center group-hover:bg-[#0F3D56] group-hover:text-white transition-all duration-300 shadow-2xs">
                  <Camera className="w-6 h-6" />
                </div>
                {inputMode === 'image' && (
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#15B6A6] text-white uppercase tracking-wider shadow-2xs">
                    Activo
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-[#0F3D56] text-base group-hover:text-[#15B6A6] transition-colors">
                  Tomar una fotografía
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                  Analiza un acta, documento o DNI.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-[14px] bg-[#15B6A6] hover:bg-[#11988A] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Subir imagen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Area */}
      <div ref={inputAreaRef} className="bg-white border border-slate-200/90 rounded-[22px] shadow-xs overflow-hidden">
        <div className="p-6 space-y-4">
          {/* Text Mode */}
          {inputMode === 'text' && (
            <div className="space-y-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ejemplo: La policía me ha detenido en la calle y me pide el celular para revisar mis mensajes. ¿Pueden hacerlo sin orden judicial?"
                rows={4}
                className="w-full p-4 rounded-2xl border border-slate-200 text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#15B6A6] focus:bg-white focus:ring-3 focus:ring-[#15B6A6]/15 transition-all resize-none font-medium"
              />
            </div>
          )}

          {/* Audio Mode */}
          {inputMode === 'audio' && (
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-[20px] text-center space-y-4">
              <p className="text-xs text-slate-600 font-medium max-w-lg mx-auto">
                Graba tu relato de voz explicando la situación que viviste o estás presenciando durante el control policial.
              </p>

              <div className="flex flex-col items-center justify-center gap-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-[#0F3D56] hover:bg-[#092B3E] text-[#15B6A6] border border-[#15B6A6]/30 flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer"
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-[#0F3D56] text-white flex items-center justify-center shadow-lg animate-pulse cursor-pointer border-2 border-[#15B6A6]"
                  >
                    <Square className="w-6 h-6 text-white" />
                  </button>
                )}

                <div className="text-xs font-bold text-slate-700">
                  {isRecording ? (
                    <span className="text-[#15B6A6] font-mono">
                      ● Grabando audio: {recordingSeconds}s
                    </span>
                  ) : audioBase64 ? (
                    <span className="text-[#2EB67D]">
                      ✓ Grabación lista ({Math.round((audioBlob?.size || 0) / 1024)} KB)
                    </span>
                  ) : (
                    'Toca el micrófono para comenzar a grabar'
                  )}
                </div>
              </div>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Añadir aclaración escrita adicional (Opcional)..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#15B6A6]"
              />
            </div>
          )}

          {/* Image Mode */}
          {inputMode === 'image' && (
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-[20px] text-center space-y-4">
              <div className="max-w-md mx-auto space-y-3">
                {filePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-300 max-h-56 mx-auto bg-black flex items-center justify-center">
                    <img src={filePreview} alt="Vista previa" className="max-h-56 object-contain" />
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-black cursor-pointer"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-[#15B6A6] hover:bg-teal-50/20 transition-all">
                    <Upload className="w-8 h-8 text-[#15B6A6] mb-2" />
                    <span className="text-xs font-bold text-[#0F3D56]">Sube o toma una fotografía</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Formatos JPG, PNG, WEBP de actas o documentos</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe la duda sobre la foto subida..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 outline-none focus:border-[#15B6A6]"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 font-medium">
              Gemma 4 RAG • Información legal determinística en tiempo real
            </p>

            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || (!inputText.trim() && !audioBase64 && !filePreview)}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#15B6A6] hover:bg-[#11988A] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? 'Analizando RAG...' : 'Consultar ahora'}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 bg-slate-50 border-t border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-[#15B6A6] border-t-transparent animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-[#0F3D56]">{loadingStep}</h3>
              <p className="text-xs text-slate-500 font-medium">Verificando Código Procesal Penal Art. 205 y D.S. N° 012-2025-IN</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border-t border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Prompts Rápidos Sugeridos */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#15B6A6] px-1">
          Consultas Frecuentes
        </h2>

        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(promptText);
                setInputMode('text');
                handleSubmit(promptText);
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 hover:border-[#15B6A6] hover:bg-teal-50/30 text-xs font-semibold text-slate-700 hover:text-[#0F3D56] transition-all cursor-pointer shadow-2xs text-left"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Query Result Display */}
      {queryResult && (
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-3 h-3 rounded-full bg-[#2EB67D]" />
                <span className="text-xs font-bold text-[#0F3D56] uppercase tracking-wider">
                  {queryResult.scenario?.category || 'Control de Identidad Policial'}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                  queryResult.scenario?.riskLevel === 'alto'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : queryResult.scenario?.riskLevel === 'medio'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  Nivel de Riesgo: {queryResult.scenario?.riskLevel || 'bajo'}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-[#0F3D56]">
                Orientación Legal Ciudadana
              </h2>
            </div>

            <button
              onClick={handleSaveToHistory}
              disabled={isSaved}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-emerald-50 text-[#2EB67D] border-[#2EB67D]/30'
                  : 'bg-[#0F3D56] hover:bg-[#092B3E] text-white border-[#0F3D56]'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'Guardado en Mi Biblioteca' : 'Guardar en Mi Biblioteca'}</span>
            </button>
          </div>

          {/* 1. Resumen Ciudadano (Overview) */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#15B6A6] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#15B6A6]" />
              Resumen Ciudadano
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80">
              {queryResult.explanation?.overview || (queryResult as any).explanationText || 'Orientación legal emitida en base al Decreto Supremo N° 012-2025-IN y el Código Procesal Penal (Art. 205).'}
            </p>
          </div>

          {/* 2. Derechos del Ciudadano & Obligaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Derechos */}
            {queryResult.explanation?.citizenRights && queryResult.explanation.citizenRights.length > 0 && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2EB67D]" />
                  Derechos del Ciudadano
                </h4>
                <ul className="space-y-2 text-xs text-slate-800 font-medium">
                  {queryResult.explanation.citizenRights.map((right, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#2EB67D] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{right}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Obligaciones */}
            {queryResult.explanation?.citizenDuties && queryResult.explanation.citizenDuties.length > 0 && (
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-extrabold text-[#0F3D56] uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#0F3D56]" />
                  Obligaciones del Ciudadano
                </h4>
                <ul className="space-y-2 text-xs text-slate-800 font-medium">
                  {queryResult.explanation.citizenDuties.map((duty, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#0F3D56] font-extrabold text-sm leading-none">•</span>
                      <span className="leading-relaxed">{duty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 3. Qué PUEDE hacer la Policía vs Qué NO PUEDE hacer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Qué PUEDE hacer */}
            {queryResult.explanation?.whatPoliceCanDo && queryResult.explanation.whatPoliceCanDo.length > 0 && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-extrabold text-[#0F3D56] uppercase tracking-wider flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0F3D56]" />
                  Facultades de la Policía
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {queryResult.explanation.whatPoliceCanDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qué NO PUEDE hacer la Policía */}
            {queryResult.explanation?.whatPoliceCannotDo && queryResult.explanation.whatPoliceCannotDo.length > 0 && (
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Lo que la Policía NO PUEDE hacer
                </h4>
                <ul className="space-y-2 text-xs text-slate-800 font-medium">
                  {queryResult.explanation.whatPoliceCannotDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-extrabold text-sm leading-none">✕</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 4. Frases Sugeridas con Reproducción por Voz (TTS) y Copia */}
          {((queryResult.suggestedPhrases && queryResult.suggestedPhrases.length > 0) ||
            ((queryResult as any).recommendedPhrases && (queryResult as any).recommendedPhrases.length > 0)) && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#15B6A6] flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#15B6A6]" />
                Frases Sugeridas para Comunicarte con el Oficial
              </h3>

              <div className="space-y-2.5">
                {(queryResult.suggestedPhrases || (queryResult as any).recommendedPhrases || []).map((item: any, idx: number) => {
                  const phraseText = typeof item === 'string' ? item : item.phrase;
                  const contextText = typeof item === 'object' ? item.context : undefined;

                  return (
                    <div key={idx} className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-bold text-[#0F3D56] italic">
                          "{phraseText}"
                        </p>
                        {contextText && (
                          <p className="text-[11px] text-slate-500 font-medium">
                            💡 Contexto: {contextText}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleSpeakPhrase(phraseText, idx)}
                          className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#15B6A6] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-teal-200/60"
                          title="Escuchar frase"
                        >
                          <Volume2 className="w-4 h-4 text-[#15B6A6]" />
                          <span className="hidden sm:inline">Escuchar</span>
                        </button>

                        <button
                          onClick={() => handleCopyPhrase(phraseText, idx)}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Copiar texto"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-4 h-4 text-[#2EB67D]" />
                              <span className="text-[#2EB67D]">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-slate-500" />
                              <span className="hidden sm:inline">Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Referencias Legales */}
          {queryResult.legalReferences && queryResult.legalReferences.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F3D56] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0F3D56]" />
                Referencias Legales Oficiales
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {queryResult.legalReferences.map((ref, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/90 p-4 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-[#0F3D56] bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                        {ref.document} ({ref.article})
                      </span>
                      {ref.isVigente && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Vigente 2025
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 font-medium leading-relaxed">
                      {ref.summary}
                    </p>
                    {ref.officialUrl && (
                      <a
                        href={ref.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F3D56] hover:underline pt-1"
                      >
                        <span>Ver fuente oficial</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Canales de Derivación */}
          {queryResult.derivationChannels && queryResult.derivationChannels.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F3D56] flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-[#0F3D56]" />
                Canales Oficiales de Reclamo y Orientación
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {queryResult.derivationChannels.map((channel, idx) => (
                  <div key={idx} className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-[#0F3D56]">{channel.entity}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{channel.purpose}</p>
                    </div>

                    <a
                      href={`tel:${channel.phone.replace(/[^0-9]/g, '')}`}
                      className="px-3.5 py-2 rounded-xl bg-[#0F3D56] hover:bg-[#092B3E] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{channel.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Trazabilidad RAG / Auditoría */}
          {queryResult.pipelineTrace && queryResult.pipelineTrace.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPipelineTrace(!showPipelineTrace)}
                className="text-xs font-bold text-[#0F3D56] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>{showPipelineTrace ? 'Ocultar trazabilidad RAG / Auditoría' : 'Ver trazabilidad RAG y auditoría del proceso'}</span>
              </button>

              {showPipelineTrace && (
                <div className="mt-3 p-4 bg-slate-900 text-slate-200 rounded-2xl text-xs space-y-2 font-mono border border-slate-800">
                  <div className="font-extrabold text-[#15B6A6] text-xs">Trazabilidad de Procesamiento Gemma 4 / RAG:</div>
                  {queryResult.pipelineTrace.map((step, idx) => (
                    <div key={idx} className="border-b border-slate-800/80 pb-1.5 pt-1">
                      <span className="text-[#2EB67D] font-bold">✓ {step.title}:</span> {step.details}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Legal base citation */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="font-bold text-[#0F3D56]">Base Legal Citada: D.S. N° 012-2025-IN & CPP Art. 205</span>
            <span className="text-[11px] font-mono text-slate-400">Verificado determinísticamente</span>
          </div>
        </div>
      )}
    </div>
  );
};
