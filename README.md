# 🚀 LinkedIn Post Generator - Impalia AI Test

Ce projet est une application Full-Stack permettant de générer des publications LinkedIn professionnelles et cohérentes pour une entreprise, en se basant sur une description d'entité et un brief court.

## 🛠️ Stack Technique

- **Frontend** : Next.js 14, React, Tailwind CSS (Design épuré et responsive).
- **Backend** : FastAPI (Python), orchestré avec **LangGraph**.
- **IA & Orchestration** : 
  - **LangChain** pour la gestion des prompts.
  - **LangGraph** pour implémenter un cycle de "Self-Healing" (auto-correction du format et de la longueur).
  - **Groq (Llama 3.1)** pour une génération ultra-rapide.

## 🧠 Architecture AI (LangGraph)

Le service utilise un graphe d'état pour garantir la qualité de sortie :
1. **Node Generate** : Rédige le post en suivant un prompt de "Ghostwriter expert".
2. **Node Validator** : Vérifie si le post respecte la limite des 1300 caractères et le format JSON.
3. **Cycle de Correction** : Si le post est trop long, le graphe renvoie automatiquement la donnée au premier nœud pour une réécriture plus concise.

## ⚙️ Installation et Lancement

### 1. Backend
```bash
cd backend
# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate # Ou venv\Scripts\activate sur Windows
# Installer les dépendances
pip install fastapi uvicorn langchain-openai langgraph python-dotenv
# Lancer le serveur
python -m uvicorn main:app --reload