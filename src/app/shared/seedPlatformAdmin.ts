
import * as bcrypt from 'bcryptjs';
import { config } from '../../config/index.env';
import { UserRole } from '../../../prisma/generated/prisma/enums';
import { prisma } from '../../lib/prisma';
const superAdminCreds = {
  email: config.platformAdmin.email,
  password: config.platformAdmin.password
};
export const seedPlatformAdmin = async () => {
  try {
    // 1. Check if Super Admin already exists
    const isPlatformAdminExists = await prisma.user.findUnique({
      where: {
        email: superAdminCreds.email,
      },
    });

    if (isPlatformAdminExists) {
      console.log('⚠️ Platform Admin already exists. Skipping...');
      return;
    }

    
    
    const hashedPassword = await bcrypt.hash(superAdminCreds.password, 12);

      await prisma.user.create({
        data: {
          email: superAdminCreds.email,
          password: hashedPassword,
          role: UserRole.PLATFORM_ADMIN
        },
      });

     
  

    console.log('✅ Platform Admin created successfully!');
  } catch (err) {
    console.error('❌ Error seeding Super Admin:', err);
  } finally {
    await prisma.$disconnect();
  }
};