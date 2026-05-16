# 🦅 Gouden Adelaar – Bouw & Renovatie Website

Professionele website voor **Gouden Adelaar**, een Nederlands bouw- en renovatiebedrijf.

## 🚀 Features

- Responsief design (desktop, tablet, mobiel)
- Dynamische hero-slideshow met parallax-effect
- Interactieve projectengalerij met filter & lightbox
- Review-systeem met sterbeoordeling
- Offerte-aanvraagformulier met foto-upload
- Contactformulier met e-mail notificaties
- Rate limiting, input validatie & sanitatie
- Productie-grade Express backend

## 📁 Projectstructuur

```
gouden-adelaar/
├── public/              # Frontend (statische bestanden)
│   ├── index.html       # Hoofdpagina
│   ├── css/style.css    # Stylesheet
│   ├── js/main.js       # JavaScript
│   ├── img/             # Afbeeldingen
│   └── favicon/         # Favicon bestanden
├── server/              # Backend
│   ├── index.js         # Express server entrypoint
│   ├── package.json     # Server dependencies
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   └── middleware/       # Express middleware
├── package.json         # Root config
└── README.md            # Dit bestand
```

## 🛠️ Installatie

### Vereisten
- Node.js 18+ 
- npm 9+

### Stappen

```bash
# 1. Clone de repository
git clone https://github.com/jouw-org/gouden-adelaar.git
cd gouden-adelaar

# 2. Installeer server dependencies
cd server
npm install

# 3. Maak een .env bestand aan
cp .env.example .env
# Vul de omgevingsvariabelen in (zie .env.example)

# 4. Start de server
cd ..
npm run dev    # Ontwikkelmodus (met nodemon)
# of
npm start      # Productiemodus
```

De website is dan bereikbaar op **http://localhost:3000**

## 🌐 Productie Deployment

Voor productie kun je de server draaien met procesmanager PM2:

```bash
npm install -g pm2
pm2 start server/index.js --name gouden-adelaar
pm2 save
pm2 startup
```

Of gebruik een Docker container / deploy naar diensten als Railway, Render, of een VPS.

## 📧 Email Configuratie

Het contactformulier gebruikt **Nodemailer** voor e-mail notificaties.
Configureer in `server/.env`:

```
EMAIL_HOST=smtp.ziggo.nl
EMAIL_PORT=465
EMAIL_USER=your-email@ziggo.nl
EMAIL_PASS=your-password
NOTIFICATION_EMAIL=uw@email.nl
```

## ⚙️ API Endpoints

| Endpoint | Methode | Beschrijving |
|----------|---------|-------------|
| `/api/offerte` | POST | Offerte aanvraag met optionele bestanden |
| `/api/contact` | POST | Contactformulier versturen |
| `/api/review` | POST | Review plaatsen |
| `/api/health` | GET | Healthcheck |

## 📄 Licentie

MIT License – vrij te gebruiken en aan te passen.

---

Gemaakt met ❤️ voor Gouden Adelaar Bouw & Renovatie
