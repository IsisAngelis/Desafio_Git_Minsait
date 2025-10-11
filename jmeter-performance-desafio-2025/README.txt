# Desafio de Performance 2025 - Apache JMeter

## Descrição Geral
Este projeto faz parte da Capacitação Interna - Do Código ao Comportamento: Testes de Performance e tem como objetivo medir a performance e estabilidade de uma API REST local, realizando testes de banco de dados, operações CRUD, login com dados CSV e simulações de pico de carga.

O plano de teste foi desenvolvido na ferramenta **Apache JMeter 5.6.3**.

---

## Estrutura do Plano de Teste

### 🧱 1. setUp Thread Group - Banco de Dados
Conecta-se ao banco **MySQL (sakila)** e realiza uma consulta:
```
SELECT first_name, email FROM customer LIMIT 20
```
Os resultados são salvos em um arquivo (`lista.plain`) e utilizados pelos grupos de teste posteriores via `CSV Data Set Config`.

**Configuração JDBC:**
- Driver: `com.mysql.cj.jdbc.Driver`
- URL: `jdbc:mysql://localhost:3306/sakila`
- Usuário: `root`
- Senha: `AmoBd@S2`

---

### 👥 2. Grupo de Usuários - Testes CRUD
Executa testes funcionais com 20 usuários simulados, realizando:
1. **Cadastro de usuários** (`POST /usuarios`)
2. **Login** (`POST /login`)
3. **Listagem de usuários** (`GET /usuarios`)
4. **Validação condicional de login (If Controller)**
5. **Extração de IDs com JSON Extractor**
6. **Exclusão de usuários** (`DELETE /usuarios/{id}` via Foreach Controller)

**Arquivos CSV utilizados:**
- `TesteCadastro.csv`  
- `TesteLogin.csv`  
- `list_JDBC/lista.plain` (gerado pelo setup)

**Asserções:**  
Cada requisição possui validações de:
- Código HTTP esperado (200, 201, 401)
- Mensagem JSON esperada (`$.message`)


---

### 📋 3. Grupo de Usuários - Teste CSV
Simula múltiplos logins a partir de arquivos CSV, validando respostas de sucesso e erro (`Login realizado com sucesso` e `Email e/ou senha inválidos`).

---

### ⚡ 4. jp@gc - Ultimate Thread Group (3 e 4 Cargas)
Responsável pelos **testes de carga e pico de performance** no endpoint `/login`.

#### Configuração de Cargas:
| Etapa | Usuários | Delay Inicial (s) | Subida (s) | Duração (s) | Descida (s) |
|-------|-----------|------------------|-------------|--------------|--------------|
| 1ª carga | 100 | 0 | 10 | 60 | 5 |
| 2ª carga | 100 | 65 | 10 | 60 | 5 |
| 3ª carga | 100 | 130 | 10 | 60 | 5 |
| **Pico** | **200** | **195** | **5** | **5** | **5** |

Endpoint testado:  
```
POST http://localhost:3000/login
Body:
{
  "email": "fulano@qa.com",
  "password": "123"
}
```

**Asserções:**  
- Código HTTP = 200  
- Tempo de resposta validado por gráficos  

**Relatórios adicionados:**
- Summary Report  
- Aggregate Report  
- View Results Tree  

---

## 🧾 Estrutura do Projeto

```
📦 jmeter-performance-desafio-2025
 ┣ 📄 jmeter-performance-desafio-2025.jmx
 ┣ 📄 README.txt
 ┣ 📂 /resultados/
 ┃ ┗ 📄 SRReport_25.jtl
 ┣ 📂 /SRReport_25/
 ┃ ┣ 📄 index.html
 ┃ ┣ 📄 statistics.json
 ┃ ┗ (outros arquivos do relatório)
 ┗ 📂 /list_JDBC/
    ┗ 📄 lista.plain
```

---

## ⚙️ Execução do Teste

### Modo linha de comando:
1. Abra o terminal na pasta do projeto.
2. Execute:
```
jmeter.bat -n  -t jmeter-performance-desafio-2025.jmx -l SRReport_25.jtl -e -o SRReport_25
```
3. Após a execução, abra o arquivo:
```
SRReport_25/index.html
```
para visualizar o relatório de performance completo.

---

## 🧠 Observações Finais
- Porta padrão: **3000**
- Banco de dados: **MySQL - sakila**
- Endpoint principal: **/login**
- Usuário fixo para o teste de pico: `fulano@qa.com / 123`
- O relatório HTML inclui:
  - Tempo médio de resposta
  - Erros por segundo
  - Número de threads ativas
  - Tempo de throughput (requisições/s)
  - Curva de carga durante o pico

---

## 👩‍💻 Autor
Isis Angelis  
Desafio de Performance - 2025  
Apache JMeter 5.6.3
