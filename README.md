# 🧠 Simula

<img src="frontend/src/assets/logo-simula.png" alt="Logo do Simula" width="200"/>

**Uma plataforma de estudos full-stack, completa e interativa, construída com Django e React.**

Este projeto é uma aplicação web completa projetada para ajudar estudantes a se prepararem para exames através de simulados personalizados e análises de desempenho detalhadas. A plataforma oferece dois modos de estudo, um dashboard completo com gráficos e um sistema de autenticação seguro.

---

## ✨ Principais Funcionalidades

-   **Autenticação de Usuários:** Sistema completo de cadastro e login com tokens JWT, garantindo que cada usuário tenha seu próprio histórico e dados seguros.
-   **Modo Simulado ENEM:** Gera uma prova com uma estrutura fixa de questões, simulando a experiência do exame real.
-   **Modo Teste Personalizado:** Permite ao usuário total controle sobre seu estudo, com filtros por matéria, dificuldade e número de questões (total ou por matéria).
-   **Dashboard de Desempenho:** Uma central de análise que exibe:
    -   Métricas gerais (percentual de acerto, total de questões).
    -   Gráfico de desempenho por matéria para identificar pontos fortes e fracos.
-   **Histórico de Provas:** Todos os simulados realizados ficam salvos, com suas respectivas pontuações e tempo de duração.
-   **Modo de Revisão:** Após finalizar um teste, o usuário pode revisar cada questão para ver sua resposta e a resposta correta, aprendendo com os erros.
-   **Cronômetro Integrado:** As provas têm um tempo limite, adicionando um desafio extra e simulando as condições reais de um exame.

---

## 🚀 Acesso e Demonstração

Você pode testar a aplicação completa no link abaixo.

-   **Frontend (Vercel):** https://simula-six.vercel.app/

---

## 🛠️ Tecnologias Utilizadas

A aplicação foi construída utilizando uma arquitetura moderna, separando o back-end e o front-end.

### **Back-end (Servidor)**
-   **Linguagem:** Python 3
-   **Framework:** Django
-   **API:** Django REST Framework
-   **Banco de Dados:** PostgreSQL
-   **Autenticação:** Djoser & Simple JWT
-   **Servidor de Produção:** Gunicorn & WhiteNoise

### **Front-end (Interface)**
-   **Biblioteca:** React 18
-   **Build Tool:** Vite
-   **Roteamento:** React Router DOM
-   **UI/Componentes:** Material-UI (MUI)
-   **Gráficos:** Chart.js
-   **Cliente HTTP:** Axios

### **Deploy (Hospedagem)**
-   **Back-end:** Render
-   **Front-end:** Vercel

---

## ⚙️ Como Rodar o Projeto Localmente

Para executar este projeto na sua máquina, siga os passos abaixo.

### **Pré-requisitos**
-   [Git](https://git-scm.com/)
-   [Python](https://www.python.org/downloads/) (versão 3.8 ou superior)
-   [Node.js e npm](https://nodejs.org/en/) (versão LTS recomendada)
-   [PostgreSQL](https://www.postgresql.org/download/)

### **Instalação**

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/MateusFerreiraM/Simula.git
    cd Simula
    ```

2.  **Configure o Back-end:**
    ```bash
    # Navegue até a pasta do backend
    cd backend

    # Crie e ative um ambiente virtual
    python -m venv venv
    # No Windows:
    .\venv\Scripts\activate
    # No macOS/Linux:
    # source venv/bin/activate

    # Instale as dependências
    pip install -r requirements.txt

    # Crie o seu ficheiro de ambiente local
    # Crie um ficheiro chamado .env na pasta 'backend' e adicione as seguintes variáveis:
    # SECRET_KEY=SUA_CHAVE_SECRETA_AQUI
    # DEBUG=True
    # DATABASE_URL=postgres://SEU_USER:SUA_SENHA@localhost:5432/SEU_DB

    # Aplique as migrações no seu banco de dados PostgreSQL local
    python manage.py migrate
    ```

3.  **Configure o Front-end:**
    ```bash
    # A partir da raiz do projeto, navegue até a pasta do frontend
    cd ../frontend

    # Instale as dependências
    npm install
    ```

### **Execução**

Você precisará de **dois terminais** abertos para rodar a aplicação.

-   **Terminal 1 (Back-end):**
    ```bash
    cd backend
    .\venv\Scripts\activate
    python manage.py runserver
    ```
    O servidor Django estará rodando em `http://127.0.0.1:8000`.

-   **Terminal 2 (Front-end):**
    ```bash
    cd frontend
    npm run dev
    ```
    A aplicação React estará acessível em `http://localhost:5173`.

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

*Desenvolvido por Mateus Ferreira Machado*
