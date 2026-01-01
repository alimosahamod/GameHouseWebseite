import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../modules/auth/auth.service';

async function createDefaultAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    const admin = await authService.createAdmin('admin', 'admin123');
    console.log('✅ Standard-Admin erstellt:');
    console.log('   Username: admin');
    console.log('   Passwort: admin123');
    console.log('   ID:', admin.id);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️  Admin existiert bereits');
    } else {
      console.error('❌ Fehler beim Erstellen des Admins:', error.message);
    }
  }

  await app.close();
}

createDefaultAdmin();
