export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "ZIP-SHIP API",
    version: "1.0.0",
    description: `
## ZIP-SHIP Cloud Deployment API

ZIP-SHIP ermöglicht das schnelle Deployment von Projekten zu GitHub per Drag & Drop.

### Authentifizierung
Die API verwendet Session-basierte Authentifizierung. Melde dich unter \`/login\` an, um auf geschützte Endpunkte zuzugreifen.

### Hauptfunktionen
- **Deploy**: ZIP-Datei hochladen → GitHub Repository wird automatisch erstellt
- **Pricing**: Pay-per-Deploy Modell (Single, Pack, Enterprise)
- **Framework-Erkennung**: Automatische Erkennung von React, Vue, Next.js, etc.
    `,
    contact: {
      name: "ZIP-SHIP Support",
      email: "support@zip-ship.com"
    }
  },
  servers: [
    {
      url: "/",
      description: "Current server"
    }
  ],
  tags: [
    { name: "Auth", description: "Authentifizierung" },
    { name: "Deploy", description: "Projekt-Deployment" },
    { name: "User", description: "Benutzer-Verwaltung" },
    { name: "GitHub", description: "GitHub Integration" },
    { name: "Payments", description: "Stripe Zahlungen" }
  ],
  paths: {
    "/api/auth/user": {
      get: {
        tags: ["Auth"],
        summary: "Aktuellen Benutzer abrufen",
        description: "Gibt den aktuell eingeloggten Benutzer zurück",
        responses: {
          "200": {
            description: "Benutzer gefunden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          "401": { description: "Nicht authentifiziert" }
        }
      }
    },
    "/api/deploy-zip": {
      post: {
        tags: ["Deploy"],
        summary: "ZIP-Datei deployen",
        description: "Lädt eine ZIP-Datei hoch und erstellt ein GitHub Repository",
        security: [{ session: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file", "projectName"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "ZIP-Datei des Projekts"
                  },
                  projectName: {
                    type: "string",
                    description: "Name des GitHub Repositories"
                  },
                  aiFixEnabled: {
                    type: "boolean",
                    description: "KI-Auto-Fix aktivieren"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Deployment erfolgreich",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    repoUrl: { type: "string" },
                    message: { type: "string" }
                  }
                }
              }
            }
          },
          "400": { description: "Ungültige Anfrage" },
          "401": { description: "Nicht authentifiziert" },
          "402": { description: "Keine Deploy-Credits verfügbar" }
        }
      }
    },
    "/api/deploys": {
      get: {
        tags: ["Deploy"],
        summary: "Deployments abrufen",
        description: "Liste aller Deployments des Benutzers",
        security: [{ session: [] }],
        responses: {
          "200": {
            description: "Erfolg",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Deploy" }
                }
              }
            }
          }
        }
      }
    },
    "/api/user/stats": {
      get: {
        tags: ["User"],
        summary: "Benutzer-Statistiken",
        description: "Deploy-Credits und Statistiken des Benutzers",
        security: [{ session: [] }],
        responses: {
          "200": {
            description: "Erfolg",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalDeploys: { type: "integer" },
                    remainingDeploys: { type: "integer" },
                    hasUnlimited: { type: "boolean" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/github/status": {
      get: {
        tags: ["GitHub"],
        summary: "GitHub-Verbindungsstatus",
        description: "Prüft ob GitHub verbunden ist",
        security: [{ session: [] }],
        responses: {
          "200": {
            description: "Erfolg",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    connected: { type: "boolean" },
                    username: { type: "string" },
                    avatarUrl: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/github/connect": {
      get: {
        tags: ["GitHub"],
        summary: "GitHub OAuth starten",
        description: "Leitet zum GitHub OAuth weiter",
        responses: {
          "302": { description: "Redirect zu GitHub" }
        }
      }
    },
    "/api/checkout": {
      post: {
        tags: ["Payments"],
        summary: "Stripe Checkout starten",
        description: "Erstellt eine Stripe Checkout Session",
        security: [{ session: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["planId"],
                properties: {
                  planId: {
                    type: "string",
                    enum: ["single", "pack", "unlimited"],
                    description: "Gewählter Plan"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Checkout URL",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/plans": {
      get: {
        tags: ["Payments"],
        summary: "Preispläne abrufen",
        description: "Alle verfügbaren Preispläne",
        responses: {
          "200": {
            description: "Erfolg",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Plan" }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          email: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Deploy: {
        type: "object",
        properties: {
          id: { type: "integer" },
          projectName: { type: "string" },
          repoUrl: { type: "string" },
          status: { type: "string", enum: ["pending", "success", "failed"] },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Plan: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          price: { type: "string" },
          deploys: { type: "integer" }
        }
      }
    },
    securitySchemes: {
      session: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
        description: "Session Cookie"
      }
    }
  }
};
