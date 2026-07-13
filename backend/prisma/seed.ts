import { PrismaClient, UserRole, UserStatus, AssetStatus, AssetCondition } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const USERS = [
  { email: 'admin@assetrix.com', password: 'Admin@123', firstName: 'Rahul', lastName: 'Mehta', role: UserRole.ADMIN, employeeId: 'EMP-001', designation: 'System Administrator' },
  { email: 'asset.manager@assetrix.com', password: 'Manager@123', firstName: 'Priya', lastName: 'Sharma', role: UserRole.DEPARTMENT_MANAGER, employeeId: 'EMP-002', designation: 'Asset Manager' },
  { email: 'dept.head@assetrix.com', password: 'DeptHead@123', firstName: 'Amit', lastName: 'Verma', role: UserRole.DEPARTMENT_MANAGER, employeeId: 'EMP-003', designation: 'Department Head - Engineering' },
  { email: 'employee1@assetrix.com', password: 'Employee@123', firstName: 'Neha', lastName: 'Gupta', role: UserRole.EMPLOYEE, employeeId: 'EMP-004', designation: 'Software Engineer' },
  { email: 'employee2@assetrix.com', password: 'Employee@123', firstName: 'Arjun', lastName: 'Singh', role: UserRole.EMPLOYEE, employeeId: 'EMP-005', designation: 'Software Engineer' },
  { email: 'auditor@assetrix.com', password: 'Auditor@123', firstName: 'Kavya', lastName: 'Patel', role: UserRole.EMPLOYEE, employeeId: 'EMP-006', designation: 'Internal Auditor' },
  { email: 'technician@assetrix.com', password: 'Tech@123', firstName: 'Vikram', lastName: 'Reddy', role: UserRole.TECHNICIAN, employeeId: 'EMP-007', designation: 'IT Support Technician' },
  { email: 'hr@assetrix.com', password: 'Hr@123', firstName: 'Sneha', lastName: 'Joshi', role: UserRole.DEPARTMENT_MANAGER, employeeId: 'EMP-008', designation: 'HR Manager' },
];

const DEPARTMENTS = [
  { name: 'Engineering', code: 'ENG', description: 'Software development and technical operations' },
  { name: 'Marketing', code: 'MKT', description: 'Brand management, campaigns, and communications' },
  { name: 'Human Resources', code: 'HR', description: 'People operations and talent management' },
  { name: 'Finance', code: 'FIN', description: 'Financial planning, accounting, and compliance' },
  { name: 'Operations', code: 'OPS', description: 'Business operations and process management' },
  { name: 'IT Infrastructure', code: 'IT', description: 'Internal IT support and infrastructure management' },
];

const CATEGORIES = [
  { name: 'Laptops', code: 'LAP', description: 'Portable computing devices', defaultUsefulLife: 25 },
  { name: 'Monitors', code: 'MON', description: 'Display screens and monitors', defaultUsefulLife: 20 },
  { name: 'Projectors', code: 'PRJ', description: 'Presentation and projection equipment', defaultUsefulLife: 15 },
  { name: 'Meeting Rooms', code: 'ROOM', description: 'Conference and meeting room resources', defaultUsefulLife: 5 },
  { name: 'Vehicles', code: 'VEH', description: 'Company vehicles and transport', defaultUsefulLife: 15 },
  { name: 'Servers', code: 'SRV', description: 'Server hardware and networking equipment', defaultUsefulLife: 20 },
  { name: 'Peripherals', code: 'PER', description: 'Keyboards, mice, headsets, accessories', defaultUsefulLife: 30 },
  { name: 'Cameras', code: 'CAM', description: 'Photography and videography equipment', defaultUsefulLife: 20 },
];

const ASSET_TEMPLATES = {
  LAPTOP: [
    { name: 'MacBook Pro 16" M3 Max', brand: 'Apple', model: 'MacBook Pro 16', purchasePrice: 249900, currentValue: 212415 },
    { name: 'Dell XPS 15', brand: 'Dell', model: 'XPS 15 9530', purchasePrice: 134999, currentValue: 114749 },
    { name: 'ThinkPad X1 Carbon', brand: 'Lenovo', model: 'X1 Carbon Gen 11', purchasePrice: 129999, currentValue: 110499 },
    { name: 'HP Spectre x360', brand: 'HP', model: 'Spectre x360 16', purchasePrice: 119999, currentValue: 101999 },
    { name: 'ASUS ROG Zephyrus', brand: 'ASUS', model: 'G14 2024', purchasePrice: 164999, currentValue: 140249 },
  ],
  MONITOR: [
    { name: 'LG UltraWide 34"', brand: 'LG', model: '34WN80C-B', purchasePrice: 49999, currentValue: 37499 },
    { name: 'Dell UltraSharp 27"', brand: 'Dell', model: 'U2723QE', purchasePrice: 44999, currentValue: 33749 },
    { name: 'Samsung ViewFinity 5K', brand: 'Samsung', model: 'S9 27"', purchasePrice: 89999, currentValue: 67499 },
  ],
  PROJECTOR: [
    { name: 'Epson EB-L210W', brand: 'Epson', model: 'EB-L210W', purchasePrice: 89999, currentValue: 71999 },
    { name: 'BenQ LH930', brand: 'BenQ', model: 'LH930', purchasePrice: 119999, currentValue: 95999 },
  ],
  ROOM: [
    { name: 'Board Room Alpha', brand: '-', model: 'Capacity: 20', purchasePrice: 0, currentValue: 0 },
    { name: 'Huddle Room B2', brand: '-', model: 'Capacity: 6', purchasePrice: 0, currentValue: 0 },
    { name: 'Training Hall C1', brand: '-', model: 'Capacity: 50', purchasePrice: 0, currentValue: 0 },
  ],
  VEHICLE: [
    { name: 'Toyota Innova Crysta', brand: 'Toyota', model: 'Innova Crysta 2.4', purchasePrice: 1899000, currentValue: 1519200 },
    { name: 'Honda City', brand: 'Honda', model: 'City ZX CVT', purchasePrice: 1349000, currentValue: 1079200 },
  ],
  SERVER: [
    { name: 'Dell PowerEdge R750', brand: 'Dell', model: 'R750 Tower', purchasePrice: 349999, currentValue: 279999 },
    { name: 'HP ProLiant DL380', brand: 'HP', model: 'DL380 Gen11', purchasePrice: 299999, currentValue: 239999 },
  ],
};

function generateAssetTag(categoryCode: string, index: number): string {
  return `AF-${categoryCode}-${String(index + 1).padStart(4, '0')}`;
}

function generateSerialNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SN-';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function main() {
  console.log('🌱 Starting Assetrix seed...\n');

  const adminUser = USERS[0];
  const hashedPassword = await bcrypt.hash(adminUser.password, SALT_ROUNDS);

  // 1. Create Users
  console.log('👤 Creating users...');
  const createdUsers: Record<string, string> = {};

  for (const user of USERS) {
    const password = user === adminUser ? hashedPassword : await bcrypt.hash(user.password, SALT_ROUNDS);
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        employeeId: user.employeeId,
        designation: user.designation,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
    });
    createdUsers[user.email] = created.id;
    console.log(`   ✓ ${user.firstName} ${user.lastName} (${user.role})`);
  }

  // 2. Create Departments
  console.log('\n🏢 Creating departments...');
  const createdDepts: Record<string, string> = {};

  for (const dept of DEPARTMENTS) {
    const created = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: {
        name: dept.name,
        code: dept.code,
        description: dept.description,
        headId: createdUsers[DEPARTMENTS.indexOf(dept) % 2 === 0 ? 'asset.manager@assetrix.com' : 'dept.head@assetrix.com'],
      },
    });
    createdDepts[dept.code] = created.id;
    console.log(`   ✓ ${dept.name} (${dept.code})`);
  }

  // 3. Create Asset Categories
  console.log('\n📁 Creating asset categories...');
  const createdCats: Record<string, string> = {};

  for (const cat of CATEGORIES) {
    const created = await prisma.assetCategory.upsert({
      where: { code: cat.code },
      update: {},
      create: {
        name: cat.name,
        code: cat.code,
        description: cat.description,
        defaultUsefulLife: cat.defaultUsefulLife,
      },
    });
    createdCats[cat.code] = created.id;
    console.log(`   ✓ ${cat.name} (${cat.code})`);
  }

  // 4. Create Assets
  console.log('\n📦 Creating assets...');
  let assetCount = 0;

  const deptCodes = Object.keys(createdDepts);
  const statuses: AssetStatus[] = [AssetStatus.AVAILABLE, AssetStatus.ALLOCATED, AssetStatus.MAINTENANCE];
  const conditions: AssetCondition[] = [AssetCondition.EXCELLENT, AssetCondition.GOOD, AssetCondition.FAIR];

  for (const [categoryCode, templates] of Object.entries(ASSET_TEMPLATES)) {
    const catId = createdCats[categoryCode] || createdCats[Object.keys(createdCats).find(k => k === categoryCode) || 'LAP'];

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      const deptCode = deptCodes[i % deptCodes.length];
      const status = statuses[i % statuses.length];
      const condition = conditions[i % conditions.length];

      const allocatedToId = status === AssetStatus.ALLOCATED
        ? createdUsers[USERS[3 + (i % 3)].email]
        : undefined;

      const asset = await prisma.asset.create({
        data: {
          name: template.name,
          assetTag: generateAssetTag(categoryCode, i),
          qrCode: `QR-${categoryCode}-${String(i + 1).padStart(4, '0')}`,
          serialNumber: generateSerialNumber(),
          description: `${template.brand} ${template.model}`,
          status,
          condition,
          purchasePrice: template.purchasePrice,
          currentValue: template.currentValue,
          purchaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          departmentId: createdDepts[deptCode],
          categoryId: catId,
          allocatedToId,
          location: `Building ${String.fromCharCode(65 + i % 4)}, Floor ${(i % 5) + 1}`,
        },
      });
      assetCount++;
    }
  }

  console.log(`   ✓ ${assetCount} assets created across ${Object.keys(ASSET_TEMPLATES).length} categories`);

  console.log('\n✅ Seed completed successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  LOGIN CREDENTIALS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  for (const user of USERS) {
    console.log(`  ${user.role.padEnd(22)} ${user.email} / ${user.password}`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
