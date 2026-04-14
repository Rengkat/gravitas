"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { Send, Mic, MicOff, Settings, Loader2 } from "lucide-react";
import { sendChatMessage, SUBJECTS, WELCOME_MESSAGE } from "@/lib/constants/ai-tutor";
import { Conversation, Difficulty, Message, ResponseStyle, Subject } from "@/types/ai-tutor";
import { buildSystemPrompt, QUICK_PROMPTS, SUGGESTIONS } from "@/lib/mock/ai-tutor";
import Sidebar from "./SideBar";
import SettingsPanel from "./SettingsPanel";
import MessageBubble from "./MessageBubble";
import Header from "./Header";

// ── Inline Web Speech API types (avoids @types/dom-speech-recognition issues) ──
interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}
// ────────────────────────────────────────────────────────────────────────────────

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject>("general");
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>("detailed");
  const [pidgin, setPidgin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Understanding Physics",
      lastMessage: "Newton's laws…",
      timestamp: new Date(Date.now() - 86_400_000),
      messageCount: 12,
      subject: "physics",
    },
    {
      id: "2",
      title: "Mathematics Problem Set",
      lastMessage: "Quadratic equations…",
      timestamp: new Date(Date.now() - 172_800_000),
      messageCount: 8,
      subject: "mathematics",
    },
    {
      id: "3",
      title: "WAEC English Prep",
      lastMessage: "Essay structure…",
      timestamp: new Date(Date.now() - 259_200_000),
      messageCount: 5,
      subject: "english",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const recognRef = useRef<ISpeechRecognition | null>(null);

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [input]);

  /* Close settings panel when clicking outside */
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        settingsBtnRef.current &&
        !settingsBtnRef.current.closest("[data-settings-container]")?.contains(target)
      ) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [settingsOpen]);

  /* Voice input */
  const toggleRecording = useCallback(() => {
    // ✅ reads from window directly — no typeof SpeechRecognition needed
    const SR: ISpeechRecognitionConstructor | undefined =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SR) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recog = new SR();
    recog.lang = "en-NG";
    recog.interimResults = true;
    recog.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
    };
    recog.onend = () => setIsRecording(false);
    recog.start();
    recognRef.current = recog;
    setIsRecording(true);
  }, [isRecording]);

  /* Send message */
  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isLoading) return;

      setInput("");
      setIsLoading(true);

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
        subject: selectedSubject,
      };

      const streamingId = `${Date.now() + 1}`;
      const streamingMsg: Message = {
        id: streamingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        subject: selectedSubject,
        streaming: true,
      };

      setMessages((prev) => [...prev, userMsg, streamingMsg]);

      try {
        const systemPrompt = buildSystemPrompt(selectedSubject, difficulty, responseStyle, pidgin);

        const history = messages
          .filter((m) => !m.streaming && m.id !== "welcome")
          .slice(-12)
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

        const responseText = await sendChatMessage({
          systemPrompt,
          history,
          userMessage: content,
        });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId ? { ...m, content: responseText, streaming: false } : m,
          ),
        );

        setConversations((prev) => {
          const title = content.slice(0, 40) + (content.length > 40 ? "…" : "");
          const [first, ...rest] = prev;
          if (first?.id === "current") {
            return [
              { ...first, lastMessage: content, messageCount: first.messageCount + 1 },
              ...rest,
            ];
          }
          return [
            {
              id: "current",
              title,
              lastMessage: content,
              timestamp: new Date(),
              messageCount: 1,
              subject: selectedSubject,
            },
            ...prev,
          ];
        });
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? {
                  ...m,
                  content: "⚠️ Something went wrong. Please check your connection and try again.",
                  streaming: false,
                }
              : m,
          ),
        );
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, isLoading, messages, selectedSubject, difficulty, responseStyle, pidgin],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
  };

  const handleFeedback = (id: string, feedback: "like" | "dislike") => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, feedback } : m)));
  };

  const currentSubject = SUBJECTS.find((s) => s.id === selectedSubject) ?? SUBJECTS[0];

  return (
    <>
      <style>{`
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to { transform: rotate(360deg); } }
      `}</style>

      <div
        data-testid="ai-tutor-page"
        className="flex flex-col h-screen bg-cream font-sans overflow-hidden">
        <Header
          clearChat={clearChat}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentSubject={currentSubject}
          pidgin={pidgin}
          selectedSubject={selectedSubject}
        />

        <div className="flex-1 flex overflow-hidden relative">
          {sidebarOpen && (
            <div
              id="mobile-sidebar"
              role="dialog"
              aria-label="Subject selection sidebar"
              aria-modal="true"
              className="absolute inset-0 z-40 flex">
              <div
                className="absolute inset-0 bg-green-900/40"
                aria-hidden="true"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="relative z-[41] w-[280px] h-full">
                <Sidebar
                  selectedSubject={selectedSubject}
                  setSelectedSubject={setSelectedSubject}
                  conversations={conversations}
                  onNewChat={() => {
                    clearChat();
                    setSidebarOpen(false);
                  }}
                  mobile
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            </div>
          )}

          <div className="hidden lg:flex shrink-0">
            <Sidebar
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              conversations={conversations}
              onNewChat={clearChat}
            />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <main
              aria-label="Chat messages"
              aria-live="polite"
              aria-atomic="false"
              className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} onFeedback={handleFeedback} />
              ))}

              {messages.length === 1 && (
                <div style={{ animation: "fadeUp 0.5s 0.3s ease both" }}>
                  <p className="text-[12px] text-text-light font-mono tracking-[0.06em] uppercase mb-2.5">
                    Try asking…
                  </p>
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))" }}>
                    {SUGGESTIONS.slice(0, 6).map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => void sendMessage(s)}
                        className="px-3.5 py-2.5 rounded-xl text-left bg-white border border-cream-border text-[13px] text-text-muted cursor-pointer hover:bg-cream-dark hover:border-green-200 transition-all font-sans leading-snug focus-visible:outline-2 focus-visible:outline-green-500">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} aria-hidden="true" />
            </main>

            <div
              role="toolbar"
              aria-label="Quick prompt suggestions"
              className="px-5 pt-2.5 pb-0 border-t border-green-500/[0.08] bg-white flex gap-1.5 overflow-x-auto shrink-0">
              {QUICK_PROMPTS.map((q, i) => {
                const Icon = q.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setInput(q.prompt);
                      inputRef.current?.focus();
                    }}
                    aria-label={`Quick prompt: ${q.label}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-800/[0.06] border border-green-500/[0.12] text-[12px] font-semibold text-green-600 whitespace-nowrap cursor-pointer shrink-0 hover:bg-green-800/[0.12] hover:border-green-500/[0.2] transition-all focus-visible:outline-2 focus-visible:outline-green-500">
                    <Icon size={12} aria-hidden="true" /> {q.label}
                  </button>
                );
              })}
            </div>

            <div className="px-5 pt-3 pb-4 bg-white shrink-0">
              <div className="flex items-end gap-2.5 bg-white border-[1.5px] border-green-500/[0.18] rounded-2xl px-3 py-2.5 transition-all shadow-[0_2px_12px_rgba(13,43,26,0.05)] focus-within:border-green-800 focus-within:shadow-[0_0_0_3px_rgba(26,74,46,0.08)]">
                <label htmlFor="chat-input" className="sr-only">
                  Message Sabi-Tutor about {currentSubject.name}
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about ${currentSubject.name}… (Enter to send, Shift+Enter for new line)`}
                  rows={1}
                  disabled={isLoading}
                  aria-label={`Ask about ${currentSubject.name}`}
                  aria-describedby="chat-hint"
                  className="flex-1 border-none outline-none resize-none text-[14px] text-text-main bg-transparent leading-relaxed min-h-[22px] max-h-[140px] overflow-y-auto font-sans placeholder:text-text-main/30 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={toggleRecording}
                  aria-label={isRecording ? "Stop voice recording" : "Start voice input"}
                  title={isRecording ? "Stop recording" : "Voice input"}
                  className={`shrink-0 w-[34px] h-[34px] rounded-lg flex items-center justify-center border-none cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-green-500 ${
                    isRecording
                      ? "bg-red-500/10 text-red-500"
                      : "bg-green-800/[0.07] text-text-muted hover:bg-green-800/[0.12]"
                  }`}>
                  {isRecording ? (
                    <MicOff size={16} aria-hidden="true" />
                  ) : (
                    <Mic size={16} aria-hidden="true" />
                  )}
                </button>

                <div className="relative shrink-0" data-settings-container>
                  <button
                    type="button"
                    ref={settingsBtnRef}
                    onClick={() => setSettingsOpen((o) => !o)}
                    aria-label="Open tutor settings"
                    title="Tutor settings"
                    className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center border-none cursor-pointer text-text-muted transition-all focus-visible:outline-2 focus-visible:outline-green-500 ${
                      settingsOpen
                        ? "bg-green-800/[0.12]"
                        : "bg-green-800/[0.07] hover:bg-green-800/[0.12]"
                    }`}>
                    <Settings size={15} aria-hidden="true" />
                  </button>
                  {settingsOpen && (
                    <SettingsPanel
                      difficulty={difficulty}
                      setDifficulty={setDifficulty}
                      style={responseStyle}
                      setStyle={setResponseStyle}
                      pidgin={pidgin}
                      setPidgin={setPidgin}
                      onClose={() => setSettingsOpen(false)}
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={!input.trim() || isLoading}
                  data-testid="send-btn"
                  aria-label={isLoading ? "Sending message…" : "Send message"}
                  className={`shrink-0 h-[34px] px-4 rounded-lg border-none font-bold text-[13px] flex items-center gap-1.5 transition-all font-sans focus-visible:outline-2 focus-visible:outline-green-400 ${
                    input.trim() && !isLoading
                      ? "bg-green-800 text-white cursor-pointer hover:bg-green-700"
                      : "bg-green-800/20 text-green-800/40 cursor-not-allowed"
                  }`}>
                  {isLoading ? (
                    <Loader2
                      size={15}
                      aria-hidden="true"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <Send size={15} aria-hidden="true" />
                  )}
                  <span>{isLoading ? "Thinking…" : "Send"}</span>
                </button>
              </div>

              <p id="chat-hint" className="text-[11px] text-text-light text-center mt-2 font-mono">
                Sabi-Tutor can make mistakes. Verify important answers in your textbook.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
