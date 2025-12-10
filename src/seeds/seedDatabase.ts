import mongoose from 'mongoose';
import { User } from '../models/User';
import { Court } from '../models/Court';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vital-sport-center';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Court.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin Vital Sport',
      email: 'admin@vitalsport.com',
      password: hashedAdminPassword,
      role: 'admin',
      phone: '+57 300 000 0000',
    });
    console.log('Created admin user:', adminUser._id);

    // Create sample users
    const hashedPassword = await bcrypt.hash('user123', 10);
    const user1 = await User.create({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: hashedPassword,
      role: 'client',
      phone: '+57 300 123 4567',
    });

    const user2 = await User.create({
      name: 'María García',
      email: 'maria@example.com',
      password: hashedPassword,
      role: 'client',
      phone: '+57 300 987 6543',
    });
    console.log('Created sample users');

    // Create sample courts
    const courts = await Court.insertMany([
      {
        name: 'Cancha Fútbol Centro',
        sport: 'Fútbol',
        location: 'Centro, Manizales',
        price: 60000,
        capacity: 22,
        description: 'Cancha de fútbol profesional con iluminación',
        amenities: ['Iluminación LED', 'Estacionamiento', 'Vestiarios'],
        image: 'https://images.unsplash.com/photo-1641029185333-7ed62a19d5f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmaWVsZCUyMGFlcmlhbHxlbnwxfHx8fDE3NjUzOTk5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        admin: adminUser._id,
        isAvailable: true,
      },
      {
        name: 'Cancha Tenis La Arboleda',
        sport: 'Tenis',
        location: 'La Arboleda, Manizales',
        price: 50000,
        capacity: 2,
        description: 'Cancha de tenis con cesped sintético',
        amenities: ['Cesped Sintético', 'Iluminación', 'Agua'],
        image: 'https://images.unsplash.com/photo-1564769353575-73f33a36d84f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBjb3VydCUyMHNwb3J0fGVufDF8fHx8MTc2NTM2OTYyOHww&ixlib=rb-4.1.0&q=80&w=1080',
        admin: adminUser._id,
        isAvailable: true,
      },
      {
        name: 'Cancha Baloncesto Palogrande',
        sport: 'Baloncesto',
        location: 'Palogrande, Manizales',
        price: 55000,
        capacity: 12,
        description: 'Cancha de baloncesto cubierta con aire acondicionado',
        amenities: ['Techada', 'Aire Acondicionado', 'Bebederos'],
        image: 'https://images.unsplash.com/photo-1710378844976-93a6538671ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnQlMjBpbmRvb3J8ZW58MXx8fHwxNzY1MzkyMTY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        admin: adminUser._id,
        isAvailable: true,
      },
      {
        name: 'Cancha Vóleibol Pinares',
        sport: 'Vóleibol',
        location: 'Pinares, Manizales',
        price: 45000,
        capacity: 12,
        description: 'Cancha de vóleibol techada con piso adecuado',
        amenities: ['Techada', 'Vestiarios', 'Estacionamiento'],
        image: 'https://images.unsplash.com/photo-1479859546309-cd77fa21c8f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2xsZXliYWxsJTIwY291cnR8ZW58MXx8fHwxNzY1MzMxMzI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        admin: adminUser._id,
        isAvailable: true,
      },
      {
        name: 'Cancha Pádel Versalles',
        sport: 'Pádel',
        location: 'Versalles, Manizales',
        price: 65000,
        capacity: 4,
        description: 'Cancha de pádel profesional con vidrios panorámicos',
        amenities: ['Vidrios Panorámicos', 'Iluminación LED', 'Café'],
        image: 'https://images.unsplash.com/photo-1657704358775-ed705c7388d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWRlbCUyMHRlbm5pc3xlbnwxfHx8fDE3NjUzOTc1MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        admin: adminUser._id,
        isAvailable: true,
      },
    ]);

    console.log('Created sample courts:', courts.length);

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin:');
    console.log('  Email: admin@vitalsport.com');
    console.log('  Password: admin123');
    console.log('\nClient:');
    console.log('  Email: juan@example.com');
    console.log('  Password: user123');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
