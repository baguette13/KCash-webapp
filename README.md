# KCash - Platforma inwestycyjna i marketplace produktów finansowych

KCash to nowoczesna aplikacja webowa służąca jako platforma zakupowa, która umozliwia klientom składanie zamówień na towary.

## Architektura projektu


```
                    +----------------+
                    |     Klient     |
                    | (React/TypeScript) |
                    +--------+-------+
                             |
                             | HTTP API
                             |
                    +--------v-------+
                    |    REST API    |
                    |   (Django)     |
                    +--------+-------+
                             |
                  +----------+-----------+
                  |                      |
        +---------v-------+    +---------v-------+
        |      Baza       |    |    Kolejka      |
        |    danych       |    |    komunikatów  |
        |   (PostgreSQL)  |    |   (RabbitMQ)    |
        +-----------------+    +---------+-------+
                                         |
                                +--------v-------+
                                |  Worker        |
                                | (Przetwarzanie |
                                |  w tle)        |
                                +----------------+
```

### Główne komponenty:

1. **Frontend**: Aplikacja React/TypeScript z architekturą opartą na komponentach
2. **Backend**: Django REST API z warstwową architekturą:
   - Kontrolery: Obsługa żądań i odpowiedzi HTTP
   - Serwisy: Implementacja logiki biznesowej
   - Repozytoria: Zarządzanie dostępem do danych
   - Modele: Definiowanie struktur danych

3. **Przetwarzanie asynchroniczne**: RabbitMQ do kolejkowania komunikatów i przetwarzania zamówień w tle
4. **Przechowywanie danych**: Baza danych PostgreSQL do trwałego przechowywania danych

## Wykorzystane technologie

### Frontend
- **React**: Wybrany ze względu na styczność w przeszłości
- **TypeScript**: Dodaje statyczne typowanie do JavaScript, poprawiając jakość kodu
- **React Router**: Obsługuje routing po stronie klienta dla płynnego działania
- **Axios**: Klient HTTP oparty na obietnicach do wykonywania zapytań API
- **TailwindCSS**: Framework CSS typu utility-first do szybkiego tworzenia interfejsów użytkownika
- **React Icons**: Kompleksowa biblioteka ikon

### Backend
- **Django**: Solidny framework webowy w Pythonie z wbudowanymi funkcjami bezpieczeństwa i ORM
- **Django REST Framework**: Potężny i elastyczny zestaw narzędzi do budowania API webowych
- **PostgreSQL**: Zaawansowana, open-source'owa relacyjna baza danych do trwałego przechowywania danych
- **RabbitMQ**: Broker komunikatów do przetwarzania asynchronicznego i komunikacji między usługami
- **Simple JWT**: Uwierzytelnianie JSON Web Token dla bezpiecznego dostępu do API

### DevOps
- **Docker & Docker Compose**: Konteneryzacja dla spójnego środowiska rozwoju i wdrażania

## Instrukcje uruchomienia

### Wymagania wstępne
- Docker i Docker Compose zainstalowane w systemie
- Git do kontroli wersji

### Pierwsze kroki

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/baguette13/KCash-webapp.git
   cd KCash-webapp
   ```

2. Uruchom wszystkie usługi za pomocą Docker Compose:
   ```bash
   docker-compose up -d
   ```

   To polecenie:
   - Zbuduje i uruchomi bazę danych PostgreSQL
   - Zbuduje i uruchomi brokera wiadomości RabbitMQ
   - Zbuduje i uruchomi backend Django
   - Zbuduje i uruchomi proces przetwarzania w tle
   - Zbuduje i uruchomi frontend React

3. Dostęp do aplikacji:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Konsola zarządzania RabbitMQ: http://localhost:15672 (użytkownik: guest, hasło: guest)

### Konfiguracja środowiska deweloperskiego

#### Rozwój backendu
1. Przejdź do katalogu backendu:
   ```bash
   cd backend
   ```

2. Zainstaluj zależności:
   ```bash
   pip install -r requirements.txt
   ```

3. Wykonaj migracje:
   ```bash
   python manage.py migrate
   ```

4. Uruchom serwer deweloperski:
   ```bash
   python manage.py runserver
   ```

#### Rozwój frontendu
1. Przejdź do katalogu frontendu:
   ```bash
   cd frontend
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   ```

3. Uruchom serwer deweloperski:
   ```bash
   npm start
   ```

## Funkcje

- **Uwierzytelnianie użytkowników**: Bezpieczny system logowania
- **Przeglądanie produktów**: Podgląd dostępnych produktów finansowych
- **Koszyk zakupowy**: Dodawanie i zarządzanie produktami w koszyku
- **Przetwarzanie zamówień**: Składanie zamówień, które są przetwarzane asynchronicznie
- **Historia zamówień**: Podgląd wcześniejszych zamówień i ich statusu

## Struktura projektu

### Struktura backendu
```
backend/
├── api/                       # Główna aplikacja API
│   ├── controllers/           # Obsługa żądań
│   ├── models.py              # Modele danych
│   ├── repositories/          # Warstwa dostępu do danych
│   ├── services/              # Logika biznesowa
│   ├── queue/                 # Integracja z RabbitMQ
│   └── serializers.py         # Serializacja danych
├── backend/                   # Ustawienia projektu Django
└── manage.py                  # Narzędzie wiersza poleceń Django
```

### Struktura frontendu
```
frontend/
├── public/                    # Pliki statyczne
└── src/
    ├── components/            # Komponenty wielokrotnego użytku
    ├── context/               # Dostawcy kontekstu React
    ├── interfaces/            # Interfejsy TypeScript
    ├── pages/                 # Strony aplikacji
    └── services/              # Integracja z usługami API
```

## Licencja

Ten projekt jest licencjonowany na podstawie licencji MIT - szczegóły znajdują się w pliku LICENSE.
