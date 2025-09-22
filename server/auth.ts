// Blueprint: javascript_auth_all_persistance - Authentication setup
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'fittimer-pro-session-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Rutas de autenticación
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("El usuario ya existe");
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // Omitir password del response
        const { password, ...userResponse } = user;
        res.status(201).json(userResponse);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Omitir password del response
    const { password, ...userResponse } = req.user!;
    res.status(200).json(userResponse);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Omitir password del response
    const { password, ...userResponse } = req.user!;
    res.json(userResponse);
  });

  // Rutas para sets de Tabata por usuario
  app.get("/api/tabata-sets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const sets = await storage.getUserTabataSets(req.user!.id);
      res.json(sets);
    } catch (error) {
      res.status(500).send("Error al obtener los sets");
    }
  });

  app.post("/api/tabata-sets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const newSet = await storage.createTabataSet({
        userId: req.user!.id,
        name: req.body.name,
        description: req.body.description,
        sequences: req.body.sequences,
      });
      res.status(201).json(newSet);
    } catch (error) {
      res.status(500).send("Error al crear el set");
    }
  });

  app.put("/api/tabata-sets/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const setId = parseInt(req.params.id);
      
      // Verificar que el set pertenece al usuario actual
      const existingSet = await storage.getUserTabataSets(req.user!.id);
      const userOwnsSet = existingSet.some(set => set.id === setId);
      
      if (!userOwnsSet) {
        return res.status(403).send("No tienes permisos para modificar este set");
      }
      
      const updatedSet = await storage.updateTabataSet(setId, req.body);
      if (!updatedSet) {
        return res.status(404).send("Set no encontrado");
      }
      res.json(updatedSet);
    } catch (error) {
      res.status(500).send("Error al actualizar el set");
    }
  });

  app.delete("/api/tabata-sets/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const setId = parseInt(req.params.id);
      
      // Verificar que el set pertenece al usuario actual
      const existingSets = await storage.getUserTabataSets(req.user!.id);
      const userOwnsSet = existingSets.some(set => set.id === setId);
      
      if (!userOwnsSet) {
        return res.status(403).send("No tienes permisos para eliminar este set");
      }
      
      const deleted = await storage.deleteTabataSet(setId);
      if (!deleted) {
        return res.status(404).send("Set no encontrado");
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send("Error al eliminar el set");
    }
  });
}

export { hashPassword, comparePasswords };