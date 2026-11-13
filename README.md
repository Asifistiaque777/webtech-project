# FoodParcel Express

HTML, CSS and JavaScript midterm frontend prototype for food and parcel delivery.

## Omar's customer catalogue and cart work

- Student: **OMAR FARUQ — 23-54202-3**
- Branch: **OMAR-23-54202-3**
- [Contribution details, code explanation and demo checklist](docs/OMAR-23-54202-3.md)
- [View this branch on GitHub](https://github.com/OMAR2631/webtech-project/tree/OMAR-23-54202-3)

This branch adds item search, category filtering, price sorting within each category, reset/results feedback, direct cart removal, a total-quantity cart badge and a short add-to-cart confirmation. The contribution document distinguishes these additions from the inherited features.

## Run

1. Open the project folder in VS Code.
2. Open `index.html` with Live Server.
3. Keep customer, admin and rider pages on the **same origin** (same protocol, hostname and port) in the same browser profile to share demo data.

No build step, framework, npm installation or database is needed. Item photos use external URLs; a placeholder appears if they cannot load.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@gmail.com | admin123 |
| Rider | rahim@rider.com | rider123 |
| Rider | karim@rider.com | rider123 |
| Rider | sumon@rider.com | rider123 |

These are browser-side demo accounts, not production authentication. The original team setup and order flow are documented in [README.txt](README.txt).

## Prototype scope

Items, cart and orders use `localStorage`; login state uses `sessionStorage`. There is no server, shared online database or payment processing. Choosing bKash records a demo payment choice only.
