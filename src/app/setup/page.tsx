"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function SetupPage() {
  const [email, setEmail] = useState("admin@coti.app");
  const [password, setPassword] = useState("Coti2026!");
  const [message, setMessage] = useState("");

  async function handleSignup() {
    const supabase = createClient();
    
    // First try to sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // If user exists, try to sign in
      if (error.message.includes("already registered")) {
        setMessage("Usuário já existe. Tentando login...");
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) {
          setMessage("Erro no login: " + loginError.message);
        } else {
          setMessage("Login OK! Redirecionando...");
          window.location.href = "/admin";
        }
      } else {
        setMessage("Erro: " + error.message);
      }
    } else {
      setMessage("Usuário criado com sucesso! Fazendo login...");
      // Auto sign in
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) {
        setMessage("Criado mas erro no login: " + loginError.message);
      } else {
        setMessage("Sucesso! Redirecionando...");
        window.location.href = "/admin";
      }
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Setup Admin</h1>
      <div style={{ marginBottom: "12px" }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
      </div>
      <button
        onClick={handleSignup}
        style={{ width: "100%", padding: "12px", background: "#1e40af", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}
      >
        Criar Admin e Entrar
      </button>
      {message && <p style={{ marginTop: "16px", color: message.includes("Erro") ? "red" : "green" }}>{message}</p>}
    </div>
  );
}
