// Blueprint: javascript_auth_all_persistance - Authentication setup
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema, insertTabataSetSchema, tabataConfigSchema } from "@shared/schema";
import { z } from "zod";

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
  if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'fittimer-pro-session-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: 'lax',
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

  // Esquemas de validación
  const registerSchema = z.object({
    username: z.string().min(3, "El username debe tener al menos 3 caracteres"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    name: z.string().min(1, "El nombre es requerido"),
  });

  const createTabataSetSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
    sequences: z.array(tabataConfigSchema).min(1, "Debe haber al menos una secuencia"),
  });

  const updateTabataSetSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").optional(),
    description: z.string().optional(),
    sequences: z.array(tabataConfigSchema).min(1, "Debe haber al menos una secuencia").optional(),
  });

  // Rutas de autenticación
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validar entrada
      const validatedData = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).send("El usuario ya existe");
      }

      const user = await storage.createUser({
        username: validatedData.username,
        name: validatedData.name,
        password: await hashPassword(validatedData.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // Omitir password del response
        const { password, ...userResponse } = user;
        res.status(201).json(userResponse);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
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
      // Validar entrada
      const validatedData = createTabataSetSchema.parse(req.body);
      
      const newSet = await storage.createTabataSet({
        userId: req.user!.id,
        name: validatedData.name,
        description: validatedData.description,
        sequences: validatedData.sequences,
      });
      res.status(201).json(newSet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).send("Error al crear el set");
    }
  });

  app.put("/api/tabata-sets/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const setId = parseInt(req.params.id);
      
      // Validar que el ID sea un número positivo válido
      if (isNaN(setId) || setId <= 0) {
        return res.status(400).send("ID inválido");
      }
      
      // Validar entrada
      const validatedData = updateTabataSetSchema.parse(req.body);
      
      // Actualización atómica con validación de propiedad
      const updatedSet = await storage.updateTabataSet(setId, req.user!.id, validatedData);
      if (!updatedSet) {
        return res.status(404).send("Set no encontrado o no tienes permisos para modificarlo");
      }
      res.json(updatedSet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).send("Error al actualizar el set");
    }
  });

  app.delete("/api/tabata-sets/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const setId = parseInt(req.params.id);
      
      // Validar que el ID sea un número positivo válido
      if (isNaN(setId) || setId <= 0) {
        return res.status(400).send("ID inválido");
      }
      
      // Eliminación atómica con validación de propiedad
      const deleted = await storage.deleteTabataSet(setId, req.user!.id);
      if (!deleted) {
        return res.status(404).send("Set no encontrado o no tienes permisos para eliminarlo");
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send("Error al eliminar el set");
    }
  });
}

export { hashPassword, comparePasswords };