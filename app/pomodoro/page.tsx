//D:\BS-arena-NextJS\app\pomodoro\page.tsx
"use client";

import { useEffect, useState } from "react";
import { usePomodoro } from "@/context/PomodoroContext";
import { FaTrash } from "react-icons/fa";
import s from "./pomodoro.module.css";

export default function PomodoroPage() {
  const {
    session,
    remainingTime,
    isBreak,
    isPaused,
    start,
    pause,
    resume,
    reset,
  } = usePomodoro();

  const [selectedMode, setSelectedMode] = useState<"SHORT" | "LONG">("SHORT");
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      await start(selectedMode);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodos = async () => {
    const res = await fetch("/api/pomodoro/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => { fetchTodos(); }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const res = await fetch("/api/pomodoro/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTodo }),
    });
    if (res.ok) { setNewTodo(""); fetchTodos(); }
  };

  const toggleTodo = async (id: string, done: boolean) => {
    await fetch("/api/pomodoro/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, done: !done }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch("/api/pomodoro/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTodos();
  };

  const completedCount = todos.filter((t) => t.done).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <div className={s.shell}>
      <div className={s.inner}>

        {/* ── Header ── */}
        <header className={`${s.header} ${s.anim1}`}>
          <p className={s.label}>Focus Tool</p>
          <h1 className={s.heading}>
            {isBreak ? "Break" : "Pomodoro"} <em>{isBreak ? "Time" : "Timer"}</em>
          </h1>
          <p className={s.subheading}>
            {isBreak ? "Step away and recharge" : "Stay focused, build momentum"}
          </p>
        </header>

        <div className={s.divider} />

        <div className={s.grid}>

          {/* ── TIMER PANEL ── */}
          <div className={`${s.card} ${s.anim2}`}>
            <div className={s.cardTitle}>
              <span className={s.cardPip} />
              {isBreak ? "Break" : "Focus Session"}
            </div>

            <p className={s.modeLabel}>
              {isBreak ? "Break" : session ? "Focusing" : selectedMode === "SHORT" ? "25 min focus" : "50 min focus"}
            </p>

            <div className={`${s.time} ${isBreak ? s.timeBreak : ""}`}>
              {formatTime(remainingTime)}
            </div>

            {/* Mode selector */}
            {!session && (
              <div className={s.modes}>
                <button
                  onClick={() => setSelectedMode("SHORT")}
                  className={`${s.modeBtn} ${selectedMode === "SHORT" ? s.modeBtnActive : s.modeBtnInactive}`}
                >
                  25 / 5
                </button>
                <button
                  onClick={() => setSelectedMode("LONG")}
                  className={`${s.modeBtn} ${selectedMode === "LONG" ? s.modeBtnActive : s.modeBtnInactive}`}
                >
                  50 / 10
                </button>
              </div>
            )}

            {/* Start */}
            {!session && (
              <button
                onClick={handleStart}
                disabled={loading}
                className={`${s.btn} ${s.btnStart}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                {loading ? "Starting…" : "Start Focus"}
              </button>
            )}

            {/* Session controls */}
            {session && !isBreak && (
              <div className={s.btnGroup}>
                {!isPaused ? (
                  <button onClick={pause} className={`${s.btn} ${s.btnPause}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                    </svg>
                    Pause
                  </button>
                ) : (
                  <button onClick={resume} className={`${s.btn} ${s.btnResume}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Resume
                  </button>
                )}
                <button onClick={reset} className={`${s.btn} ${s.btnReset}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>
                  </svg>
                  Reset Session
                </button>
              </div>
            )}

            {isBreak && (
              <p className={s.breakMsg}>Relax. Your break is running.</p>
            )}
          </div>

          {/* ── TODO PANEL ── */}
          <div className={`${s.card} ${s.anim3}`}>
            <div className={s.cardTitle}>
              <span className={s.cardPip} />
              Todo List
              {todos.length > 0 && (
                <span style={{
                  marginLeft: "auto", fontSize: 11, fontWeight: 500,
                  color: "#7a7670", background: "rgba(0,33,71,0.07)",
                  padding: "2px 10px", borderRadius: 20, textTransform: "none", letterSpacing: 0
                }}>
                  {completedCount}/{todos.length}
                </span>
              )}
            </div>

            {/* Input */}
            <div className={s.todoInputRow}>
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                placeholder="Add a new task…"
                className={s.todoInput}
              />
              <button onClick={addTodo} className={s.todoAdd}>Add</button>
            </div>

            {/* Progress */}
            {todos.length > 0 && (
              <>
                <div className={s.progressRow}>
                  <span className={s.progressLabel}>Progress</span>
                  <span className={s.progressPct}>{Math.round(progress)}%</span>
                </div>
                <div className={s.progressTrack}>
                  <div className={s.progressFill} style={{ width: `${progress}%` }} />
                </div>
              </>
            )}

            {/* Todos */}
            <div className={s.todoList}>
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`${s.todoItem} ${todo.done ? s.todoItemDone : ""}`}
                  onClick={() => toggleTodo(todo.id, todo.done)}
                >
                  <div className={`${s.todoCheck} ${todo.done ? s.todoCheckDone : ""}`}>
                    {todo.done && (
                      <svg viewBox="0 0 12 12" className={s.todoCheckTick}>
                        <polyline points="1.5,6 4.5,9 10.5,3"/>
                      </svg>
                    )}
                  </div>

                  <span className={`${s.todoText} ${todo.done ? s.todoTextDone : ""}`}>
                    {todo.text}
                  </span>

                  <button
                    className={s.todoDelete}
                    onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}

              {todos.length === 0 && (
                <div className={s.todoEmpty}>No tasks yet. Add one above.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}