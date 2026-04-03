import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env['DATABASE_URL']!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@wherads.com' },
    update: {},
    create: {
      name: 'Admin WherAds',
      email: 'admin@wherads.com',
      password: hashedPassword,
    },
  });

  console.log(`Usuário seed criado: ${user.email}`);

  const campaigns = [
    {
      name: 'Campanha Black Friday',
      description:
        'Promoções especiais de Black Friday com foco em eletrônicos',
      status: 'ACTIVE' as const,
      budget: 15000,
      startDate: new Date('2026-11-25'),
      endDate: new Date('2026-11-30'),
    },
    {
      name: 'Campanha Natal 2026',
      description: 'Campanha de fim de ano com foco em presentes e decoração',
      status: 'DRAFT' as const,
      budget: 25000,
      startDate: new Date('2026-12-01'),
      endDate: new Date('2026-12-25'),
    },
    {
      name: 'Verão 2027',
      description: 'Promoções de verão para moda praia e acessórios',
      status: 'DRAFT' as const,
      budget: 8000,
      startDate: new Date('2027-01-10'),
      endDate: new Date('2027-03-20'),
    },
    {
      name: 'Dia das Mães',
      description:
        'Campanha especial para o Dia das Mães com ofertas personalizadas',
      status: 'COMPLETED' as const,
      budget: 12000,
      startDate: new Date('2026-04-20'),
      endDate: new Date('2026-05-12'),
    },
    {
      name: 'Volta às Aulas',
      description: 'Promoções para material escolar e eletrônicos educacionais',
      status: 'PAUSED' as const,
      budget: 6000,
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-02-28'),
    },
  ];

  for (const campaign of campaigns) {
    await prisma.campaign.create({
      data: {
        ...campaign,
        userId: user.id,
      },
    });
  }

  console.log(`${campaigns.length} campanhas seed criadas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
