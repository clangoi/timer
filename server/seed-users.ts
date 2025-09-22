// Script para crear usuarios predefinidos con contraseñas hasheadas
import { hashPassword } from './auth';
import { storage } from './storage';

async function seedUsers() {
  const users = [
    { username: 'admin', password: 'adminpass123', name: 'Administrador' },
    { username: 'user1', password: 'userpass123', name: 'Usuario Uno' },
    { username: 'trainer', password: 'trainerpass123', name: 'Entrenador Personal' },
    { username: 'athlete', password: 'athletepass123', name: 'Atleta Profesional' }
  ];

  for (const userData of users) {
    try {
      const existingUser = await storage.getUserByUsername(userData.username);
      if (!existingUser) {
        const hashedPassword = await hashPassword(userData.password);
        await storage.createUser({
          username: userData.username,
          password: hashedPassword,
          name: userData.name
        });
        console.log(`Usuario ${userData.username} creado correctamente`);
      } else {
        console.log(`Usuario ${userData.username} ya existe`);
      }
    } catch (error) {
      console.error(`Error creando usuario ${userData.username}:`, error);
    }
  }
}

seedUsers().then(() => {
  console.log('Seed de usuarios completado');
  process.exit(0);
}).catch(console.error);