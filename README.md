# KCash - Platforma Produktów Finansowych

KCash to aplikacja webowa służąca jako platforma marketplace, umożliwiająca klientom przeglądanie, dodawanie do koszyka i składanie zamówień na produkty.

## Architektura projektu

```
                    +--------------------+
                    |     Klient         |
                    | (React/TypeScript) |
                    +--------+-----------+
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
        |     danych      |    |    wiadomości   |
        |   (PostgreSQL)  |    |   (RabbitMQ)    |
        +-----------------+    +---------+-------+
                                         |
                                +--------v-------+
                                |     Worker     |
                                | (Przetwarzanie |
                                |  w tle)        |
                                +----------------+
```

### Główne komponenty:

1. **Frontend**: Aplikacja React/TypeScript z architekturą komponentową wykorzystującą TailwindCSS do stylizacji
2. **Backend**: Django REST API z warstwową architekturą:
   - Kontrolery: Obsługa żądań HTTP i odpowiedzi
   - Serwisy: Implementacja logiki biznesowej
   - Repozytoria: Zarządzanie dostępem do danych
   - Modele: Definicja struktur danych

3. **Przetwarzanie asynchroniczne**: RabbitMQ do kolejkowania wiadomości i przetwarzania zamówień w tle
4. **Przechowywanie danych**: Baza danych PostgreSQL do trwałego przechowywania danych

## Stos technologiczny

### Frontend
- **React 18**: Biblioteka UI oparta na komponentach do budowania interaktywnych interfejsów użytkownika
- **TypeScript**: Dodaje statyczne typowanie do JavaScript, poprawiając jakość kodu 
- **React Router**: Obsługuje routing po stronie klienta
- **Axios**: Klient HTTP oparty na obietnicach do wykonywania żądań API
- **TailwindCSS**: Framework CSS oparty na klasach użytkowych do szybkiego tworzenia UI
- **React Icons**: Bogata biblioteka ikon
- **Context API**: Do zarządzania stanem (Koszyk i kontekst API)

### Backend
- **Django**: Solidny framework webowy Python z wbudowanymi funkcjami bezpieczeństwa i ORM
- **Django REST Framework**: Potężny i elastyczny zestaw narzędzi do budowania Web API
- **PostgreSQL**: Zaawansowana, open-source'owa relacyjna baza danych do trwałego przechowywania danych
- **RabbitMQ**: Broker wiadomości do przetwarzania asynchronicznego i komunikacji międzyserwisowej
- **Simple JWT**: Uwierzytelnianie JWT do bezpiecznego dostępu do API
- **drf-yasg**: Generator dokumentacji API Swagger

### DevOps
- **Docker & Docker Compose**: Konteneryzacja dla spójnych środowisk rozwojowych i wdrożeniowych

## Pierwsze kroki

### Wymagania wstępne
- Docker i Docker Compose zainstalowane w systemie
- Git do kontroli wersji

### Początkowa konfiguracja

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/baguette13/KCash-webapp.git
   cd KCash
   ```

2. Uruchom wszystkie usługi za pomocą Docker Compose:
   ```bash
   docker-compose up -d
   ```

   To polecenie:
   - Buduje i uruchamia bazę danych PostgreSQL
   - Buduje i uruchamia broker wiadomości RabbitMQ
   - Buduje i uruchamia backend Django
   - Buduje i uruchamia worker do przetwarzania w tle
   - Buduje i uruchamia frontend React

3. Dostęp do aplikacji:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Dokumentacja API Swagger: http://localhost:8000/api/docs
   - Konsola zarządzania RabbitMQ: http://localhost:15672 (login: guest, hasło: guest)

### Konfiguracja środowiska deweloperskiego

#### Rozwój Backend
1. Przejdź do katalogu backend:
   ```bash
   cd backend
   ```

2. Zainstaluj zależności:
   ```bash
   pip install -r requirements.txt
   ```

3. Zastosuj migracje:
   ```bash
   python manage.py migrate
   ```

4. Uruchom serwer deweloperski:
   ```bash
   python manage.py runserver
   ```

#### Rozwój Frontend
1. Przejdź do katalogu frontend:
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

## Funkcjonalności

- **Uwierzytelnianie użytkownika**: Bezpieczny system logowania z tokenami JWT
- **Przeglądanie produktów**: Wyświetlanie dostępnych produktów finansowych
- **Koszyk zakupowy**: Dodawanie i zarządzanie produktami w koszyku
- **Przetwarzanie zamówień**: Składanie zamówień przetwarzanych asynchronicznie
- **Historia zamówień**: Przeglądanie poprzednich zamówień i ich statusów
- **Zarządzanie sesją**: Automatyczna obsługa wygaśnięcia i odnowienia tokenu
- **Panel administracyjny**: Specjalny interfejs dla pracowników do zarządzania zamówieniami

## Testowanie

Projekt zawiera kompleksowy zestaw testów jednostkowych dla API, obejmujących wszystkie endpointy. Testy sprawdzają zarówno poprawność działania, jak i właściwą obsługę błędów.

### Uruchamianie testów

Aby uruchomić testy, użyj następującego polecenia w kontenerze Docker:

```bash
docker exec -it kcash-backend bash -c "cd /app && python manage.py test api.tests"
```

Lub lokalnie:

```bash
cd backend
python manage.py test api.tests
```

### Raport pokrycia testami

Szczegółowy raport pokrycia testami znajduje się w pliku `backend/api/test_coverage.md`. Raport zawiera:

- Listę wszystkich testowanych endpointów API
- Nazwy testów pokrywających każdy endpoint
- Szczegółowy opis każdego testu
- Podsumowanie pokrycia testami

## Struktura projektu

### Struktura Backend
```
backend/
├── api/                       # Główna aplikacja API
│   ├── controllers/           # Obsługa żądań
│   │   ├── logistics_controller.py
│   │   ├── order_controller.py
│   │   ├── product_controller.py
│   │   └── user_controller.py
│   ├── models.py              # Modele danych
│   ├── repositories/          # Warstwa dostępu do danych
│   │   ├── order_repository.py
│   │   ├── product_repository.py
│   │   └── user_repository.py
│   ├── services/              # Logika biznesowa
│   │   ├── logistics_service.py
│   │   ├── order_service.py
│   │   ├── product_service.py
│   │   └── user_service.py
│   ├── queue/                 # Integracja z RabbitMQ
│   │   ├── order_worker.py
│   │   ├── rabbitmq_utils.py
│   │   └── status_worker.py
│   ├── serializers.py         # Serializacja danych
│   ├── tests.py               # Testy API
│   └── urls.py                # Routing API
├── backend/                   # Ustawienia projektu Django
│   ├── settings.py
│   └── swagger_settings.py
└── manage.py                  # Narzędzie wiersza poleceń Django
```

### Struktura Frontend
```
frontend/
├── public/                    # Pliki statyczne
│   ├── growth-investment.svg
│   ├── index.html
│   └── manifest.json
└── src/
    ├── components/            # Komponenty wielokrotnego użytku
    │   ├── authorization/     # Komponenty związane z uwierzytelnianiem
    │   ├── marketplace/       # Komponenty wyświetlania produktów
    │   ├── modals/            # Okna dialogowe
    │   ├── notification/      # Powiadomienia użytkownika
    │   ├── panels/            # Główne panele UI
    │   └── Navbar.tsx         # Pasek nawigacyjny
    ├── context/               # Dostawcy kontekstu React
    │   ├── ApiContext.tsx     # Zarządzanie stanem API
    │   └── CartContext.tsx    # Zarządzanie koszykiem
    ├── hooks/                 # Niestandardowe hooki React
    │   └── useSessionMonitor.tsx # Zarządzanie sesją
    ├── interfaces/            # Interfejsy TypeScript
    │   └── interfaces.ts
    ├── pages/                 # Strony aplikacji
    │   ├── DefaultPage.tsx
    │   ├── Login.tsx
    │   ├── LogisticsPage.tsx  # Panel administracyjny
    │   └── MainPage.tsx       # Główny interfejs użytkownika
    ├── routes/                # Routing aplikacji
    ├── services/              # Usługi integracji API
    ├── wrappers/              # Wrappery komponentów
    └── App.tsx                # Główny komponent
```

## Licencja

Ten projekt jest objęty licencją MIT.
