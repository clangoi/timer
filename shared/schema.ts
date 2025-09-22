import { pgTable, serial, text, integer, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Usuarios predefinidos para el sistema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sets de Tabata que pertenecen a usuarios específicos
export const tabataSets = pgTable("tabata_sets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  sequences: jsonb("sequences").notNull().$type<TabataConfig[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relaciones entre tablas
export const usersRelations = relations(users, ({ many }) => ({
  tabataSets: many(tabataSets),
}));

export const tabataSetsRelations = relations(tabataSets, ({ one }) => ({
  user: one(users, {
    fields: [tabataSets.userId],
    references: [users.id],
  }),
}));

// Tipos TypeScript generados automáticamente
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TabataSet = typeof tabataSets.$inferSelect;
export type InsertTabataSet = typeof tabataSets.$inferInsert;

// Esquemas de validación con Zod
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertTabataSetSchema = createInsertSchema(tabataSets);
export const selectTabataSetSchema = createSelectSchema(tabataSets);

// Tipos para las configuraciones de Tabata (manteniendo compatibilidad)
export interface TabataConfig {
  id: string;
  name: string;
  workTime: number;
  restTime: number;
  longRestTime: number;
  sets: number;
}

// Esquema de validación para TabataConfig
export const tabataConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre es requerido"),
  workTime: z.number().min(1, "El tiempo de trabajo debe ser mayor a 0"),
  restTime: z.number().min(1, "El tiempo de descanso debe ser mayor a 0"),
  longRestTime: z.number().min(1, "El tiempo de descanso largo debe ser mayor a 0"),
  sets: z.number().min(1, "Debe haber al menos 1 set"),
});